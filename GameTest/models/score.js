let mongoose = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User =  require("./user")





let scoreSchema = new mongoose.Schema({
	score: Number,
	level: Number,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	username: String,
	date:  { type: Date, default: Date.now }
});


let Score = mongoose.model("Score", scoreSchema);





exports.Score = mongoose.model('Score', scoreSchema);
exports.scoreSchema = scoreSchema;
/*

{username:String,
score:123,
level:123
date:date.now()
}


*/