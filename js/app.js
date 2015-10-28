
// Main function
var main = function(){
	
	// Initiate WordClock instance
	var wordClock = new WordClock("#000000", "#FFFFFF", "#303030");
	//var wordClock = new WordClock();  // Default constructor; same as WordClock("#000000", "#FFFFFF", "#303030")
	
	// Reset Word Clock colors
	//wordClock.bgColor = "#000000";  // Default is "#000000"
	//wordClock.onColor = "#FFFFFF";  // Default is "#FFFFFF"
	//wordClock.offColor = "#303030";  // Default is "#303030"
	
	// Bind colors to HTML for the big clock
	document.getElementById("big-clock").style.color = wordClock.offColor;
	document.getElementById("big-clock").style.backgroundColor = wordClock.bgColor;
	
	// Function to update and show the time to the HTML ID passed, then returns hour and minute values
	var getCurrentTime = function(id){
		
		// Get current time
		var dateObj = new Date();
		var hr = dateObj.getHours();
		var min = dateObj.getMinutes();
		var sec = dateObj.getSeconds();
		var AMPM = "AM";
		
		// Convert hour to 12-hour format
		if(hr === 12)
		{
			AMPM = "PM";
		}
		else if(hr > 12)
		{
			hr -= 12;
			AMPM = "PM";
		}
		else if(hr === 0)
		{
			hr = 12;
		}
		
		// Format time string
		if(hr < 10) {hr = "0" + hr;}
		if(min < 10) {min = "0" + min;}
		if(sec < 10) {sec = "0" + sec;}
		var currentTime = hr + ":" + min + ":" + sec + " " + AMPM;
		
		// Return the current time (hours and minutes)
		return {hour: hr, minute: min, second: sec};
	};
	
	
	// Code for updating the clock in real time based on the time (setInterval for 1 ms)
	var updateBasedOnCurrentTime = function(){
		
		// Get hours and minutes (time)
		var time = getCurrentTime();
			
		// Update Word Clock based on time
		wordClock.changeState(time.hour, time.minute);
		
		// Print grid (text)
		wordClock.printGrid("#clock-face-text");
		
		// Update big clock
		wordClock.updateBigGrid("big-letter", "#big-clock-letters");
	};
	
	
	// Display current time
	var updateCurrentTime = function(){
		var d = new Date();
		var t = d.toLocaleTimeString();
		document.getElementById("clock-text").innerHTML = t;
	};
	var clockIntervalID = setInterval(function(){updateCurrentTime();}, 1);
	
	
	// Initial run to update the clock in real time based on time
	var realTimeUpdateIntervalID = setInterval(function(){updateBasedOnCurrentTime();}, 1);
	
	
	// Display Word Clock using user input time
	
	// Method to call (to enable both button click and pressing enter key)
	var processInputTime = function(){
		
		// Read input and save hour and minute
		var customTime = $('input[name=input-time]').val();
		var timeArray = customTime.split(":");
		var hour = parseInt(timeArray[0], 0);
		var minute = parseInt(timeArray[1], 0);
		
		// Process if input is valid
		if(hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59)
		{
			// Hide bad input warning if shown
			$('#input-warning').hide();
			
			// Stop real time updates based on current time
			clearInterval(realTimeUpdateIntervalID);
			
			// Update Word Clock based on time
			wordClock.changeState(hour, minute);
			
			// Print grid (text)
			wordClock.printGrid("#clock-face-text");
			
			// Update big clock
			wordClock.updateBigGrid("big-letter", "#big-clock-letters");
		}
		else
		{
			$('#input-warning').show();
		}
	};
	
	// Button click
	$("#btn-input-time").click(function(){
		processInputTime();
	});
	
	// Keypress enter event
	$("#input-time-id").keypress(function(event){
		if(event.which === 13)
		{
			processInputTime();
		}
	});
	
	
	
	// Reset to updating the clock in real time based on time
	$("#btn-current-time").click(function(){
		
		// Stop real time updates based on current time to prevent multiple threads from running
		clearInterval(realTimeUpdateIntervalID);
		
		// Start it again
		realTimeUpdateIntervalID = setInterval(function(){updateBasedOnCurrentTime();}, 1);
	});
	
	
	// Print to console button
	$("#btn-console").click(function(){
		wordClock.printConsole();
	});
	
	
}

$(document).ready(main);
