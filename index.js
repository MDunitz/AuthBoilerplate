const express = require('express');
//native node library-for working with incoming http requests
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
//create our app as an instance of express
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

//***DB (mongodb) setup***
//from the command line (project directory)
  //brew update
  //brew install mongodb
//create the data directory-place to save the data being collected
  //mkdir -p /data/db
//set permissions on the directory we just created
  //sudo chown -R $USER /data/db
//start mongodb
  //mongod
//connect mongoose to this instance of mongodb 
  //this creates a new db inside of mongodb called auth1
  mongoose.connect('mongodb://localhost:auth/auth1');


//****App setup-getting express to work****
//morgan and bodyparser are express middleware, any incoming request (to our server) will pass through them (app.use registers them as middleware)
//morgan is a logging framework-logs incoming requests in the command line-use for debugging
app.use(morgan('combined'));
//use to prevent cors errors/rejections, tell server to accept everything, middleware specifically handling cors-could also specify domains to allow to limit access to api
app.use(cors());
//bodyparser-parses incoming requests, and will parse them as if they were json 
app.use(bodyParser.json({type: '*/*'}));
//calling the router function we created with our app
router(app);



//****Server setup-getting express application to talk to outside world***
const port =process.env.PORT || 3090;
//create an http server that can recieve requests and forward anything that comes in to our express application (app)
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on port ', port);
console.log('check out the app at http://localhost:', port);