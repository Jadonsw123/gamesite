


let scoreboard = [];
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

function writeScore(args){
  $(".personal").html("");
  for(let i = 0; i < scoreboard.length;i++){
  	let str = `<tr><td>${i+1}</td>${(args.level !== undefined) ?"<td>" + scoreboard[i].level + "</td>" : ""}${(args.score !== undefined) ? "<td>" + scoreboard[i].score + "</td>" : ""}</tr>`;
    $(".personal").append(str);
  }
}





function sendScore(score, level){
  $.post("/games" + window.location.href.substring(index + 'games'.length)+"/scores", {
    score: score,
    level: level
  }, function(){
    
    // console.log("It worked")
  }).fail(function(){
    console.log("error");
  });
  
}

function getScore(args){
  $.get("/games" + window.location.href.substring(index + 'games'.length) + "/scores",
  function(data, status){
    for(let j = 0; j < data.length; j++){
      addPersonalData(data[j].score, data[j].level);
    }

    
     writeScore(args);
  }
  ).fail(function(){
    console.log("error");
  });
}




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



function loadGlobalLeaderboard(args){
  $.get("/games" + window.location.href.substring(index + 'games'.length)+"/leaderboard",
  function(data, status){
    //console.log(data);
    //console.log(status);
    globalScoreBoard = [];
    if(!(data.board === undefined)){
      for(let i = 0; i < data.board.length; i++){
        let ob = data.board[i];
        addGlobalData(ob.score, ob.level, ob.username);
      }
      if(args === undefined) debugger;


      writeGlobalData(args);
    }
  }
  ).fail(function(){
    console.log("error");
  });
}



let globalScoreBoard = [];
function writeGlobalData(args){
  $(".global").html("");
  for(let i = 0; i < globalScoreBoard.length;i++){
  	let str = `<tr><td>${i+1}</td><td>${globalScoreBoard[i].username}</td>${(args.level !== undefined) ?"<td>" + globalScoreBoard[i].level + "</td>" : ""}${(args.score !== undefined) ? "<td>" + globalScoreBoard[i].score + "</td>" : ""}</tr>`;
    $(".global").append(str/*"<tr><td>" + (i+1) + "</td><td>" + globalScoreBoard[i].username + "</td><td>" + globalScoreBoard[i].level + "</td><td>" + globalScoreBoard[i].score + "</td></tr>"*/);
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
  if((globalScoreBoard.length <= 10) || score > globalScoreBoard[globalScoreBoard.length - 1].score){
    $.post("/games" + window.location.href.substring(index + 'games'.length) + "/leaderboard", {
      score: score,
      level: level
    }, function(){
    	let args = {};
    	if(score > -1) args.score = true;
    	if(level > -1) args.level = true;
      loadGlobalLeaderboard(args);
      //console.log('it worked')
    }).fail(function(){
      console.log("error");
    });
  }
}





function getTouches(evt) {
    return evt.touches ||             // browser API
        evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    let eventA = {}
    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) {
            eventA.keyCode = LEFT_KEY;
        } else {
            eventA.keyCode = RIGHT_KEY;
        }
    } else {
        if (yDiff > 0) {
            eventA.keyCode = UP_KEY;
        } else {
            eventA.keyCode = DOWN_KEY;
        }
        
    }
    changeDirection(eventA);
    /* reset values */
    xDown = null;
    yDown = null;
};





let canvas = document.getElementById("gameCanvas");
let context = canvas.getContext('2d');
let ctx = context;

let index = window.location.href.indexOf('games');

let t = $('<script><\/script>').appendTo("body");


let actualWidth;
let actualheight

t.attr("src", window.location.href.substring(0,index) + "js/" + window.location.href.substring(index + 'games'.length) + ".js")
let is_mobile = navigator.userAgent.indexOf('Mobile') !== -1;

function setUpCanvas(){
  is_mobile = navigator.userAgent.indexOf('Mobile') !== -1;

	if(is_mobile) $(".main-content").css('flex-direction', 'column');
	if(is_mobile){
		$("#gameCanvas").css('width', window.innerWidth - 150);
		$("canvas").css('margin-left', "auto");
		actualWidth = window.innerWidth;
	} 
	if(!is_mobile){
    $("body").attr("onresize", "setUpCanvas()");
		$("canvas").css('height', window.innerHeight * 3/4);
		actualheight = window.innerheight * 3/4;
	}
	if($("body").width()/2 - gameCanvas.width > 0 && !is_mobile){
		$(".canvas").css("margin-left", $("body").width()/2 - gameCanvas.width + "px");
	}

	actualWidth = window.getComputedStyle(document.querySelector('canvas')).width
	$(".canvas").css('width', actualWidth);
	$("#reset").css('width', actualWidth);
  let toggledScroll = false;


  if(is_mobile) $("#personal").css("float", "left");

	if(is_mobile){
    $('#topbar').css("margin", 'auto');
    $("body").toggleClass('disable');
    //add button in top right to lock screen
    $('#topbar').after('<button id="scroll-lock" class="btn btn-primary enable fixed-div" style="margin:auto;">Scroll Lock</button>');
    document.getElementById("scroll-lock").addEventListener("click", function(){
      if(toggledScroll){
        document.querySelector('body').style.overflow = '';
        document.querySelector('body').style.position = '';
        document.querySelector('body').style.top = ``;
        document.querySelector('body').style.width = '';
        toggledScroll = false;
      } else {
        scrollPosition = window.pageYOffset;
        document.querySelector('body').style.overflow = 'hidden';
        document.querySelector('body').style.position = 'fixed';
        document.querySelector('body').style.top = `-${scrollPosition}px`;
        document.querySelector('body').style.width = '100%';
        toggledScroll = true;
      }

    });





	}
}




