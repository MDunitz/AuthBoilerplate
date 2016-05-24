//set up passport here-passport is what will help us authenticate a user when they try to access a protected route
const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
//for sign in use passport local-LocalStrategy will expect an object containing a username and a password
const LocalStrategy = require('passport-local');


//***Create Local Strategy**** (local b/c we are storing the token locally?)
//sign in, authenticate the user using only email/password -let them through to a route handler which will give them a jwt token 
const localOptions = { usernameField: 'email' }; //when you want the username, look at the email property of the request
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  //verify the email and password
  User.findOne({ email: email }, function(err, user){
    //check database for email
    if (err) { return done(err); }
    //if the email/password is not correct call done with false
    if (!user) {return done(null, false); }
    
    //if the username exists, compare passwords (have to compare an encrypted password to a non-encrypted one)
    user.comparePassword(password, function(err, isMatch){
      if (err) {return done(err); }
      //if the email/password is not correct call done with false
      if(!isMatch) {return done(null, false); }
  
      //if it is correct email and password call done with email/password
      return done(null, user);
    })

  })



});

//*****setup options for jwt strategy*****
const jwtOptions = {
  //have to tell it where to look on the request for the jwt 
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  //in order to decode the token need to pass in the secret
  secretOrKey: config.secret
};




//*****create jwt strategy*****
//payload is decoded jwt token (will have a sub property and a timestamp property)
//done is a callback function to be called based on successful authentication
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  //see if user id in the payload exists in our database
  User.findById(payload.sub, function(err, user){
    //if the search fails call done with err and false (indicating that the user wasnt found)
    if(err) { return done(err, false); }

    //if the user id does exist call done with that user object
    if(user) {
      done(null, user);
    //else call done with null (no error) and false (we didnt find the user)
    } else {
      done(null, false);
    }
  });
});




//*****tell passport to use this strategy*****
passport.use(jwtLogin);
passport.use(localLogin);




