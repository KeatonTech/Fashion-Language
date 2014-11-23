# Convert a raw number property into a value and a unit
window.fashion.$run.getUnit = (rawValue, varType, type=FASHION.type, unit=FASHION.unit) ->

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


	# Determine a color's format (expressed as a unit)
	getColorUnit = ()->
		if rawValue[0] is "#" then return {value: rawValue, unit: unit.Color.Hex}

		if rawValue.toLowerCase().indexOf("rgba") is 0 
			return {value: rawValue, unit: unit.Color.RGBA}
		if rawValue.toLowerCase().indexOf("rgb") is 0 
			return {value: rawValue, unit: unit.Color.RGB}

		# Otherwise it must be a const
		return {value: rawValue, unit: unit.Color.Const}

	# Run one of those two functions for numbers or colors
	if varType is type.Number then return getNumberUnit()
	if varType is type.Color then return getColorUnit()

	# Trim the quotation marks if necessary
	else if varType is type.String
		if rawValue[0] is "'" or rawValue[0] is "\""
			rawValue = rawValue.substring(1, rawValue.length - 1)

	return {value: rawValue, unit: undefined}