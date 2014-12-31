
# Split each selector to into pieces with homogenous property modes
# Returns the new selectors array and a map associating them with the original selector IDs
window.fashion.$actualizer.regroupProperties = (parseTree) ->
	homogenousSelectors = []
	expansionMap = []

	# For each original selector
	for selector in parseTree.selectors
		properties = selector.properties
		if !properties or properties.length is 0 then continue

		# Backwards passes through the properties to try and group like modes together
		# The order of these passes essentially determines the order of the properties
		$wf.$actualizer.groupPropertiesWithMode properties, $wf.$runtimeMode.dynamic
		$wf.$actualizer.groupPropertiesWithMode properties, $wf.$runtimeMode.globalDynamic
		$wf.$actualizer.groupPropertiesWithMode properties, $wf.$runtimeMode.live
		$wf.$actualizer.groupPropertiesWithMode properties, $wf.$runtimeMode.individual

		# Generate homogenous selectors based on the newly reordered properties
		splitSelectors = $wf.$actualizer.splitSelectorByModes selector
		selectorIds = []
		for splitSelector in splitSelectors
			splitSelector.index = homogenousSelectors.length
			homogenousSelectors.push splitSelector
			selectorIds.push(homogenousSelectors.length - 1)

		# Add the list of generated selectors to the expansion map
		expansionMap.push selectorIds

	# Return something useful
	return {selectors: homogenousSelectors, map: expansionMap}


# Try and collect all properties with the given mode at the bottom of the list
# without messing up the semantic meaning of the CSS.
window.fashion.$actualizer.groupPropertiesWithMode = (properties, mode) ->

	# Count how many items have been moved to the bottom
	# This is the distance from the bottom that new items will be moved
	# Not really necessary but it's nice for efficiency
	bottomCount = if properties[properties.length - 1].mode is mode then 1 else 0

	# Go backwards through the list so that the rearranging doesn't screw stuff up
	# Don't need to consider the last item because it can't move down
	for o in [properties.length - 2 - bottomCount .. 0] by -1
		property = properties[o]
		if property.mode isnt mode then continue

		# If the two properties share the same 'category', they conflict
		if property.name[0] is "-" then id = 2 else id = 0 # Deal with prefixing
		propertyCategory = property.name.split('-')[id].toLowerCase()

		# Go through everything under it and check for conflicts
		i = o + 1
		while i < properties.length - bottomCount
			if properties[i].name[0] is "-" then id = 2 else id = 0 # Deal with prefixing
			compareCategory = properties[i].name.split('-')[id].toLowerCase()
			if compareCategory is propertyCategory then break
			i++

		# Move the property as low as it can go (which is i - 1 because i does conflict)
		properties.splice(o, 1)
		properties.splice(i - 1, 0, property)
		if i is properties.length - bottomCount then bottomCount++


# Splits a selector into multiple, homogenous selectors
window.fashion.$actualizer.splitSelectorByModes = (selector) ->
	newSelectors = []
	currentSelector = undefined
	for property in selector.properties

		# This is a situation where a new selector block needs to be generated
		if !currentSelector or currentSelector.mode isnt property.mode
			currentSelector = new Selector selector.name, property.mode
			newSelectors.push currentSelector

		# Add the current property to the new selector
		currentSelector.addProperty property

	# Return the list of generated selectors
	return newSelectors
