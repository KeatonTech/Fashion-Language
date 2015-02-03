$wf.$extend window.fashion.$functions, 
	
	"@": new FunctionModule
		output: $wf.$type.Number
		unit: ''
		dynamic: true
		requires: ["DOMWatcher"]

		# Get the value
		evaluate: (selector, property, element) -> 
			if !element then element = document
			matched = @querySelector selector.value
			style = @getComputedStyle matched
			return style[property.value]

		# Watch the value for changes
		watch: (selector, property, element) ->
			console.log arguments