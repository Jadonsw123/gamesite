let express = require("express"),
	app = express(),
	path = require("path"),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User = require("./models/user")
	Leaderboard = require("./models/leaderboard").Leaderboard,
	AllBoards = require("./models/allBoards"),
	Score = require("./models/score").Score;

var flash = require('connect-flash');
var cookieParser = require("cookie-parser");
var session = require('express-session');



const os = require("os");
var networkInterfaces = os.networkInterfaces();

var http = require("http");
var https = require("https");
var port = process.env.PORT || 4999;





mongoose.connect('mongodb://127.0.0.1:27017/gameWebsite', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
let count = 0;

app.use(session({
	secret: "Adarsh refuses to learn anything!",
	resave: false,
	saveUninitialized: false
}))
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));



passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(cookieParser('keyboard cat'));
app.use(flash());



// let local = {};
// local.snake = [1,2,3,4];

// User.create({personalLeaderboard: local}, function(err, created){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log(created);
// 		local.stacker = [5,4,3];

// 		User.findByIdAndUpdate(created._id, {personalLeaderboard: local}, function(err, found){
// 			if(err){
// 				console.log(err);
// 			} else {
// 				//console.log(updated.stacker);
// 				User.findById(found._id, function(err, updated){
// 					console.log(updated);
// 				});
// 			}
// 		});
// 	}
// });

// let newAllBoards = new AllBoards({
// 	name: "First Board",
// 	boards: {}
// });
// newAllBoards.boards.date = Date.now;
// newAllBoards.save(function(err, post){

// });

//so what you have to do to either create or update if not created:
// if its null, make it an array
// then, you can do the leaderboard stuff to add it in, then on website end you sort top ten.




 








app.get("/games", function(req, res){
	count++;
	res.render("home", {currentUser: req.user});
	logReq(req, req.url);

});

app.get("/register", function(req, res){
	res.render('register', {currentUser: req.user,  message: ""});
	logReq(req, req.url);
});

app.post('/register', async function(req, res){
	let username = req.body.username;
	let password = req.body.password;
	let local = {snake:[]};
	try {

		let user = await User.register(new User({username:username, personalLeaderboard:local}), req.body.password);
		passport.authenticate("local")(req, res, function(){
			res.redirect("/");
		});
	} catch(err) {
		console.log(err);
		res.render('register', {currentUser: req.user, message: err});
	}
})


app.get('/login', function(req, res){
	// console.log(req);
	res.render('login', {currentUser: req.user, message: req.flash('error')[0]});
	logReq(req, req.url);
})

app.post("/login", passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}),async function(req, res){

});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
	logReq(req, req.url);
})




app.get("/games/:id", function(req, res){
	count++;
	res.render("games/" + req.params.id, {currentUser: req.user});
	logReq(req, req.url);
});




//req.body contains a score
app.post("/games/:id/leaderboard", async function(req, res){
	try{
		if(req.isAuthenticated()){
			let allBoards = (await AllBoards.find({name: "First Board"}))[0];
			// console.log(allBoards.boards);
			if(allBoards.boards[req.params.id] === undefined){
				let newLeaderboard = new Leaderboard({
					game: req.params.id,
					board: {}
				});
				newLeaderboard = await newLeaderboard.save();
				// console.log(newLeaderboard);
				let boards = allBoards.boards;
				boards[req.params.id] = newLeaderboard;
				await AllBoards.findByIdAndUpdate(allBoards._id, {boards: boards});
			}
			allBoards = (await AllBoards.find({name: "First Board"}))[0];
			let leaderboard = (await Leaderboard.find({game: req.params.id}))[0];

			let newScore = new Score(req.body);
			newScore.user = req.user._id;
			newScore.username = (await User.findById(req.user._id)).username;
			newScore = await newScore.save();

			let scores = leaderboard.board;
			scores.push(newScore);
			leaderboard = await Leaderboard.findByIdAndUpdate(leaderboard._id, {board: scores});
			// console.log("Final Leaderboard: " + leaderboard)
			


		}
	} catch(err){
	console.log(err);
	}
	res.send("???");
});

app.get("/games/:id/leaderboard", async function(req, res){
	try{
		let allBoards = (await AllBoards.find({name: "First Board"}))[0];
		let leaderboard = (await Leaderboard.find({game: req.params.id}))[0];
		res.send(leaderboard);
	} catch(err){
		console.log(err);
	}
});


app.post("/games/:id/scores", async function(req, res){
	try{
		if(req.isAuthenticated()){
			let user = req.user;
			if(user.personalLeaderboard[req.params.id] === undefined){
				let local = user.personalLeaderboard;
				local[req.params.id] = [];
				local[req.params.id].push(req.body);

				await User.findByIdAndUpdate(user._id, {personalLeaderboard: local});
			} else{
				let local = user.personalLeaderboard;
				local[req.params.id].push(req.body);

				await User.findByIdAndUpdate(user._id, {personalLeaderboard: local});
			}
		}
	} catch(err){
		console.log(err);
	}
	res.send("Scores");
});


app.get("/games/:id/scores", async function(req, res){
	try{
		if(!req.isAuthenticated()) res.send([]);
		else {
			let user = req.user;
			if(! (user.personalLeaderboard[req.params.id] === undefined) ) {
				res.send(user.personalLeaderboard[req.params.id]);
			}
		}
	} catch(err){
		console.log(err);
	}
});





app.get("/", function(req, res){
	res.redirect("/games");
	logReq(req, req.url);
});




app.get("*", function(req, res){
	res.redirect("/games");
	logReq(req, req.url);
});








// app.listen(4999, "192.168.0.25", function(){
// 	console.log("It started!");
// });
app.listen(port, /*networkInterfaces['Wi-Fi'].find(element => element.family === "IPv4").address,*/ function(){
	console.log(networkInterfaces['Wi-Fi'].find(element => element.family === "IPv4").address);
	console.log("It started!");
});


function logReq(req, place){
	let person = "UNKNOWN";
	if(req.connection.remoteAddress == '75.49.123.188') person = 'Danny';
	else if(req.connection.remoteAddress == '70.114.133.114') person = 'Me';
	else if(req.connection.remoteAddress == '70.114.148.181') person = 'Adarsh';
	else if(req.isAuthenticated()){
		person = req.user.username;
	}
	console.log(Date() + " " + count + ": IP ADDRESS " + req.connection.remoteAddress + " Entered " + place + ": " + person);

}

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}