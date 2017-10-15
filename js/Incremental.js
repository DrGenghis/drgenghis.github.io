// Timer for building ticks
var Timer = window.setInterval(function(){Tick()}, 1000);

var ToolTipTimer = window.setInterval(function() {BuildingTT(0), BuildingTT(1)}, 500);

// Auto-save timer
var ASTimer = window.setInterval(function(){SaveGame()}, 10000);

var buildings = [];

var buildingModifier = 1.15;

// Button to click for stone
function GatherStone() {
	game.stone++;
	
	UpdateResources();
}

// Handles what happens every time the timer hits 1 sec
function Tick() {
	for (var i = 0; i < game.buildings.length; i++) {
		if (buildings[i].resource == "stone") {
			game.stone += game.buildings[i] * buildings[i].persec;
		} else if (buildings[i].resource == "ore") {
			game.ore += game.buildings[i] * buildings[i].persec;
		}
	}
	
	UpdateResources();
}

// Takes the string for the cost of a building and splits it up into individual values.
// (e.g. "105 stone 200 metal 5 cogs" -> [105], ["stone"], [200], ["metal"], [5], ["cogs"])
function CostStringSplit(id) {
	var costSplit = [];
	var costString = buildings[id].cost;
	
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
		//newSplit.push(costList[i] * (buildingModifier^buildings[id]));
		newSplit.push(costList[i] * (Math.pow(buildingModifier, game.buildings[id])));
		newSplit[i] = parseFloat(newSplit[i]).toFixed(2);
		newSplit.push(costList[i+1]);
	}
	
	console.log("newSplit: " + newSplit);
	
	// Returns the new set of costs after modifying their costs
	return newSplit;
}

// Checks to make sure you have enough resources to build the thing you're trying to build
// FIXME: This doesn't figure out the individual parts correctly, it only figures out
//			if you can the WHOLE thing. I want it to be able to tell you if you have each
//			part individually.
function BuildingCostCheck(costList, id) {
	var resCheck = 0;
	
	for (var i = 0; i < costList.length; i += 2) {
		if (costList[i + 1] == "stone") {
			if (game.stone >= costList[i]) {
				resCheck++;
			}
		} else if (costList[i + 1] == "ore") {
			if (game.ore >= costList[i]) {
				resCheck++;
			}
		}
	}
	
	if (resCheck == (costList.length / 2) && costList.length > 1) {
		return true;
	} else if (resCheck == costList) {
		console.log("What are you doing here?");
	}else {
		console.log("resCheck: " + resCheck);
		return false;
	}
}

function BuildingTT(id) {
	var toolTip = buildings[id].desc;
	var costList = CostStringSplit(id);
	var adjCostList = CostMultiplier(costList, id);
	toolTip = toolTip + '<font size="1">';
	//var costList = CostStringSplit(buildings[id].cost);
	
	for (var i = 0; i < adjCostList.length; i++) {
		toolTip = toolTip + adjCostList[i] + " ";
	}
	
	toolTip += "&emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;" + buildings[id].resource + " Per Sec:  " + buildings[id].persec;
	
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
	
	UpdateResources();
}

function ResetGame() {
	game.stone = 0;
	game.ore = 0;
	game.buildings = []
	
	for (var i  = 0; i < buildings.length; i++) {
		game.buildings[i] = 0;
	}
	
	UpdateResources();
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
	LoadBuilding("Quarry", "10 stone", .5, "stone", "A large quarry designed to output a great deal of stone. <hr>");
	LoadBuilding("Ore Mine", "50 stone", .2, "ore", "Outputs ore which can later be smelted down into metals. <hr>");
}

function LoadBuilding(name, cost, persec, resource, desc) {
	var cur = buildings.length;
	buildings[cur] = new Building();
	buildings[cur].name = name;
	buildings[cur].cost = cost;
	buildings[cur].persec = persec;
	buildings[cur].resource = resource;
	buildings[cur].desc = desc;
}

function Build(id) {
	var costList = CostStringSplit(id);
	var adjCostList = CostMultiplier(costList, id);
	
	if (BuildingCostCheck(adjCostList, id == true)) {
		for (var i = 0; i < adjCostList.length; i += 2) {
			if (adjCostList[i + 1] == "stone") {
				game.stone -= adjCostList[i];
			}
			if (adjCostList[i + 1] == "ore") {
				game.ore -= adjCostList[i];
			}
		}
		
		game.buildings[id]++;
		
		UpdateResources();
	}
}

function UpdateResources() {
	document.getElementById("stone").innerHTML = game.stone.toFixed(2);
	document.getElementById("ore").innerHTML = game.ore.toFixed(2);
	document.getElementById("Building1Qty").innerHTML = game.buildings[0];
	document.getElementById("Building2Qty").innerHTML = game.buildings[1];
}

// Sets up the game file
window.onload = function() {
	InitBuildings();
	window.game = new GameSave();
	
	LoadGame();
}