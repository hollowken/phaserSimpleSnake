const MAX_WIDTH = 25;
const MAX_HEIGHT = 20;

var direction = 'right';
var headCoords = [4, 4];
var fructCoords = [8, 12];
var fructSpawned = true;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function preload() {
	game.load.image('head', 'assets/head.png');
	game.load.image('tail', 'assets/tail.png');
	game.load.image('fruct', 'assets/fruct.png');
}

function create() {
	setInterval(updateSec, 300);
	game.stage.backgroundColor = '#71c5cf';

	game.head = game.add.sprite(headCoords[1]*32, headCoords[0]*32, 'head');
	game.fruct = game.add.sprite(fructCoords[1]*32, fructCoords[0]*32, 'fruct');

	tailCoords = [
		[game.add.sprite(4,3,'tail'), 3, 4],
		[game.add.sprite(4,2,'tail'), 2, 4],
		[game.add.sprite(4,1,'tail'), 1, 4]
	];

    var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    var sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    var aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    var dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

    wKey.onDown.add(function() {
    	direction = 'up';
    }, this);
    sKey.onDown.add(function() {
    	direction = 'down';
    }, this);
    aKey.onDown.add(function() {
    	direction = 'left';
    }, this);
    dKey.onDown.add(function() {
    	direction = 'right';
    }, this);
}

function update() {

	if(!fructSpawned) {
		var x = randomInt(1, MAX_WIDTH-2);
		var y = randomInt(1, MAX_HEIGHT-2);
		fructCoords = [x, y];
		fructSpawned = true;
	}

	if(headCoords[0] === fructCoords[0] && headCoords[1] === fructCoords[1]) {
		fructSpawned = false;
		var x = tailCoords[tailCoords.length-1][1];
		var y =  tailCoords[tailCoords.length-1][2];
		tailCoords.push([game.add.sprite(y*32, x*32, 'tail'), x, y]);
	}

	game.fruct.x = fructCoords[0]*32;
	game.fruct.y = fructCoords[1]*32;

	game.head.x = headCoords[0]*32;
	game.head.y = headCoords[1]*32;

	for(var i = 0; i < tailCoords.length; i++) {
		tailCoords[i][0].x = tailCoords[i][1]*32;
		tailCoords[i][0].y = tailCoords[i][2]*32;
		if(tailCoords[i][1] === headCoords[0] && tailCoords[i][2] === headCoords[1]) restartGame();
	}

}

function updateSec() {

	for(var i = 0; i < tailCoords.length; i++)
	{
		if (i === 0) {
			var tempX = tailCoords[i][1];
			var tempY = tailCoords[i][2];
			tailCoords[i][1] = headCoords[0];
			tailCoords[i][2] = headCoords[1];
			tailCoords[i+1][1] = tempX;
			tailCoords[i+1][2] = tempY;
		} 
		else if (i === tailCoords.length-1) {} 
		else {
			var tempX = tailCoords[i][1];
			var tempY = tailCoords[i][2];
			tailCoords[i][1] = tailCoords[i+1][1];
			tailCoords[i][2] = tailCoords[i+1][2];
			tailCoords[i+1][1] = tempX;
			tailCoords[i+1][2] = tempY;
		}
	} 

	switch(direction) {
		case 'left':
			headCoords[0]--;
			if(headCoords[0] < 0) headCoords[0] = MAX_WIDTH-1;
			break;
		case 'right':
			headCoords[0]++;
			if(headCoords[0] > MAX_WIDTH-1) headCoords[0] = 0;
			break;
		case 'up':
			headCoords[1]--;
			if(headCoords[1] < 0) headCoords[1] = MAX_HEIGHT-1;
			break;
		case 'down':
			headCoords[1]++;
			if(headCoords[1] > MAX_HEIGHT-1) headCoords[1] = 0;
			break;
	}
}

function restartGame() {

	for (var i = tailCoords.length - 1; i >= 0; i--) {
		tailCoords[i][0].destroy();
		tailCoords.pop();
	}

	tailCoords = [
		[game.add.sprite(4,3,'tail'), 3, 4],
		[game.add.sprite(4,2,'tail'), 2, 4],
		[game.add.sprite(4,1,'tail'), 1, 4]
	];

	direction = "right";
	headCoords = [4, 4];
	fructSpawned = true;
	fructCoords = [8, 12];
}

var game = new Phaser.Game(800, 640, Phaser.AUTO, '', { preload: preload, create: create, update: update });