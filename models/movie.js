var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: {type: String, required: true},
    movieNum: {type: Number, required: true},
    movieName: {type: String, required: true},
    releaseDate: {type: String, required: true},
    movieSynopsis: {type: String, required: true},
    movieLength: {type: Number, required: true},
    movieDirector: {type: String, required: true},
    movieActor: {type: String, required: true},
    ticketPrice: {type: Number, required: true}
}, {
    collection: 'movies'
});

module.exports = mongoose.model('Movie', schema);