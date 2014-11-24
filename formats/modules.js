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