var Movie = require('../models/movie');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/movie', {useNewUrlParser:true, useUnifiedTopology:true})
    .then(() => console.log('MongoDB:movie Connected...'))
    .catch((err) => console.log(err));

var movies = [
    new Movie({
        imagePath: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.flickeringmyth.com%2Fwp-content%2Fuploads%2F2018%2F03%2FReady-Player-One-poster.jpg&f=1&nofb=1',
        movieNum: 00021,
        movieName: '一級玩家',
        releaseDate: '2018/04/20',
        movieSynopsis: '2045年，地球大多數地區變成貧民窟，人們為了逃避混亂的現實，大部分時間都投入在…',
        movieLength: 140,
        movieDirector: 'Director of 一級玩家',
        movieActor: 'Actors of 一級玩家',
        ticketPrice: 200
    }),
    new Movie({
        imagePath: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.LRY3BZiIx7LChdPfrJOQYwHaKj%26pid%3DApi&f=1',
        movieNum: 05037,
        movieName: '煞不住',
        releaseDate: '2016/05/17',
        movieSynopsis: '電影介紹02',
        movieLength: 95,
        movieDirector: 'Director of 煞不住',
        movieActor: 'Actors of 煞不住',
        ticketPrice: 200
    }),
    new Movie({
        imagePath: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.cmLfUjwKvpM22BDLESQGzAHaKS%26pid%3DApi&f=1',
        movieNum: 05154,
        movieName: 'JUSTICE',
        releaseDate: '2014/11/21',
        movieSynopsis: '電影介紹03',
        movieLength: 154,
        movieDirector: 'Director of JUSTICE',
        movieActor: 'Actors of JUSTICE',
        ticketPrice: 200
    }),
    new Movie({
        imagePath: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2Fpl7aCgi2gu8FKvOG4ziDjql7iRl.jpg&f=1&nofb=1',
        movieNum: 04615,
        movieName: 'LIVE BY NIGHT',
        releaseDate: '2018/05/01',
        movieSynopsis: '電影介紹04',
        movieLength: 127,
        movieDirector: 'Director of LIVE BY NIGHT',
        movieActor: 'Actors of LIVE BY NIGHT',
        ticketPrice: 200
    }),
    new Movie({
        imagePath: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffanart.tv%2Ffanart%2Fmovies%2F5876%2Fmovieposter%2Fthe-mist-56d7ff4e42302.jpg&f=1&nofb=1',
        movieNum: 01605,
        movieName: 'THE MIST',
        releaseDate: '2016/01/21',
        movieSynopsis: '電影介紹05',
        movieLength: 162,
        movieDirector: 'Director of THE MIST',
        movieActor: 'Actors of THE MIST',
        ticketPrice: 200
    })
];

var done = 0;
for (var i = 0; i < movies.length; i++){
    movies[i].save(function(err, result){
        done++;
        if (done==movies.length){
            exit();
        }
    });
}
function exit(){
    mongoose.disconnect();
}