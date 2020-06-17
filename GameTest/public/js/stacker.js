
let width = 400;
let height = 600;
$("canvas").attr("height", height);
$("canvas").attr("width", width);



loadGlobalLeaderboard({level:true, score:true});
getScore({score:true, level:true});
setUpCanvas();


const background = "black";
const border = "red";
let speed = 75;
// let is_mobile = navigator.userAgent.indexOf('Mobile') !== -1;
let score = 0;
let level = 1;
let goingRight = true;
let viewOffset = 0;
// $(".canvas").css('width', canvas.width);


let blockWidth = 10;
let blockHeight = 20;



let fallingBlocks = [];

let dx = blockWidth;

let blocks = [];
let movingBlocks = [];
for(let i = 0; i < 20; i++){
  movingBlocks.push({x:400-i*blockWidth, y:gameCanvas.height - blockHeight});
}

$('#score1').html(level);


window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
document.addEventListener("keydown", spacePressed);

window.addEventListener("touchstart", spacePressed);


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
  document.getElementById('score2').innerHTML = score;
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
  $('#score1').html(level);
  for(let i = movingBlocks.length - 1; i > -1; i--){
    if(placeBlock(movingBlocks[i], i)){
      score += 10 * level;
      document.getElementById('score2').innerHTML = score;
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
  if (keyPressed === SPACE_KEY || event.touches !== null) {
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
  	let score = $("#score2")[0].innerHTML;
    viewOffset = 0;
    
  	addScore(score, level);
  	writeScore({score: true, level:true});
    level = 1;
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
