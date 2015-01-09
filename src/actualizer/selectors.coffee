# Creates two lists of selectors: 1 with normal CSS properties and one with individual ones
# Returned lists are maps, so as to maintain the original indexes
window.fashion.$actualizer.splitIndividual = (selectors) ->
	cssSelectors = {}; indSelectors = {}
	cssRule = indRule = 0
	indMode = $wf.$runtimeMode.individual

	for id, selector of selectors

		# Make 2 new selector objects
		cssSelector = new Selector selector.name, selector.mode
		indSelector = new Selector selector.name, selector.mode

		# Go through each property and add it to one or the other
		for pid,property of selector.properties
			if (property.mode & indMode) is indMode
				indSelector.addProperty property
			else
				cssSelector.addProperty property

		# Add the selector objects as necessary
		if cssSelector.properties.length > 0
			cssSelector.rule = cssRule++
			cssSelectors[id] = cssSelector
		if indSelector.properties.length > 0
			indSelector.rule = indRule++
			indSelectors[id] = indSelector

	# Return the maps
	{cssSels: cssSelectors, individualSels: indSelectors}


# Returns an object that contains only selectors that need to be included in runtime data
window.fashion.$actualizer.filterStatic = (allSelectors, filterMode) ->
	passingSelectors = {}

	# Move in the new selectors
	for id, selector of allSelectors
		dynamicSelector = new Selector selector.name, selector.mode
		dynamicSelector.rule = selector.rule
		dynamicSelector.properties = {}
		hasDynamic = false

		# Add each dynamic property
		for pid,property of selector.properties
			if property.mode > 0
				hasDynamic = true
				dynamicSelector.properties[pid] = property

		# If there's at least one dynamic property, the JS needs to know about the selector
		if hasDynamic then passingSelectors[id] = dynamicSelector

	return passingSelectors