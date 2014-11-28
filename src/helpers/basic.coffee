window.fashion.$extend = (object, anotherObject) ->
	for key, value of anotherObject
		if !object[key] then object[key] = value