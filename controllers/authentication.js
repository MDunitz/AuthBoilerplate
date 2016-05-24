const User = require('../models/user');
//use jwt library to take the user ID + secret string -> JSON Web Token (jwt)
const jwt = require('jwt-simple');
//get the secret we created 
const config = require('../config');


//put in logic for creating a token
//pass in user model
function tokenForUser(user){
  //when this token was issued
  const timestamp=new Date().getTime();
  //first arg passed to jwt is the info we want to encode, second argument is the secret string we will use to encrypt it
  //jwt is a standard, as a convention json web tokens have a sub property (short for subject-who is the token about), iat-stands for issued at time
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}


//route for sigin
exports.signin = function(req, res, next){
  //user has had email/password authed, we just need to give them a token
  //need to access current user model (passed in via the done function of localLogin )
  res.send({ token: tokenForUser(req.user) });

}



//put logic for processing and responding to a signup request

exports.signup = function(req, res, next){
  //get email/password off of post request
  const email = req.body.email;
  const password = req.body.password

  if(!email || !password){
    return res.status(422).send({ error: 'You must provide email and password'});
  }

  //see if a user with a given email exists, 
  //search through database-via user model we created-it has a method 
  User.findOne({ email: email }, function(err, existingUser){
    //if connection to database fails
    if(err){ return next(err); }
    //if a user with the email does exist return an error
    if(existingUser) {
      return res.status(422).send({ error: 'Email is in use'})
    }
    //if a user with email does not exist create and save new user record
      //use new key word on the user class making a new instance of the user model
    const user = new User ({
      email: email,
      password: password
    });
    //save record to the database-pass a callback so we know if/when it completes
    user.save(function(err){
      if(err){ return next(err); }
    //respond to request indicating the user was created
      //pass in a token that the user can store and use to make authenticated requests
      res.json({ token: tokenForUser(user) });
    });
  });
    

    


  






}