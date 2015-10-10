
document.getElementById("gamestatus").innerText+="Use buttons (Left,Right),(s,d),(b,n),(`,1).\n\n";

var noOfPlayers = prompt("Enter no of players (Max 4, for now) :");
if(!noOfPlayers) noOfPlayers=1;



var speed = 0.06;
var angularSpeed = 0.002;
var defaultLineWidth = 4;
var minLineWidth =10;

var bgColor = "#000000";
//  playerColores= [ orange		 green~  	]
var playerColors = [ "#ff8834","#22a4ff", "#22ff33", "#ff2fd3"];
var playerNames = ["Orange", "Blue", "Green", "Pink"];


var keyCodes = {
	'left': 37,
	'right': 39,

	's': 83,
	'd': 68,

	'b': 66,
	'n': 78,

	'`': 192,
	'1': 49,

	'a': 65,
	'w': 87,
	'f': 70,
	'down': 38,
	'up': 38

}

var defaultKeyCombos = [
	[keyCodes['left'], keyCodes['right']],
	[keyCodes['s'], keyCodes['d']],
	[keyCodes['b'], keyCodes['n']],
	[keyCodes['`'], keyCodes['1']]
]

var canvasWidth=400, canvasHeight = 400;

var player = function(direc , xx, yy , col, keyAnti, keyClocki) {
	this.direction = Math.floor((Math.random() * 2 * Math.PI));
	this.x = Math.floor((Math.random() * canvasWidth * (0.6)) + canvasWidth * (0.2));
	this.y = Math.floor((Math.random() * canvasHeight * (0.6)) + canvasHeight * (0.2));
	this.color = col;
	this.keyAnti =  keyAnti;
	this.keyClocki = keyClocki;
	this.alive = true;
	this.lineWidth = defaultLineWidth;
};

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
canvas.style.border = "4px solid #70707f";
//console.log(canvas.style);
document.getElementById("gamediv").appendChild(canvas);
document.body.style.backgroundColor = "black";


var playerList = [];
var timeElapsed=0;
var noOfAlivePlayers;

var resetCanvas =  function(){
	ctx.fillStyle = bgColor;
	ctx.fillRect(0,0,canvas.width,canvas.height);

	playerList = [];
	for(var iitu = 0; iitu < noOfPlayers; iitu++){
		playerList[iitu] =  new player(0,30,30,playerColors[iitu], defaultKeyCombos[iitu][0],defaultKeyCombos[iitu][1]);
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
}, false);		

//remove key
addEventListener("keyup", function (e) 
{	delete pressedKeys[e.keyCode];
}, false);


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
		if (( playerList[i].keyAnti in pressedKeys)||(playerList[i].keyClocki in pressedKeys)){
			sense = ((playerList[i].keyAnti in pressedKeys)?1:-1);		//sense is 1 for anticlockwise, -1 for clockwise

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


//Algo for colision detection. Need to work on this
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
			document.getElementById("gamestatus").innerText+=playerNames[i] + " lost.\n";
			if (noOfAlivePlayers==1){
				setTimeout(function(){
					resetCanvas();
				},1000);
			}
		}

		ctx.beginPath();
		ctx.moveTo(oldX,oldY);
		ctx.lineTo(newX,newY);
		ctx.strokeStyle = playerList[i].color;
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

resetCanvas();


render(0.001);
main();