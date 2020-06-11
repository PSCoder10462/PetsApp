var express     = require('express'),
    Pet         = require('../models/pet'),
    Comment     = require('../models/comment'),
    middleware  = require('../middleware'),
    router      = express.Router({mergeParams: true});

// new comment
    // show form
router.get('/new', middleware.isLoggedIn, function(req, res){
    Pet.findById(req.params.id, function(err, foundPet){
        if(err){
            req.flash('Cannot create a new comment now! Try again later!');
            res.redirect('/pets');
        }
        else{
            res.render('../views/comments/new', {pet: foundPet});
        }
    });
})

    // post req
router.post('/', middleware.isLoggedIn, function(req, res){
    Pet.findById(req.params.id, function(err, foundPet){
        if(err){
            req.flash('Cannot create a new comment now! Try again later!');
            res.redirect('/pets');
        }
        else{
            Comment.create(req.body.comment, function(err, createdComment){
                if(err){
                    req.flash('Cannot create a new comment now! Try again later!');
                    res.redirect('/pets');
                }
                else{
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    foundPet.comments.push(createdComment);
                    foundPet.save();
                    req.flash('success', 'You posted a new comment successfully!');
                    res.redirect('/pets/'+req.params.id);
                }
            });
        }
    });
})

// edit route
    // form route
router.get('/:comment_id/edit', middleware.isCommentOwner, function(req, res){
    var pet_id = req.params.id;
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            req.flash('Sorry! The comment could not be edited');
            res.redirect('/pets/'+ req.params.id);
        }
        else{
            res.render('../views/comments/edit', {pet_id : pet_id, comment: comment});
        }
    });
})
    // put route
router.put('/:comment_id',middleware.isCommentOwner, function(req, res){
    
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updated){
        if(err){
            req.flash('Sorry! The comment could not be edited');
            res.redirect('/pets/'+ req.params.id);
        }
        else{
            req.flash('success', 'Your comment has been updated successfully!');
            res.redirect('/pets/'+ req.params.id);
        }
    });
})

// DELETE ROUTE
router.delete('/:comment_id', middleware.isCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash('error', 'Could not delete the comment, retry later');
        }
        else
            req.flash( 'success' , 'comment deleted!');
            res.redirect('/pets/' + req.params.id);
    });
})

module.exports = router;
