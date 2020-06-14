let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
const background = "black";
const border = "red";
let speed = 75;

let score = 0;
let level = 1;
let goingRight = true;
let viewOffset = 0;


let scoreboard = [];

let blockWidth = 10;
let blockHeight = 20;



let fallingBlocks = [];

let dx = blockWidth;

let blocks = [];
let movingBlocks = [];
for(let i = 0; i < 20; i++){
  movingBlocks.push({x:400-i*blockWidth, y:gameCanvas.height - blockHeight});
}




window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
document.addEventListener("keydown", spacePressed);

//////

document.getElementById("reset").addEventListener("click", function(){
  // if(didGameEnd()){
    movingBlocks = [];
  setTimeout(function onTick(){
    blocks = [
    
  ];
  movingBlocks = [];
  for(let i = 0; i < 20; i++){
  movingBlocks.push({x:400-i*10, y:gameCanvas.height - blockHeight});
  }

  score = 0;
  viewOffset = 0;
  level = 0;
  document.getElementById('stackerScore').innerHTML = score;
  speed=100;
  dx=blockWidth;
  fallingBlocks = [];
  goingRight = true;

  main();

  }, speed + 10);
  
  // }
});

main();

//////

function didGameEnd() {
  if(movingBlocks.length < 1) return true;
}



function placeBlock(block, i){

  if(block.x > gameCanvas.width - blockWidth || block.x < 0){
    movingBlocks.splice(i,1);

    return false;
  }

  if(block.y === gameCanvas.height - blockHeight){
    blocks.push(block);
    movingBlocks[i] = {x:movingBlocks[i].x, y:movingBlocks[i].y - blockHeight};
    return true;
  } else{
    for(let j = 0; j < blocks.length; j++){
      if(blocks[j].x === block.x && blocks[j].y - blockHeight === block.y){
        blocks.push(block);
        movingBlocks[i] = {x:movingBlocks[i].x, y:movingBlocks[i].y - blockHeight};
        return true;
      }
    }
  }
  fallingBlocks.push(movingBlocks[i]);
  movingBlocks.splice(i,1);

  return false;
}

function placeBlocks(){
  if(level < 7) speed -= 5;
  else if(level < 30) speed -= 1;
  level++;
  $('#level').html(level);
  for(let i = movingBlocks.length - 1; i > -1; i--){
    if(placeBlock(movingBlocks[i], i)){
      score += 10 * level;
      document.getElementById('stackerScore').innerHTML = score;
    }
  }
}

function isOffScreen(){
  for(let i = 0; i < movingBlocks.length;i++){
    let block = movingBlocks[i]
    if(block.x > canvas.width) return 1;
    if(block.x < 0) return -1;
  }
  return 0;
}

function advanceBlocks(){
  // console.log(movingBlocks);
  if(!didGameEnd()){
  let head = movingBlocks[0];
  let end = movingBlocks[movingBlocks.length - 1];
  if(isOffScreen() > 0){
    dx = -blockWidth;
  } else if(isOffScreen() < 0){
    dx = blockWidth;
  }
  movingBlocks.unshift({x:head.x + dx,y:head.y});
  movingBlocks.pop();
  dropBlocks();
  
  }
}

function dropBlocks(){
  for(let i = 0; i < fallingBlocks.length; i++){
      dropBlock(fallingBlocks[i], i) 
  }
}

function dropBlock(block, i){
  if(block.y >= gameCanvas.height - blockHeight){
    blocks.push(block);
      fallingBlocks.splice(i,1);
    return false;
  }

  for(let j = 0; j < blocks.length; j++){
    if(blocks[j].x === block.x && blocks[j].y - blockHeight === block.y){
      blocks.push(block);
      fallingBlocks.splice(i,1);
      return false;
    }
  }
  // for(let j = 0; j < fallingBlocks.length; j++){
  //   if(fallingBlocks[j].x === block.x && fallingBlocks[j].y - blockHeight === block.y){
  //     blocks.push(block);
  //     fallingBlocks.splice(i,1);
  //     return false;
  //   }
  // }
  fallingBlocks[i] = {x:fallingBlocks[i].x, y:fallingBlocks[i].y + blockHeight};
  return true;

}

function spacePressed(event){
  const SPACE_KEY = 32;
  const keyPressed = event.keyCode;
  
  if(!didGameEnd()){
  if (keyPressed === SPACE_KEY) {
    placeBlocks();
  }}
}
//
let Rcolor = 26;
let Gcolor = 68;
let Bcolor = 98;
let dcolorR = 1;
let dcolorG = 1;
let dcolorB = -1;
function drawBlockPart(part){
  ctx.fillStyle = '#' + Rcolor + Gcolor + Bcolor;
  ctx.strokeStyle = '#' + Rcolor + Gcolor + Bcolor;
  
  ctx.fillRect(part.x,part.y,blockWidth,blockHeight);
}

function drawBlocks(){
  Rcolor += dcolorR;
  Gcolor += dcolorG;
  Bcolor += dcolorB;
  if(Rcolor > 98) dcolorR = -1;
  if(Rcolor < 11) dcolorR = 1;
  if(Gcolor > 98) dcolorG = -1;
  if(Gcolor < 11) dcolorG = 1;
  if(Bcolor > 98) dcolorB = -1;
  if(Bcolor < 11) dcolorB = 1;
  blocks.forEach(drawBlockPart);
  movingBlocks.forEach(drawBlockPart);
  fallingBlocks.forEach(drawBlockPart);
}


function clearCanvas(){
  ctx.fillStyle = background;
  ctx.strokeStyle = border;
  ctx.fillRect(0,0,canvas.width,canvas.height );
}




function moveDown(){
  for(let i = 0; i < blocks.length; i++){
    blocks[i] = {x:blocks[i].x, y : blocks[i].y + blockHeight}
  }
  for(let i = 0; i < movingBlocks.length; i++){
    movingBlocks[i] = {x:movingBlocks[i].x, y : movingBlocks[i].y + blockHeight}
  }
  viewOffset++;
}


function main(){
  if(didGameEnd()){
  	let score = $("#stackerScore")[0].innerHTML;
    viewOffset = 0;
    
  	addScore(score, level);
  	writeScore();
    level = 0;
  	return;
  } 
  setTimeout(function onTick(){
    
    clearCanvas();
    
    advanceBlocks();
    if(level > 15 + viewOffset) moveDown();
    drawBlocks();

    main();
  }, speed);

  
}
//

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
    if(scoreboard.length === 1) sendTopScore(score, level);
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
  $.post("/games/stacker/scores", {
    score: score,
    level: level
  }, function(){
    
    // console.log("It worked")
  }).fail(function(){
    console.log("error");
  });
  
}

$.get("/games/stacker/scores",
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


$(".canvas").css("padding-left", $("body").width()/2 - gameCanvas.width + "px");




// $.post("/games/stacker/leaderboard", {
//     score: score,
//     level: level
//   }).fail(function(){
//     console.log("error");
//   });
function loadGlobalLeaderboard(){
  $.get("/games/stacker/leaderboard",
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
    $.post("/games/stacker/leaderboard", {
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