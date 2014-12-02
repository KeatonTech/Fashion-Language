# Go through the parse tree and pull out properties defined by FASHION modules
window.fashion.$processor.properties = (parseTree, properties) ->
	funcs = window.fashion.$processor.api

	# Go through each selector (yes, this is tedious)
	for selector, selectorProperties of parseTree.selectors

		# Go through each property (I know, I'm bored already)
		index = -1
		for property, value of selectorProperties
			index++

			# Determine if this is a fashion property
			if properties[property] and properties[property]['compile']

				# Bind the API to this particular run state
				# Guarantees a certain amount of safety
				API =
					throwError: funcs.throwError.bind 0, property
					setProperty: funcs.setProperty.bind 0, parseTree, selector, index
					getProperty: funcs.setProperty.bind 0, parseTree, selector
					parseValue: funcs.parseValue

				# Process it!
				properties[property].compile.call API, value

	# Pass it back
	return parseTree