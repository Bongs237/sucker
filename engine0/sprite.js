/**
* Creates a thing like yeah like dodeoeoajeipijpoeijpofijoi idk like a sprite. DUH!
*
* @param {Array} images Array of Images xD
* @param {String} parentId The html object
* @param {String} type NAME OF SPRITE DUH
* @returns {undefined} Nununununnununoooooo
*/

class Sprite {
	constructor(images, type) {
		this.parentId = Game.parentId;
		this.type = type;
		this.activeImage = 0;
		this.images = [];
		this.addImages(images);
		this.x = 0;
		this.y = 0;
		this.degrees = 0;
		this.degreesY = 0;
		this.deltaX = 0;
		this.deltaY = 0;
		this.autoMoveX = 0;
		this.autoMoveY = 0;
		this.autoWrap = 0;
		this.keyBindings = [];
		this.boundary = {
			top: 0,
			bottom: document.getElementById(this.parentId).clientHeight,
			left: 0,
			right: document.getElementById(this.parentId).clientWidth
		};
		Game.addSprite(this);
	}

	addImages(imageNames) {
		for (var i = 0; i < imageNames.length; i++) {
			var img = new Image();
			img.src = imageNames[i];
			img.style.position = 'absolute';
			if (i == this.activeImage) {
				img.style.display = '';
			} else {
				img.style.display = 'none';
			}
			document.getElementById(this.parentId).appendChild(img);
			this.images.push(img);
		}
	};
	
	show() {
		this.getActiveImage().style.display = '';
	};
	
	hide() {
		this.getActiveImage().style.display = 'none';
	};


	getActiveImage() {
		return this.images[this.activeImage];
	};
	
	setImage(imageIndex) {
		var prevImage = this.activeImage; // Store image before changing it or whatever #HARd2ExPlaIN
		this.activeImage = imageIndex;
		for (var i = 0; i < this.images.length; i++) {
			if (i == this.activeImage) {
				this.images[i].style.display = '';
				this.images[i].style.left = this.images[prevImage].style.left;
				this.images[i].style.top = this.images[prevImage].style.top;
			} else {
				this.images[i].style.display = 'none';
			}
		}
	};
	
	setActiveImage(i) {
		setImage(i);
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
		
		var img = this.getActiveImage();
		img.style.left = x + "px";
		img.style.top = y + "px";
		if (this.moveFunc != null) {
			this.moveFunc();
		}
	};
	
	setX(x) {
		this.x = x;
		
		var img = this.getActiveImage();
		img.style.left = x + "px";
		if (this.moveFunc != null) {
			this.moveFunc();
		}
	};
	
	setY(y) {
		this.y = y;
		
		var img = this.getActiveImage();
		img.style.top = y + "px";
		if (this.moveFunc != null) {
			this.moveFunc();
		}
	};

	rotate(degrees) {
		this.degrees = degrees;
		
		var img = this.getActiveImage();
		img.style.transform = "rotate(" + degrees + "deg)";
	};

	flip(degreesY) {
		this.degreesY = degreesY;
		var img = this.getActiveImage();
		img.style.transform = "rotateY(" + degreesY + "deg)";
	}

	changeX(deltaX) {
		this.x += deltaX;
		if (this.autoWrap != true) {
			if (this.x < this.boundary.left) {
				this.x = this.boundary.left;
				
				if (this.boundaryFunc != null) {
					this.boundaryFunc('left');
				}
			} else if (this.x > this.boundary.right - this.getActiveImage().width) {
				this.x = this.boundary.right - this.getActiveImage().width;
				
				if (this.boundaryFunc != null) {
					this.boundaryFunc('right');
				}
			}
		} else {
			if (this.x < this.boundary.left - this.getActiveImage().width) {
				this.x = this.boundary.right;
			} else if (this.x > this.boundary.right) {
				this.x = this.boundary.left - this.getActiveImage().width;
			}
		}
		this.getActiveImage().style.left = this.x + "px";
		if (this.moveFunc != null) {
			this.moveFunc();
		}
	};

	changeY(deltaY) {
		this.y += deltaY;
		if (this.autoWrap != true) {
			if (this.y < this.boundary.top) {
				this.y = this.boundary.top;
				
				if (this.boundaryFunc != null) {
					this.boundaryFunc('top');
				}
			} else if (this.y > this.boundary.bottom - this.getActiveImage().height) {
				this.y = this.boundary.bottom - this.getActiveImage().height;
				
				if (this.boundaryFunc != null) {
					this.boundaryFunc('bottom');
				}
			}
		} else {
			if (this.y < this.boundary.top - this.getActiveImage().height) {
				this.y = this.boundary.bottom;
			} else if (this.y > this.boundary.bottom) {
				this.y = this.boundary.top - this.getActiveImage().height;
			}
		}
		this.getActiveImage().style.top = this.y + "px";
		if (this.moveFunc != null) {
			this.moveFunc();
		}
	};

	addKeyBinding(key, func, options) {
		if (options !== undefined) {
			if (options.noHold != undefined || options.noHold) {
				this.addKeyBindingNoHold(key, func);
				return;
			}
		}
		this.keyBindings.push({
			key: key,
			cbFunction: func
		});
	};

	clearKeyBindings() { // clears all bc im lazy
		this.keyBindings = [];
	};
	
	addKeyBindingNoHold(key, func) { // Add a key binding but it prevents holding down the key (so you have to spam aaaaaaaaaaaaaaaa)
		var f = func;
		var moveListener = null;
		document.addEventListener('keydown', function(e) {
			if (e.keyCode == key) {
				var keyCode = e.keyCode;
				if (moveListener === null) {
					moveListener = setInterval(f(keyCode), 400);
				}
			}
		});
		
		document.addEventListener("keyup", function(event) {
			clearInterval(moveListener);
			moveListener = null;
		});
	}
	
	addArrowKeys(speed) {
		var blah = this;
		blah.addKeyBinding(Game.KEY_UP, function() {
			blah.changeY(-speed);
		});
		blah.addKeyBinding(Game.KEY_DOWN, function() {
			blah.changeY(speed);
		});
		blah.addKeyBinding(Game.KEY_LEFT, function() {
			blah.changeX(-speed);
		});
		blah.addKeyBinding(Game.KEY_RIGHT, function() {
			blah.changeX(speed);
		});
	};
	
	addWASD(speed) {
		var blah = this;
		blah.addKeyBinding(Game.KEY_W, function() {
			blah.changeY(-speed);
		});
		blah.addKeyBinding(Game.KEY_S, function() {
			blah.changeY(speed);
		});
		blah.addKeyBinding(Game.KEY_A, function() {
			blah.changeX(-speed);
		});
		blah.addKeyBinding(Game.KEY_D, function() {
			blah.changeX(speed);
		});
	};

	autoMove(x, y) {
		this.autoMoveX = x;
		this.autoMoveY = y;
		//How to hack a comptuer how to hakc a hakc hakc a hack a day a ocmpuefdf
	};
	
	onCollide(func) {
		this.collideFunc = func;
	}
	
	onMove(func) { // Do something on move
		this.moveFunc = func;
	}

	onBoundary(func) { // Do something when you hit a boundary (returns which boundary is being touched - "top", "bottom", "left", "right")
		this.boundaryFunc = func;
	}
	
	
	// Example Thingy: 0, 768, 0, 1024 for 1024x768
	setBoundary(top, bottom, left, right) {
		this.boundary.top = top;
		this.boundary.bottom = bottom;
		this.boundary.left = left;
		this.boundary.right = right;
	};
	
	
	// Put the sprite at the beginning thingy (hard to explain) when touching a boundary.
	setAutoWrap(state) {
		this.autoWrap = (state === true);
	};

	update() {
		var kb;
		var keys = Game.keyStatus;
		
		for (var i = 0; i < this.keyBindings.length; i++) {
			kb = this.keyBindings[i];
			if (keys[kb.key]) {
				kb.cbFunction(this);
			}
		}
		if (this.autoMoveX !== 0 || this.autoMoveY !== 0) {
			this.changeX(this.autoMoveX);
			this.changeY(this.autoMoveY);
		}
		
		if (this.collideFunc != null) {
			var obj = Game.getCollision(this);
			if (obj.length > 0) {
				this.collideFunc(obj);
				obj = [];
			}
		}
	};
}