# Go through the parse tree and pull out properties defined by FASHION modules
window.fashion.$processor.properties = (parseTree, properties) ->
	funcs = window.fashion.$processor.propertiesApi

	# Go through each selector (yes, this is tedious)
	for selector, selectorProperties of parseTree.selectors

		# Go through each property (I know, I'm bored already)
		index = -1
		for property, value of selectorProperties
			index++

			# Determine if this is a fashion property
			if properties[property]

				# Bind the API to this particular run state
				# Guarantees a certain amount of safety
				API =
					setProperty: funcs.setProperty.bind 0, parseTree, selector, index

				# Process it!
				properties[property].compile.call API, value

	# Pass it back
	return parseTree

# Useful internal functions to expose to the properties compiler
window.fashion.$processor.propertiesApi =

	# Sets a property in the parse tree
	setProperty: (parseTree, selector, insertIndex, name, value) ->

		# Make sure the selector exists (it really always should)
		properties = parseTree.selectors[selector]
		if !properties then return false

		# Guarantee inheritance order
		index = 0
		for k,v in properties
			index++
			if index < insertIndex then continue
			if k is name then return false

		# Add the property
		properties[name] = value