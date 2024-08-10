const express = require('express');
const router = express.Router();

const passport = require('passport');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
const util = require('util');
var ObjectId = require('mongodb').ObjectID;
const models = require('../models/models');
const nodemailer = require('nodemailer');
// const passport = require('../config/passport');
const users = require('../routes/users');
const JSON = require('circular-json');
const passportSignIn = passport.authenticate('ex-local-strategy', {session: false});
const passportJWT= passport.authenticate('ex-jwt-token', {session: false});
const { validateBody, signInSchema} = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');


Profile= models.profile;
Food = models.food;
Item = models.item;
Executive = models.executive;
NGO = models.ngo;


const transporter = nodemailer.createTransport({
  service:'gmail',
  auth: { 
      user: 'projectlenity365@gmail.com',
      pass: 'lenity1234'
  }
});

router.route('/signin')
  .post(validateBody(signInSchema.authSchema),passportSignIn, UsersController.signIn);

router.route('/login')
  .get( (req, res) => {
    res.render('executiveLogin');
  })
  .post(passport.authenticate('local-executive', {
    successRedirect: '/executive/dashboard',
    failureRedirect: '/executive/executivelogin',
    failureFlash: true
  }));

router.route('/dashboard')
  .get(passportJWT, async (req, res, next) => {
    try{
    await req.user;
    var executive_data = await Executive.findById(req.user.id);
    console.log('printing executives data');
    res.json({executive_data: executive_data});
  }catch(error){
    next(error);
  }
  })
  .post(passportJWT, async (req, res, next) => {
    try{
    console.log('confirming delivery');
    console.log('-------------');
    console.log(req.body);
    await req.body;
    await req.user;

    if(req.body.type=='food'){
    await Food.findOneAndUpdate({'_id':req.body.id}, {$set: {'status': true}}, async function(err, record){
      if(err) throw err;
      record.save;
      console.log('update food');
      console.log(record);   
    });
    await Profile.findOneAndUpdate({'food._id':req.body.id},{$set: {'food.$.status':true}},async function(err2, prodata){
      if(err2) throw err2;
      prodata.save();
      console.log('update users food');
      //-------------------------mail--------------   
  
  const html = `Hi, ${prodata.local.username},
  The food that you donated has successfully been delivered!
  Thank you for your contribution!`;

      const mailOptions = {
        from: 'projectlenity365@gmail.com',
        to: prodata.local.email,
        subject: 'Food delivery done',
        text: html
      };

      await transporter.sendMail(mailOptions, function(error, info){
        if(error) {
          console.log(error);
        } else {
          console.log('Email sent' + info.response);
        }
        
      });
   //--------------------------
      // console.log(prodata);
    });
    console.log('printing req.user.id')
    console.log(req.user.id);
    await Executive.findOneAndUpdate({'_id':req.user.id, 'food._id':req.body.id},{$set: {'food.$.status':true}}, async function(err1, exedata){
      if(err1) throw err1;
      await exedata;
      exedata.save();
      console.log('update executives food')
      finaldata = await Executive.findOne({'_id':req.user.id, 'food._id':req.body.id})
      // console.log(exedata);
      res.json({executive_data:finaldata});
    });

  }


  if(req.body.type=='item'){
    console.log('item update');
    Item.findOneAndUpdate({'_id':req.body.id}, {$set: {'status': true}}, async function(err, record){
      if(err) throw err;
      await record;
      record.save;
      console.log('updated item');
      console.log(record);   
      // res.json(record);
    });
    Profile.findOneAndUpdate({'item._id':req.body.id},{$set: {'item.$.status':true}},async function(err2, prodata){
      if(err2) throw err2;
      await prodata;
      prodata.save();
      console.log('update users food');
      console.log(prodata);

      const html = `Hi, ${prodata.local.firstname},
      The item that you donated has successfully been delivered!
      Thank you for your contribution!`;
    
          const mailOptions = {
            from: 'projectlenity365@gmail.com',
            to: prodata.local.email,
            subject: 'Your item has been delivered',
            text: html
          };
    
          await transporter.sendMail(mailOptions, function(error, info){
            if(error) {
              console.log(error);
            } else {
              console.log('Email sent' + info.response);
            }
            
          });
          //--
      console.log(prodata);
    });
    Executive.findOneAndUpdate({'_id':req.user.id, 'item._id':req.body.id},{$set: {'item.$.status':true}}, async function(err1, exedata){
      if(err1) throw err1;
      exedata.save();
      console.log('update executives food')
    finaldata = await Executive.findOne({'_id':req.user.id, 'item._id':req.body.id})
      // console.log(exedata);
      res.json({executive_data:finaldata});
    })

  }

  //--------------------ngo pickup confirm-------------
  if(req.body.type=='ngo'){
    console.log('ngo update');
    NGO.findOneAndUpdate({'_id':req.body.id}, {$set: {'status': true}}, async function(err, record){
      if(err) throw err;
      record.save;
      console.log('updated ngo donation');
      console.log(record);   
      // res.json(record);

    var pro1 = await Profile.findById(record.user);
    console.log(pro1.local.email);

      const html = `Hi, ${pro1.local.username},
      Your donation has successfully been delivered to the ngo!
      Thank you for your contribution!`;
    
          const mailOptions = {
            from: 'projectlenity365@gmail.com',
            to: pro1.local.email,
            subject: 'Your donation to the  has been delivered',
            text: html
          };
    
          await transporter.sendMail(mailOptions, function(error, info){
            if(error) {
              console.log(error);
            } else {
              console.log('Email sent' + info.response);
            }
            
          });
          //--
        });
  
    Executive.findOneAndUpdate({'_id':req.user.id, 'ngo._id':req.body.id},{$set: {'ngo.$.status':true}}, async function(err1, exedata){
      if(err1) throw err1;
      exedata.save();
      console.log('update executives food')
    finaldata = await Executive.findOne({'_id':req.user.id, 'ngo._id':req.body.id})
      // console.log(exedata);
      res.json({executive_data:finaldata});
    })

  }

  //---------------------------------------------------

  }catch(error){
    next(error);
  }
  });



module.exports = router;