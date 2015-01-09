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


	# Set the value of a variable
	setVariable: (varName, value, element) ->
		if element is undefined then return @setTopLevelVariable varName, value
		console.log "Scoped variable setting coming soon"


	# Set a top-level variable
	setTopLevelVariable: (varName, value) ->
		vObj = FASHION.variables[varName]
		if !vObj then return @throwError "Variable '$#{varName}' does not exist"
		if vObj.mode is 0 then return @throwError "Cannot change static variables"

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
		vObj.default = value
		@updateDependencies varName


	# Set a top-level variable
	updateDependencies: (varName) ->
		vObj = FASHION.variables[varName]

		# Update all of the dependents
		for bindLink in vObj.dependents

			# If the dependency is a variable, go through and update all its stuff
			if bindLink[0] is "v"
				@updateDependencies bindLink[1]

			# Bound to a specific property that we can just update
			else if bindLink.length is 3
				@setPropertyOnSelector bindLink[0], bindLink[1], bindLink[2]

			# Bound to an entire selector that will need to be regenerated
			else
				@regenerateSelector bindLink[0], bindLink[1]


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
			