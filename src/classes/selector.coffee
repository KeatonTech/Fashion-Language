# Represents a selector
class Selector

	# Create a selector object, which is really pretty boring
	constructor: (name) -> 
		@name = name
		@properties = []
		@index = -1

	# Add a raw, unparsed body
	addToBody: (bodyString) -> 
		if !@body then @body = ""
		@body += bodyString

	# When it's parsed, add a property
	addProperty: (property) ->
		@body = undefined # No longer needed
		@properties.push property


window.fashion.$class.Selector = Selector