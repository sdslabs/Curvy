playerScoreDivIdPrefix = "playerScoreDiv";

function getConfigFromUrl(){
	var querySring = location.search;
	var index1 = querySring.indexOf('config=');
	if (index1 != -1){
		index2 = querySring.indexOf('&',index1+7);
		if (index2 != -1){
			configString = querySring.slice(index1+7,index2);
		} else {
			configString = querySring.slice(index1+7);
		}
		return(JSON.parse(atob(decodeURIComponent(configString))));
	}
	return null;
}

function getDefaultConfig(){
	var noOfPlayers_temp = prompt("Enter no of players (" + minPlayerCount + " to " + maxPlayerCount  + "):");
	if(!(noOfPlayers_temp >= minPlayerCount && noOfPlayers_temp <= maxPlayerCount)) noOfPlayers_temp = 2;
	return(getDefaultPlayerConfigList(noOfPlayers_temp));
}

var config = getConfigFromUrl();
if (!config) config = getDefaultConfig();
var noOfPlayers = config.length;

var canvasWidth=600, canvasHeight = 600;

var player = function(direc , xx, yy , col, keyAnti, keyClocki, prevScore) {
	this.direction = direc;
	this.x = xx;
	this.y = yy;
	this.color = col;
	this.keyAnti =  keyAnti;
	this.keyClocki = keyClocki;
	this.alive = true;
	this.lineWidth = defaultLineWidth;
	this.score = prevScore;
};

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var playerList = [];
var timeElapsed=0;
var noOfAlivePlayers;

var resetCanvas =  function(){
	ctx.fillStyle = bgColor;
	ctx.fillRect(0,0,canvas.width,canvas.height);

	if(!playerList) playerList = [];
	for(var iitu = 0; iitu < noOfPlayers; iitu++){
		console.log(playerList[iitu]);
		console.log("playerList[iitu].score");
		console.log(playerList[iitu]?playerList[iitu].score:0);
		playerList[iitu] =  new player(
			Math.floor((Math.random() * 2 * Math.PI)),
			Math.floor((Math.random() * canvasWidth * (0.6)) + canvasWidth * (0.2)),
			Math.floor((Math.random() * canvasHeight * (0.6)) + canvasHeight * (0.2)),
			config[iitu].colorIndex,
			config[iitu].keyAnti,
			config[iitu].keyClocki,
			(playerList[iitu]?playerList[iitu].score:0)
		);
	}
	timeElapsed=0;
	noOfAlivePlayers = noOfPlayers;
}


//pressed keys
var pressedKeys = {};


//add key
addEventListener("keydown", function (e) {
	pressedKeys[e.keyCode] = true;
	console.log(e.keyCode);
}, true);		

//remove key
addEventListener("keyup", function (e) 
{	delete pressedKeys[e.keyCode];
}, true);

var appendScoreDivs = function(){
	for(var i = 0; i < noOfPlayers; i++){
		newDiv = document.createElement("div");
		newDiv.className = "playerStatusDiv";
		
		newDivName = document.createElement("div");
		newDivName.className = "playerNameStatusDiv"
		newDivName.innerHTML = playerNames[config[i].colorIndex];

		newDivColor = document.createElement("div");
		newDivColor.className = "playerColorStatusDiv";
		newDivColor.style.backgroundColor = playerColors[config[i].colorIndex];

		newDivScore = document.createElement("div");
		newDivScore.className = "playerScoreStatusDiv";
		newDivScore.id = playerScoreDivIdPrefix + i;
		newDivScore.innerHTML = "0";

		newDiv.appendChild(newDivName);
		newDiv.appendChild(newDivColor);
		newDiv.appendChild(newDivScore);

		document.getElementById("scores").appendChild(newDiv);
	}
}

var showScores = function(){
	for(var ioi = 0; ioi < noOfPlayers; ioi++){
		document.getElementById(playerScoreDivIdPrefix + ioi).innerHTML = playerList[ioi].score;
	} 
}

//render function
var render = function(millisecs){

	if(millisecs==0) return;
	timeElapsed+=millisecs;

	if(timeElapsed < 1800){
		ctx.fillStyle = bgColor;
		ctx.fillRect(0,0,canvas.width,canvas.height);
	}

	for(var i = 0; i < playerList.length; i++)
	{
		if (playerList[i].alive==false) continue;

		var oldX = playerList[i].x;
		var newX = 0;
		var oldY = playerList[i].y;
		var newY = 0;

		var oldDirec = playerList[i].direction;

		//console.log(pressedKeys);
		if (( keyCodes[playerList[i].keyAnti] in pressedKeys)||(keyCodes[playerList[i].keyClocki] in pressedKeys)){
			sense = ((keyCodes[playerList[i].keyAnti] in pressedKeys)?1:-1);		//sense is 1 for anticlockwise, -1 for clockwise

			//console.log(playerList[i].direction);

			playerList[i].direction += angularSpeed * millisecs * sense;
			if(playerList[i].direction > 2 * Math.PI) playerList[i].direction -= 2*Math.PI;
			if(playerList[i].direction < -2 * Math.PI) playerList[i].direction += 2*Math.PI;

			dist = speed * millisecs;
			var newX = oldX + dist * Math.cos(oldDirec);
			var newY = oldY - dist * Math.sin(oldDirec);

			playerList[i].x = newX;
			playerList[i].y = newY;
		}
		else{
			dist = speed * millisecs;
			newX = oldX + dist * Math.cos(oldDirec);
			newY = oldY - dist * Math.sin(oldDirec);

			
			playerList[i].x = newX;
			playerList[i].y = newY;

		}
		if(newX<0 || newX > canvasWidth || newY< 0 || newY > canvasHeight)
		{
			playerList[i].alive=false;
			

		}


		//Algo for colision detection. So ugly.
		if(playerList[i].alive){
			for(var ii = 1; ii<=1.2; ii+= 0.1){
				testX = oldX + defaultLineWidth*(ii) * Math.cos(oldDirec);
				testY = oldY - defaultLineWidth*(ii) * Math.sin(oldDirec);		
				cols=ctx.getImageData(testX,testY,1,1).data;
				//if(cols[0]!=0){console.log("col  " + cols[0]);}

				if ((cols[0] >25 && cols[0] < 45) || (cols[0] >145 && cols[0] < 180) || (cols[0] >239))
				{
					playerList[i].alive=false;
					
				}
			}
		}

		if (playerList[i].alive==false) {
			noOfAlivePlayers-=1;
			for(var ie = 0; ie < playerList.length; ie++)
				if(playerList[ie].alive) playerList[ie].score+=1;
			showScores();
			if (noOfAlivePlayers==1){
				showScores();
				setTimeout(function(){
					resetCanvas();
				},1500);
			}
		}

		ctx.beginPath();
		ctx.moveTo(oldX,oldY);
		ctx.lineTo(newX,newY);
		ctx.strokeStyle = playerColors[playerList[i].color];
		ctx.lineWidth = playerList[i].lineWidth;
		ctx.lineCap = "round";
		ctx.stroke();

	}
};

var main = function () {
	var now = Date.now();
	var delta = now - then;
	//update(delta);
	render(delta);
	then = now;
	setTimeout(function(){requestAnimationFrame(main);},10);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();

appendScoreDivs();
resetCanvas();

render(0.001);
main();