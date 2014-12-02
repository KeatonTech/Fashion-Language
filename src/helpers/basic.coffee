# Add unique values from one object to another
window.fashion.$extend = (object, anotherObject) ->
	for key, value of anotherObject
		if !object[key] then object[key] = value

# Combine two objects into one
window.fashion.$combine = (objects...) ->
	ret = {}
	window.fashion.$extend ret, obj for obj in objects
	return ret