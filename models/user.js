//this file =local definition of what a user is (for mongoose)
const mongoose = require('mongoose');
//use schema property of mongoose to tell mongoose particular fields our model will have
const Schema = mongoose.Schema;
//use bcrypt library to encrypt password
const bcrypt = require('bcrypt-nodejs');


//****define our model*****
//create a schema and pass it an object containing the properties we want the model to have, and their type
const userSchema = new Schema({
  //uniquenss check doesnt do capitals v non capital so we save everything as lowercase
  email: { type: String, unique: true, lowercase: true },
  password: String
});

//******on save hook, encrypt password******
//before saving a model, run this function
userSchema.pre('save', function(next){
  //get access to the user model (here user is an instance of the user model)
  const user = this;
  //generate a salt, then run callback
  bcrypt.genSalt(10, function(err, salt){
    if(err) {return next(err); }
    //hash password using the salt, then run callback
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err) {return next(err); }
      //overwrite plain text password with encrypted password
      user.password = hash;
      //save the model
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

//****create model class****
//load the schema into mongoose, and it corresponds to a collection called 'user'
const ModelClass = mongoose.model('user', userSchema);
//above is a class representing all users

//****export model*****
module.exports = ModelClass;