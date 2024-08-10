var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
const router = require('express').Router();
const util = require('util');
const passportConf = require('../passport');
const passport = require('passport');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
var ObjectId = require('mongodb').ObjectID;
const models = require('../models/models');
const nodemailer = require('nodemailer');
const users = require('../routes/users');
const JSON = require('circular-json');
var NodeGeocoder = require('node-geocoder');
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

var options = {
    provider: 'google',
   
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: '-Insert-Key-Here-', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  };


router.get('/', (req, res, next) => {
    console.log("donate to ngo");
    res.json("Item donate form here");

});

router.post('/', passportJWT, async (req, res, next) => {
    try{
        console.log("donating to ngo");
        await req.user;
        var pro1 = await Profile.findById(req.user.id);
        name1 = req.body.donatedBy;
        category1 = req.body.category;
        quantity1 = req.body.quantity;
        location1 = req.body.location;
        var ngo1 = new NGO({
            user : pro1._id,
            donatedBy: name1,
            category: category1,
            quantity: quantity1,
            location: location1,
            status: 0
        });

        //-----------------------------mail--------
        const html = `Hi, ${name1},
        Thank you for donating ${quantity1} ${category1} .
        We will come to your location you specified, ${location1} to pick up the donations and deliver them to the NGO`;
        
            const mailOptions = {
              from: 'projectlenity365@gmail.com',
              to: pro1.local.email,
              subject: 'Thank you for donating',
              text: html
            };
        
            await transporter.sendMail(mailOptions, function(error, info){
              if(error) {
                console.log(error);
              } else {
                console.log('Email sent' + info.response);
              }
              
            });
        //-------------------------------------------
        await ngo1.save().then(async function(){

        //---------assigning executive-----------'

        //------------------map------------

        var geocoder = NodeGeocoder(options);
        
            geocoder.geocode(location1)
            .then(async function(loc) {
                // console.log(loc);
                // res.json({loc});
                // console.log(loc[0].latitude);
                Executive.aggregate().near({
                    near:{
                        'type':'Point',
                        'coordinates':[loc[0].longitude,loc[0].latitude]
                    },
                    maxDistance: 100000,
                    spherical: true,
                    distanceField:"dis"
                }).then(async function(exes){
                    // console.log('exes:', exes);
                    record = exes[0];
                    await record;
                    // console.log(record)
                    // console.log('print record',record._id);
                    if(record){
                    await Executive.findById(record._id).then(async function(exe1){
                        if(exe1){
                            console.log("finding id:", exe1)
                          exe1.ngo.addToSet(ngo1);
                          exe1.save();
                        }});
                    }
                        else{
                          exe1 =  await Executive.findOne({"address": "sri city"});
                          exe1.ngo.addToSet(ngo1);
                          exe1.save();
                          record = exe1;
                        }

                        console.log(record.email);

        //-----------mailing eexcutive to pick it up---------
        const html = `Hi, ${record.username},
        You have been assigned to pick up the ${category1} donated by:
        ${name1} at ${location1} 
        Please reach there asap and confirm after successful delivery.
        Have a pleasant day!`;
        
            const mailOptions = {
              from: 'projectlenity365@gmail.com',
              to: record.email,
              subject: 'Delivery update',
              text: html
            };
        
            await transporter.sendMail(mailOptions, function(error, info){
              if(error) {
                console.log(error);
              } else {
                console.log('Email sent' + info.response);
              }
              
            });

            //-----------------------
            res.json({ngo:ngo1, executive: record});
                      });
                    
                });



            })

        

        }
    catch(error){
        next(error);
      }
});







router.get('/check', (req, res, next) => {
    console.log("checking mappppp");
    var geocoder = NodeGeocoder(options);
 
// Using callback
geocoder.geocode('Gummidipundi')
  .then(function(loc) {
    console.log(loc);
    // res.json({loc});
    console.log(loc[0].latitude);
    Executive.aggregate().near({
        near:{
            'type':'Point',
            'coordinates':[loc[0].longitude,loc[0].latitude]
        },
        maxDistance: 100000,
        spherical: true,
        distanceField:"dis"
    }).then(function(exes){
        console.log('exes:', exes);
        res.json({exes:exes[0]});
    });



  })



});


module.exports = router;