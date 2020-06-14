let mongoose = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User =  require("./user"),
	Score = require("./score").Score,
	scoreSchema = require("./score").scoreSchema,
	Leaderboard = require("./leaderboard").Leaderboard,
	leaderboardSchema = require("./leaderboard").leaderboardSchema;





let allBoardsSchema = new mongoose.Schema({
	name: String,
	boards: {},//object of leaderboard schema
	date:  { type: Date, default: Date.now }
});







module.exports = mongoose.model('AllBoards', allBoardsSchema);

/*

{username:String,
score:123,
level:123
date:date.now()
}


*/