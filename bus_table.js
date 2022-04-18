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
	if (route == "158") {
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
	

function makeTable() {
	let date = new Date;
	
	//add one minute to ensure times are in the future
	date.setTime(date.getTime() + 1000 * 60);
	const today = getDate(date);
	const timeNow = getTime(date, false);

	let table = document.getElementById("bus_table").querySelector("table");
	table.removeChild(table.firstChild);
	generateTableHead(table, ["Date", "Time", "Route", "Gate"]);
	let entriesToPrint = 15;
	var lastEntry;
	busData.every(entry => {
		if (entry.date >= today && entry.time >= timeNow) {
			generateTableRow(table, [entry.date, entry.time.slice(0,-3), entry.route, getGate(entry.time, entry.route)]);
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
	let t = setTimeout(function(){ makeTable() }, 3*60*1000);
}