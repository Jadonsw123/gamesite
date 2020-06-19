var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };








let width = 600;
let height = 600;
$("canvas").attr("height", height);
$("canvas").attr("width", width);



loadGlobalLeaderboard({level:true, score:true});
getScore({score:true, level:true});

setUpCanvas();






const backgroundC = "black";
const paddleC = "green";
const ballC = "white";


let score = 0;
let lives = 1;
let blockWidth = 100;
let blockHeight = 30;
let ballRadius = 5;
let gapX = 0;
let gapY = 0;
let startBlocksY = 5;
let endBlocksY = 15;
let startBlocksX = 1;
let endBlocksX = width / blockWidth - (width / blockWidth * 5 / blockWidth) - 1;

let level = 1;

let player;
let balls = [];

let paddles = [];
document.getElementById('score2').innerHTML = score;
document.getElementById('score1').innerHTML = level;
populate();






document.getElementById("reset").addEventListener("click", resetGame);

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

window.addEventListener("touchstart", function (event) {
    if (event.touches[0].clientX > $(window).width() / 2) keysDown[39] = true;
    if (event.touches[0].clientX <= $(window).width() / 2) keysDown[37] = true;

});
window.addEventListener("touchend", function (event) {
    delete keysDown[37];
    delete keysDown[39];

});



function populate(){
  player = new Player();
  balls = [];
  balls.push(new Ball(player.paddle.x  + player.paddle.width / 2, player.paddle.y - 20));
  paddles = [];

  for (let i = startBlocksX; i < endBlocksX; i++){
  for(let j = startBlocksY; j < endBlocksY; j++){
      
    paddles.push(new Paddle(i * (blockWidth + gapX) + 2,j * (blockHeight + gapY),blockWidth,blockHeight, getRandomColor()));
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







window.onload = function () {
    $('body').toggleClass('disableTouch');
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
    // $('score1').html(level);
    document.getElementById('score1').innerHTML = level;
    document.getElementById('score2').innerHTML = score;
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
      

      document.getElementById('score1').innerHTML = level;
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
        document.getElementById('score2').innerHTML = score;
        addNewBall();
        remove = false;
      }
          


        }
    }
    this.x += this.x_speed;
    this.y += this.y_speed;
};



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












function resetGame(){

	populate();
	addScore(score, level);
  	writeScore({score: true, level: true});
    lives = 3;
    score = 0;
	document.getElementById('score2').innerHTML = score;
	document.getElementById('score1').innerHTML = level;
}


