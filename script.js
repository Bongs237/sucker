Game.init('container', true);

document.addEventListener('keydown', function(e) {
	if (e.key.startsWith("Arrow")) {
		e.preventDefault();
	}
});

// modes!
var pointsToWin = 10;
var switchServing = false; // the loser serves the next round instead of the winner
var allowBridge = false;
var computerMode = true;

var marginTop = 120;
var fieldWidth = 750;
var fieldHeight = 250;

var goalSize = 51;
var playerSize = 50;
var ballSize = 50;

var p1End = 340;
var p2End = 408;

var ballDirX = 0;
var ballDirY = 0;

var playerSpeed = 4;
var computerSpeed = 0.75;
var jitter = 1;
var reactTime = 1;

var ballSpeed = 0;
var addBallSpeed = 0.8;
var maxBallSpeed = 7;

/* https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// Epic background music!!! Oh yeah
let bgMusic = [
    '5am.mp3',
    '8am.mp3',
    'palace.opus',
    '1am.opus',
    'newday.mp3',
    'ahh.mp3',
];

shuffle(bgMusic);

let bgIndex = 0;

let backgroundAudio = new Audio();
backgroundAudio.volume = 0.25;

function nextBackgroundSong() {
    backgroundAudio.src = 'music/' + bgMusic[bgIndex];
    backgroundAudio.play();
    bgIndex++;
    if (bgIndex == bgMusic.length) {
        bgIndex = 0;
    }
}

backgroundAudio.addEventListener('ended', nextBackgroundSong);

document.addEventListener("visibilitychange", () => {
	if (document.hidden) {
		backgroundAudio.pause();
	} else {
		backgroundAudio.play();
	}
});

function resetAllSettings() {
    if (confirm("Are you sure?")) {
        localStorage.clear();
        location.reload();
    }
}

if (localStorage.getItem('playerSpeed')) {
	$('#playerspeed').val(parseFloat(localStorage.getItem('playerSpeed')));
	playerSpeed = parseFloat(localStorage.getItem('playerSpeed'));
}

if (localStorage.getItem('botSpeed')) {
	$('#botspeed').val(parseFloat(localStorage.getItem('botSpeed')));
	computerSpeed = parseFloat(localStorage.getItem('botSpeed'));
}

if (localStorage.getItem('kickSpeed')) {
	$('#kickspeed').val(parseFloat(localStorage.getItem('kickSpeed')));
	addBallSpeed = parseFloat(localStorage.getItem('kickSpeed'));
	maxBallSpeed = addBallSpeed * 8.75;
}

if (localStorage.getItem('jitter')) {
	$('#jitter').val(parseFloat(localStorage.getItem('jitter')));
	jitter = parseFloat(localStorage.getItem('jitter'));
}

if (localStorage.getItem('reactTime')) {
	$('#reacttime').val(parseFloat(localStorage.getItem('reactTime')));
	reactTime = parseFloat(localStorage.getItem('reactTime'));

	if (reactTime < 1) {
		reactTime = 1;
	}
}

if (localStorage.getItem("musicVol")) {
	$("#musicvol").val(localStorage.getItem("musicVol"));
	backgroundAudio.volume = $('#musicvol').val() / 100;
}

if (localStorage.getItem("soundVol")) {
	$("#soundvol").val(localStorage.getItem("soundVol"));
}

// hide cursor
document.addEventListener("click", function(e) {
    if (!($("#settings-dialog").hasClass('show') || $("#win-dialog").hasClass('show'))) {
        let tag = e.target.tagName;

        if (!(tag == "I" || tag == "BUTTON" || tag == "H4" || tag == "INPUT" || tag == "SPAN")) {
            document.body.requestPointerLock();
        }
    }
});

// settingzzz
$('#playerspeed').change(function() {
	playerSpeed = parseFloat($('#playerspeed').val());
	localStorage.setItem('playerSpeed', playerSpeed);
});

$('#botspeed').change(function() {
	computerSpeed = parseFloat($('#botspeed').val());
	localStorage.setItem('botSpeed', computerSpeed);
});

$('#kickspeed').change(function() {
	addBallSpeed = parseFloat($('#kickspeed').val());
	maxBallSpeed = addBallSpeed * 8.75;

	localStorage.setItem('kickSpeed', addBallSpeed);
});

$('#jitter').change(function() {
	jitter = parseFloat($('#jitter').val());
	localStorage.setItem('jitter', jitter);
});

$('#reacttime').change(function() {
	reactTime = parseFloat($('#reacttime').val());
	localStorage.setItem('reactTime', reactTime);
});

$('#musicvol').on("input", function() {
	backgroundAudio.volume = $('#musicvol').val() / 100;

	localStorage.setItem('musicVol', $('#musicvol').val());
});

$('#soundvol').on("input", function() {
	localStorage.setItem('soundVol', $('#soundvol').val());
});

function getSoundVol() {
	if (localStorage.getItem("soundVol")) {
		return localStorage.getItem("soundVol") / 100;
	} else {
		return 1;
	}
}

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('twoplayers')) { // if 2 player mode
    computerMode = false;
    $('#arrow-key-stuff').hide();
} else {
    computerMode = true;
}

var gameOver = false;
var paused = false;
var firstCollision = false;

var dotStartPos;
var dotStartPosX = 50;

if (navigator.userAgent.match(/Android/i)
	|| navigator.userAgent.match(/webOS/i)
	|| navigator.userAgent.match(/iPhone/i)
	|| navigator.userAgent.match(/iPad/i)
	|| navigator.userAgent.match(/iPod/i)
	|| navigator.userAgent.match(/BlackBerry/i)
	|| navigator.userAgent.match(/Windows Phone/i)) { // mobile device?
	$('#sticks').show();
} else {
	$('#sticks').hide();
}

function resizeGame() {
	var wheight = window.innerHeight;
	var wwidth = document.body.clientWidth;

	if (wwidth > fieldWidth) {
		var a = (wheight / fieldHeight) * 0.4;
		$('#container').css('transform', 'translateY(' + (Math.pow(0.999328, wheight) * -946.814 + 677.736) + 'px) scale(' + a + ', ' + a + ')');
	} else {
		var a = (wwidth / fieldWidth) * 0.9;
		$('#container').css('transform', 'translateX(' + (Math.pow(1.00141, wwidth) * 210.322 - 557.158) + 'px) scale(' + a + ')');
	}

	dotStartPos = wheight - 130;
	dot.style.top = dotStartPos + 'px';
	dot.style.left = dotStartPosX + 'px';
	joystick.style.top = dotStartPos + 'px';
	joystick.style.left = dotStartPosX + 'px';
}

resizeGame();

window.onresize = resizeGame;

var winModal = new bootstrap.Modal(document.getElementById('win-dialog'), {
	keyboard: false
});

var settingsModal = new bootstrap.Modal(document.getElementById('settings-dialog'));

var ball = new Sprite(['ball.png'], 'ball');
//ball.setSolid(true);

var player1 = new Sprite(['redthingy.png'], 'player');

var useArrowKeys = false;
addp1WASD();

if (localStorage.getItem('useArrows') == 'true') {
	$('#usearrows')[0].checked = true;
	//console.log('hee')
	changethingee();
}

$('#usearrows').change(function() {
	changethingee();
});

function changethingee() {
	useArrowKeys = $('#usearrows')[0].checked;
	localStorage.setItem('useArrows', useArrowKeys);

	player1.clearKeyBindings();
	if (useArrowKeys && computerMode) {
		addp1Arrows();
	} else {
		addp1WASD();
	}
}

// add WASD
function addp1WASD() {
	player1.addKeyBinding(Game.KEY_W, function() {
		if (!paused)
			player1.changeY(-playerSpeed);
	});
	player1.addKeyBinding(Game.KEY_S, function() {
		if (!paused)
			player1.changeY(playerSpeed);
	});
	player1.addKeyBinding(Game.KEY_A, function() {
		if (!paused)
			player1.changeX(-playerSpeed);
	});
	player1.addKeyBinding(Game.KEY_D, function() {
		if (!paused)
			player1.changeX(playerSpeed);
	});
}

function addp1Arrows() {
	player1.addKeyBinding(Game.KEY_UP, function() {
		if (!paused)
			player1.changeY(-playerSpeed);
	});
	player1.addKeyBinding(Game.KEY_DOWN, function() {
		if (!paused)
			player1.changeY(playerSpeed);
	});
	player1.addKeyBinding(Game.KEY_LEFT, function() {
		if (!paused)
			player1.changeX(-playerSpeed);
	});
	player1.addKeyBinding(Game.KEY_RIGHT, function() {
		if (!paused)
			player1.changeX(playerSpeed);
	});
}

var player2 = new Sprite(['bluethingy.png'], 'player');
if (!computerMode) {
	addPlayer2Controls();
}

function addPlayer2Controls() {
	player2.addKeyBinding(Game.KEY_UP, function() {
		if (!paused)
			player2.changeY(-playerSpeed);
	});
	player2.addKeyBinding(Game.KEY_DOWN, function() {
		if (!paused)
			player2.changeY(playerSpeed);
	});
	player2.addKeyBinding(Game.KEY_LEFT, function() {
		if (!paused)
			player2.changeX(-playerSpeed);
	});
	player2.addKeyBinding(Game.KEY_RIGHT, function() {
		if (!paused)
			player2.changeX(playerSpeed);
	});
}

var score1 = new Score('score1', 0);
var score2 = new Score('score2', 0);

var serving = Math.round(Math.random()) + 1;
if (computerMode) serving = 1;

var isDragging = false;

$('#dot').draggable({
	start: function(e) {
		isDragging = true;
	},
	drag: function(e) {
		//console.log($(this).offset().left);
		//console.log($(this).offset().top);

		var xPos = $(this).offset().left;
		var yPos = $(this).offset().top;
		
		var diffOfX = xPos - dotStartPosX;
		var diffOfY = yPos - dotStartPos;
		var distanceee = Math.sqrt((diffOfX * diffOfX) + (diffOfY * diffOfY));

		if (distanceee > 150) {
			e.preventDefault();
		}
	},
	stop: function(e) {
		dot.style.top = dotStartPos + 'px';
		dot.style.left = dotStartPosX + 'px';
		isDragging = false;
	},
	scroll: false
});



Game.onLoop(doStuff);

function doStuff() {
	//console.log(dot.style.left);
	//console.log(dot.style.top);
	if (isDragging && !paused) {
		var xPos = parseFloat(dot.style.left);
		var yPos = parseFloat(dot.style.top);
		
		var diffOfX = xPos - dotStartPosX;
		var diffOfY = yPos - dotStartPos;
		var distanceee = Math.sqrt((diffOfX * diffOfX) + (diffOfY * diffOfY));

		var moveTheX = parseFloat(diffOfX / distanceee);
		var moveTheY = parseFloat(diffOfY / distanceee);

		if (moveTheX == NaN || moveTheY == NaN) {
			return;
		}

		if (moveTheX > 0.01) {
			player1.changeX(moveTheX * playerSpeed);
		} else if (moveTheX < 0.01) {
			player1.changeX(moveTheX * playerSpeed);
		}

		if (moveTheY > 0.01) {
			player1.changeY(moveTheY * playerSpeed);
		} else if (moveTheY < 0.01) {
			player1.changeY(moveTheY * playerSpeed);
		}
	}
}

function theMoveSauce() {
	var diffX = ball.x - player2.x;
	var diffY = ball.y - player2.y;
	var dist = Math.sqrt((diffX * diffX) + (diffY * diffY));

	var moveX = diffX / dist;
	var moveY = diffY / dist;

	if ((ball.x + 25) < player2.x) { // if ball is in front of computer (most likely case)
		var moveByThingy = Math.random() * (computerSpeed / 1.4545) * (jitter) * 1.3; // "jitteryness"

		// move in the opposite direction of the player
		if (player2.y > player1.y) {
			player2.autoMove(moveX * computerSpeed, moveY * computerSpeed - moveByThingy);
		} else {
			player2.autoMove(moveX * computerSpeed, moveY * computerSpeed + moveByThingy);
		}
	} else { // if behind computer, try to get it
		var thingbob = 0;

		if (ball.y < player2.y) { // ball above computer
			thingbob = computerSpeed;
		} else { // ball below computer
			thingbob = -computerSpeed;
		}

		player2.autoMove(computerSpeed * 1.2, moveY * computerSpeed + thingbob);
	}

	if (gameOver) {
		player2.autoMove(0, 0);
		clearInterval(moveThingy);
	}
}

// AI mode
function moveComputer() {
	if (computerMode) {
		moveThingy = setInterval(theMoveSauce, reactTime * 100);
	}
}

function pause(value) {
	if (value) {
		paused = true;
        //backgroundAudio.volume = 0.25;
		if (computerMode) {
			player2.autoMove(0, 0);
			clearInterval(moveThingy);
		}
	} else {
		paused = false;
        //backgroundAudio.volume = 0.5;
		if (computerMode)
			moveThingy = setInterval(theMoveSauce, reactTime * 100);
	}
}

function resetPos() {
	player1.setPosition(goalSize, (fieldHeight / 2 + marginTop) - (playerSize / 2));
	player2.setPosition(fieldWidth - playerSize - goalSize, (fieldHeight / 2 + marginTop) - (playerSize / 2));
	
	if (serving == 1) {
	ball.setPosition(p1End / 2, (fieldHeight / 2 + marginTop) - (ballSize / 2));
	} else {
		ball.setPosition((p2End + fieldWidth) / 2 - ballSize, (fieldHeight / 2 + marginTop) - (ballSize / 2));
	}
	ball.autoMove(0, 0);
}

resetPos();

ball.setBoundary(marginTop, marginTop + fieldHeight, goalSize, fieldWidth - goalSize);

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
}

let kickSounds = [];
for (let i = 0; i < 6; i++) {
    kickSounds.push(new Audio('sounds/kick-00' + (i + 1) + '.mp3'));
}

ball.onCollide(function(sprites) {
	var sprite;

	if (sprites.length == 1) {
		sprite = sprites[0];
	} else {
		if (computerMode) { // i have no idea why it's this value
			if (Math.random() * 1.515 > 0.5) {
				sprite = player1;
			} else {
				sprite = player2;
			}
		} else {
			sprite = sprites[getRndInteger(0, sprites.length)];
		}
	}

	if (!gameOver) {
		if (!firstCollision) {
			firstCollision = true;
			moveComputer();
            nextBackgroundSong();
		}

		var diffX = ball.x - sprite.x;
		var diffY = ball.y - sprite.y;
		var dist = Math.sqrt((diffX * diffX) + (diffY * diffY));

		if (dist == 0) return; // no dividing by zero

		ballDirX = diffX / dist; // x over r (cos)
		ballDirY = diffY / dist; // y over r (sin)

		ballSpeed += addBallSpeed;

		if (ballSpeed > maxBallSpeed) {
			ballSpeed = maxBallSpeed;
		}

		ball.autoMove(ballDirX * ballSpeed, ballDirY * ballSpeed);

        let randomKick = kickSounds[getRndInteger(0, kickSounds.length - 1)];
        //console.log(randomKick.currentTime)

        if (randomKick.currentTime == 0 || randomKick.currentTime > 0.75) {
            randomKick.pause();
            randomKick.currentTime = 0;
            randomKick.volume = Math.random() * getSoundVol();
            randomKick.play();
        }
	}
});

setInterval(function() {
	if (!gameOver) {
		if (ballSpeed >= 1) {
			ballSpeed -= 0.5;
		}
		ball.autoMove(ballDirX * ballSpeed, ballDirY * ballSpeed);
	}
}, 100);

function countdown() {
	var i = 3;
	$('#countdown').fadeIn(0);

	function asdfjkl() {
		const hit = new Audio('sounds/hit.ogg');
		hit.volume = getSoundVol();
		hit.play();
		if (i == 0) {
			$('#countdown').text('GO!');
			$('#countdown').finish().fadeOut(500);
			clearInterval(dumbo);
			pause(false);
		} else {
			$('#countdown').text(i);
		}
		i--;
	}

	asdfjkl();
	var dumbo = setInterval(asdfjkl, 750);
}

ball.onBoundary(function(bound) {
	if (!gameOver) {
		if (bound == 'left' || bound == 'right') {
			ballSpeed = 0;
			$('#whoscored').fadeIn(0);

			var blueScores = ball.x < p1End;
			var redScores = ball.x > p2End;

			if (blueScores) {
				$('#whoscored').html('<span style="color: blue">Blue scored!</span>');
				score2.add(1);

				if (switchServing) {
					serving = 1;
				} else {
					serving = 2;
				}

				const ding = new Audio('sounds/ding.mp3');
				ding.volume = getSoundVol();
				ding.play();
			} else if (redScores) {
				$('#whoscored').html('<span style="color: red">Red scored!</span>');
				score1.add(1);

				if (switchServing) {
					serving = 2;
				} else {
					serving = 1;
				}

				const ding = new Audio('sounds/ding.mp3');
				ding.volume = getSoundVol();
				ding.play();
			} else { // tie
				$('#whoscored').html("It's a tie...");
				serving = Math.round(Math.random()) + 1;
			}
			$('#whoscored').finish().fadeOut(2000);

			if (score1.score >= pointsToWin && score1.score - score2.score >= 2) {
				win(1);
				return;
			} else if (score2.score >= pointsToWin && score2.score - score1.score >= 2) {
				win(2);
				return;
			}

			pause(true);
			resetPos();
			countdown();
		}
		
		if (bound == 'top' || bound == 'bottom') {
			ballDirY = -ballDirY;
			ball.autoMove(ballDirX * ballSpeed, ballDirY * ballSpeed);
		}
	}
});

function win(player) {
	gameOver = true;

	$('#final-player1').html(score1.score);
	$('#final-player2').html(score2.score);

	if (player == 1) {
		$('#player-who-won').html('<span style="color: red">RED</span>');
		$('#yaywin').attr('src', 'redthingy.png');
	} else {
		$('#player-who-won').html('<span style="color: blue">BLUE</span>');
		$('#yaywin').attr('src', 'bluethingy.png');
	}

    backgroundAudio.pause();
	const win = new Audio('sounds/triumph.mp3');
	win.volume = getSoundVol();
	win.play();

	ball.hide();

	document.exitPointerLock();
	
	winModal.show();
}

Game.start();