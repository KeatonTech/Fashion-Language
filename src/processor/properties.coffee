# Go through the parse tree and pull out properties defined by FASHION modules
window.fashion.$processor.properties = (parseTree, propertyModules) ->
	funcs = window.fashion.$processor.api

	# Go through each selector (yes, this is tedious)
	for selector in parseTree.selectors

		# Go through each property (I know, I'm bored already)
		index = -1
		for property in selector.properties
			index++
			propertyModule = propertyModules[property.name]

			# Determine if this is a fashion property
			if propertyModule

				# Bind the API to this particular run state
				# Guarantees a certain amount of safety
				API =
					throwError: funcs.throwError.bind 0, property
					setProperty: funcs.setProperty.bind 0, selector, index
					getProperty: funcs.getProperty.bind 0, parseTree, selector.name
					parseValue: funcs.parseValue
					determineType: funcs.determineType
					determineUnit: funcs.determineUnit

				# Remove the property if necessary
				if propertyModule.mode is $wf.$runtimeMode.individual
					parseTree.addPropertyDependency property.name, propertyModule

				else
					# Process it!
					propertyModules[property.name].compile.call API, property.value

					# Remove it if necessary
					if propertyModule.replace then selector.properties.splice index--, 1


	# Pass it back
	return parseTree