# Convert a raw variable object into one with a little more info
window.fashion.$parser.parseVariable = (variableObject) ->

	# Make sure the variable has a value
	val = variableObject.raw || variableObject.value
	if !val then return {}

	# Add a type
	typ = variableObject.type = window.fashion.$run.determineType(val, 
		window.fashion.$type, window.fashion.$typeConstants)

	# Add units, if necessary
	unittedValue = window.fashion.$run.getUnit(
		val, typ, window.fashion.$type, window.fashion.$unit)
	variableObject.value = unittedValue['value']
	variableObject.unit = unittedValue['unit']

	# Add a dependents list
	variableObject.dependants = {}

	# Return the new variable object
	return variableObject


# Link dependencies back to a variable's dependants field
window.fashion.$parser.backlinkDependencies = (selector, properties, variables) ->

	# Go through each dependancy variable
	linkDependenciesList = (list, propertyName) ->
		for varName in list
			if varName[0] is "$" 
				varName = varName.substr(1)

				# Make sure the variable exists
				depVar = variables[varName]
				if depVar isnt undefined # Make sure the variable exists

					if !depVar['dependants'][selector]
						depVar['dependants'][selector] = []
					depVar['dependants'][selector].push propertyName

				else
					#ERROR: Variable doesn't exist

	for k, p of properties
		if p['dependencies'] then linkDependenciesList p['dependencies'], k
		if p['transition']
			for tk, tp of p['transition']
				key = "transition." + k
				if tp['dependencies'] then linkDependenciesList(tp['dependencies'], key)


	# Link any variables contained in the selector itself
	regex = /\$([\w\-]+)/g
	while vObj = regex.exec selector
		varName = vObj[1]
		depVar = variables[varName]
		if depVar isnt undefined

			# Add the dependancy
			if !depVar['dependants'][selector]
					depVar['dependants'][selector] = []
			depVar['dependants'][selector].push " "


# Create a list of globals and their dependants
window.fashion.$parser.backlinkGlobals = (parseTree, selector, properties, globals) ->
	for k, p of properties when p['dependencies']
		for varName in p['dependencies'] when varName[0] is "@"
			varName = varName.substr 1
			if !(varName in parseTree.globals) then parseTree.globals[varName] = {dependants:{}}
			if !parseTree.globals[varName].dependants[selector]
				parseTree.globals[varName].dependants[selector] = []
			parseTree.globals[varName].dependants[selector].push k
