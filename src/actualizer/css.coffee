# Create CSS stylesheets from a parse tree and return a mapping
# From selectors to sheet & rule numbers
window.fashion.$actualizer.makeDomStyleFromTree = (parseTree, index) ->

	# Generate stylesheets
	dynamicSheet = window.fashion.$dom.makeStylesheet("fashionDynamic", index, true)
	staticSheet = window.fashion.$dom.makeStylesheet("fashionStatic", index, false)

	# Add everything to the document head (otherwise it won't work)
	window.fashion.$dom.addElementToHead staticSheet
	window.fashion.$dom.addElementToHead dynamicSheet

	# Add style properties to the sheets
	rules = window.fashion.$actualizer.generateStyleProperties(
		parseTree.selectors, parseTree.variables)
	console.table rules.static
	console.table rules.dynamic

	# Add each static rule to the static sheet
	staticMap = {}
	for row, rule of rules.static
		staticMap[rule.name] = [index, parseInt row]
		window.fashion.$actualizer.addCSSRule rule.value, staticSheet

	# Add each dynamic rule to the dynamic sheet and map its location
	dynamicMap = {}
	for row, rule of rules.dynamic
		dynamicMap[rule.name] = [index, parseInt row]
		window.fashion.$actualizer.addCSSRule rule.value, dynamicSheet

	# Sub in final rules (with transitions) after the initial load
	# This prevents transitions from running as soon as the page loads
	wait 1, ()-> window.fashion.$actualizer.subInFinalRules(
		rules.final, staticMap, dynamicMap, staticSheet, dynamicSheet)

	# Return the map
	return dynamicMap


# Add selectors and their properties to style tags
# Returns a map of selectors to their sheet location
window.fashion.$actualizer.generateStyleProperties = (selectors, variables) ->
		rStatic = []; rDynamic = []; tStatic = []; tDynamic = [];

		# Loop over every selector
		for selector, properties of selectors

			# Expand out any variables in the selector string
			newSelector = window.fashion.$run.expandVariables selector, variables

			# Separate styles based on whether or not they'll actually change
			dynamicProps = staticProps = "#{newSelector} {"
			dynamicSelector = newSelector isnt selector
			hasDynamicProps = hasStaticProps = false
			if dynamicSelector then hasDynamicProps = true

			# Deal with CSS3 transitions
			transitions = []
			hasTransition = false

			# Loop over every property in the selector
			for property, valueObject of properties

				# Evaluate the current string value
				val = window.fashion.$run.evaluate(valueObject, undefined, 
					variables, $wf.$type, {}, $wf.$globals)

				# Check to see if the value has a transition
				if typeof valueObject is 'object' and valueObject['transition']
					hasTransition = true
					transitions[property] = valueObject.transition

				# Add the property to the appropriate string
				if dynamicSelector or valueObject["dynamic"] is true
					dynamicProps += "#{property}: #{val};"
					hasDynamicProps = true
				else
					staticProps += "#{property}: #{val};"
					hasStaticProps = true

			# Add transition properties
			tCSS = window.fashion.$actualizer.addTransitions(transitions)
			if tCSS.static 
				tStatic.push {name: selector, value: staticProps + tCSS.static + "}"}
			if tCSS.dynamic
				tDynamic.push {name: selector, value: dynamicProps + tCSS.dynamic + "}"}

			# Add properties as necessary
			if hasStaticProps then rStatic.push {name: selector, value: staticProps+"}"}
			if hasDynamicProps then rDynamic.push {name: selector, value: dynamicProps+"}"}

		# Return lists of static and dynamic CSS rules
		return {
			static: rStatic, dynamic: rDynamic, 
			final: {static: tStatic, dynamic: tDynamic}
		}


# Add transition properties 
window.fashion.$actualizer.addTransitions = (transitions) ->
	tStatic = tDynamic = "transition: "
	hasStatic = hasDynamic = false
	for property, t of transitions

		# Determine if the transition is dynamic or static
		isDynamic = t.easing and typeof t.easing is 'object' and t.easing.dynamic
		isDynamic &= t.duration and typeof t.duration is 'object' and t.duration.dynamic
		isDynamic &= t.delay and typeof t.delay is 'object' and t.delay.dynamic

		# Generate a string of the transition
		tString = "#{property} #{t.duration || '1s'} #{t.easing || ''} #{t.delay || ''},"
		if isDynamic then tDynamic += tString else tStatic += tString
		if isDynamic then hasDynamic = true else hasStatic = true

	# Replace last comma with a semicolon
	tStatic = tStatic.substr(0, tStatic.length - 1) + ";"
	tDynamic = tDynamic.substr(0, tDynamic.length - 1) + ";"

	# Browser prefixing
	tStatic = [tStatic, "-webkit-"+tStatic, "-moz-"+tStatic, "-ms-"+tStatic].join('')
	tDynamic = [tDynamic, "-webkit-"+tDynamic, "-moz-"+tDynamic, "-ms-"+tDynamic].join('')

	# Return transition rules
	return {
		static: (if hasStatic then tStatic else false)
		dynamic: (if hasDynamic then tDynamic else false)
	}

# Sub in final CSS (used to prevent transitions from happening at the beginning)
window.fashion.$actualizer.subInFinalRules = 
	(final, staticMap, dynamicMap, staticSheet, dynamicSheet) ->
		for rule in final.static
			row = staticMap[rule.name][1]
			window.fashion.$actualizer.subCSSRule rule.value, staticSheet, row
		for rule in final.dynamic
			row = dynamicMap[rule.name][1]
			window.fashion.$actualizer.subCSSRule rule.value, dynamicSheet, row

# Simple function adds a single rule to a sheet and returns the index
window.fashion.$actualizer.addCSSRule = (ruleText, sheetElement) ->
	staticIndex = window.fashion.$dom.incrementSheetIndex(sheetElement)
	try
		sheetElement.sheet.insertRule ruleText, staticIndex
	catch error
		console.log "[FASHION] Invalid rule: '#{ruleText}'"
	return staticIndex

# Simple function adds a single rule to a sheet and returns the index
window.fashion.$actualizer.subCSSRule = (ruleText, sheetElement, index) ->
	sheetElement.sheet.deleteRule index
	sheetElement.sheet.insertRule ruleText, index
