//export function from this file, import it into index.js and pass it app
const Authentication = require('./controllers/authentication');
const passportService = require ('./services/passport');
const passport = require('passport');


//middleware that will run b/w request and the routehandler, use on any route we want to require authentication for
const requireAuth = passport.authenticate('jwt', {session: false})

const requireSignin = passport.authenticate('local', { session: false });


module.exports = function(app){

  //for root route, send them through requireAuth and if they get through that run the following function to handle the request 
  app.get('/', requireAuth, function(req, res){
    res.send({ message: 'Super secret code is fdsklf' });
  });

  app.post('/signin', requireSignin, Authentication.signin);

  //add route handlers to express, on app we call get (function) will match to type of the http request that will be issued/we want to handle, first argument is the route we want to handle (here '/signup') the second argument is the function we want to call for that particular route.
  //the function getting called for our route gets called with three arguments, req-object representing incoming http request, res-response object we will form up and send back, next-mostly for error handling 
  app.post('/signup', Authentication.signup);


}