# Custom stringifier that includes functions
window.fashion.$stringify = (value) ->
	switch typeof value
		when "string" then JSON.stringify value
		when "object" then window.fashion.$stringifyObject value
		when "array" then window.fashion.$stringifyArray value
		when "number" then value
		when "undefined" then "undefined"
		else value.toString()

# Convert a javascript object into a string
window.fashion.$stringifyObject = (object) ->
	propStrings = []
	for property, value of object when object.hasOwnProperty property
		property = property.replace("'","\'")
		propStrings.push "'#{property}': #{window.fashion.$stringify value}"
	return "{#{propStrings.join(',\n')}}"


# Convert a javascript array into a string
window.fashion.$stringifyArray = (array) ->
	propStrings = []
	for value in object
		propStrings.push window.fashion.$stringify value
	return "{#{propStrings.join(',')}}"