# Generate a runtime data object from homogenous selectors and a parse tree
window.fashion.$actualizer.generateRuntimeData = (parseTree, hSelectors, hMap) ->

	# Turn the parse tree's variables into runtime object variables and map the dependents
	variables = $wf.$actualizer.actualizeVariables parseTree, hSelectors, hMap

	# Create the runtime data object
	rdata = new RuntimeData hSelectors, variables

	# Return the runtime data object
	return rdata


# Converts the parser's variable objects into runtime variable objects.
window.fashion.$actualizer.actualizeVariables = (parseTree, hSelectors, hMap) ->
	variables = {}
	for varName, scopes of parseTree.variables

		# Determine the type and unit of the variable (must be identical in all scopes)
		type = unit = -1
		for name, varObj of scopes
			if varObj.type then type = varObj.type
			if varObj.unit then unit = varObj.unit

		# Create a runtime variable object
		rvar = new RuntimeVariable varName, type, unit

		# Add each scope
		for name, varObj of scopes
			rvar.addScope name, varObj.value 

		# Add the dependencies, mapped to the split up selector blocks
		bindings = parseTree.bindings.variables[varName]
		rvar.dependents = $wf.$actualizer.mapVariableDependents rvar, bindings, hMap

		# Store this variable
		variables[varName] = rvar

	return variables

# Add dependencies to each variable object, based on homogenous selectors
window.fashion.$actualizer.mapVariableDependents = (runtimeVar, bindings, hMap) ->
	hDependents = []
	for boundSelectorId in bindings
		hDependents.push.call hDependents, hMap[boundSelectorId]
	return hDependents


# Classes used in runtime code
# @prepros-prepend ../classes/runtime/runtime-data.coffee