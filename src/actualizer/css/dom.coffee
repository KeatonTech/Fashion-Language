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
