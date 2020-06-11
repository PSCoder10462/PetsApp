var express     = require('express'),
    router      = express.Router(),
    User        = require('../models/user'),
    passport    = require('passport');

// SIGNUP
    // form
router.get('/register', function(req, res){
    res.render('../views/authentication/register');
})

    // post 
router.post('/register', function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, newUser){
        if(err){
            req.flash('error', err.message);
            res.redirect('/login');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/pets');
        })
    });
})

// LOGIN
    // form
router.get('/login', function(req, res){
    res.render('../views/authentication/login');
})

    // post
router.post('/login', passport.authenticate('local', {
    successRedirect: '/pets',
    failureRedirect: '/login'
}), function(req, res){});

// LOGOUT
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'logged out successfully!');
    res.redirect('/pets');
})

module.exports = router;