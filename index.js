playerConfigList = [];
playerCount = 0;
playerConfigDivIdPrefix = "playerConfigDiv";

function initializePlayerConfigList(){
	playerConfigList = getDefaultPlayerConfigList(maxPlayerCount);
}

function playerCountChanged(){
	inputCount = parseInt(document.getElementById("playerCount").value);
	if (inputCount >= minPlayerCount && inputCount <= maxPlayerCount){
		updatePlayerConfigDiv(inputCount);
		playerCount = inputCount;
	}
}

function updatePlayerConfigDiv(newPlayerCount){
	if (newPlayerCount < playerCount){
		for(var i = playerCount - 1; i >= newPlayerCount; i--){
			document.getElementById("playerConfigListDiv").removeChild(document.getElementById(playerConfigDivIdPrefix + i));
		}
	}
	if (newPlayerCount > playerCount){
		for(var i = playerCount; i < newPlayerCount; i++){
			appendPlayerConfigDiv(i);
		}
	}
}

function appendPlayerConfigDiv(index){
	newDiv = document.createElement("div");
	newDiv.className = "playerConfigDiv";
	newDiv.id = playerConfigDivIdPrefix + index;

	newDivName = document.createElement("div");
	newDivName.className = "playerNameDiv";
	newDivName.innerHTML = playerNames[playerConfigList[index].colorIndex];

	newDivColorStatus = document.createElement("div");
	newDivColorStatus.className = "playerColorStatusDiv"
	newDivColorStatus.style.backgroundColor = playerColors[playerConfigList[index].colorIndex]
	newDivColor = document.createElement("div");
	newDivColor.className = "playerColorDiv";
	newDivColor.appendChild(newDivColorStatus);

	newDivKeyAnti = document.createElement("div");
	newDivKeyAnti.className = "playerKeyDiv playerKeyAntiDiv";
	newDivKeyAnti.innerHTML = keyNames[playerConfigList[index].keyAnti];

	newDivKeyClocki = document.createElement("div");
	newDivKeyClocki.className = "playerKeyDiv playerKeyClockiDiv";
	newDivKeyClocki.innerHTML = keyNames[playerConfigList[index].keyClocki];

	newDiv.appendChild(newDivName);
	newDiv.appendChild(newDivColor);
	newDiv.appendChild(newDivKeyAnti);
	newDiv.appendChild(newDivKeyClocki);

	document.getElementById("playerConfigListDiv").appendChild(newDiv);
}

function redirectToGame(){
	config = playerConfigList.slice(0,playerCount);
	window.location = "game.html?config=" + encodeURIComponent(btoa(JSON.stringify(config)));
}

initializePlayerConfigList();
playerCountChanged();