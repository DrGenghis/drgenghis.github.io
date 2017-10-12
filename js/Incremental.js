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
		if (buildings[i].resource == "Stone") {
			game.stone += game.buildings[i] * buildings[i].persec;
		} else if (buildings[i].resource == "Ore") {
			game.ore += game.buildings[i] * buildings[i].persec;
		}
	}
	
	document.getElementById("stone").innerHTML = game.stone;
	document.getElementById("ore").innerHTML = game.ore;
}

// Saving
function GameSave() {
	this.stone = 0;
	this.ore = 0;
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
	game.ore = JSON.parse(window.localStorage["SaveName"]).ore;
	game.buildings = JSON.parse(window.localStorage["SaveName"]).buildings;
	
	/*if (game.buildings[0] == 0) {
		document.getElementById("ore-name").style.display = "none";
		document.getElementById("ore").style.display = "none";
	}*/
	
	document.getElementById("stone").innerHTML = game.stone;
	document.getElementById("ore").innerHTML = game.ore;
	document.getElementById("Building1Qty").innerHTML = game.buildings[0];
	document.getElementById("Building2Qty").innerHTML = game.buildings[1];
}

function ResetGame() {
	game.stone = 0;
	game.ore = 0;
	game.buildings = []
	
	for (var i  = 0; i < buildings.length; i++) {
		game.buildings[i] = 0;
	}
	
	document.getElementById("stone").innerHTML = game.stone;
	document.getElementById("ore").innerHTML = game.ore;
	document.getElementById("Building1Qty").innerHTML = game.buildings[0];
	document.getElementById("Building2Qty").innerHTML = game.buildings[1];
}

// Building class
function Building() {
	this.name = "Building Name";
	this.cost = 10;
	this.persec = 1;
	this.resource = "";
}

function InitBuildings() {
	LoadBuilding("Quarry", 10, 1, "Stone");
	LoadBuilding("Ore Mine", 50, 1, "Ore");
}

function LoadBuilding(name, cost, persec, resource) {
	var cur = buildings.length;
	buildings[cur] = new Building();
	buildings[cur].name = name;
	buildings[cur].cost = cost;
	buildings[cur].persec = persec;
	buildings[cur].resource = resource;
}

function Build(id) {
	if (game.stone >= buildings[id].cost) {
		game.stone -= buildings[id].cost;
		game.buildings[id]++;
		
		/*if (game.buildings[id] >= 0) {
			document.getElementById("ore").display = "inline-block";
			document.getElementById("ore").display = "inline-block";
		}*/
		
		document.getElementById("stone").innerHTML = game.stone;
		document.getElementById("ore").innerHTML = game.ore;
		document.getElementById("Building1Qty").innerHTML = game.buildings[0];
		document.getElementById("Building2Qty").innerHTML = game.buildings[1];
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
}