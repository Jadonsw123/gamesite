let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
const background = "black";
const border = "red";
let speed = 100;
const FOOD_BORDER_COLOR = 'darkred'; 
const FOOD_COLOR = 'red'; 
let score = 0;
let changingDirection = false;
let numberToAdd = 0;


let scoreboard = [];

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



window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
document.addEventListener("keydown", changeDirection);

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
		  document.getElementById('snakeScore').innerHTML = score;
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
        document.getElementById('snakeScore').innerHTML = score;
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

// function addScore(score){
//   	for(let i = 0; i < scoreboard.length; i++){
//   		let oldScore = scoreboard[i];
//   		if(parseInt(score) > parseInt(oldScore)){
//   			scoreboard.splice(i,0,score);
//   			if(scoreboard.length > 10) scoreboard.pop();
//   			return;
//   		}
//   	}
//   	scoreboard.push(score);
//   	if(scoreboard.length > 10) scoreboard.pop();
// 	return;
// }



function main(){
  if(didGameEnd()){
  	let score = $("#snakeScore")[0].innerHTML;
  	addScore(score);
  	writeScore();
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

function addScore(score, level){
    for(let i = 0; i < scoreboard.length; i++){
      let oldScore = scoreboard[i].score;
      if(parseInt(score) > parseInt(oldScore)){
        scoreboard.splice(i,0,{score:score});
        sendScore(score);
        sendTopScore(score, level);
        if(scoreboard.length > 10) scoreboard.pop();
        return;
      }
    }



    scoreboard.push({score:score});
    if(scoreboard.length === 1) sendTopScore(score, level);
    if(scoreboard.length <= 10) sendScore(score, level);
    if(scoreboard.length > 10) scoreboard.pop();
  return;
}

function writeScore(){
  $(".personal").html("");
  for(let i = 0; i < scoreboard.length;i++){
    $(".personal").append("<tr><td>" + (i+1) + "</td><td>" + scoreboard[i].score + "</td></tr>");
  }
}


function sendScore(score){
  $.post("/games/snake/scores", {
    score: score
  }).fail(function(){
    console.log("error");
  });
}

$.get("/games/snake/scores",
  function(data, status){
    console.log(data);
    console.log(status);
    for(let j = 0; j < data.length; j++){
      addPersonalData(data[j].score);
    }

    
     writeScore();
  }
  ).fail(function(){
    console.log("error");
  });


function addPersonalData(score){
    for(let i = 0; i < scoreboard.length; i++){
      let oldScore = scoreboard[i].score;
      if(parseInt(score) > parseInt(oldScore)){
        scoreboard.splice(i,0,{score:score});
        if(scoreboard.length > 10) scoreboard.pop();
        return;
      }
    }



    scoreboard.push({score:score});
    if(scoreboard.length > 10) scoreboard.pop();
  return;
}



$(".canvas").css("padding-left", $("body").width()/2 - gameCanvas.width + "px");






function loadGlobalLeaderboard(){
  $.get("/games/snake/leaderboard",
  function(data, status){
    console.log(data);
    console.log(status);
    globalScoreBoard = [];
    if(!(data.board === undefined)){
      for(let i = 0; i < data.board.length; i++){
        let ob = data.board[i];
        addGlobalData(ob.score, ob.level, ob.username);
      }
    }
    writeGlobalData();
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
    $(".global").append("<tr><td>" + (i+1) + "</td><td>" + globalScoreBoard[i].username + "</td><td>" + globalScoreBoard[i].score + "</td></tr>");
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
  level = 0;
  if((globalScoreBoard.length <= 10) || score > globalScoreBoard[-1].score){
  $.post("/games/snake/leaderboard", {
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