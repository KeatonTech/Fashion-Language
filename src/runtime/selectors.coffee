$wf.addRuntimeModule "selectors", ["evaluation"],

	# Update the CSS of a selector block
	regenerateSelector: (selectorId) ->
		variables = FASHION.variables
		selectors = FASHION.selectors

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


	# Generate a CSS rule for the given selector block
	CSSRuleForSelector: (selectorObject) ->

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