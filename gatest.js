var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;
document.body.appendChild(canvas);


var x = 40;

function dabba(){
	console.log(x);
	ctx.fillStyle="white";
	ctx.fillRect(0,0,400,400);

	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.moveTo(x,40);
	ctx.lineTo(x+3,40);
	ctx.strokeStyle = '#2f2244';
	ctx.lineWidth = 7;
	ctx.lineCap = "square";
	ctx.stroke();
	x+=1;
}

setInterval(dabba,17);
//ctx.fillRect(0,0,canvas.width,canvas.height);

