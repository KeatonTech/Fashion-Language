# This is basically the core of the Fashion runtime, it handles modifying CSS stylesheets
$wf.addRuntimeModule "selectors", ["evaluation", "errors"],

	# Common entry point, takes a list of binding objects and updates all associated CSS
	regenerateBoundSelectors: (bindings) ->
		@regenerateBoundSelector(bindLink) for bindLink in bindings


	# Same thing but handles only a single bind link
	regenerateBoundSelector: (bindLink) ->
		
		# If the dependency is a variable, go through and update all its stuff
		if bindLink[0] is "v" and @regenerateVariableDependencies?
			@regenerateVariableDependencies bindLink[1]

		# If the dependency is a function watcher, recreate it
		else if bindLink[0] is "w" and @watchFunctionBinding?
			@watchFunctionBinding FASHION.modules.functions[bindLink[1]], bindLink[2]

		# Bound to a specific property that we can just update
		else if bindLink.length is 3
			@setPropertyOnSelector bindLink[0], bindLink[1], bindLink[2]

		# Bound to an entire selector that will need to be regenerated
		else
			@regenerateSelector bindLink[0], bindLink[1]


	# ==== 2 Different Methods of Stylesheet Modification ==== #
	

	# Set a property on a CSS selector block
	setPropertyOnSelector: (sheet, selectorId, propertyName) ->
		if sheet is "i" then return @setPropertyOnIndividual selectorId, propertyName

		# Get the selector object from fashion
		selector = FASHION.selectors[selectorId]

		# Get the rule from the stylesheet
		sheet = document.getElementById(FASHION.config.cssId).sheet
		rules = sheet.rules || sheet.cssRules # Hello, firefox

		rule = rules[@countForIE rules, selector.rule]
		if !rule?
			console.log "[FASHION] Could not find rule"
			console.log selector

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
		ieIndex = @countForIE stylesheet.rules, selector.rule
		stylesheet.insertRule @CSSRuleForSelector(selector), ieIndex


	# Internet Explorer has a problem with counting so we have to fix it
	# UPDATE: This may not be necessary
	countForIE: (rules, ruleNumber) -> return ruleNumber 

	###
		# This is an easy task for most browsers
		if !document.documentMode? then return ruleNumber

		# But IE gets confused by commas, much like a third grader
		offs = 0
		for i in [0...ruleNumber]
			offs += rules[i].selectorText.split(",").length - 1
		return offs + ruleNumber
	###


	# ==== Templates for CSS Generation ==== #


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
			module.apply.call FASHION.runtime, element, propertyObject.value, evalFunction

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


	# ==== Helper Functions ==== #


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
