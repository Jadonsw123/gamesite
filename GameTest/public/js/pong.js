var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };


let width = 400;
let height = 600;
$("canvas").attr("height", height);
$("canvas").attr("width", width);


setUpCanvas();


$(".tableScore1").css("display", "none");
$(".scoreLabel1").css("display", "none");
loadGlobalLeaderboard({score:true});
getScore({score:true});
// $(".canvas").css("padding-left", $("body").width()/2 - gameCanvas.width + "px");
const backgroundC = "black";
const paddleC = "green";
const ballC = "white";

let score = 0;
let lives = 3;
let level = -1;
// let is_mobile = navigator.userAgent.indexOf('Mobile') !== -1;

// $(".canvas").css('width', canvas.width);
// $('body').toggleClass('disableTouch');


window.onload = function () {

  animate(step);
};

var step = function() {
	if(lives <= 0) resetGame();
  update();
  render();
  animate(step);
};


var update = function() {
	player.update();
	computer.update(ball);
	ball.update(player.paddle, computer.paddle);
};


function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Paddle.prototype.render = function() {
  context.fillStyle = paddleC;
  context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
   this.paddle = new Paddle(175, 580, 50, 10);
}

function Computer() {
  this.paddle = new Paddle(175, 10, 50, 10);
}

Player.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.render = function() {
  this.paddle.render();
};

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = 3;
  this.radius = 5;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = ballC;
  context.fill();
};

var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);

var render = function() {
  context.fillStyle = backgroundC;
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();
  ball.render();
};



Ball.prototype.update = function(paddle1, paddle2) {
	this.x += this.x_speed;
	this.y += this.y_speed;

	var left_x = this.x - 5;
	var top_y = this.y - 5;
	var right_x = this.x + 5;
	var bottom_y = this.y + 5;

	//cheacking left and right walls
	if(this.x - 5 < 0) { // hitting the left wall
		this.x = 5;
		this.x_speed = -this.x_speed;
	} else if(this.x + 5 > 400) { // hitting the right wall
		this.x = 395;
		this.x_speed = -this.x_speed;
	}

	if(this.y < 0 || this.y > 600) { // a point was scored
		if(this.y < 0) {
			score+= 100;
			this.x_speed = Math.abs(this.x_speed) + 0.5;
			this.y_speed = Math.abs(this.y_speed) + 0.5;
		}
		if(this.y > 600) {lives--;}
		document.getElementById('score2').innerHTML = score;
		document.getElementById('score1').innerHTML = lives;
		this.x_speed = 0;
		// this.y_speed = 3;
		this.x = 200;
		this.y = 300;
	}

	if(top_y > 300) {
	    if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && left_x < (paddle1.x + paddle1.width) && right_x > paddle1.x) {
	      // hit the player's paddle
	      this.y_speed = -this.y_speed;
	      this.x_speed += (paddle1.x_speed / 2);
	      this.y += -10 + this.y_speed;
	      this.x += this.x_speed;
	    }
	  } else {
	    if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && left_x < (paddle2.x + paddle2.width) && right_x > paddle2.x) {
	      // hit the computer's paddle
	      this.y_speed = -this.y_speed;
	      this.x_speed += (paddle2.x_speed / 2);
	      this.y += this.y_speed;
	    }
  	}
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});


window.addEventListener("touchstart", function (event) {
    //alert($(window).width());
    //alert(event.touches[0].screenX)
    if (event.touches[0].screenX > $(window).width() / 2) keysDown[39] = true;
    if (event.touches[0].screenX <= $(window).width() / 2) keysDown[37] = true;
    
});
window.addEventListener("touchend", function (event) {
    delete keysDown[37];
    delete keysDown[39];
    
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
  }
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.x < 0) { // all the way to the left
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.width > 400) { // all the way to the right
    this.x = 400 - this.width;
    this.x_speed = 0;
  }
}

Computer.prototype.update = function(ball) {
  var x_pos = ball.x;
  var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
  if(diff < 0 && diff < -2 - score/1000) { // max speed left
    diff = -2 - score/1000;
  } else if(diff > 0 && diff > 2 + score/1000) { // max speed right
    diff = 2 + score/1000;
  }
  this.paddle.move(diff, 0);
  if(this.paddle.x < 0) {
    this.paddle.x = 0;
  } else if (this.paddle.x + this.paddle.width > 400) {
    this.paddle.x = 400 - this.paddle.width;
  }
};





document.getElementById("reset").addEventListener("click", resetGame);




function resetGame(){

	player = new Player();
	computer = new Computer();
	ball = new Ball(200, 300);
	addScore(score, level);
	writeScore({ score: true});
    lives = 3;
    score = 0;
	document.getElementById('score2').innerHTML = score;
	document.getElementById('score1').innerHTML = lives;
}

