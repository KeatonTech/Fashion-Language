# Helper function to splice a string into another string
window.fashion.$parser.spliceString = (string, start, length, replacement) ->
	string.substr(0, start) + replacement + string.substr(start + length)

# Convert an expression string into an object containing a javascript function
# TODO(keatontech): Break this up into multiple sub-40-line functions
window.fashion.$parser.parseExpression = (expressionString, vars, funcs, globals) ->
	strSplice = window.fashion.$parser.spliceString
	string = expressionString

	# Track different things about this expression
	dependencies = []
	functions = []
	unit = undefined

	# Detect functions and variables
	regex = ///(
			\$([\w\-]+)|			# Defined variable
			\@([\w\-]+)|			# Global variable
			(this|self|parent)|		# Relative variable
			([\-]{0,1}				# Number with unit (negative)
			([\.]{0,1}\d+|			# Number with unit (decimal at beginning)
			\d+(\.\d*)?)			# Number with unit (decimal in middle)
			[a-zA-Z]{1,4})|			# Number with unit (unit)
			([\w\-]*)\(|			# Function definition
			\)						# Track depth
			)///g

	# Only top level variables, functions and numbers count for units
	depth = 0
	stringOffset = 0
	topLevelTypeUnit = []
	individualized = false

	# Handle each piece
	while section = regex.exec expressionString
		si = section.index + stringOffset

		# Local variable
		if section[2]
			vObj = vars[section[2]]
			if !vObj then console.log "[FASHION] Variable $#{section[2]} does not exist."
			else
				dependencies.push "$" + section[2]
				if depth is 0 then topLevelTypeUnit.push [vObj.type, vObj.unit]
				stringOffset += "v.#{section[2]}.value".length - section[0].length
				string = strSplice string, si, section[0].length, "v.#{section[2]}.value"

		# Global variable
		else if section[3]
			section[3] = section[3].toLowerCase()
			gObj = globals[section[3]]
			if !gObj then console.log "[FASHION] Global @#{section[3]} does not exist."
			else
				dependencies.push "@" + section[3]
				if depth is 0 then topLevelTypeUnit.push [gObj.type, gObj.unit]
				stringOffset += "g.#{section[3]}.get()".length - section[0].length
				string = strSplice string, si, section[0].length, "g.#{section[3]}.get()"

		# Relative variable
		else if section[4]
			individualized = true
			if section[4] is "parent"
				stringOffset += "this.parent".length - section[0].length
				string = strSplice string, si, section[0].length, "this.parent"
			else
				stringOffset += "this".length - section[0].length
				string = strSplice string, si, section[0].length, "this"

		# Number with unit
		else if section[5]
			numberType = window.fashion.$type.Number
			unittedValue = window.fashion.$run.getUnit(section[5],
				numberType, window.fashion.$type, window.fashion.$unit)
			if unittedValue.value is NaN then unittedValue.value = 0
			if depth is 0 then topLevelTypeUnit.push [numberType, unittedValue.unit]
			stringOffset += unittedValue.value.toString().length - section[0].length
			string = strSplice string, si, section[0].length, unittedValue.value.toString()

		# Function
		else if section[7]
			depth++
			fObj = funcs[section[7]]
			if !fObj then console.log "[FASHION] Function '#{section[7]}' does not exist."
			else
				functions.push section[7]
				if depth is 1 then topLevelTypeUnit.push [fObj.output, false]
				stringOffset += "f.#{section[7]}(".length - section[0].length
				string = strSplice string, si, section[0].length, "f.#{section[7]}("

		# Closing parenthesis
		else if section[0] is ")" then depth--

	# Determine the unit
	for typeUnit in topLevelTypeUnit
		if typeUnit[1]
			if !unit then unit = typeUnit[1]
			else if unit != typeUnit[1]
				console.log "[FASHION] Conflicting units '#{unit}' and '#{typeUnit[1]}'"
				console.log "[FASHION] Unit conversion will be implemented in the future"
				return ""

	# Create the function
	script = "return (#{string}) + '#{unit || ''}'"
	evaluate = Function("v", "g", "f", script)

	# Return the expression object
	return {
		dependencies: dependencies
		functions: functions
		dynamic: dependencies.length > 0
		evaluate: evaluate
		script: script
		individualized: individualized
		unit: unit
	}

