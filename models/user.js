var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    telephone: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    salt: {type: Number, required: true},
    referralCode: {type: String, required: true}
});


module.exports = mongoose.model('User', userSchema);