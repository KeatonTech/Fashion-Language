# Adds a variable object
window.fashion.$parser.addVariable = (parseTree, name, value, flag, scopeSelector) ->
	if flag is "!important" then throw new FSImportantVarError name

	# Parse the value into an expression if necessary
	FSSVal = value
	value = $wf.$parser.parsePropertyValues(value, parseTree, scopeSelector, true)
	if value instanceof Array
		throw new FSMultipartVariableError name, JSON.stringify value

	# Do not allow individualized expressions on non-nested variables
	indMode = $wf.$runtimeMode.individual
	if value.mode and (value.mode & indMode) is indMode
		if !scopeSelector
			throw new FSIndividualVarError name, FSSVal

		# We'll need some special functionality to deal with this at runtime
		parseTree.addRequirements [$wf.$runtimeCapability.scopedIndividual]

	# Make a variable object
	variableObject = new Variable name, value, scopeSelector?.name
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