const JWT = require('jsonwebtoken');

const models = require('../models/models');
User = models.profile;
Executive = models.executive;
const { JWT_SECRET }= require('../configuration');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const passport = require('../passport');

signToken = user => {
    return JWT.sign({
      iss: 'ProjectLenity',
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, JWT_SECRET);
  }

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: { 
        user: 'projectlenity365@gmail.com',
        pass: 'lenity1234'
    }
});

module.exports = {
    signUp: async(req,res,next) => {

        const { username, email, password } = req.value.body;

        const foundUser = await User.findOne({ "local.email":email });
        if (foundUser) { 
            return res.status(403).json({ error: 'Email is already in use'});
        }

        const Username = await User.findOne({ "local.username":username });
        if (Username) { 
            return res.status(403).json({ error: 'Username already exists'});
        }

        const secretToken = randomstring.generate();
        const hash = await models.hashPassword(password);

        const active = false;
       
        const newUser = new User({ 
            methods: 'local',
            local : {
                username: username,
                
                email: email,
                password: hash,
                secretToken: secretToken,
                active: active
            }
        });
          
        
        await newUser.save();
        console.log(newUser);

        const html = `Hi there,
        Thank you for registering!!
        
        Please verify your email by typing the following token:
        Token:${secretToken}
        On the following page:
        <a href="http://localhost:5000/users/verify"> http://localhost:5000/users/verify </a>
        Have a pleasant day.`

        const mailOptions = {
            from: 'projectlenity365@gmail.com',
            to: email,
            subject: 'Please verify your email',
            text: html
          };
    
          await transporter.sendMail(mailOptions, function(error, info){
            if(error) {
              console.log(error);
            } else {
              console.log('Email sent' + info.response);
            }
        });

        // res.json({ user: 'created' });
        //Generate the token
        const token = signToken(newUser);

           //Respond with token
        res.status(200).json({ token });

    },
    signIn: async(req,res,next) => {
    
        const token = signToken(req.user);
        res.status(200).json({ token });
        console.log('UserController.signIn() called');
        console.log('Successfull login!!!');

    },
    secret: async(req,res,next) => {
        console.log('I managed to get here!!!');
        res.json({ secret: 'resource'});

    },
    googleOAuth: async (req, res, next) => {
        // Generate token
        console.log('req.user', req.user);
        const token = signToken(req.user);
       
        res.status(200).json({ token: token });
    },
    facebookOAuth: async (req, res, next) => {
        // Generate token
        console.log('got here');
    },
    verify: async(req,res,next) => {
        try{
            //var token = token;
            console.log('lalalaa');
            console.log(req.user);
        
            const { secretToken } = req.body;
            console.log(secretToken);
            const user = await User.findOne({ 'local.secretToken': secretToken });
            console.log(user);
            if(!user){
                return res.status(403).json({ error: 'Invalid Token'});
            }
        
            user.local.active = true;
            user.local.secretToken = ''
            user.save();

            console.log('verified');
            return res.json({token:'abc'});
        }catch(error){
            next(error);
        };
    },
    forgetPassword: async(req,res,next) => {
        const email = req.body.email;
        if (email != req.user.local.email) {
            return res.status(403).json({ error: 'Enter valid email'});
        }
        console.log(req.user);
        const html = `Hi, there,
        On the following page:
        <a href="http://localhost:5000/users/checkPassword">http://localhost:5000/users/checkPassword</a>
        Have a pleasant day!`;
        const mailOptions = {
          from: 'projectlenity365@gmail.com',
          to: email,
          subject: 'Please verify your email',
          text: html
        };
  
        await transporter.sendMail(mailOptions, function(error, info){
          if(error) {
            console.log(error);
          } else {
            console.log('Email sent' + info.response);
          }
        });

        res.json({ success: true, Message:'Please check your email'});

    },
    confirmPassword: async(req,res,next) => {
        const password = req.value.body.password;
        console.log(req.user);
        const hash = await models.hashPassword(password);
        await User.findOneAndUpdate({ 'local.username':req.user.local.username},{
            $set:{'local.password': hash}
          },function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
        });
        res.json({ Message:'Password updated'});

    },
    editProfile: async(req,res,next) => {
        const { firstname, lastname, contactno, address } = req.value.body;
        User.findByIdAndUpdate(req.user.id,{
            $set:{ 
                "firstname":firstname,
                "lastname":lastname, 
                "address":address,
                "contactno": contactno 
            }
        },function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
        });
        res.json({ Message:'Profile Updated' });
    },
    profile: async(req,res,next) => {
        return res.json({ user: req.user });
    }


}