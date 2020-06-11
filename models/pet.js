var mongoose = require('mongoose');

var petSchema = new mongoose.Schema({
    name: String,
    species: String,
    image: String,
    description: String,
    adoptionStatus: String,
    author:{
        id:{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }, 
        username: String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model('Pet', petSchema);
