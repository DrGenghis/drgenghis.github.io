// Timer for building ticks
var Timer = window.setInterval(function(){Tick()}, 1000);

// Auto-save timer
var ASTimer = window.setInterval(function(){SaveGame()}, 10000);

var buildings = [];

// Button to click for money
function GatherMoney() {
	game.money++;
	
	document.getElementById("money").innerHTML = game.money;
}

// Handles what happens every time the timer hits 1 sec
function Tick() {
	for (var i = 0; i < game.buildings.length; i++) {
		game.money += game.buildings[i] * buildings[i].persec;
	}
	
	document.getElementById("money").innerHTML = game.money;
}

// Saving
function GameSave() {
	this.money = 0;
	this.buildings = [];
	
	for (var i = 0; i < buildings.length; i++) {
		this.buildings[i] = 0;
	}
}

function SaveGame() {
	window.localStorage["SaveName"] = JSON.stringify(game);
}

function LoadGame() {
	game.money = JSON.parse(window.localStorage["SaveName"]).money;
	game.buildings = JSON.parse(window.localStorage["SaveName"]).buildings;
	
	document.getElementById("money").innerHTML = game.money;
	document.getElementById("Building1Qty").innerHTML = game.buildings[0];
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
	if (game.money >= buildings[id].cost) {
		game.money -= buildings[id].cost;
		game.buildings[id]++;
		
		document.getElementById("money").innerHTML = game.money;
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
	
	//document.getElementById("money").innerHTML = GameTwo.money;
	//document.getElementById("Building1Qty").innerHTML = GameTwo.buildings[0];
}