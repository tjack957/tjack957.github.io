
// GameBoard code below


function Circle(game, wire, r, c) {
   
    this.radius = r;
    
    this.color = c
    this.wire = wire
    this.x = wire.x2
    this.y = wire.y2
    Entity.call(this, game, this.x, this.y);

   
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.update = function () {
	 this.x = this.wire.x2
	 this.y = this.wire.y2
    Entity.prototype.update.call(this);
 
};

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = "Red";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};

function Wire(game) {
	
	this.g =  1
	this.m1 = 40
	this.m2 = 40
	
	this.l1 = 200
	this.l2 = 200
	
	this.t1 = Math.PI/2			//Theta Angle
	this.t2 = Math.PI/2
	this.t1V = 0.1				//Velocity
	this.t2V = 0.1
	this.t1A = 0.001			//Aceleration 
	this.t2A = 0.002
	
	this.x1 = this.l1 * Math.sin(this.t1)
	this.y1 = -this.l1 * Math.cos(this.t1)
	
	this.x2 = this.x1 + this.l2 * Math.sin(this.t2)
	this.y2 = this.y1 - this.l2 * Math.cos(this.t2)
	
	Entity.call(this, game)
}
Wire.prototype = new Entity();
Wire.prototype.constructor = Wire;
Wire.prototype.update = function (){
	
	//Numerator of the Acceleration 1 Formula
	var top11 = -this.g * (2 * this.m1 + this.m2) * Math.sin(this.t1) 
	var top12 = -this.m2 * this.g * Math.sin(this.t1 - 2 * this.t2)
	var top121 = this.t2V * this.t2V * this.l2
	var top122 = this.t1V * this.t1V * this.l1 * Math.cos(this.t1 - this.t2)
	var top13 = - 2 * Math.sin(this.t1 - this.t2) * this.m2 * (top121 + top122)
	
	//Denominator of the Acceleration formula
	var bot112 = this.m2 * Math.cos(2 * this.t1 - 2 * this.t2)
	var bot = (2 * this.m1 + this.m2 - bot112)
	
	this.t1A = (top11 + top12 + top13)/(this.l1 * bot)//Acceleration 1 Calculated
	
	
	//Numerator of the Acceleration 2 Formula
	var top21 = 2 * Math.sin(this.t1 - this.t2)
	var top22 = this.t1V * this.t1V * this.l1 * (this.m1 + this.m2)
	var top23 = this.g * (this.m1 + this.m2) * Math.cos(this.t1) 
	var top24 = this.t2V * this.t2V * this.l2 * this.m2 * Math.cos(this.t1 - this.t2)
	
	
	this.t2A = (top21 * (top22 + top23 + top24))/(this.l2 * bot)//Acceleration 2 Calculated
	
	//Adjust Velocity and Acceleration
	this.t1V += this.t1A
	this.t2V -= this.t2A
	this.t1 += this.t1V
	this.t2 -= this.t2V
	
	//Position recalculated
	this.x1 = this.l1 * Math.sin(this.t1)
	this.y1 = this.l1 * Math.cos(this.t1)
	
	this.x2 = this.x1 + this.l2 * Math.sin(this.t2)
	this.y2 = this.y1 + this.l2 * Math.cos(this.t2)
	
	
}
Wire.prototype.draw = function (ctx) {
	ctx.beginPath()
	ctx.translate(500,500)
	ctx.lineWidth = 3
	ctx.moveTo(0, 0);   
	ctx.arc(0, 0, 5, 0, Math.PI * 2, false);
	ctx.fill();
	ctx.lineTo(this.x1, this.y1);  
	ctx.arc(this.x1, this.y1, 5, 0, Math.PI * 2, false);
	//ctx.fill();
	ctx.moveTo(this.x1, this.y1);
	ctx.lineTo(this.x2, this.y2); 
    //ctx.fillStyle = "Red"
	//ctx.arc(this.x2, this.y2, 15, 0, Math.PI * 2, false);
	//ctx.fill();
	ctx.stroke();          // Render the path
	
}
// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 200;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');


    var gameEngine = new GameEngine();
    
    var wire = new Wire(gameEngine);
    gameEngine.addEntity(wire)
    var circle = new Circle(gameEngine, wire, 20);
    gameEngine.addEntity(circle);
    gameEngine.init(ctx);
    gameEngine.start();
});
