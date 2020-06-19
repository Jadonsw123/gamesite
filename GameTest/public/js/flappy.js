let animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };
// let is_mobile = navigator.userAgent.indexOf('Mobile') !== -1;



let width = 400;
let height = 600;
$("canvas").attr("height", height);
$("canvas").attr("width", width);

$(".tableScore1").css("display", "none");
$(".scoreLabel1").css("display", "none");

setUpCanvas();
loadGlobalLeaderboard({score:true});
getScore({score:true});




const backgroundC = "black";
const paddleC = "green";
let score = 0;
let lives = 0;
let level = -1;
let b1;
let gravity;
let bgDx;
let counter;
let timeBeforeNext;
let gap;
let pipes;
let countPipes = 0;

let backGroundX = 0;
let foreGroundX = 0;


let bird1 = new Image();
let bird2 = new Image();
let bird3 = new Image();
let bird4 = new Image();
let pipeNorth = new Image();
let pipeSouth = new Image();
let backGround = new Image();
let foreGround = new Image();
let fancyPipeNorth = new Image();
let fancyPipeSouth = new Image();
bird1.src = "../images/flappy/bird.png";
bird2.src = "../images/flappy/bird2.png";
bird3.src = "../images/flappy/bird3.png";
bird4.src = "../images/flappy/bird4.png";
pipeNorth.src = "../images/flappy/pipeNorth.png";
pipeSouth.src = "../images/flappy/pipeSouth.png";
backGround.src = "../images/flappy/bg.png";
foreGround.src = "../images/flappy/fg.png";
fancyPipeNorth.src = "../images/flappy/fancyPipeNorth.png";
fancyPipeSouth.src = "../images/flappy/fancyPipeSouth.png";

let keysDown = {};
window.addEventListener("keydown", function(event) {
 	keysDown[event.keyCode] = true;
});

window.addEventListener("touchstart", function (event) {
	keysDown[32] = true;
});

window.addEventListener("touchend", function (event) {
	delete keysDown[32];
});

window.addEventListener("keyup", function(event) {
	delete keysDown[event.keyCode];
});
		
		
		
class Bird {
	constructor(x, y, dx, dy, width, height, image, color){
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.width = width;
		this.height = height;
		this.image = image[0];
		this.images = image;
		this.color = color;
		this.isJumping = false;
		this.drag = 0.99;
		this.onGround = false;
		this.angle = 0;
		this.tick = 0;
		this.renderDelay = 5;
		this.diffImg = 1;
		if(this.image){
			this.width = this.image.width;
			this.height = this.image.height;
		}	
	}
	render(){
		if(this.image){
			if(this.tick > this.renderDelay * (this.images.length) -2) this.diffImg = -1;
			if(this.tick <= 0) {this.diffImg = 1; this.tick = 0;}
			this.tick += this.diffImg;
			// if(this.tick % this.renderDelay === 0) this.tick /= this.renderDelay
			// console.log(this.tick , this.renderDelay, this.diffImg);
			this.image = this.images[Math.floor(this.tick / this.renderDelay)];
			// this.image = this.images[2];



			// Save the current context
			context.save();
			// Translate to the center point of our image
			context.translate(this.x + this.image.width / 2, this.y + this.image.height / 2);
			// Perform the rotation
			context.rotate(DegToRad(this.angle));
			// Translate back to the top left of our bird
			context.translate(-(this.x + this.image.width / 2), -(this.y + this.image.height / 2));
			// Finally we draw the bird
			context.drawImage(this.image, this.x, this.y);
			// And restore the context ready for the next loop
			context.restore();
			if (this.isJumping) this.angle -= 3;
			else this.angle += 3;

			if (this.angle > 25) this.angle = 25;
			if (this.angle < -40) this.angle = -40;

			//context.drawImage(this.image, this.x, this.y);











		} else{
			context.fillStyle = this.color;
			context.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	update(){
		this.x += this.dx;
		this.y += this.dy;
		this.dy += gravity;
		this.dy *= this.drag;
		if(this.dy >= -3) this.isJumping = false;
		if(keysDown[32] && !this.isJumping){
		 	this.dy = -6;
		 	this.isJumping = true;
		 	this.y -= 0.01;
		}
		if (this.y + this.height >= height - foreGround.height + 40){ // has hit ground
			this.y = height - foreGround.height + 40 - this.height;  // place on ground
			this.dy = 0;			  // stop delta y
			this.onGround = true;
		}else{
			this.onGround = false;
		}
		if (this.y < 0) {
			this.y = 0;
		}

		let topY = this.y;
		let bottomY = this.y + this.height;
		let rightX = this.x + this.width;
		let leftX = this.x;
		for(let p of pipes){
			let p1 = p.pipe1;
			let p2 = p.pipe2;
			if(topY < p1.y + p1.height && (leftX < p1.x + p1.width && p1.x < rightX )){
				resetGame();
			}
			if(bottomY > p2.y && (leftX < p2.x + p2.width && p2.x < rightX )){
				resetGame();
			}
		}
	}

}

class Pipe {
	constructor(x, y, dx, dy, width, height, image, color){
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.width = width;
		this.height = height;
		this.image = image;
		this.color = color;
		this.isJumping = false;
		if(this.image){
			this.width = image.width;
			this.height = image.height;
		}	
	}
	render(){
		if(this.image){
			context.drawImage(this.image,this.x,this.y);
		} else{
			context.fillStyle = this.color;
			context.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	update(){
		this.x += this.dx;
		this.y += this.dy;
		this.dx = bgDx;


	}

}

class PipePair {
	constructor(gap, y, countOfPipes){
		this.gap = gap;
		this.y = y;
		this.countOfPipes = countOfPipes;
		let img1 = pipeNorth;
		let img2 = pipeSouth;
		if(countPipes === 0){
			img1 = fancyPipeNorth;
			img2 = fancyPipeSouth;
		}
		this.pipe1 = new Pipe(width, -(img1.height - this.y), 0, 0, 20, y, img1);
		this.pipe2 = new Pipe(width, this.y + this.gap, 0, 0, 20, height - this.y - this.gap, img2);
		this.scoreGiven = false;
		// this.pipe1.y = 0;
		// this.pipe1.height = y;
		// this.pipe2.y = y + gap;
		// this.pipe2.height = height - y - gap;

	}
	render(){
		this.pipe1.render();
		this.pipe2.render();
	}
	update(){
		this.pipe1.update();
		this.pipe2.update();
		this.x = this.pipe1.x;
		if(this.x < b1.x - this.pipe1.width  && !this.scoreGiven){
			(this.countOfPipes === 0) ? score+=5:score++;
			document.getElementById('score2').innerHTML = score;
			this.scoreGiven = true;
		}
		if(this.x < 0 - this.pipe1.width){
		 pipes.shift();
		 

		}	

	}
}





setUpGame();


//x, y, dx, dy, width, height, image, color
function setUpGame(){
	pipes = [];
	gap = 200;
	timeBeforeNext = 200;
	countPipes = 0;
	counter = 0;
	bgDx = -2;
	gravity = 0.2
	let birdImages = [bird1, bird2, bird3, bird4];
	b1 = new Bird(50, 50, 0, 2, 10, 10, birdImages, "yellow");
	
}


function randomHeight(){
	return (Math.random() * (height - 150 - 18 - gap - 130) + 100);
}


function update(){
	b1.update();
	for(p of pipes){
		p.update();
	}
	counter++;
	if(counter > timeBeforeNext){
		counter = 0;
		countPipes++;
		if(countPipes % 3 === 0){
			countPipes = 0;
		}
		pipes.push(new PipePair(gap,randomHeight(), countPipes));
		if(timeBeforeNext > 100) timeBeforeNext -= 3;
		if(gap > 125) gap -= 3;

	}
}

function render(){
	context.drawImage(backGround, backGroundX, 0);
	context.drawImage(backGround, backGroundX + width, 0);
	// context.fillStyle = backgroundC;
 // 	context.fillRect(0, 0, width, height);
	b1.render();


	for(p of pipes){
		p.render();
	}
	context.drawImage(foreGround, foreGroundX, height - foreGround.height + 40);
	context.drawImage(foreGround, foreGroundX + width, height - foreGround.height + 40);
	foreGroundX+=bgDx;
	backGroundX+=bgDx /3;
	if(foreGroundX < -width) foreGroundX += width;
	if(backGroundX < -width) backGroundX += width;


}

function DegToRad(d) {
	// Converts degrees to radians  
	return d * 0.01745;
}

function step(){
	update();
	render();
	animate(step);
}



window.onload = function() {
	animate(step);
};

function resetGame(){
	//console.log("reset game");
	setUpGame();
	addScore(score, level);
	writeScore({ score: true});
	lives = 0;
	score = 0;
	document.getElementById('score2').innerHTML = score;
	// document.getElementById('score2').innerHTML = lives;
}





document.getElementById("reset").addEventListener("click", resetGame);

