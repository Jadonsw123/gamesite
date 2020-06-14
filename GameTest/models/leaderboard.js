let mongoose = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User =  require("./user"),
	Score = require("./score").Score,
	scoreSchema = require("./score").scoreSchema;





let leaderboardSchema = new mongoose.Schema({
	game: String,
	board: [scoreSchema],
	date:  { type: Date, default: Date.now }
});







exports.Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
exports.leaderboardSchema = leaderboardSchema;

/*

{username:String,
score:123,
level:123
date:date.now()
}


*/