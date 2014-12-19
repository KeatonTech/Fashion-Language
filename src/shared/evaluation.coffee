window.fashion.$shared.getVariable =
(variables, globals, funcs, runtime, varName, elem) ->
	vObj = variables[varName]
	if !vObj
		console.log "[FASHION] Could not find variable '#{varName}'"
		return {value: undefined}

	# Parsetree variables -- sent by the actualizer
	if vObj[0] then return vObj[0]

	# Scoped variables
	if vObj.scope and vObj.scope.length > 0
		@throwError "Scoped variables are not yet supported"

	# Top-level variables
	else if vObj.default 
		if vObj.default.script
			return value: @evaluate vObj.default, variables, globals, funcs, runtime, elem
		else return value: vObj.default 

	# Variable doesn't exist, I guess
	else @throwError "Variable '#{varName}' does not exist."


# Turn a value object into an actual string value for the sheet
window.fashion.$shared.evaluate =
(valueObject, variables, globals, funcs, runtime, element) ->

	# Evaluates a single value, not an array
	evaluateSingleValue = (valueObject) =>

		# Take care of the easy stuff
		if typeof valueObject is "string" then return valueObject
		if typeof valueObject is "number" then return valueObject

		# Create a variable lookup function
		varObjects = []
		varLookup = (varName, element) => 
			vObj = @getVariable variables, globals, funcs, runtime, varName, element
			varObjects.push {object: vObj, value: vObj.value}
			return vObj

		# Handle expressions
		if valueObject.evaluate
			val = valueObject.evaluate varLookup, globals, funcs, runtime, element

			# Check to see if the expression changed any variable values
			if valueObject.setter
				for v in varObjects when v.object.value isnt v.value
					@setVariable v.object.name, v.object.value

			return val

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

