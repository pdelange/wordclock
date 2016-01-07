// Original English version by jcjmartin
// https://github.com/jcjmartin/wordclock

// Dutch version by Peter de Lange
// https://github.com/pdelange/wordclock

// Word Clock class
function WordClock(bgColor, onColor, offColor)
{
	// Set colors (or use defaults)
   
	this.bgColor = typeof bgColor !== 'undefined' ? bgColor : "#000000";  		// Black
	this.onColor = typeof onColor !== 'undefined' ? onColor : "#FFFFFF";  		// White
	this.offColor = typeof offColor !== 'undefined' ? offColor : "#303030";  	// Dark Gray
	
	// String representation
	var letterArray = [
//Col012345678910
	"HETKISAVIJF", // Row 0
	"TIENATZVOOR", // Row 1
	"OVERMEKWART", // Row 2
	"HALFSPMOVER", // Row 3
	"VOORTHGÉÉNS", // Row 4
	"TWEEAMCDRIE", // Row 5
	"VIERVIJFZES", // Row 6
	"ZEVENONEGEN", // Row 7
	"ACHTTIENELF", // Row 8
	"TWAALFAMUUR"  // Row 9
	];
	
	// Block class (represents each letter and whether it is on) to use in grid representation below
	function Block(letter)
	{
		this.letter = letter;
		this.isOn = false;
	}
	
	// Initiate grid by populating 2D array according to the representation above
	var grid = function(){
		var grid = [];
		for(var row in letterArray)
		{
			grid.push([]);
			for(var col in letterArray[row])
			{
				grid[row].push(new Block(letterArray[row][col]));
			}
		}
		
		return grid;
	}();  // The () makes it return a value to assign to grid instead of passing a function
	
	// Change which "lights" are "on" based on the time
	// Takes time as a parameter instead of using current time to test/debug different times
	this.changeState = function(hour, minute){
		
		// Create a "bitmap" to represent blocks whose lights are on
		var onMap = letterArray.slice();
		var on = "*"; // Character to represent "on" lights
		
		// Returns a string of "on" bits based on the word to turn on and the "on" character
		var replacement = function(word, on){
			var ons = "";
			for(var index in word)
			{
				ons += on;
			}
			return ons;
		};
		
		// Turns the words on for the specified rows of onMap (method finds the words within the rows)
		var turnOn = function(firstRow, lastRow){
			for(var row = firstRow; row <= lastRow; row++)
			{
				for(var index in words)
				{
					var word = words[index];
					onMap[row] = onMap[row].replace(word, replacement(word, on));
				}
			}
		};
		
		// Turning on blocks follows the logic below
		
		// Creating an array of words to replace based on the logic below
		var words = []; // Words to turn on
		
		// The following logic applies to rows 0-1 only:
		
		// 'HET IS' is always on
		words.push("HET");
		words.push("IS");		
		
		// "Vijf" is displayed between xx:05 and xx:09 or between xx:25 and xx:29 or between xx:35 and xx:39 or between xx:55 and xx:59
		if(minute >= 5 && minute <= 9 || minute >= 25 && minute <= 29 || minute >= 35 && minute <= 39 || minute >= 55 && minute <= 59)
		{
			words.push("VIJF");
		}
		// "Tien" is displayed between xx:10 and xx:14 or between xx:20 and xx:24 or between xx:40 and xx:44  or between xx:50 and xx:54
		if(minute >= 10 && minute <= 14 || minute >= 20 && minute <= 24 || minute >= 40 && minute <= 44 || minute >= 50 && minute <= 54)
		{
			words.push("TIEN");
		}
		// Turn on words for rows 0-4
		turnOn(0,1);
		
		// Reset words
		words = [];
		
		// The following logic applies to rows 2-3 only:

		// "Kwart" is displayed between xx:15 and xx:19 or between xx:45 and xx:49
		if(minute >= 15 && minute <= 19 || minute >= 45 && minute <= 49)
		{
			words.push("KWART");
		}
		// "Half" is displayed between xx:20 and xx:44
		if(minute >= 20 && minute <= 44)
		{
			words.push("HALF");
		}
		// Turn on words for rows 2-3
		turnOn(2,3);
		
		// Reset words
		words = [];
		
		// The following logic applies to rows 1-2 only:

		// "Voor" is displayed between xx:20 and xx:29
		if(minute >= 20 && minute <= 29)
		{
			words.push("VOOR");
		}
		// "Over" is displayed between xx:35 and xx:44
		if(minute >= 35 && minute <= 44)
		{
			words.push("OVER");
		}
		// Turn on words for rows 1-2
		turnOn(1,2);
		
		// Reset words
		words = [];

		// The following logic applies to rows 3-4 only:

		// "Voor" is displayed between xx:05 and xx:19
		if(minute >= 05 && minute <= 19)
		{
			words.push("OVER");
		}
		// "Over" is displayed between xx:50 and xx:59
		if(minute >= 50 && minute <= 59)
		{
			words.push("VOOR");
		}
		// Turn on words for rows 3-4
		turnOn(3,4);
		
		// Reset words
		words = [];

		// The following logic applies to rows 5-9:
		
		// Create a date for comparison (assumes 12-hour format for hour)
		
		var hr = hour.toString();
		var min = minute.toString();
		
		// Format hours and minutes
		if(hour < 10) {hr = "0" + hour;}
		if(min < 10) {min = "0" + minute;}
		
		// Put the string together and parse it into a date object
		var strTime = hr + ":" + min;
		var clockTime = Date.parse("01/01/2011 " + strTime);
		
		// 'ÉÉN' is displayed between 12:35 and 12:59 or 01:00 and 01:34
		if(clockTime >= Date.parse("01/01/2011 12:35") && clockTime <= Date.parse("01/01/2011 12:59") || clockTime >= Date.parse("01/01/2011 01:00") && clockTime <= Date.parse("01/01/2011 01:34"))
		{
			words.push("ÉÉN");
		}
		
		// 'TWEE' is displayed between 01:35 and 02:34
		if(clockTime >= Date.parse("01/01/2011 01:35") && clockTime <= Date.parse("01/01/2011 02:34"))
		{
			words.push("TWEE");
		}
		
		// 'DRIE' is displayed between 02:35 and 03:34
		if(clockTime >= Date.parse("01/01/2011 02:35") && clockTime <= Date.parse("01/01/2011 03:34"))
		{
			words.push("DRIE");
		}
		
		// 'VIER' is displayed between 03:35 and 04:34
		if(clockTime >= Date.parse("01/01/2011 03:35") && clockTime <= Date.parse("01/01/2011 04:34"))
		{
			words.push("VIER");
		}
		
		// 'VIJF' is displayed between 04:35 and 05:34
		if(clockTime >= Date.parse("01/01/2011 04:35") && clockTime <= Date.parse("01/01/2011 05:34"))
		{
			words.push("VIJF");
		}
		
		// 'ZES' is displayed between 05:35 and 06:34
		if(clockTime >= Date.parse("01/01/2011 05:35") && clockTime <= Date.parse("01/01/2011 06:34"))
		{
			words.push("ZES");
		}
		
		// 'ZEVEN' is displayed between 06:35 and 07:34
		if(clockTime >= Date.parse("01/01/2011 06:35") && clockTime <= Date.parse("01/01/2011 07:34"))
		{
			words.push("ZEVEN");
		}
		
		// 'ACHT' is displayed between 07:35 and 08:34
		if(clockTime >= Date.parse("01/01/2011 07:35") && clockTime <= Date.parse("01/01/2011 08:34"))
		{
			words.push("ACHT");
		}
		
		// 'NEGEN' is displayed between 08:35 and 09:34
		if(clockTime >= Date.parse("01/01/2011 08:35") && clockTime <= Date.parse("01/01/2011 09:34"))
		{
			words.push("NEGEN");
		}
		
		// 'TIEN' is displayed between 09:35 and 10:34
		if(clockTime >= Date.parse("01/01/2011 09:35") && clockTime <= Date.parse("01/01/2011 10:34"))
		{
			words.push("TIEN");
		}
		
		// 'ELF' is displayed between 10:35 and 11:34
		if(clockTime >= Date.parse("01/01/2011 10:35") && clockTime <= Date.parse("01/01/2011 11:34"))
		{
			words.push("ELF");
		}
		
		// 'TWAALF' is displayed between 11:35 and 12:34
		if(clockTime >= Date.parse("01/01/2011 11:35") && clockTime <= Date.parse("01/01/2011 12:34"))
		{
			words.push("TWAALF");
		}
		
		// 'UUR' is displayed between xx:00 and xx:04
		if(minute >= 0 && minute <= 4)
		{
			words.push("UUR");
		}
		
		// Turn on words for rows 4-9
		turnOn(4,9);
		
		// After bitmap is set, turn on blocks in grid according to bitmap
		for(var row in onMap)
		{
			for(var col in onMap[row])
			{
				grid[row][col].isOn = onMap[row][col] === on;
			}
		}
		
	};
	
	
	// Print current grid state to console
	this.printConsole = function(){
		for(var row in grid)
		{
		  var line = "";
		  for(var col in grid[row])
		  {
			  if(grid[row][col].isOn)
			  {
				line += grid[row][col].letter[0];
			  }
			  else
			  {
				  line += "*";
			  }
		  }
		  console.log(line);
		}		
	};
	
	
	// Print current grid state as text to HTML ID
	// Can be printed anywhere and retain the defined colors
	this.printGrid = function(id){
		// Font and size definitions specific to the text version of the word clock
		var styleFont = "font-family: 'Lucida Console', Monaco, monospace;";
		var styleSize = "width: 230px; height: 220px; padding: 10px;";
		
		// Add style to HTML code
		var html = '<div style="' + styleFont + styleSize + 'background-color: ' + this.bgColor + '">';
		html += '<p style="text-align:center">';
		
		// Assemble multiline clock face
		for(var row in grid)
		{
			var line = "";
			for(var col in grid[row])
			{
				line += '<span style="color:';
				
				// If letter is on, use the on color
				if(grid[row][col].isOn)
				{
					line += this.onColor;
				}
				
				// Otherwise, use the off color
				else
				{
					line += this.offColor;
				}
				line += '">' + grid[row][col].letter[0] + "</span> ";
			}
			html += line + '<br>';
		}
		html += '</p></div>';
		
		// Assign HTML to the ID
		$(id).html(html);
	};
	
	// Update big grid with current grid state
	// Assumes a class exists to style each letter block
	this.updateBigGrid = function(blockClassName, id){
		var html = "";
		for(var row in grid)
		{
			for(var col in grid[row])
			{
				var letter = '<span style="color:';
				
				// If the letter is on, use the on color
				if(grid[row][col].isOn)
				{
					letter += this.onColor;
				}
				
				// Otherwise, use the off color
				else
				{
					letter += this.offColor;
				}
				
				letter += '">' + grid[row][col].letter + "</span> ";
				
				// Add a div for the letter block
				html += '<div class="' + blockClassName + '">' + letter + '</div>';
			}
		}
		
		// Assign HTML to the ID
		$(id).html(html);
	};
}
