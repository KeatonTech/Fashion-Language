// Functions
functionName: {
	"output": FASHION.type.Number, // Output type
	"unitFrom": 0, // Output in the same unit as the first argument
	"unit": "px",  // Don't use with unitFrom. Hard-code a unit
	"evaluate": function(n){ Math.round(n); } // Function body
}

// Globals
globalName: {
	"type": FASHION.type.Number,
	"unit": "px", // Output unit

	// Getter function for the variable
	"get": function(){ return window.innerWidth; },

	// Runs once, watches for changes to the value to update elements
	"watch": function(onchange){
		// Don't actually use this method, it's slow
		lastVal = window.innerWidth;
		setInterval(function(){
			if( window.innerWidth != lastVal ) {
				lastVal = window.innerWidth;
				onchange()
			}
		})
	}
}

// Properties
"property-name": {

	// Occurs during the compile process
	// This function is run on a 'this' scope with the following properties
	// These properties are also passed in a second argument, for the 'this'-averse
	// {
	// 		setProperty(name, value): Sets a property while respecting inheritance
	//		getProperty(name): Gets the value of another property in the selector
	//		getType(value): Returns the data type of a value, in terms of FASHION.type
	//		getUnit(value): Returns the unit of a numerical value
	//		addScript(javascript): Injects javascript into the compiled results
	//		getSelector(): Returns the name of the current selector
	// }
	// Returns an error if the property could not be added

	"compile": function(value, self) {},

	// Occurs during runtime for each matched element
	"apply": function(value, element) {},

	// True if the property should be entirely removed from the original CSS
	"replace": false,

	// Optionally add functions to the compiled fashion runtime
	"runtimeKey": "propertyName",
	"runtimeObject": {
		"usefulFunction": function() {console.log("I'm useful");}
	}
}

// Blocks
blockName: {

	// Occurs during the compile process
	// This function is run on a this scope with the following properties
	// These properties are also passed in a second argument, for the 'this'-averse
	// {
	// 		addSheet(): Creates a new CSS stylesheet and returns a reference to it
	//		addRule(sheet, selector, rule): Adds a CSS rule to the stylesheet
	//		getProperty(selector, name): Gets the value of a property in any sheet
	//		addScript(javascript): Injects javascript into the compiled results
	// }
	// Returns an error if the block could not be added

	"compile": function(value) {},

	// Optionally add functions to the compiled fashion runtime
	"runtimeKey": "propertyName",
	"runtimeObject": {
		"usefulFunction": function() {console.log("I'm useful");}
	}
}