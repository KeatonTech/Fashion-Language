# Represents a selector
class Selector

	# Create a selector object, which is really pretty boring
	constructor: (name, mode) -> 
		@rawName = @name = name
		@properties = {length: 0}
		@_propertyIntIndex = 0
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
		if !property.id 
			property.id = @_propertyIntIndex
			@properties[@_propertyIntIndex++] = property
		else @properties[property.id] = property
		@properties.length++

	# Insert a new property in at a given index
	insertProperty: (property, index) ->
		@body = undefined # Signals that the body is no longer needed

		# Figure out where to add this
		for i in [0...1000]
			if !@properties[index + i/1000]? then break
		index = index + i/1000

		# Add the property
		if !property.id then property.id = index
		@properties[index] = property
		@properties.length++

	# Delete property
	deleteProperty: (index) ->
		delete @properties[index]
		@properties.length--

	# ITERATION
	# Run a function for each property with a given name
	forEachPropertyNamed: (name, run)->
		for property in @properties
			if property.name is name
				if run.call(this, property) is false then return


window.fashion.$class.Selector = Selector