//var express = require('express');
//var router = express.Router();



module.exports = function(app,passport){

  app.get('/', isLoggedIn ,function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  app.get('/login',function(req,res,next){
    res.render('login',{title:'Join the Adventure',message: req.flash('loginMessage')});
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/signup',function(req,res,next){
    res.render('signup', { message: req.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/music', function(req,res,next){

  });

  app.post('/music', function(req,res,next){

  });

  app.get('/us',isLoggedIn,function(req,res){
    res.part
  });

}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('/login');
}
