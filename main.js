var AM = new AssetManager();

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
	
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}


// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
    this.ctx.fillStyle = "SaddleBrown";
    this.ctx.fillRect(0,550,800,250);
};

Background.prototype.update = function () {
};
function Platform(game, spritesheet, x, y) {
	this.plat = new Animation(spritesheet, 60, 0, 350, 150, 0.1, 1, true, false);
    this.x = x;
    this.y = y;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, this.x, this.y);
};
Platform.prototype = new Entity();
Platform.prototype.constructor = Platform;
Platform.prototype.draw = function () {
	this.plat.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0.5);
  
};

Platform.prototype.update = function () {
	Entity.prototype.update.call(this);
};



// inheritance 
function Warrior(game, spritesheet) {
    this.animation = new Animation(spritesheet, 4, 0, 80,70, 0.1, 9, true, false);
    this.reverseAnimation = new Animation(spritesheet, 4, 808, 80,70, 0.1, 9, true, false);
    this.up = new Animation(spritesheet, 4, 640, 80,70, 0.1, 7, false, false);
    this.reverseUp = new Animation(spritesheet, 4, 720, 80,70, 0.1, 7, false, false);
    this.mine = new Animation(spritesheet, 4, 560, 80,70, 0.1, 7, false, false);
    this.duck = new Animation(spritesheet, 4, 240, 80,70, 0.1, 5, false, false);
    this.reverseDuck = new Animation(spritesheet, 4, 170, 77,70, 0.1, 5, false, false);
    this.speed = 100;
    this.ctx = game.ctx;
    this.right = true
    this.left = false 
    this.upTest = false
    this.reverseUpTest = false
    this.mineTest = false
    this.duckTest = false
    this.reverseDuckTest = false
    this.count = 0;
    this.time = this.up.elapsedTime
    this.total = this.up.totalTime
    this.rightCheck = true
    this.leftCheck = false
    Entity.call(this, game, 100, 450);
}

Warrior.prototype = new Entity();
Warrior.prototype.constructor = Warrior;

Warrior.prototype.update = function () {
	
	if(this.x === 96){
		this.mine.elapsedTime = 0
		this.up.elapsedTime = 0
		this.duck.elapsedTime = 0
		this.reverseDuck.elapsedTime = 0
		this.rightCheck = true
	    this.leftCheck = false
		this.reverseUpTest = true
		this.left = false
	}
	if (this.x === 600){
		this.mine.elapsedTime = 0
		this.reverseUp.elapsedTime = 0
		this.duck.elapsedTime = 0
		this.reverseDuck.elapsedTime = 0
		this.rightCheck = false
	    this.leftCheck = true
		this.upTest = true
		this.right = false
	}
	if(this.x === 260){
		this.mineTest = true
		this.right = false
		this.left = false

		
	}
	if(this.x === 460){
		this.right = false
		this.left = false
		if(this.rightCheck){
			this.duckTest = true
		}
		if(this.leftCheck){
			this.reverseDuckTest = true
		}
		
	}
	if(this.right){
		this.x += 2;
	} 
	if (this.left){
		this.x -= 2;
	}
	if(this.duckTest){
		if(this.duck.isDone()){
			this.duckTest = false			
			this.x += 4
				
			this.right = true
		}
	}
	if(this.reverseDuckTest){
		if(this.reverseDuck.isDone()){
			this.reverseDuckTest = false			
			this.x -= 4
				
			this.left = true
		}
	}
	if(this.mineTest){
		if(this.mine.isDone()){			
			this.mineTest = false			
			if(this.rightCheck){
				this.x += 4
				
			    this.right = true
			}
			if(this.leftCheck){
				this.x -= 4
				
			    this.left = true
			}
		}
	}
	if(this.upTest){
		if(this.up.isDone()){			
			this.upTest = false			
			this.left = true			
		}
		
	}
	if(this.reverseUpTest){		
		var test2 = this.reverseUp.isDone()
		if(test2){
			this.reverseUpTest = false
			this.right = true
		}
		
	}
	
    Entity.prototype.update.call(this);
    
}

Warrior.prototype.draw = function () {
	
	if(this.right){	
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
		
	} 
	if(this.left){
	    this.reverseAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
	}
	
	if(this.upTest){
		this.up.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
	}
	if(this.reverseUpTest){
		this.reverseUp.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
	}
	if(this.mineTest){
		this.mine.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
	}
	if(this.duckTest){
		this.duck.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
	}
	if(this.reverseDuckTest){
		this.reverseDuck.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
	}
    Entity.prototype.draw.call(this);
    
}


AM.queueDownload("./img/minerv4.png");

AM.queueDownload("./img/cave.jpg");
AM.queueDownload("./img/board.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    var count = 0;
    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/cave.jpg")));
    for(var i = 0; i < 8; i++){
    	gameEngine.addEntity(new Platform(gameEngine, AM.getAsset("./img/board.png"), count, 530));
    	count += 100
    }
    
    gameEngine.addEntity(new Warrior(gameEngine, AM.getAsset("./img/minerv4.png")));

    console.log("All Done!");
});