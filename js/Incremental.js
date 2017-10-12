// Timer for building ticks
var Timer = window.setInterval(function(){Tick()}, 1000);

// Auto-save timer
var ASTimer = window.setInterval(function(){SaveGame()}, 10000);

var buildings = [];

// Button to click for stone
function GatherStone() {
	game.stone++;
	
	document.getElementById("stone").innerHTML = game.stone;
}

// Handles what happens every time the timer hits 1 sec
function Tick() {
	for (var i = 0; i < game.buildings.length; i++) {
		game.stone += game.buildings[i] * buildings[i].persec;
	}
	
	document.getElementById("stone").innerHTML = game.stone;
}

// Saving
function GameSave() {
	this.stone = 0;
	this.buildings = [];
	
	for (var i = 0; i < buildings.length; i++) {
		this.buildings[i] = 0;
	}
}

function SaveGame() {
	window.localStorage["SaveName"] = JSON.stringify(game);
}

function LoadGame() {
	game.stone = JSON.parse(window.localStorage["SaveName"]).stone;
	game.buildings = JSON.parse(window.localStorage["SaveName"]).buildings;
	
	if (game.buildings[0] == 0) {
		document.getElementById("copper-name").style.display = "none";
		document.getElementById("copper").style.display = "none";
	}
	
	document.getElementById("stone").innerHTML = game.stone;
	document.getElementById("Building1Qty").innerHTML = game.buildings[0];
}

function ResetGame() {
	game.stone = 0;
	game.buildings = []
	
	for (var i  = 0; i < buildings.length; i++) {
		game.buildings[i] = 0;
	}
}

// Building class
function Building() {
	this.name = "Building Name";
	this.cost = 10;
	this.persec = 1;
}

function InitBuildings() {
	LoadBuilding("Copper Mine", 10, 1);
}

function LoadBuilding(name, cost, persec) {
	var cur = buildings.length;
	buildings[cur] = new Building();
	buildings[cur].name = name;
	buildings[cur].cost = cost;
	buildings[cur].persec = persec;
}

function Build(id) {
	if (game.stone >= buildings[id].cost) {
		game.stone -= buildings[id].cost;
		game.buildings[id]++;
		
		if (game.buildings[id] >= 0) {
			document.getElementById("copper-name").display = "inline-block";
			document.getElementById("copper").display = "inline-block";
		}
		
		document.getElementById("stone").innerHTML = game.stone;
		document.getElementById("Building1Qty").innerHTML = game.buildings[id];
	}
}

// Sets up the game file
window.onload = function() {
	InitBuildings();
	window.game = new GameSave();
	if (window.localStorage["SaveName"] == null) {
		GameSave();
	}
	
	LoadGame();
	
	//document.getElementById("stone").innerHTML = GameTwo.stone;
	//document.getElementById("Building1Qty").innerHTML = GameTwo.buildings[0];
}