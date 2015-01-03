# Returns an object that contains only selectors that need to be included in runtime data
# ASIDE: This is my favorite function name ever.
window.fashion.$actualizer.cullIndividuality = (allSelectors, map) ->
	passingSelectors = []
	offsets = {}
	exclude = {}
	currentOffset = 0

	# Move in the new selectors
	for id, selector of allSelectors
		if (selector.mode & $wf.$runtimeMode.individual) is $wf.$runtimeMode.individual
			currentOffset++
			exclude[id] = true
		else
			newId = id - currentOffset
			passingSelectors.push selector
	
		offsets[id] = currentOffset

	# Create the new offset map
	newMap = []
	mapIndividualCount = 0
	for outer, inners of map
		newMap.push []

		# Add individual properties as strings beginning with an 'i'
		# Other properties are added as numbers
		for inner in inners
			if exclude[inner] is true
				newMap[outer].push("i" + mapIndividualCount++)
			else 
				newMap[outer].push(inner - parseInt(offsets[inner]))

	return {sel: passingSelectors, map: newMap, offsets: offsets}


# Returns an object that contains only selectors that need to be included in runtime data
window.fashion.$actualizer.filterStatic = (allSelectors, filterMode) ->
	passingSelectors = {}

	# Move in the new selectors
	for id, selector of allSelectors
		if selector.mode > 0
			passingSelectors[id] = selector

	return passingSelectors


# Add each individual selector to the runtime data
window.fashion.$actualizer.addIndividualProperties = (selectors, offsets) ->
	individualProperties = []
	indMode = $wf.$runtimeMode.individual
	for id, selector of selectors when (selector.mode & indMode) is indMode
		selector.index = id - offsets[id]
		individualProperties.push selector
	return individualProperties
