var middlewareObj   = {},
    Pet             = require('../models/pet'),
    Comment         = require('../models/comment');

// login status
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash('error', 'Please login first!');
        res.redirect('/login');
    }
}

// commentOwnership status
middlewareObj.isCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, found){
            
            if(err){
                console.log(err);
                req.flash('error', 'some db error occured');
                redirect('back');
            }
            else{
                if(found.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash('error', 'You do not have the permission to do that');
                    res.redirect('back');
                }
            }
        });
    }
    else{
        req.flash('error', 'You must be logged in!');
        res.redirect('/login');
    }
}


// petOwnership status
middlewareObj.isPetOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Pet.findById(req.params.id, function(err, found){
            if(err){
                req.flash('error', 'db error!');
                res.redirect('/pets/' + req.params.id);
            }
            else{
                if(found.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash('error', 'you do not have the permission to do that');
                    res.redirect('/pets/'+req.params.id);
                }
            }
        });
    }
    else{
        req.flash('error', 'You must login before accessing this feature');
        res.redirect('/login');
    }
}

module.exports = middlewareObj;