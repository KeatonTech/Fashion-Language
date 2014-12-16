# Get the string value of a variable
window.fashion.$run.getVariable = (variables, varName) ->
	if !variables[varName] then return ""
	vobj = variables[varName]

	# Numbers should be rendered with units
	if vobj.type is type.Number
		return vobj.value + (vobj.unit || "")

	# Everything else can just get sent normally
	else return vobj.value

# Turn a value object into an actual string value for the sheet
window.fashion.$run.evaluate = (valueObject, element, variables, globals, funcs) ->
	if !variables then variables = FASHION.variableProxy
	if !funcs then funcs = FASHION.functions
	if !globals then globals = FASHION.globals
	runtime = if window.FASHION then w.FASHION.runtime else $wf.$run

	# Create a variable lookup function
	varLookup = (varName) -> variables[varName].default

	# Evaluates a single value, not an array
	evaluateSingleValue = (valueObject) ->

		# Take care of the easy stuff
		if typeof valueObject is "string" then return valueObject
		if typeof valueObject is "number" then return valueObject

		# Handle expressions
		else if valueObject.evaluate
			return valueObject.evaluate varLookup, globals, funcs, runtime, element

		# Handle valued objects (used with transitiong)
		else if valueObject.value then return valueObject.value


	# Check to see if this is an array of values
	if valueObject instanceof Array
		if valueObject.length is 0 then return ''

		# We have a comma-separated multi-part property 
		if valueObject[0] instanceof Array
			return (
				(evaluateSingleValue(vi) for vi in vo).join(' ') for vo in valueObject
			).join(', ')

		# We have a multi-value property
		else
			return (evaluateSingleValue(value) for value in valueObject).join(' ')

	# Nope, just one value
	else return evaluateSingleValue(valueObject);

