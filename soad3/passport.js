const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const JwtexStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require('./configuration/index');
const models = require('./models/models');
const User = models.profile;
const Executive = models.executive;
const LocalStrategy = require('passport-local').Strategy;
const LocalexStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const config = require('./configuration');




//JSON web tokens Strategy
passport.use('jwt', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try{
        //find user specified in token
        // console.log("enter pass-jwt page");
        const user = await User.findById(payload.sub);
        // console.log(user);
        //if user does not exist, handle it
        if(!user){
            return done(null, false);
        }

        console.log(user);

        //Otherwise, return the user
        done(null, user);


    }catch(error){
        done(error, false);
    }

}));


//Local Strategy

// LOCAL STRATEGY
passport.use('local',new LocalStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    try {
      console.log('lalala');
      console.log(User);
      // console.log(password);
      // Find the user given the email
      const user = await User.findOne({ "local.email":email });
      console.log(user);
      // If not, handle it
      if (!user) {
        return done(null, false);
      }
      console.log(user);
      // Check if the password is correct
      const isMatch = await user.isvalidPassword(password);
    
      // If not, handle it
      if (!isMatch) {
        return done(null, false);
      }
    
      if(user.local.active == false){
        return done(null, false);
      }
      // Otherwise, return the user
      done(null, user);
    } catch(error) {
      done(error, false);
    }
  }));



  passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret,
    passReqToCallback: true,
  },  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Could get accessed in two ways:
      // 1) When registering for the first time
      // 2) When linking account to the existing one
  
      // Should have full user profile over here
      console.log('profile', profile);
      console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);
  
      
        // We're in the account creation process
        const existingUser = await User.findOne({ "google.id": profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }
  
  
        const newUser = new User({
          methods: ['google'],
          google: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });
    
        await newUser.save();
        done(null, newUser);
      
    } catch(error) {
      done(error, false, error.message);
    }
  }));



  passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('profile', profile);
      console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);
      
      
      
    } catch(error) {
      done(error, false, error.message);
    }
  }));

  passport.use('ex-jwt-token',new JwtexStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try{
        //find user specified in token
        const user = await Executive.findById(payload.sub);

        //if user does not exist, handle it
        if(!user){
            return done(null, false);
        }

        console.log('printed');
        console.log(user);

        //Otherwise, return the user
        done(null, user);


    }catch(error){
        done(error, false);
    }

}));


// LOCAL STRATEGY
passport.use('ex-local-strategy',new LocalexStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    try {
      // console.log('lalala');
      // console.log(User);
      // Find the user given the email
      const user = await Executive.findOne({ email });
      console.log(user);
      // If not, handle it
      if (!user) {
        return done(null, false);
      }
      console.log(user);
      // Check if the password is correct
    
      // If not, handle it
      if (password  != user.password) {
        return done(null, false);
      }
    


      // Otherwise, return the user
      done(null, user);
    } catch(error) {
      done(error, false);
    }
  }));