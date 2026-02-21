/**
* Creates a thing like yeah like dodeoeoajeipijpoeijpofijoi idk like a sprite. DUH!
*
* @param {Array} images Array of Images xD
* @param {String} parentId The html object
* @param {String} type NAME OF SPRITE DUH
* @returns {undefined} Nununununnununoooooo
*/

class Sprite {
	constructor(images, type, initX, initY) {
		this.parentId = Game.parentId;
		this.type = type;
		this.activeImage = 0;
		this.images = [];
		if (Array.isArray(images)) {
			this.addImages(images);
		} else {
			this.addImages([images]);
		}

		this.x = initX || 0;
		this.y = initY || 0;
		this.setPosition(this.x, this.y);

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

		this.solid = false;

		Game.addSprite(this);
	}

	getRandomX() {
		return Game.random(this.boundary.left, this.boundary.right);
	}

	getRandomY() {
		return Game.random(this.boundary.top, this.boundary.bottom);
	}

	goToRandomPosition() {
		this.setPosition(this.getRandomX(), this.getRandomY());
	};

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

	updatePos() {
		const img = this.getActiveImage();
		img.style.left = this.x + "px";
		img.style.top = this.y + "px";
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
		this.updatePos();
		if (this.moveFunc != null) {
			this.moveFunc();
		}
	};
	
	setX(x) {
		this.x = x;
		this.updatePos();
		if (this.moveFunc != null) {
			this.moveFunc();
		}
	};
	
	setY(y) {
		this.y = y;
		this.updatePos();
		if (this.moveFunc != null) {
			this.moveFunc();
		}
	};

	getWidth() {
		return this.getActiveImage().width;
	};

	setWidth(width) {
		this.getActiveImage().width = width;
	};

	getHeight() {
		return this.getActiveImage().height;
	};

	setHeight(height) {
		this.getActiveImage().height = height;
	};

	setRotation(degrees) {
		this.degrees = degrees;
		
		var img = this.getActiveImage();
		img.style.transform = "rotate(" + this.degrees + "deg)";
	};

	changeRotation(degrees) {
		this.degrees += degrees;
		var img = this.getActiveImage();
		img.style.transform = "rotate(" + this.degrees + "deg)";
	};

	flip(degreesY) {
		this.degreesY = degreesY;
		var img = this.getActiveImage();
		img.style.transform = "rotateY(" + degreesY + "deg)";
	}

	changeX(deltaX) {
		this.x += (deltaX / Game.currentFps) * Game.fps;

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

				if (this.boundaryFunc != null) {
					this.boundaryFunc('left');
				}
			} else if (this.x > this.boundary.right) {
				this.x = this.boundary.left - this.getActiveImage().width;

				if (this.boundaryFunc != null) {
					this.boundaryFunc('right');
				}
			}
		}
		this.updatePos();
		if (this.moveFunc != null) {
			this.moveFunc();
		}
	};

	changeY(deltaY) {
		this.y += (deltaY / Game.currentFps) * Game.fps;
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

				if (this.boundaryFunc != null) {
					this.boundaryFunc('top');
				}
			} else if (this.y > this.boundary.bottom) {
				this.y = this.boundary.top - this.getActiveImage().height;

				if (this.boundaryFunc != null) {
					this.boundaryFunc('bottom');
				}
			}
		}
		this.updatePos();
		if (this.moveFunc != null) {
			this.moveFunc();
		}
	};

	clearKeyBindings() { // clears all bc im lazy
		this.keyBindings = [];
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
			cbFunction: func,
		});
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
		
		document.addEventListener("keyup", function() {
			clearInterval(moveListener);
			moveListener = null;
		});
	}

	addMovementKeys(up, down, left, right, speed) {
		const blah = this;

		blah.addKeyBinding(up, function() {
			blah.changeY(-speed);
		});
		blah.addKeyBinding(down, function() {
			blah.changeY(speed);
		});

		blah.addKeyBinding(left, function() {
			blah.changeX(-speed);
		});
		blah.addKeyBinding(right, function() {
			blah.changeX(speed);
		});
	}
	
	addArrowKeys(speed) {
		this.addMovementKeys(Game.KEY_UP, Game.KEY_DOWN, Game.KEY_LEFT, Game.KEY_RIGHT, speed);
	};
	
	addWASD(speed) {
		this.addMovementKeys(Game.KEY_W, Game.KEY_S, Game.KEY_A, Game.KEY_D, speed);
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

	setSolid(solid) {
		this.solid = solid;
	};

	remove() {
		this.getActiveImage().remove();
		Game.removeSprite(this);
	};

	update() {
		var keys = Game.keyStatus;

		for (let kb of this.keyBindings) {
			if (Array.isArray(kb.key)) { // if you want to add multiple keys to call a single function (like wasd + arrows)
				for (let key of kb.key) {
					if (keys[key]) {
						kb.cbFunction(this);
						break;
					}
				}
			} else {
				if (keys[kb.key]) {
					kb.cbFunction(this);
				}
			}
		}

		if (this.autoMoveX !== 0 || this.autoMoveY !== 0) {
			// change to make it work for any fps thingy (just for this game)
			this.changeX(this.autoMoveX);
			this.changeY(this.autoMoveY);
		}
		
		this.collisions = Game.getCollision(this);
		if (this.collisions.length > 0) {
			for (let sprite of this.collisions) {
				if (sprite.solid) {
					let thisRight = this.x + this.getWidth();
					let spriteRight = sprite.x + sprite.getWidth();

					let thisBottom = this.y + this.getHeight();
					let spriteBottom = sprite.y + sprite.getHeight();

					if (thisRight > sprite.x && this.x < spriteRight && thisBottom > sprite.y && this.y < spriteBottom) {
						// Collision detected

						// Determine the direction of collision
						let overlapX = Math.min(thisRight, spriteRight) - Math.max(this.x, sprite.x);
						let overlapY = Math.min(thisBottom, spriteBottom) - Math.max(this.y, sprite.y);

						if (overlapX < overlapY) {
							// Collision is more likely in the X-axis
							if (this.x < sprite.x) {
								// Collision from the left
								this.x -= overlapX;
							} else {
								// Collision from the right
								this.x += overlapX;
							}
						} else {
							// Collision is more likely in the Y-axis
							if (this.y < sprite.y) {
								// Collision from the top
								this.y -= overlapY;
							} else {
								// Collision from the bottom
								this.y += overlapY;
							}
						}
					}

					this.updatePos();
				}
			}

			if (this.collideFunc != null) {
				this.collideFunc(this.collisions);
			}
			//this.collisions = [];
		}
	};
}