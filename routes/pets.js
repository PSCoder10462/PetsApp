const pet = require('../models/pet');

var Pet             = require('../models/pet'),
    express         = require('express'),
    router          = express.Router(),
    middleware      = require('../middleware'),
    mongoose        = require('mongoose');

// INDEX ROUTE-show all animals
router.get('/', function(req, res){

    Pet.find({}, function(err, allPets){
        if(err){
            req.flash('error', 'DB issues, retry later!');
            res.redirect('/');
        }
        else{
            res.render('../views/pets/index', {pets: allPets});
        }
    });
})


// NEW ROUTE- create new animal
// form display
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('../views/pets/new');
})
// post request
router.post('/', middleware.isLoggedIn, function(req, res){
    var name            = req.body.name;
    var species         = req.body.species;
    var image           = req.body.image;
    var description     = req.body.description;
    var author          = {
        id : req.user._id,
        username : req.user.username
    };
    var adopt           = req.body.adopt;
    
    var pet = {name: name, species:species, image:image, description: description, adoptionStatus: adopt, author: author};
    Pet.create(pet, function(err, createdPet){
        if(err){
            req.flash('error', 'Cannot create the post');
            res.redirect('/new');
        }
        else{
            req.flash('success', 'Your post has been added successfully');
            res.redirect('/pets');
        }
    });
})

// SHOW
router.get('/:id', function(req, res){
    Pet.findById(req.params.id).populate('comments').exec(function(err, found){
        if(err){
            req.flash('error', 'No info right now');
        }
        else{
            res.render('../views/pets/show', {pet: found});
        }
    });
})

// EDIT ROUTE
// form
router.get('/:id/edit', middleware.isPetOwner ,function(req, res){
    Pet.findById(req.params.id, function(err, found){
        if(err){
            req.flash('error', "can't edit");
        }
        else{
            res.render('../views/pets/edit', {pet: found});
        }
    })
})

// put route
router.put('/:id', middleware.isPetOwner, function(req, res){
    Pet.findByIdAndUpdate(req.params.id, req.body.pet, function(err, updated){
        if(err){
            console.log(err);
            req.flash('error', "can't edit");
            res.redirect('/pets/'+req.params.id);
        }
        else{
            req.flash('success', 'your post was updated successfully');
            res.redirect('/pets/'+req.params.id);
        }
    });
})

// DELETE ROUTE
router.delete('/:id', middleware.isPetOwner, function(req, res){
    Pet.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            req.flash('error', "can't delete");
        }
        else{
            req.flash('success', 'your post has been successfully deleted!')
            res.redirect('/pets');
        }
    })
})

router.get('/:id/adopt', middleware.isLoggedIn, function(req, res){
    Pet.findById(req.params.id, function(err, found){
        if(err){
            req.flash('error', 'db error... try again later');
        }
        else{
            found.adoptionStatus = "true";
            req.flash('success', "congratulations on adopting a "+found.species);
        }
        
        res.redirect('/pets');
    })
})

module.exports = router;