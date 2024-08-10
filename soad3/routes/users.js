const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('googleToken', { session: false });
const passportfacebook = passport.authenticate('facebookToken', { session: false });
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({extended: false});

//const router = express.Router;

const { validateBody, schemas, signInSchema, confirmPassword, editProfile } = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');

router.route('/signup')
    .post(validateBody(schemas.authSchema), UsersController.signUp);


router.route('/signin')
    .post(validateBody(signInSchema.authSchema), passportSignIn,UsersController.signIn);

router.route('/secret')
    .get(passportJWT, UsersController.secret);

router.route('/oauth/google')
    .post(passportGoogle,UsersController.googleOAuth);

router.route('/oauth/facebook')
    .post(passportfacebook,UsersController.facebookOAuth);


router.route('/verify')
    .post(UsersController.verify);

router.route('/forgetPassword')
    .post(passportJWT,UsersController.forgetPassword);

router.route('/confirmPassword')
    .post(validateBody(confirmPassword.authSchema),passportJWT,UsersController.confirmPassword);


router.route('/editProfile')
    .post(validateBody(editProfile.authSchema),passportJWT,UsersController.editProfile);

router.route('/profile')
    .get(passportJWT,UsersController.profile);


    router.route('/dashboard')
    .get(passportJWT,async (req, res, next) => {
      try{
        var receivedRequests = [];
          await Request.find().then( async function(result){
            await result;
            for(var i = 0;i<result.length;i++){
              for(var j=0;j<result[i].itemRequested.length;j++){
                if(result[i].itemRequested[j].user === req.user.local.username && result[i].itemRequested[j].confirmationStatus == 0){
                  // bool = true;
                  receivedRequests.push({
                    requestor:result[i].requestor,
                    item : result[i].itemRequested[j]
                  });
                  // break;
                }
              }
  
            }
        });
  
        var sentRequests = [];
        await Request.findOne({'requestor':req.user.local.username}).then( async function(result){
          await result;
  
          if(result){
            for(var i=0;i<result.itemRequested.length;i++){
              // console.log(result.itemRequested[i]);
              if(result.itemRequested[i].confirmationStatus === 0){
                  sentRequests.push({
                    item : result.itemRequested[i]
                  });
              }
            }
          }
        });
        // console.log(sentRequests);
        var receivedAndAccepted = [];
        //confirmationStatus
        await Request.find().then( async function(result){
          await result;
          for(var i = 0;i<result.length;i++){
            for(var j =0;j<result[i].itemRequested.length;j++){
              if((result[i].itemRequested[j].confirmationStatus === 1 || result[i].itemRequested[j].confirmationStatus === 2) &&
              result[i].itemRequested[j].user === req.user.local.username &&
                 result[i].itemRequested[j].status===false){
                // result[i].itemRequested.splice(j,1);
                receivedAndAccepted.push({
                  requestor : result[i].requestor,
                  item : result[i].itemRequested[j]
                });
              }
            }
          }
  
      });
  
      var sentAndAccepted = [];
      //confirmationStatus
      await Request.find().then( async function(result){
        await result;
        for(var i = 0;i<result.length;i++){
          for(var j =0;j<result[i].itemRequested.length;j++){
            if((result[i].itemRequested[j].confirmationStatus === 1 || result[i].itemRequested[j].confirmationStatus === 2) &&
              result[i].requestor === req.user.local.username && result[i].itemRequested[j].status===false){
              // result[i].itemRequested.splice(j,1);
              sentAndAccepted.push({
                to : result[i].itemRequested[j].user,
                item : result[i].itemRequested[j]
              });
            }
          }
        }
  
      });
  
  
      // await console.log(req.user);
      const username = await req.user.local.username;
  
      res.json({
        username: username,
        isUser: req.user.id,
        receivedRequests : receivedRequests,
        receivedAndAccepted : receivedAndAccepted,
        sentRequests : sentRequests,
        sentAndAccepted : sentAndAccepted
      });
    }catch(error){
      next(error);
    }
    });
  
  //Confirming the request
  router.post('/dashboard/',passportJWT,urlencodedParser, async (req,res,next) => {
    try{
      var id = req.body.id;
      var user = req.body.user;
      console.log('Accepting item#..');
      console.log(id);
      console.log(user);
  
        await Request.find().then( async function(result){
          await result;
          for(var i = 0;i<result.length;i++){
  
            for(var j =0;j<result[i].itemRequested.length;j++){
  
              if(result[i].itemRequested[j]._id == id && result[i].requestor == user){
                console.log('Setting confirmation to true');
                result[i].itemRequested[j].confirmationStatus = 1;
                result[i].save();
  
                await Item.findOne({'_id':id}).then( async function(rec){
                  await rec;
                  rec.confirmationStatus = 1;
                  rec.save();
                });
                break;
  
              }
              else if (result[i].itemRequested[j]._id == id && result[i].requestor != user) {
                result[i].itemRequested.splice(j,1);
                console.log('Spliced');
                result[i].save();
                if(result[i].itemRequested.length == 0){
                   await Request.findOneAndRemove({'requestor':result[i].requestor});
                   console.log('Deleted the record..');
                   i = i-1;
                }
                break;
  
              }
  
            }
  
          }
          res.json(result);
      });
    }
    catch(error){
      next(error);
    }
  
  });
  


module.exports = router;
