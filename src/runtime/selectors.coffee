$wf.addRuntimeModule "selectors", ["evaluation", "errors"],

	# Include the runtime modes
	runtimeModes: window.fashion.$runtimeMode

	# Update the CSS of a selector block
	regenerateSelector: (selectorId) ->

		# Handle individual selectors
		if typeof selectorId is 'string' and selectorId[0] is "i"
			selector = FASHION.individual[parseInt(selectorId.substr(1))]
			if !selector then @throwError "Could not find individual property #{selectorId}"

			# The 'individualized' module is not required by this one
			if !@updateSelectorElements
				return @throwError "The 'individualized' module was not included."

			# If the selector name changed, re-list the elements it applies to
			if @evaluate(selector.name) isnt selector.elementsSelector
				@updateSelectorElements selector

			# Recalculate the value for each selector
			@regenerateIndividualSelector selector


		# Handle dynamic / live selectors
		else

			# Get the selector
			selector = FASHION.selectors[selectorId]
			if !selector then return @throwError "Selector #{selectorId} does not exist"

			# Delete it from the stylesheet
			cssElem = document.getElementById "#{FASHION.config.cssId}"
			stylesheet = cssElem.sheet
			stylesheet.deleteRule selectorId

			# Add the regenerated selector
			stylesheet.insertRule @CSSRuleForSelector(selector), selectorId

	# CSS Templates
	CSSPropertyTemplate: window.fashion.$actualizer.cssPropertyTemplate
	CSSSelectorTemplate: window.fashion.$actualizer.cssSelectorTemplate

	# Generate a CSS rule for the given selector block
	CSSRuleForSelector: (selector, element, name) ->

		# Get the name of the selector
		selectorName = name || @evaluate(selector.name, element)

		# Loop over every property in the selector
		cssProperties = (for propertyObject in selector.properties

			if module = FASHION.modules.properties[propertyObject.name]
				evalFunction = @evaluate.bind(this, propertyObject.value, element)

				# The apply function is run at runtime
				if !module.apply then continue
				module.apply element, propertyObject.value, evalFunction

				if module.replace then continue

			value = @evaluate(propertyObject.value, element)
			@CSSPropertyTemplate(propertyObject.name, value)
		)

		# Return the templated selector
		return @CSSSelectorTemplate selectorName, cssProperties
