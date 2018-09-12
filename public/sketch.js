var w = 640, h = 480;
var p1x = w / 2 - 80, p1y = h / 2;
var p2x = w / 2 + 80, p2y = h / 2;
var bgColor = 23;
var txtColor = [0, 255, 255];
var p1 = new Player([0, 167, 247]);
var p2 = new Player([135, 231, 0]);

var state;
const BOARD = 0, SPLASH = 1, GAME = 2;

var socket;

var input, button, greeting;


// -- DRAWING FUNCTIONS --
function setup() {
	createCanvas(w, h);
	background(bgColor);
	state = BOARD;
	socket = io.connect('http://localhost:3010');
	// We make a named event called 'mouse' and write an
	// anonymous callback function
	socket.on('mouse',
	function(data) {
		// Draw a blue circle
		fill(0,0,255);
		noStroke();
		ellipse(data.x,data.y,80,80);
	}
);
}


function draw() {

	if (state === BOARD) {
		drawBoard();
		noLoop();
	}


	if (state === SPLASH) {
		drawSplash();
		resetPlayers();
		noLoop();
	}

	else if (state === GAME) {
		renderPlayer(p1);
		renderPlayer(p2);
		moveForward(p1);
		moveForward(p2);
		checkDeaths();
	}
}

function drawSplash() {
	strokeWeight(0);
	textSize(72);
	textAlign(CENTER, CENTER);
	textFont("Verdana");
	fill(txtColor);
	text("TRON", width / 2, height * 2 / 5);
	textSize(30);
	text("P1: WASD | P2: IJKL\nClick anywhere to begin!", width / 2, height * 3 / 5);
}

function drawBoard(){
	strokeWeight(0);
	textSize(72);
	textAlign(CENTER, CENTER);
	textFont("Verdana");
	fill(txtColor);
	text("TRON", width / 2, height * 2 / 5);
	input = createInput();

	input.position(screen.width / 2 - input.width, screen.height * 2 / 5 );

	button = createButton('submit');
	button.position(input.x + input.width, input.y);
	button.mousePressed(greet);

	textSize(30);
	var lbl = text("Choisis ton nom de pilote?", width / 2, height * 3 / 5);
	//greeting = createElement('h2', 'Choisis un nom de pilote?');
	//greeting.position(input.x, input.y -50);
	console.log(lbl)

	textAlign(CENTER);
	textSize(50);
}



function resetPlayers() {
	p1.x = p1x;
	p1.y = p1y;
	p2.x = p2x;
	p2.y = p2y;
	p1.dir = 0;
	p2.dir = 0;
}

function renderPlayer(player) {
	stroke(player.color);
	point(player.x, player.y);
}

function moveForward (player) {
	[player.x, player.y] = pixelInFront(player);
}

function checkDeaths() {
	if (isDead(p1)  || isDead(p2)) {
		if (isDead(p1)  && isDead(p2))
		alert("Tie game!");
		else if (isDead(p1))
		alert("P2 Wins!");
		else alert ("P1 Wins!")
		state = BOARD;
	}
}

function isDead(player) {
	return get(player.x, player.y)[0] != bgColor;
}

function Player(color) { // Other attributes: x, y, dir
	this.color = color;
}

function keyPressed() {
	if (p1.dir != 2 && (key === 'w' || key === 'W'))
	p1.dir = 0;
	else if (p1.dir != 3 && (key === 'd' || key === 'D'))
	p1.dir = 1;
	else if (p1.dir != 0 && (key === 's' || key === 'S'))
	p1.dir = 2;
	else if (p1.dir != 1 && (key === 'a' ||key === 'A'))
	p1.dir = 3;

	if (p2.dir != 2 && (key === 'i' || key === 'I'))
	p2.dir = 0;
	else if (p2.dir != 3 && (key === 'l' || key === 'L'))
	p2.dir = 1;
	else if (p2.dir != 0 && (key === 'k' || key === 'K'))
	p2.dir = 2;
	else if (p2.dir != 1 && (key === 'j' || key === 'J'))
	p2.dir = 3;
}

function mouseClicked() {
	/*if (state === BOARD) {
	background(bgColor);
	state = SPLASH;
	strokeWeight(1);
	loop();
}else*/
if (state === SPLASH) {
	background(bgColor);
	state = GAME;
	strokeWeight(1);
	loop();
}else{
	var data = {
		x: mouseX,
		y: mouseY
	};
	console.log(data)
}
}

function pixelInFront(player) {
	var x = player.x;
	var y = player.y;
	switch (player.dir) {
		case 0: y--; // Up
		break;
		case 1: x++; // Right
		break;
		case 2: y++; // Down
		break;
		case 3: x--; // Left
		break;
		default: //console.log("Invalid direction");
		break;
	}
	x = clamp(x, width);
	y = clamp(y, height);
	return [x, y];
}

function clamp(num, upperBound) {
	if (num < 0)
	num += upperBound;
	else if (num >= upperBound)
	num -= upperBound;
	return num;
}

function mouseDragged() {
	// Make a little object with mouseX and mouseY
	var data = {
		x: mouseX,
		y: mouseY
	};
	// Send that object to the socket
	socket.emit('mouse',data);
}

function greet() {
	var name = input.value();
	//greeting.html('hello '+name+'!');
	//input.value('');
	console.log(name);
	background(bgColor);
	state = SPLASH;
	strokeWeight(1);
	loop();

}
