# Functions that are included in the compiled JS and run on the client.
# Must be run with self set to either window.fashion.$run or FASHION.runtime
# Note: These will only be minified if you run the minified Fashion compiler.
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
	updateSelector: (name, variables, selectors, map, allowNonexistant = false) ->

		# Defaults (set here to keep the function definition under 93 chars)
		if !variables then variables = FASHION.variables
		if !selectors then selectors = FASHION.selectors
		if !map then map = FASHION.cssMap

		# Deal with dynamic selectors
		if selectors.dynamic[name]
			properties = selectors.dynamic[name]

			# Check that everything is as it should be
			if !properties then return @throwError "Could not find selector '#{name}'"
			location = map[name]
			if !location and !allowNonexistant
				return @throwError "Could not find selector '#{name}' in CSS"

			# Delete the existing rule, or make a new one
			if location
				cssElem = document.getElementById("#{FASHION.config.cssId}#{location[0]}")
				cssElem.sheet.deleteRule location[1]
			else 
				cssElem = document.getElementById("#{FASHION.config.cssId}0")
				map[name] = location = [0, cssElem.sheet.rules.length]

			# Add the regenerated selector
			cssElem.sheet.insertRule @regenerateSelector(name, properties), location[1]

		# Deal with individualized selectors
		if selectors.individual[name]
			individualProps = selectors.individual[name]
			if individualProps then @applyIndividualizedSelectors selectors.individual


	# Add new properties to a selector
	addProperties: (name, properties, overwrite = true, selectors) ->

		# Defaults (set here to keep the function definition under 93 chars)
		if !selectors then selectors = FASHION.selectors

		# Add the selector, if necessary
		if !selectors.dynamic[name] then selectors.dynamic[name] = {}

		# Start adding stuff
		for property, valueObject of properties
			if selectors.dynamic[name][property] and !overwrite then continue
			selectors.dynamic[name][property] = valueObject

		# Update this selector, or create it if necessary
		@updateSelector name, false, selectors, false, true


	# Generate a selector from its dynamic properties
	regenerateSelector: (selector, properties, variables = FASHION.variables) ->
		# Separate styles based on whether or not they'll actually change
		expandedSelector = @expandVariables selector
		dynamicSelector = expandedSelector isnt selector
		dynamicProps = "#{expandedSelector} {"

		# Loop over every property in the selector
		for property, valueObject of properties

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
# @prepros-append "../shared/evaluation.coffee"
# @prepros-append "../shared/types.coffee"
# @prepros-append "../shared/units.coffee"
# @prepros-append "./dom/individualized.coffee"
# @prepros-append "./dom/watch-vars.coffee"