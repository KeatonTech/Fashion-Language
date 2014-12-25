# Represents a selector
class Selector

	# Create a selector object, which is really pretty boring
	constructor: (name, mode) -> 
		@rawName = @name = name
		@properties = []
		@index = -1

		# Selectors with variables in the name are dynamic
		if mode then @mode = mode
		else if name instanceof Expression then @mode = $wf.$runtimeMode.dynamic
		else @mode = $wf.$runtimeMode.static

	# Add a raw, unparsed body
	addToBody: (bodyString) -> 
		if !@body then @body = ""
		@body += bodyString

	# When it's parsed, add a property
	addProperty: (property) ->
		@body = undefined # Signals that the body is no longer needed
		if !property.id then property.id = @properties.length
		@properties.push property

	# Insert a new property in at a given index
	insertProperty: (property, index) ->
		@body = undefined # Signals that the body is no longer needed
		if !property.id then property.id = @properties.length
		@properties.splice index, 0, property

	# ITERATION
	# Run a function for each property with a given name
	forEachPropertyNamed: (name, run)->
		for property in @properties
			if property.name is name
				if run.call(this, property) is false then return


window.fashion.$class.Selector = Selector