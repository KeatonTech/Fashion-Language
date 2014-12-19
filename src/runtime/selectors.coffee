$wf.addRuntimeModule "selectors", ["evaluation", "errors"],

	# Include the runtime modes
	runtimeModes: window.fashion.$runtimeMode

	# Update the CSS of a selector block
	regenerateSelector: (selectorId) ->

		# Get the selector
		selector = FASHION.selectors[selectorId]
		if !selector then return @throwError "Selector #{selectorId} does not exist"

		# Handle dynamic selectors
		if selector.mode is @runtimeModes.dynamic

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
	CSSRuleForSelector: (selector) ->

		# Get the name of the selector
		if selector.name.script
			selectorName = @evaluate valueObject
		else selectorName = selector.name

		# Loop over every property in the selector
		cssProperties = (for propertyObject in selector.properties
			@CSSPropertyTemplate(propertyObject.name, @evaluate propertyObject.value)
		)

		# Return the templated selector
		return @CSSSelectorTemplate selectorName, cssProperties