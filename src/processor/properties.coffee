# Go through the parse tree and pull out properties defined by FASHION modules
window.fashion.$processor.properties = (parseTree, propertyModules) ->
	funcs = window.fashion.$processor.api
	rmode = $wf.$runtimeMode

	# Go through each selector (yes, this is tedious)
	for sid,selector of parseTree.selectors

		# Go through each property (I know, I'm bored already)
		index = -1
		for pid,property of selector.properties
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
					parseValue: funcs.parseValue.bind 0, parseTree, [sid,pid]
					determineType: funcs.determineType
					determineUnit: funcs.determineUnit

				# Remove the property if necessary
				if (propertyModule.mode & rmode.individual) is rmode.individual
					parseTree.addPropertyDependency property.name, propertyModule
					property.mode |= propertyModule.mode

				else
					# Process it!
					propertyModules[property.name].compile.call API, property.value

					# Remove it if necessary
					if propertyModule.replace then selector.deleteProperty index--


	# Pass it back
	return parseTree