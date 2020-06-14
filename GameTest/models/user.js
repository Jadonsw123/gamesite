let mongoose = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose");




let userSchema = new mongoose.Schema({
	username: String,
	password: String,
	joinDate:  { type: Date, default: Date.now },
	personalLeaderboard: {}
});





userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);