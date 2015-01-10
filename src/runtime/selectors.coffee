$wf.addRuntimeModule "selectors", ["evaluation", "errors"],

	# Include the runtime modes
	runtimeModes: window.fashion.$runtimeMode

	# Convert CSS names into JS names
	makeCamelCase: (propertyObject) ->
		if !propertyObject? or !propertyObject.name? then return ""
		if !propertyObject.jsName?
			n = propertyObject.name
			cc = n.replace /-([a-z])/gi, (full, letter) -> letter.toUpperCase();
			propertyObject.jsName = cc
		return propertyObject.jsName
	

	# Set a property on a CSS selector block
	setPropertyOnSelector: (sheet, selectorId, propertyName) ->
		if sheet is "i" then return @setPropertyOnIndividual selectorId, propertyName

		# Get the selector object from fashion
		selector = FASHION.selectors[selectorId]

		# Get the rule from the stylesheet
		sheet = document.getElementById(FASHION.config.cssId).sheet
		rules = sheet.rules || sheet.cssRules # Hello, firefox
		rule = sheet.rules[selector.rule]

		# Go through each property looking for ones with the given name
		# There could be multiple properties that match, usually as fallbacks
		for pObj in selector.properties when @makeCamelCase(pObj) is propertyName

			# Important properties can't just be set, for some reason
			if pObj.important

				# It bothers me that this is necessary
				regex = new RegExp pObj.name + ":.*?\;", 'g'
				replacement = "#{pObj.name}: #{@CSSRuleForProperty pObj, undefined, true};"
				rule.style.cssText = rule.style.cssText.replace regex, replacement

			else
				# Generate the CSS property and set it as a style on our rule
				rule.style[propertyName] = @CSSRuleForProperty pObj, undefined, true


	# Update the CSS of a selector block
	regenerateSelector: (sheet, selectorId) ->

		# Handle individual selectors
		if sheet is "i" then return @regenerateIndividualSelector selectorId

		# Get the selector
		selector = FASHION.selectors[selectorId]
		if !selector then return @throwError "Selector #{selectorId} does not exist"

		# Delete it from the stylesheet
		cssElem = document.getElementById "#{FASHION.config.cssId}"
		stylesheet = cssElem.sheet
		stylesheet.deleteRule selector.rule

		# Add the regenerated selector
		stylesheet.insertRule @CSSRuleForSelector(selector), selector.rule


	# CSS Templates
	CSSPropertyTemplate: window.fashion.$actualizer.cssPropertyTemplate
	CSSSelectorTemplate: window.fashion.$actualizer.cssSelectorTemplate

	# Generate the CSS for a single property
	CSSRuleForProperty: (propertyObject, element, unwrapped = false) ->

		# Check to see if the property is handled by a property module
		if module = FASHION.modules.properties[propertyObject.name]
			evalFunction = @evaluate.bind(this, propertyObject.value, element)

			# The apply function is run at runtime
			if !module.apply then return
			module.apply element, propertyObject.value, evalFunction

			if module.replace then return

		# Evaluate the property and make it into valid CSS
		value = @evaluate(propertyObject.value, element)
		if unwrapped
			value + (if propertyObject.important is 1 then " !important" else "")

		else @CSSPropertyTemplate(propertyObject, value)


	# Generate a CSS rule for the given selector block
	CSSRuleForSelector: (selector, element, name) ->

		# Get the name of the selector
		selectorName = name || @evaluate(selector.name, element)

		# Loop over every property in the selector
		cssProperties = (@CSSRuleForProperty(pO, element) for pO in selector.properties)

		# Return the templated selector
		return @CSSSelectorTemplate selectorName, cssProperties
