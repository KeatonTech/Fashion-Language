# Register the module that gets and sets dynamic variables
$wf.addRuntimeModule "variables", ["evaluation", "selectors", "types", "errors"],

	# This is shared functionality so we can just bind around the existing function
	getVariable: window.fashion.$shared.getVariable
	variableValue: (varName, element) -> 
		@getVariable(
			FASHION.variables, 
			FASHION.modules.globals, FASHION.modules.functions, FASHION.runtime,
			varName, element
		).value

	# Set a variable's value
	setVariable: (varName, value, scope = 0, element) ->
		vObj = FASHION.variables[varName]
		if !vObj then return @throwError "Variable '$#{varName}' does not exist"
		if vObj.mode is 0 then return @throwError "Cannot change static variables"

		if scope isnt 0 and element?
			scopeElement = @getParentForScope element, scope
			if scopeElement
				return @setScopedVariableOnElement scopeElement, varName, value

		### For now, it's your problem if you screw this up
		# Make sure the variable did not change type
		if @determineType(value) isnt vObj.type
			return @throwError "Cannot change type of '$#{varName}'"

		# Check to see if the unit changed
		unittedValue = @getUnit value, vObj.type, types
		if unittedValue.unit and unittedValue.unit != vObj.unit
			return @throwError "Cannot (yet) change unit of '$#{varName}'"
			#vObj.unit = unittedValue.unit

		if unittedValue.value then vObj.default = unittedValue.value
		else vObj.value = value
		###

		# Instead, just trust that the user knows what they're doing *gasp*
		vObj.values[scope] = value
		if !scope or scope is 0 then vObj.default = value
		@regenerateVariableDependencies varName, scope


	# Set a top-level variable
	regenerateVariableDependencies: (varName, scope = 0) ->
		vObj = FASHION.variables[varName]
		if !vObj.dependents[scope]? then return
		@regenerateBoundSelectors vObj.dependents[scope]


	# Register the module that gets and sets dynamic variables
	$initWatchers: ()->
		
		# Create the style object
		window[FASHION.config.variableObject] = styleObject = {}

		# Go through each variable
		for varName, varObj of FASHION.variables

			# Make the property object
			propObject = ((varName) =>
				get: ()=> FASHION.runtime.variableValue(varName)
				set: (newValue)=> FASHION.runtime.setVariable varName, newValue
			)(varName)

			# Add it as a property to the container
			Object.defineProperty styleObject, varName, propObject
			Object.defineProperty styleObject, "$" + varName, propObject
			