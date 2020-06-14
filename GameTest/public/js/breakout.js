var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

let canvas = document.getElementById("gameCanvas");
let width = canvas.width;
let height = canvas.height;
var context = canvas.getContext('2d');
$(".canvas").css("padding-left", $("body").width()/2 - gameCanvas.width + "px");
const backgroundC = "black";
const paddleC = "green";
const ballC = "white";


let score = 0;
let lives = 3;
let blockWidth = 30;
let blockHeight = 15;
let ballRadius = 5;
let gap = 5;
let level = 1;

let player;
let balls = [];

let paddles = [];
populate();



function populate(){
  player = new Player();
  balls.push(new Ball(player.paddle.x  + player.paddle.width / 2, player.paddle.y - 20));
    paddles = [];
    for (let i = 0; i < width / blockWidth - (width / blockWidth * 5 / blockWidth); i++){
    for(let j = 2; j < height / blockWidth - 5; j++){
        
      paddles.push(new Paddle(i * (blockWidth + gap) + 2,j * (blockHeight + 5),blockWidth,blockHeight, getRandomColor()));
    }
  }
}



function generateHslaColors (saturation, lightness, alpha, amount) {
  let colors = []
  let huedelta = Math.trunc(360 / amount)

  for (let i = 0; i < amount; i++) {
    let hue = i * huedelta
    colors.push(`hsla(${hue},${saturation}%,${lightness}%,${alpha})`)
  }

  return colors
}
let colors = generateHslaColors(50,100,1.0,9);



window.onload = function() {
  animate(step);
};

var step = function() {
	if(lives <= 0) resetGame();
  if(balls.length == 0){
    balls.push(new Ball(player.paddle.x + player.paddle.width / 2, player.paddle.y - 20));
    lives--;
  }
  if(paddles.length == 0){
    populate();
    score += 10000;
    level++;
  } 
  update();
  render();
  animate(step);
};


var update = function() {
	player.update();
  for(let i = 0; i < balls.length; i++){
	 balls[i].update(player.paddle, paddles, i);

  }
};


function Paddle(x, y, width, height, color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
  this.color = color;
}

Paddle.prototype.render = function() {
  context.fillStyle = this.color;
  context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
   this.paddle = new Paddle(175, 580, 50, 10, paddleC);
}



Player.prototype.render = function() {
  this.paddle.render();
};



function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = -2;
  this.radius = ballRadius;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = ballC;
  context.fill();
};


camelCaseWordsHello



function getRandomColor() {
    var letters = '56789ABC'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}





var render = function() {
  context.fillStyle = backgroundC;
  context.fillRect(0, 0, width, height);
  player.render();
  for(let i = 0; i < balls.length; i++){
   balls[i].render();

  }
  for(let i = 0; i < paddles.length; i++){
    paddles[i].render();
  }
  
  
};


function addNewBall(){
  balls.push(new Ball(player.paddle.x  + player.paddle.width / 2, player.paddle.y - 20));
}


Ball.prototype.update = function(paddle1, paddle2, k) {
	this.x += this.x_speed;
	this.y += this.y_speed;

	var left_x = this.x - 5;
	var top_y = this.y - 5;
	var right_x = this.x + 5;
	var bottom_y = this.y + 5;
  // paddle2.push(paddle1);
	// //cheacking left and right walls
	// if(this.x - 5 < 0) { // hitting the left wall
	// 	this.x = 5;
	// 	this.x_speed = -this.x_speed;
	// } else if(this.x + 5 > 400) { // hitting the right wall
	// 	this.x = 395;
	// 	this.x_speed = -this.x_speed;
	// }

	// if(this.y < 0 || this.y > 600) { // a point was scored
	// 	if(this.y < 0) {
	// 		score+= 100;
	// 		this.x_speed = Math.abs(this.x_speed) + 0.5;
	// 		this.y_speed = Math.abs(this.y_speed) + 0.5;
	// 	}
	// 	if(this.y > 600) {lives--;}
	// 	document.getElementById('stackerScore').innerHTML = score;
	// 	document.getElementById('level').innerHTML = lives;
	// 	this.x_speed = 0;
	// 	// this.y_speed = 3;
	// 	this.x = 200;
	// 	this.y = 300;
	// }

	// if(top_y > width - 100) {
	    if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && left_x < (paddle1.x + paddle1.width) && right_x > paddle1.x) {
	      // hit the player's paddle
	      this.y_speed = -this.y_speed;
	      this.x_speed = (paddle1.x_speed / 6);
	      this.y += -10 + this.y_speed;
	      this.x += this.x_speed;
	    }else {
    //bounce off left and right edges of screen
      if(this.x < 0 || this.x + this.radius > width){
        this.x_speed *= -1;
      }
      if(this.y < 0){
        this.y_speed *= -1;
      }
      if(this.y + this.radius > height){
        balls.splice(k,1);
        

        document.getElementById('level').innerHTML = lives;
      }
      for(let i = 0; i < paddles.length; i++){
        let remove = false;
        let paddle = paddles[i];
        if (this.x + this.radius + this.x_speed > paddle.x && 
            this.x + this.x_speed < paddle.x + paddle.width && 
            this.y + this.radius > paddle.y && 
            this.y < paddle.y + paddle.height) {
          this.x_speed *= -1;
          remove =  true;
        }
        
        
        //if I keep moving in my current Y direction, will I collide with the center rectangle?
        if (this.x + this.radius > paddle.x && 
            this.x < paddle.x + paddle.width && 
            this.y + this.radius + this.y_speed > paddle.y && 
            this.y + this.y_speed < paddle.y + paddle.height) {
          this.y_speed *= -1;
                  remove =  true;

        }
        //bounce off top and bottom edges of screen
        if(remove){
          paddles.splice(i,1);
          i--;
          score+= 100;
            document.getElementById('stackerScore').innerHTML = score;
            addNewBall();
          remove = false;
        }
        


      }}
      this.x += this.x_speed;
      this.y += this.y_speed;
	    // if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && left_x < (paddle2.x + paddle2.width) && right_x > paddle2.x) {
	    //   // hit the computer's paddle
	    //   this.y_speed = -this.y_speed;
	    //   this.x_speed += (paddle2.x_speed / 2);
	    //   this.y += this.y_speed;
	    // }
  	// }
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 37) { // left arrow
      this.paddle.move(-4, 0);
    } else if (value == 39) { // right arrow
      this.paddle.move(4, 0);
    } else {
      this.paddle.move(0, 0);
    }
    if(value == 32){
      //addNewBall();
    }
  }
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.x + this.width / 2 < 0) { // all the way to the left
    this.x = 0 - this.width / 2 + 1;
    this.x_speed = 0;
  } else if (this.x + this.width / 2 > width) { // all the way to the right
    this.x = width - this.width;
    this.x_speed = 0;
  }
}







document.getElementById("reset").addEventListener("click", resetGame);


let scoreboard = [];

function resetGame(){
	console.log("reset game");
	populate();
	addScore(score, level);
  	writeScore();
    lives = 3;
    score = 0;
	document.getElementById('stackerScore').innerHTML = score;
	document.getElementById('level').innerHTML = lives;
}



function addScore(score, level){
    for(let i = 0; i < scoreboard.length; i++){
      let oldScore = scoreboard[i].score;
      if(parseInt(score) > parseInt(oldScore)){
        scoreboard.splice(i,0,{score:score, level:level});
        sendScore(score, level);
        sendTopScore(score, level);
        if(scoreboard.length > 10) scoreboard.pop();
        return;
      }
    }



    scoreboard.push({score:score, level:level});
    if(scoreboard.length <= 10) sendTopScore(score, level);
    if(scoreboard.length <= 10) sendScore(score, level);
    if(scoreboard.length > 10) scoreboard.pop();
  return;
}

function writeScore(){
  $(".personal").html("");
  for(let i = 0; i < scoreboard.length;i++){
    $(".personal").append("<tr><td>" + (i+1) + "</td><td>" + scoreboard[i].level + "</td><td>" + scoreboard[i].score + "</td></tr>");
  }
}





function sendScore(score, level){
  $.post("/games/breakout/scores", {
    score: score,
    level: level
  }, function(){
    
    // console.log("It worked")
  }).fail(function(){
    console.log("error");
  });
  
}

$.get("/games/breakout/scores",
  function(data, status){
    for(let j = 0; j < data.length; j++){
      addPersonalData(data[j].score, data[j].level);
    }

    
     writeScore();
  }
  ).fail(function(){
    console.log("error");
  });


function addPersonalData(score, level){
    for(let i = 0; i < scoreboard.length; i++){
      let oldScore = scoreboard[i].score;
      if(parseInt(score) > parseInt(oldScore)){
        scoreboard.splice(i,0,{score:score, level:level});
        if(scoreboard.length > 10) scoreboard.pop();
        return;
      }
    }



    scoreboard.push({score:score, level:level});
    if(scoreboard.length > 10) scoreboard.pop();
  return;
}



function loadGlobalLeaderboard(){
  $.get("/games/breakout/leaderboard",
  function(data, status){
    console.log(data);
    console.log(status);
    globalScoreBoard = [];
    if(!(data.board === undefined)){
      for(let i = 0; i < data.board.length; i++){
        let ob = data.board[i];
        addGlobalData(ob.score, ob.level, ob.username);
      }
      writeGlobalData();
    }
  }
  ).fail(function(){
    console.log("error");
  });
}
loadGlobalLeaderboard();


let globalScoreBoard = [];
function writeGlobalData(){
  console.log(globalScoreBoard);
  $(".global").html("");
  for(let i = 0; i < globalScoreBoard.length;i++){
    $(".global").append("<tr><td>" + (i+1) + "</td><td>" + globalScoreBoard[i].username + "</td><td>" + globalScoreBoard[i].level + "</td><td>" + globalScoreBoard[i].score + "</td></tr>");
  }
}

function addGlobalData(score, level, username){
  for(let i = 0; i < globalScoreBoard.length; i++){
    let oldScore = globalScoreBoard[i].score;
    if(parseInt(score) > parseInt(oldScore)){
      globalScoreBoard.splice(i,0,{score:score, level:level, username: username});
      if(globalScoreBoard.length > 10) globalScoreBoard.pop();
      return;
    }
  }

    globalScoreBoard.push({score:score, level:level, username: username});
    if(globalScoreBoard.length > 10) globalScoreBoard.pop();
}


function sendTopScore(score, level){
  if((globalScoreBoard.length <= 10) || score > globalScoreBoard[-1].score){
    $.post("/games/breakout/leaderboard", {
      score: score,
      level: level
    }, function(){
      loadGlobalLeaderboard();
      console.log('it worked')
    }).fail(function(){
      console.log("error");
    });
  }
}