function getDate(date) {	
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return [year,month,day].join("");
}

function getTime(date, includeSeconds) {
	const hour = String(date.getHours()).padStart(2, '0');
	const minute = String(date.getMinutes()).padStart(2, '0');
	const seconds = includeSeconds ? String(date.getSeconds()).padStart(2, '0') : "00";
	return [hour, minute, seconds].join(":");
}
function currentTime() {

	const date = new Date();
	document.getElementById("clock").innerText = getDate(date) + " " + getTime(date, true); 
	let t = setTimeout(function(){ currentTime() }, 1000);
};

function getGate(time, route) 
{
	if (route.startsWith("158")) {
		if (time >= "06:00:00" && time <= "22:00:00") {
			return "202";
		} 
		else if (time > "22:00:00" || time <= "01:00:00") {
			return "301";
		}
		else {
			return "76";
		}
	} else if (route == "156R" || route == "159R") {
		if (time >= "06:00:00" && time <= "22:00:00") {
			return "201";
		} 
		else if (time > "22:00:00" || time <= "01:00:00") {
			return "304";
		}
		else {
			return "<UNKNOWN>";
		}
	} else {
		return "<UNKNOWN>"
	}
}
function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (const key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTableRow(table, data) {
  let row = table.insertRow();
  for (let val of data) {
     let cell = row.insertCell();
     let text = document.createTextNode(val);
     cell.appendChild(text);
  }
}

function removeColumn(table, column) {	
	for (let row of table.rows) {
		row.deleteCell(column);
	}
}

function convertTime(time) {
	let splitTime = time.split(":");
	let hr = parseInt(splitTime[0], 10);
	
	if (hr > 23) { 
		splitTime[0] = String(hr - 24).padStart(2, "0");
	}
	
	return splitTime.join(":");
}

var makeTableTimeoutId;	

function makeTable({entriesToPrint = 15} = {}) {
	
	let date = new Date;
	
	const today = getDate(date);
	const timeNow = getTime(date, false);
	
	
	let direction = document.getElementById("direction").value;
	var busData;
	var includeGate = false;
	
	if (direction == "From") {
		busData = busDataFrom;
		includeGate = true;
	} 
	else {
		busData = busDataTo;
		includeGate = false;
	}
		

	let table = document.getElementById("bus_table").querySelector("table");
	table.removeChild(table.firstChild);
	
	let headers = ["Date", "Time", "Route"];	
	if (includeGate) {
		headers.push("Gate");
	}
	generateTableHead(table, headers);
	// let entriesToPrint = 15;
	var lastEntry;
	busData.every(entry => {
		if ((entry.date == today && entry.time > timeNow) || (entry.date > today)) {
			const depTime = entry.time.slice(0,-3); // seconds are always ":00" in the schedule
			let values = [(depTime <= "23:59") ? entry.date : entry.date + " +1",  
			              convertTime(depTime), 
						  entry.route];
			if (includeGate) {
				values.push(getGate(entry.time, entry.route));
			}
			generateTableRow(table, values);
			
			if (--entriesToPrint <= 0) {
				return false;
			}
		}
		lastEntry = entry;
		return true;
	})	
	
	if (lastEntry.date == today) {
		// Remove Date column if all times are within the same date
		removeColumn(table, 0);
	}
	
	// Refresh every 3 minutes
	if (typeof makeTableTimeoutId != 'undefined') {
		// Remove old timeout
		clearTimeout(makeTableTimeoutId);
	}
	makeTableTimeoutId = setTimeout(function(){ makeTable() }, 3*60*1000);
}

function setDefaultDirection() {
	let dirSelection = document.getElementById("direction");
	const date = new Date;
	const timeNow = getTime(date, true);
	
	if (timeNow < "13:00:00") {
		dirSelection.selectedIndex = 1;
	}
	else {
		dirSelection.selectedIndex = 0;
	}
}