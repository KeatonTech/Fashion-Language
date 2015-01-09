# Adds a variable object
window.fashion.$parser.addVariable = (parseTree, name, value, flag, scope) ->

	# Parse the value into an expression if necessary
	value = $wf.$parser.parseSingleValue(value, parseTree, true)

	# Make a variable object
	variableObject = new Variable name, value, scope
	if flag is "!static" then variableObject.mode = $wf.$runtimeMode.static
	parseTree.addVariable variableObject

	# If the variable is an expression, just pull the types out of that
	if value instanceof Expression
		type = value.type
		unit = value.unit

	# Otherwise, generate the unit and type from the constant value
	else
		
		# Make sure the variable has a constant value
		val = variableObject.raw || variableObject.value
		if !val then return

		# Add a type
		type = window.fashion.$shared.determineType(val, $wf.$type, $wf.$typeConstants)

		# Add units, if necessary
		unittedValue = window.fashion.$shared.getUnit(val, type, $wf.$type, $wf.$unit)
		typedValue = unittedValue['value']
		unit = unittedValue['unit']

	# Update the variable object
	variableObject.annotateWithType type, unit, typedValue