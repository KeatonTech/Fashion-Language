# Represents a selector
class Selector

	# Create a selector object, which is really pretty boring
	constructor: (name) -> 
		@name = name
		@properties = []

	# Add a raw, unparsed body
	setBody: (bodyString) -> @body = bodyString

	# When it's parsed, add a property
	addProperty: (property) ->
		@body = undefined # No longer needed
		@properties.push property