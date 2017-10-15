// Timer for building ticks
var Timer = window.setInterval(function(){Tick()}, 1000);

var ToolTipTimer = window.setInterval(function() {BuildingCostTT(0)}, 500);

// Auto-save timer
var ASTimer = window.setInterval(function(){SaveGame()}, 10000);

var buildings = [];

var buildingModifier = 1.5;

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

// Takes the string for the cost of a building and splits it up into individual values.
// (e.g. "105 stone 200 metal 5 cogs" -> [105], ["stone"], [200], ["metal"], [5], ["cogs"])
function CostStringSplit(id) {
	var costSplit = [];
	var costString = buildings[id].desc;
	
	// Splits the costString up into the individual values
	costSplit = costString.split(" ");
	
	// Takes the split values and turns every other one from a string to an int. (e.g. "105" -> 105)
	for (var i = 0; i < costSplit.length; i += 2) {
		costSplit[i] = parseInt(costSplit[i]);
	}
	
	return costSplit;	// Returns the split cost of the materials
}

// Goes through the list of variables that have been sliced up by CostStringSplit()
// and modifies them based on how many buildings you own of that type
function CostMultiplier(costList, id) {
	var newSplit = [];
	
	// Goes through the list of elements and updates the costs based on the amount of that building you own
	for (var i = 0;i < costList.length; i += 2) {
		newSplit.push(costList[i] * (buildingModifier^buildings[id]));
		newSplit.push(costList[i+1]);
	}
	
	// Returns the new set of costs after modifying their costs
	return newSplit;
}

function BuildingCostCheck(costList, id) {
	
}

function BuildingCostTT(id) {
	var toolTip = buildings[id].desc;
	var costList = buildings[id].cost;
	toolTip = toolTip + '<font size="2">';
	//var costList = CostStringSplit(buildings[id].cost);
	
	for (var i = 0; i < costList.length; i++) {
		toolTip = toolTip + costList[i] + " ";
	}
	
	toolTip += "</font>";
	
	if (id == 0) {
		document.getElementById("Building1TT").innerHTML = toolTip;
	} else if (id == 1) {
		document.getElementById("Building2TT").innerHTML = toolTip;
	}
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
	this.cost = "10 stone";
	this.persec = 1;
	this.resource = "";
	this.desc = "";
}

function InitBuildings() {
	LoadBuilding("Quarry", "10 stone", 1, "stone", "A large quarry designed to output a great deal of stone. <br />");
	LoadBuilding("Ore Mine", "50 stone", 1, "ore", "Outputs ore which can later be smelted down into metals. <br />");
	
	console.log("Buildings Initialized");
}

function LoadBuilding(name, cost, persec, resource, desc) {
	var cur = buildings.length;
	buildings[cur] = new Building(name, cost, persec, resource, desc);
	console.log(buildings[cur]);
	//buildings[cur].name = name;
	//buildings[cur].cost = cost;
	//buildings[cur].persec = persec;
	//buildings[cur].resource = resource;
	//buildings[cur].desc = desc;
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
	
	LoadGame();
}