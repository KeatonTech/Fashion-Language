# Represents a selector
class Selector

	# Create a selector object, which is really pretty boring
	constructor: (name) -> 
		@name = name
		@properties = []
		@index = -1

		# Selectors with variables in the name are dynamic
		if name instanceof Expression then @mode = $wf.$runtimeMode.dynamic
		else @mode = $wf.$runtimeMode.static

	# Add a raw, unparsed body
	addToBody: (bodyString) -> 
		if !@body then @body = ""
		@body += bodyString

	# When it's parsed, add a property
	addProperty: (property) ->
		@body = undefined # No longer needed
		@properties.push property


window.fashion.$class.Selector = Selector