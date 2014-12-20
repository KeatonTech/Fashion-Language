# Determines and handles variable types
window.fashion.$shared.determineType = (value, types, constants) ->

	# Try the easy stuff first
	if typeof value is 'number' then return types.Number

	# SINGULAR TYPES =======================================================================

	# Determine the type of a single value, such as font-size
	determineSinglePartType = (value) ->

		# Check if it's a string
		if value[0] is "\"" or value[0] is "'"
			return types.String

		# Check if it's a number
		if (value.charCodeAt(0) > 47 and value.charCodeAt(0) < 58) or
		   value[0] == '-' or value[0] == '.'
			return types.Number

		# Check if it's a custom color
		if value[0] is "#" or value.toLowerCase().indexOf("rgb") is 0
			return types.Color

		# Check if it's a custom type
		return determineConstantType(value) || window.fashion.$type.Unknown

	# Determine the type of a constant value, such as display
	determineConstantType = (value) ->
		if !constants then return types.Unknown;

		# Check if it's a named color
		if constants.colors and value in constants.colors
			return types.Color

	# Go!
	return determineSinglePartType(value)
	