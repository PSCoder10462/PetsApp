// =======================
//      VARIABLES
// =======================

var express                    = require('express'),
    app                        = express(),
    mongoose                   = require('mongoose'),
    bodyParser                 = require('body-parser'),
    methodOverride             = require('method-override'),
    passport                   = require('passport'),
    localStrategy              = require('passport-local'),
    passportLocalMongoose      = require('passport-local-mongoose'),
    User                       = require('./models/user'),
    Comment                    = require('./models/comment'),
    Pet                        = require('./models/pet'),
    flash                      = require('connect-flash'),
    PORT                       = 3000;
//routes
    var petsRoute        = require('./routes/pets'),
    authRoute            = require('./routes/authentication'),
    commentRoute         = require('./routes/comments');

// =======================
//      APP CONFIG
// =======================
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// for stylesheets
app.use(express.static(__dirname+'/views/public'));

// connecting to mongoose server
mongoose.connect('mongodb://localhost/pets', {useNewUrlParser: true, useUnifiedTopology: true});

// PASSPORT CONFIG
app.use(require('express-session')({
    secret: 'This is the secret line to hash passwords',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash
app.use(flash());

// passing login status to all routes
app.use(function(req, res, next){
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.currentUser = req.user;
    next();
});



// =======================
//      ROUTES
// =======================

app.use('/pets', petsRoute);
app.use(authRoute);
app.use('/pets/:id/comments', commentRoute);


// =======================
//      SERVER + LANDING
// =======================

// landing page
app.get('/', function(req, res){
    res.render('landing');
})

// server call
app.listen(PORT, function(){
    console.log('welcome to the petsapp');
})

