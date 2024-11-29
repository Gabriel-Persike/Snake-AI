var map = {
	x: 200,
	y: 200,
};

var highest = 0;
var highestMoves = 0;
var player = {
	points: 0,
	x: 50,
	y: 100,
	direction: "right",
	body: [
		{
			id: 0,
			x: 50,
			y: 100,
		},
	],
};	

var food = {
	x: 70,
	y: 120,
};

var IAActive = true;

var intervalClock = null;

function IAQlearning() {
	var state = getState();
	var action = PerceptronQLearning.chooseAction(state);

	if (action == "up") {
		player.direction = "up";
	} else if (action == "down") {
		player.direction = "down";
	} else if (action == "left") {
		player.direction = "left";
	} else if (action == "right") {
		player.direction = "right";
	}

	return {state, action};
}
function nextState(state, action, colision, gotFood){
	var nextState = getState();

	var reward = 0;
	if (gotFood) {
		reward = 10;
	}
	// else{
	// 	reward = -0.00000001;
	// }

	if (colision) {
		reward = -1;
	}

	PerceptronQLearning.updateQValue(state, action, reward, nextState);
}

$(document).ready(function () {
	StartQLearning();
	bindings();
	$("#statusIA").text(IAActive ? "Ativado" : "Desativado");
});

function bindings() {
	$(document).on("keydown", function (e) {
		var tecla = e.keyCode;

		var codigosTeclas = {
			espaco: 32,
			left: 37,
			up: 38,
			right: 39,
			down: 40,
		};

		if (tecla == codigosTeclas.espaco) {
			startStop();
		} else if (tecla == codigosTeclas.left) {
			player.direction = "left";
		} else if (tecla == codigosTeclas.right) {
			player.direction = "right";
		} else if (tecla == codigosTeclas.up) {
			player.direction = "up";
		} else if (tecla == codigosTeclas.down) {
			player.direction = "down";
		}
	});

	$("#btnStartStopIA").on("click", function () {
		IAActive = !IAActive;
		$("#statusIA").text(IAActive ? "Ativado" : "Desativado");
	});
}

function startStop() {
	if (intervalClock == null) {
		intervalClock = setInterval(clock, $("#clockTime").val());
	} else {
		clearInterval(intervalClock);
		intervalClock = null;
	}
}

function IALinearRegretion() {
	var x = player.x - food.x;
	x = x < 0 ? -1 : x > 0 ? 1 : 0;
	var y = player.y - food.y;
	y = y < 0 ? -1 : y > 0 ? 1 : 0;

	var predict = perc.predict([x, y]);
	var direction = "";

	if (predict[1] == 1) {
		direction = "up";
	} else if (predict[0] == 1) {
		direction = "down";
	} else if (predict[3] == 1) {
		direction = "left";
	} else if (predict[2] == 1) {
		direction = "right";
	}

	if (direction) {
		player.direction = direction;
	}
}

function clock() {
	var state = null;
	var action = null;
	if (IAActive) {
		var retorno = IAQlearning();
		state = getState();
		action = retorno.action;
	}
	move();
	var gotFood = checkFood();
	var colision = checkColision();
	if (action) {
		nextState(state, action, colision, gotFood);
	}
	player.moves++;
	draw();

}

function getState(){
	var x = player.x - food.x;
	x = x < 0 ? -1 : x > 0 ? 1 : 0;
	var y = player.y - food.y;
	y = y < 0 ? -1 : y > 0 ? 1 : 0;

	var Mapx = player.x >= (map.x - 10) ? 1 : map.x - player.x >= (map.x - 10) ? -1 : 0;
	var Mapy = player.y >= (map.y - 10) ? 1 : map.y - player.y >= (map.y-10)  ? -1 : 0;

	var nextState = [
		x,y,
		Mapx,
		Mapy
	];

	return nextState.join(",");
}

function checkFood() {
	if (player.x == food.x && player.y == food.y) {
		player.points++;
		// $("#points").html(player.points);
		addPixel();

		var list = getUnOcupiedPixels();
		var random = Math.floor(Math.random() * list.length);

		food.x = list[random].x;
		food.y = list[random].y;
		return true;
	}

	function getUnOcupiedPixels() {
		var pixels = [];
		for (let i = 30; i < map.x - 30; i += 10) {
			for (let j = 30; j < map.y -30; j += 10) {
				var ocupied = false;
				for (const pixel of player.body) {
					if (pixel.x == i && pixel.y == j) {
						ocupied = true;
						break;
					}
				}
				if (!ocupied) {
					pixels.push({ x: i, y: j });
				}
			}
		}
		return pixels;
	}
}
function checkColision(){
	if (player.x < 0 || player.x >= map.x || player.y < 0 || player.y >= map.y) {
		// clearInterval(intervalClock);
		// intervalClock = null;
		// alert("Game Over");
	
		if (highest < player.points) {
			highest = player.points;
			$("#textHigh").html(highest);			
		}

		if (player.moves > highestMoves) {
			$("#textHighMoves").text(player.moves);
			highestMoves = player.moves;
		}

		player = {
			points: 0,
			x: 50,
			y: 100,
			direction: "right",
			moves:0,
			body: [
				{
					id: 0,
					x: 50,
					y: 100,
				},
			],
		};
		return true;
	}
}
function addPixel() {
	var lastPixel = player.body[player.body.length - 1];
	var newPixel = {
		id: player.body.length,
		x: lastPixel.x,
		y: lastPixel.y,
	};

	player.body.push(newPixel);
}
function move() {
	var direction = player.direction;
	if (direction == "right") {
		player.x += 10;
	} else if (direction == "left") {
		player.x -= 10;
	} else if (direction == "up") {
		player.y -= 10;
	} else if (direction == "down") {
		player.y += 10;
	}

	for (let i = player.body.length - 1; i > 0; i--) {
		const pixel = player.body[i];

		pixel.x = player.body[i - 1].x;
		pixel.y = player.body[i - 1].y;
	}

	player.body[0].x = player.x;
	player.body[0].y = player.y;
}
function draw() {
	$("#main").html("");
	for (const pixel of player.body) {
		drawPixel(pixel.x, pixel.y, "black");
	}

	drawPixel(food.x, food.y, "red");
}
function drawPixel(x, y, color) {
	var html = "<div style='position:absolute;width:10px;height:10px;background-color:" + color + ";left:" + x + "px;top:" + y + "px;'></div>";
	$("#main").append(html);
}

function compareArrays(arr1, arr2) {
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] != arr2[i]) {
			return false;
		}
	}
	return true;
}