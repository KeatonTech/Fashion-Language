window.fashion.$shared.getVariable =
(variables, globals, funcs, runtime, varName, scope, elem) ->
	vObj = variables[varName]
	if !vObj
		console.log "[FASHION] Could not find variable '#{varName}'"
		return {value: undefined}

	# Single, set variables
	if typeof vObj is 'string' or typeof vObj is 'number' then return value: vObj

	# Parsetree variables -- sent by the actualizer
	if vObj[0] then return vObj[0]

	# Scoped variables
	if scope and scope isnt 0
		if !vObj.values[scope]
			@throwError "$#{varName} does not have a value for scope '#{scope}'"

		if elem? and @getScopeOverride?
			scopeVal = @getScopeOverride(elem, varName, scope) || vObj.values[scope]
		else scopeVal = vObj.values[scope]

		indMode = @runtimeModes?.individual || $wf?.$runtimeMode?.individual
		if (scopeVal.mode & indMode) is indMode then return 0

		if scopeVal.evaluate
			return value: @evaluate scopeVal, variables, globals, funcs, runtime, elem
		else return value: scopeVal

	# Top-level variables
	else if vObj.default isnt undefined
		if vObj.default.evaluate
			return value: @evaluate vObj.default, variables, globals, funcs, runtime, elem
		else return value: vObj.default 

	# Variable doesn't exist, I guess
	else @throwError "Variable '#{varName}' does not exist."


# Turn a value object into an actual string value for the sheet
window.fashion.$shared.evaluate =
(valueObject, variables, globals, funcs, runtime, element, cssMode = true) ->
	isImportant = false
	iMode = @runtimeModes?.individual || $wf?.$runtimeMode?.individual

	# Evaluates a single value, not an array
	evaluateSingleValue = (valueObject) =>

		if !valueObject?
			console.log "[FASHION] Could not evaluate empty value object"
			return console.log new Error().stack

		# Take care of the easy stuff
		if typeof valueObject is "string" then return valueObject
		if typeof valueObject is "number" then return valueObject

		# Create a variable lookup function
		varObjects = []
		varLookup = (varName, scope, element) => 
			vObj = @getVariable variables, globals, funcs, runtime, varName, scope, element
			varObjects.push {name: varName, object: vObj, value: vObj.value, scope: scope}
			return vObj

		# Create the element property lookup function, if necessary
		# This requires the 'elements' module to be installed and only works on runtime
		if ((valueObject.mode & iMode) is iMode or element?) and @elementFunction?
			if !element?
				return @throwError "Expression requires element but none provided"
			elmLookup = @elementFunction element
			if !elmLookup? then return @throwError "Could not generate element function"
		else elmLookup = () -> return 0

		# Handle expressions
		if valueObject.evaluate
			try
				val = valueObject.evaluate varLookup, globals, funcs, runtime, elmLookup
			catch e
				console.log "[FASHION] Could not evaluate: #{valueObject.evaluate}"
				console.log e
				return console.log e.stack

			if valueObject.important is true then isImportant = true

			# Check to see if the expression changed any variable values
			if valueObject.setter
				for v in varObjects when v.object.value isnt v.value
					@setVariable v.name, v.object.value, v.scope, element

			return val

		# Handle valued objects (used with transitiong)
		else if valueObject.value then return valueObject.value

	# Get the suffix to use on the property, but leave it out if we're not in 'css mode'
	addSuffix = (property, isImportant) -> 
		if isImportant and cssMode then property+" !important" else property

	# Check to see if this is an array of values
	if valueObject instanceof Array
		if valueObject.length is 0 then return ''

		# We have a comma-separated multi-part property 
		if valueObject[0] instanceof Array
			return addSuffix (
				(evaluateSingleValue(vi) for vi in vo).join(' ') for vo in valueObject
			).join(', '), isImportant

		# We have a multi-value property
		else
			string = (evaluateSingleValue(value) for value in valueObject).join(' ')
			return addSuffix string, isImportant

	# Nope, just one value
	else return addSuffix evaluateSingleValue(valueObject), isImportant
