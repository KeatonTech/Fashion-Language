# Determines and handles variable types
window.fashion.$run.determineType = (value, types = FASHION.type, constants = FASHION.constants) ->

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

		# Check if it's a named color
		if value in constants.colors
			return types.Color

	# COMPOSITE TYPES ======================================================================

	# Map of composite types and their contained types
	# Uses type IDs from ./types.coffee
	compositeTypeMap = {
		C2Number: 	[0, 0]
		C4Number: 	[0, 0, 0, 0]
		CBorder: 	[[0, 103, 2], [104, 0, 103, 2]]
	}

	# Determine the type of a composite value, such as padding
	determineCompositeType = (value) ->

	#=======================================================================================

	# Determine if the value is singular or composite
	if value.indexOf(" ") is -1
		return determineSinglePartType(value)
	else
		return determineCompositeType(value)
