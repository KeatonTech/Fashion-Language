$wf.$extend window.fashion.$functions, 
	
	"@": new FunctionModule
		output: $wf.$type.Number
		unit: ''
		dynamic: true
		evaluate: (selector, property, element) -> 
			if !element then element = document
			matched = @querySelector selector.value
			style = @getComputedStyle matched
			return style[property.value]