const express = require('express');
const middleware = require('../middleware');

const router = express.Router();

router.route('/')
  .get(middleware.auth.verify, (req, res) => {
    res.render('index.ejs', {user: req.user});
  });

// router.route('/profile')
//   .get(middleware.auth.verify, (req, res) => {
//     console.log('server/routes/auth.js', req.user);
//     res.render('profile.ejs', {user: req.user});
//   });

router.route('/login')
  .get((req, res) => {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  })
  .post(middleware.passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

router.route('/logout')
  .get((req, res) => {
    req.logout();
    res.redirect('/login');
  });

router.get('/auth/google', middleware.passport.authenticate('google', {
  scope: ['email', 'profile']
}));

router.get('/auth/google/callback', middleware.passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router;