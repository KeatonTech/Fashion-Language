# Go through the parse tree and pull out properties defined by FASHION modules
window.fashion.$processor.properties = (parseTree, propertyModules) ->
	funcs = window.fashion.$processor.api

	# Go through each selector (yes, this is tedious)
	for selector in parseTree.selectors

		# Go through each property (I know, I'm bored already)
		index = -1
		for property in selector.properties
			index++

			# Determine if this is a fashion property
			if propertyModules[property.name] and propertyModules[property.name]['compile']

				# Bind the API to this particular run state
				# Guarantees a certain amount of safety
				API =
					throwError: funcs.throwError.bind 0, property
					setProperty: funcs.setProperty.bind 0, selector, index, property.mode
					getProperty: funcs.getProperty.bind 0, parseTree, selector.name
					parseValue: funcs.parseValue
					determineType: funcs.determineType
					determineUnit: funcs.determineUnit

				# Process it!
				propertyModules[property.name].compile.call API, property.value

				# Remove the property if necessary
				if propertyModules[property.name].replace
					selector.properties.splice index--, 1


	# Pass it back
	return parseTree