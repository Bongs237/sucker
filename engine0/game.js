'use strict';
var Game;

function consoleMessage(type, message) {
	var prefix = "";
	if (type == "info") {
		prefix = "[GAME ENGINE] (MESSAGE) ";
	} else if (type == "alert") {
		prefix = "[GAME ENGINE] (!) ";
	} else if (type == "multiplayer") {
		prefix = "[GAME ENGINE] (MULTIPLAYER) ";
	} else {
		prefix = "[GAME ENGINE] ";
	}
	console.log(prefix + message);
}

Game = {
	//---Epic KeyC COdes----
	// Normal gaming keys
	KEY_LEFT: 37,
	KEY_UP: 38,
	KEY_RIGHT: 39,
	KEY_DOWN: 40,
	KEY_SPACE: 32,
	KEY_SHIFT: 16,
	KEY_CONTROL: 17,
	KEY_RETURN: 13,
	// Letters
	KEY_A: 65,
	KEY_B: 66,
	KEY_C: 67,
	KEY_D: 68,
	KEY_E: 69,
	KEY_F: 70,
	KEY_G: 71,
	KEY_H: 72,
	KEY_I: 73,
	KEY_J: 74,
	KEY_K: 75,
	KEY_L: 76,
	KEY_M: 77,
	KEY_N: 78,
	KEY_O: 79,
	KEY_P: 80,
	KEY_Q: 81,
	KEY_R: 82,
	KEY_S: 83,
	KEY_T: 84,
	KEY_U: 85,
	KEY_V: 86,
	KEY_W: 87,
	KEY_X: 88,
	KEY_Y: 89,
	KEY_Z: 90,
	// Numbers!
	KEY_0: 48,
	KEY_1: 49,
	KEY_2: 50,
	KEY_3: 51,
	KEY_4: 52,
	KEY_5: 53,
	KEY_6: 54,
	KEY_7: 55,
	KEY_8: 56,
	KEY_9: 57,
	parentId: undefined,
	keyStatus: [],
	sprites: [],
	
	init: function(parentId, showConsoleMessages) {
		onkeydown = function(e) {
			if (e.ctrlKey){
				e.preventDefault();
			}
		}
		if (showConsoleMessages != true) {
			consoleMessage = function() {}
		}
		document.addEventListener('keydown', Game.handleKeyDown);
		document.addEventListener('keyup', Game.handleKeyUp);
		Game.parentId = parentId;
		document.getElementById(parentId).style.position = 'relative';
		document.getElementById(parentId).style.overflow = 'hidden';
		consoleMessage("BOb", "Game initialized.");
	},
	
	start: function() {
		consoleMessage("info", "Game started.");
		setInterval(Game.loop, 17);
		consoleMessage("info", "Game loop working.");
	},

	onLoop: function(f) {
		Game.loopFunc = f;
	},
	
	handleKeyDown: function(event) {
		//console.log("Key Down is " + event.keyCode);
		Game.keyStatus[event.keyCode] = true;
	},
	
	handleKeyUp: function(event) {
		//console.log("Key Up is " + event.keyCode);
		Game.keyStatus[event.keyCode] = undefined;
	},
	
	addSprite: function(sprite) {
		Game.sprites.push(sprite);
	},
	
	getMouseLocationX: function() {
		return event.clientX;
	},
	
	getMouseLocationY: function() {
		return event.clientY;
	},
	
	isColliding: function(sprite1, sprite2) {
		var spriteOne = {};
		spriteOne.left = sprite1.x;
		spriteOne.right = sprite1.x + sprite1.getActiveImage().width;
		spriteOne.top = sprite1.y;
		spriteOne.bottom = sprite1.y + sprite1.getActiveImage().height;
		
		var spriteTwo = {};
		spriteTwo.left = sprite2.x
		spriteTwo.right = sprite2.x + sprite2.getActiveImage().width;
		spriteTwo.top = sprite2.y;
		spriteTwo.bottom = sprite2.y + sprite2.getActiveImage().height;
		
		if (!(spriteOne.right < spriteTwo.left ||
				spriteOne.left > spriteTwo.right ||
				spriteOne.bottom < spriteTwo.top ||
				spriteOne.top > spriteTwo.bottom)) {
			return true;
		}
		return false;
	},
	
	getCollision: function(sprite) {
		var sprites = [];

		for (var i = 0; i < Game.sprites.length; i++) {
			if (Game.isColliding(sprite, Game.sprites[i]) && sprite != Game.sprites[i]) {
				sprites.push(Game.sprites[i]);
			}
		}
		return sprites;
	},
	
	getSpriteByType: function(type) {
		var l = [];
		for (var i = 0; i < Game.sprites.length; i++) {
			if (Game.sprites[i].type == type) {
				l.push(Game.sprites[i]);
			}
		}
		return l;
	},
	
	playSound: function(filename) {
		var audio = new Audio(filename);
		audio.play();
	},
	
	enableMultiplayer: function(syncData, cbFunc, updateFunc) {
		var script = document.createElement("script");
		script.src = '/static/js/engine/multiplayer.js';
		script.onload = function() {
			Game.Multiplayer.init(syncData, cbFunc, updateFunc);
		};
		document.body.appendChild(script);
		return Game.Multiplayer;
	},
	
	loop: function() {
		//consoleMessage("info", "Game loop working");
		for (var i = 0; i < Game.sprites.length; i++) {
			Game.sprites[i].update();
		}
		if (Game.loopFunc) {
			Game.loopFunc();
		}
	}
};