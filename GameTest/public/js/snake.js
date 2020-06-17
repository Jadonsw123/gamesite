let width = 600;
let height = 600;
$("canvas").attr("height", height);
$("canvas").attr("width", width);


$(".tableScore1").css("display", "none");
$(".scoreLabel1").css("display", "none");
setUpCanvas();

loadGlobalLeaderboard({score:true});
getScore({score:true});


const background = "black";
const border = "red";
let speed = 100;
const FOOD_BORDER_COLOR = 'darkred'; 
const FOOD_COLOR = 'red'; 
let score = 0;
let changingDirection = false;
let numberToAdd = 0;
let level = -1;
// let is_mobile = navigator.userAgent.indexOf('Mobile') !== -1;

// let scoreboard = [];

let reset = false;


let foodX;
let foodY;
let dx = 20;
let dy = 0;

let snake = [
  {x:160,y:160},
  {x:140,y:160},
  {x:120,y:160},
  {x:100,y:160}
]
// $(".canvas").css('width', canvas.width);


window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);







document.addEventListener("keydown", changeDirection);



document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

// var xDown = null;
// var yDown = null;



//////

document.getElementById("reset").addEventListener("click", function(){
	reset = true;
	setTimeout(function onTick(){
		reset = false;
		snake = [
		    {x:160,y:160},
		    {x:140,y:160},
		    {x:120,y:160},
		    {x:100,y:160}
		  ]
		  score = 0;
		  document.getElementById('score2').innerHTML = score;
		  createFood();
		  changingDirection = false;
		  speed=100;
		  dx=20;
		  dy=0;
		  main();

	}, speed + 1);

  // if(didGameEnd()){
  
  // }
});

main();
createFood();

//////

function didGameEnd() {
	if(reset) return true;
	if(!$("input")[0].checked){
		for (let i = 2; i < snake.length; i++) {
			if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
		}}

		const hitLeftWall = snake[0].x < 0;
		const hitRightWall = snake[0].x > gameCanvas.width - 20;
		const hitTopWall = snake[0].y < 0;
		const hitBottomWall = snake[0].y > gameCanvas.height - 20;
		if($("input")[0].checked){
			if(hitLeftWall) snake[0].x = gameCanvas.width;
			if(hitRightWall) snake[0].x = 0;
			if(hitTopWall) snake[0].y = gameCanvas.height;
			if(hitBottomWall) snake[0].y = 0;
		}else{
			return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
		}
	  

	  	
	
	return false;
}

function createFood(){
  foodX = random20(0,canvas.width - 20);
  foodY = random20(0,canvas.height - 20);

  
  snake.forEach(function check(part){
    if(part.x == foodX && part.y == foodY){
      createFood();
    }
  });
}

function drawFood(){
  ctx.fillStyle = FOOD_COLOR;
  ctx.strokestyle = FOOD_BORDER_COLOR;
  ctx.fillRect(foodX, foodY, 20, 20);
  //ctx.strokeRect(foodX, foodY, 20, 20);
}

function random20(min,max){
  return Math.round((Math.random() * (max-min) + min)/20) * 20;
}

function advanceSnake(){
  let head = snake[0];
  snake.unshift({x:head.x +dx,y:head.y+dy});
  
  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
      if (didEatFood) {
        // Increase score
        score += 100;
        // Display score on screen
        document.getElementById('score2').innerHTML = score;
        numberToAdd += 3;
        // Generate new food location
        createFood();
      } else {
        // Remove the last part of snake body
        if(numberToAdd <= 0) snake.pop();
        else numberToAdd -= 1;
        
      }
}


function changeDirection(event){
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;
  const keyPressed = event.keyCode;
  const goingUp = dy === -20;
  const goingDown = dy === 20;
  const goingRight = dx === 20;
  const goingLeft = dx === -20;
  
  if (changingDirection) return;
  changingDirection = true;
  
  
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -20;
    dy = 0;
  }  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -20;
  }  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 20;
    dy = 0;
  }  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 20;
  }
}
//

function drawSnakePart(part){
  ctx.fillStyle = "green";
  ctx.strokeStyle = "green";
  ctx.fillRect(part.x,part.y,20,20);
}

function drawSnake(){
  snake.forEach(drawSnakePart);
  ctx.fillStyle = "#00ff32";
  ctx.strokeStyle = "#00ff32";
  let part = snake[0];
  ctx.fillRect(part.x,part.y,20,20);
}


function clearCanvas(){
  ctx.fillStyle = background;
  ctx.strokeStyle = border;
  ctx.fillRect(0,0,canvas.width,canvas.height );
}





function main(){
  if(didGameEnd()){
  	// let score = $("#score2")[0].innerHTML;
  	addScore(score, level);
    writeScore({ score: true });
  	return;
  } 
  setTimeout(function onTick(){
    changingDirection = false;
    clearCanvas();
    drawFood();
    
    advanceSnake();
    
    drawSnake();
    if(score > 50){
       speed = 75;
    }
    if(score > 1000) speed = 50;
    main();
  }, speed);

  
}
//
