var noOfPlayers = 2;

var speed = 0.06;
var angularSpeed = 0.002;
var defaultLineWidth = 4;
var minLineWidth =10;

var bgColor = "#000000";
//  playerColores= [ orange		 green~  	]
var playerColors = [ "#ff8834","#22a4ff", "#22ff33"];


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

var playerList = [];

for(var iitu = 0; iitu < noOfPlayers; iitu++){
	playerList[iitu] =  new player(0,30,30,playerColors[iitu], defaultKeyCombos[iitu][0],defaultKeyCombos[iitu][1]);
}


var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
canvas.style.border = "4px solid #70707f";
//console.log(canvas.style);
document.getElementById("gamediv").appendChild(canvas);
document.body.style.backgroundColor = "black";


ctx.fillStyle = bgColor;
ctx.fillRect(0,0,canvas.width,canvas.height);



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

//reset function
// var reset = function(){
// 	car.x = 80;
// 	car.y = 280;
// 	defend1.x = 1000;
// 	defend1.y = 280;
// 	defend2.x = 1500;
// 	defend2.y = 150;
// 	road.x = 0;
// 	road.y = 0;
// 	road2.x = canvas.width;
// 	road2.y = 0;
// 	score = 0;
// 	real_score = 0;
// 	defend1.speed = 256;
// 	defend2.speed = 256;
// };

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
			playerList[i].alive=false;

		for(var ii = 1; ii<=1.2; ii+= 0.1){
			testX = oldX + defaultLineWidth*(ii) * Math.cos(oldDirec);
			testY = oldY - defaultLineWidth*(ii) * Math.sin(oldDirec);		
			cols=ctx.getImageData(testX,testY,1,1).data;
			//if(cols[0]!=0){console.log("col  " + cols[0]);}

			if ((cols[0] >25 && cols[0] < 45) || (cols[0] >145 && cols[0] < 180) || (cols[0] >239)) playerList[i].alive=false;
		}
		//console.log(ctx.getImageData(testX,testY,1,1).data[0]);

		// var displacement = Math.sqrt((oldX-newX)*(oldX-newX) + (oldY-newY)*(oldY-newY));
		// //console.log(oldX + '  ' + newX + '   ' + displacement + '  ' + millisecs);
		// var step = minLineWidth/2;
		// var stepX = step * (oldX-newX) / displacement;
		// //console.log('and ' + step + '  ' + stepX);
		// var stepY = step * (oldY-newY) / displacement;
		// var checkPoints = displacement/step;
		// //console.log('well ' + 	checkPoints);
		// console.log('old is ' + oldX + ' ' + oldY);
		// console.log('new is ' + newX + ' ' + newY);
		// for (var j = 0; j<checkPoints; j++){
		// 	midX = newX + j * stepX;
		// 	midY = newY + j * stepY;
		// 	console.log('mid is ' + midX + ' ' + midY);
		// 	cols=ctx.getImageData(midX,midY,1,1).data;
		// 	if (cols[0] == 255) playerList[i].alive=false;
		// 	console.log(ctx.getImageData(midX,midY,1,1).data[0]);
		// }

		ctx.beginPath();
		ctx.moveTo(oldX,oldY);
		ctx.lineTo(newX,newY);
		ctx.strokeStyle = playerList[i].color;
		ctx.lineWidth = playerList[i].lineWidth;
		ctx.lineCap = "round";
		ctx.stroke();

	}
	//display score
	// ctx.fillStyle = "rgb(25, 25, 25)";
	// ctx.font = "24px Helvetica";
	// ctx.textAlign = "left";
	// ctx.textBaseline = "top";
	// ctx.fillText("Score : " + real_score, 32, 32);
};

//update function
// var update = function(mod){
	
// };

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

// Let's play this game!
var then = Date.now();
//reset();
var timeElapsed=0;
render(0.001);
main();