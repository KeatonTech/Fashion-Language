# Convert a raw number property into a value and a unit
window.fashion.$shared.getUnit = (rawValue, varType, type, unit) ->

	# Try the easy stuff first
	if typeof rawValue is 'number' then return {value: parseFloat(rawValue), unit: false}


	# Parse a number into a number plus a unit
	getNumberUnit = ()->

		# Split into components
		splitRegex = /([0-9\-\.]*)(.*?)/
		components = splitRegex.exec rawValue
		if components.length < 2 then return {value: parseFloat(rawValue), unit: false}

		# Figure out what unit this is
		unitString = rawValue.replace(components[1],"")
		unit = unit.Number[unitString]
		if !unit then return {value: parseFloat(components[1]), unit: false}

		# Return the a unit-variable construct, return a number and a unit
		return {value: parseFloat(components[1]), unit: unit}

	# Run one of those two functions for numbers or colors
	if varType is type.Number then return getNumberUnit()

	# Trim the quotation marks if necessary
	else if varType is type.String
		if rawValue[0] is "'" or rawValue[0] is "\""
			rawValue = rawValue.substring(1, rawValue.length - 1)

	return {value: rawValue, unit: undefined}

# CONVERSION METHODS

# Convert time to milliseconds
window.fashion.$shared.timeInMs = (valueObject) ->
	if valueObject.unit is "ms" then return valueObject.value
	else if valueObject.unit is "s" then return valueObject.value * 1000
	else return parseInt valueObject.value