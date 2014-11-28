# Runtime methods are also used in the compile step and 
# as such are stored as functions
# Functions must be run with self set to either window.fashion.$run or FASHION.runtime
window.fashion.$run = 

	# Throws an error to the console
	throwError: (message) -> console.log "[FASHION] " + message

	# Updates a variable's value and name, if possible
	# Errors out of the variable's type would change
	updateVariable: (name, value, variables = FASHION.variables, types = FASHION.type) ->
		vObj = variables[name]
		if !vObj then return @throwError "Variable '$#{name}' does not exist"

		# Make sure the variable did not change type
		if @determineType(value) isnt vObj.type
			return @throwError "Cannot change type of '$#{name}'"

		# Check to see if the unit changed
		vObj.raw = value
		unittedValue = @getUnit value, vObj.type, types
		if unittedValue.unit and unittedValue.unit != vObj.unit
			vObj.unit = unittedValue.unit

		if unittedValue.value then vObj.value = unittedValue.value
		else vObj.value = vObj.raw

		# Update all of the dependants
		for selector, properties of vObj.dependants
			@updateSelector selector


	# Refresh the values for a selector
	updateSelector: (name, variables, selectors, map) ->

		# Defaults (set here to keep the function definition under 93 chars)
		if !variables then variables = FASHION.variables
		if !selectors then selectors = FASHION.selectors.dynamic
		if !map then map = FASHION.cssMap

		# Load what we need
		properties = selectors[name]
		if !properties then return @throwError "Could not find selector '#{name}'"
		location = map[name]
		if !location then return @throwError "Could not find selector '#{name}' in CSS"

		# Get the sheet that contains the selector
		cssElem = document.getElementById("#{FASHION.config.cssId}#{location[0]}")

		# Swap out the selector
		cssElem.sheet.deleteRule location[1] 
		cssElem.sheet.insertRule @regenerateSelector(name, properties), location[1]

	# Generate a selector from its dynamic properties
	regenerateSelector: (selector, properties, variables = FASHION.variables) ->
		# Separate styles based on whether or not they'll actually change
		expandedSelector = @expandVariables selector
		dynamicSelector = expandedSelector isnt selector
		dynamicProps = "#{expandedSelector} {"

		# Loop over every property in the selector
		for property, valueObject of properties
			if dynamicSelector or valueObject.dynamic is true

				# Evaluate the current string value
				val = @evaluate valueObject, undefined, variables
				dynamicProps += "#{property}: #{val};"

		return dynamicProps + "}"

	# Make sure any variables in a selector's name are expanded
	expandVariables: (dynamicString,  variables = FASHION.variables) ->
		dynamicString.replace /\$([\w\-]+)/g, (match, varName) ->
			if variables[varName]
				return variables[varName].value
			else return ""

# Includes
# @prepros-append "./evaluation.coffee"
# @prepros-append "./observer.coffee"
# @prepros-append "./types.coffee"
# @prepros-append "./units.coffee"
# @prepros-append "./dom.coffee"