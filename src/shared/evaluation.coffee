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
	else if vObj.default isnt undefined
		if vObj.default.script
			return value: @evaluate vObj.default, variables, globals, funcs, runtime, elem
		else return value: vObj.default 

	# Variable doesn't exist, I guess
	else @throwError "Variable '#{varName}' does not exist."


# Turn a value object into an actual string value for the sheet
window.fashion.$shared.evaluate =
(valueObject, variables, globals, funcs, runtime, element, cssMode = true) ->
	isImportant = false

	# Evaluates a single value, not an array
	evaluateSingleValue = (valueObject) =>

		# Take care of the easy stuff
		if typeof valueObject is "string" then return valueObject
		if typeof valueObject is "number" then return valueObject

		# Create a variable lookup function
		varObjects = []
		varLookup = (varName, element) => 
			vObj = @getVariable variables, globals, funcs, runtime, varName, element
			varObjects.push {name: varName, object: vObj, value: vObj.value}
			return vObj

		# Handle expressions
		if valueObject.evaluate
			val = valueObject.evaluate varLookup, globals, funcs, runtime, element
			if valueObject.important is true then isImportant = true

			# Check to see if the expression changed any variable values
			if valueObject.setter
				for v in varObjects when v.object.value isnt v.value
					@setVariable v.name, v.object.value

			return val

		# Handle valued objects (used with transitiong)
		else if valueObject.value then return valueObject.value

	# Get the suffix to use on the property, but leave it out if we're not in 'css mode'
	getSuffix = (isImportant) -> if isImportant and cssMode then " !important" else ""

	# Check to see if this is an array of values
	if valueObject instanceof Array
		if valueObject.length is 0 then return ''

		# We have a comma-separated multi-part property 
		if valueObject[0] instanceof Array
			return (
				(evaluateSingleValue(vi) for vi in vo).join(' ') for vo in valueObject
			).join(', ') + getSuffix(isImportant)

		# We have a multi-value property
		else
			string = (evaluateSingleValue(value) for value in valueObject).join(' ')
			return string + getSuffix(isImportant)

	# Nope, just one value
	else return evaluateSingleValue(valueObject) + getSuffix(isImportant)
