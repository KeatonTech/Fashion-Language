# Add unique values from one object to another
window.fashion.$extend = (object, anotherObject) ->
	for key, value of anotherObject
		if !object[key] then object[key] = value

# Combine two objects into one
window.fashion.$combine = (objects...) ->
	ret = {}
	window.fashion.$extend ret, obj for obj in objects
	return ret

# Build an array out of a number of smaller arrays
window.fashion.$buildArray = (arrays...) ->
	ret = []
	for arr in arrays
		if arr instanceof Array
			ret.push.apply(ret, arr)
		else if arr
			ret.push arr
	return ret