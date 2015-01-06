# Generate a runtime data object from homogenous selectors and a parse tree
window.fashion.$actualizer.generateRuntimeData = 
(parseTree, jsSelectors, individual, cssMap) ->

	# Turn the parse tree's variables into runtime object variables and map the dependents
	vars = $wf.$actualizer.actualizeVariables parseTree, jsSelectors, individual, cssMap

	# Create the runtime data object
	rdata = new RuntimeData parseTree, jsSelectors, vars

	# Add individual selectors
	if individual then rdata.individual = individual

	# Return the runtime data object
	return rdata


# Converts the parser's variable objects into runtime variable objects.
window.fashion.$actualizer.actualizeVariables =
(parseTree, jsSelectors, individual, cssMap) ->
	variables = {}
	for varName, scopes of parseTree.variables

		# Determine the type and unit of the variable (must be identical in all scopes)
		type = unit = -1
		mode = 0
		for name, varObj of scopes
			if varObj.type? then type = varObj.type
			if varObj.unit? then unit = varObj.unit
			if varObj.mode? then mode |= varObj.mode

		# Create a runtime variable object
		rvar = new RuntimeVariable varName, type, unit, mode

		# Add each scope
		for name, varObj of scopes
			rvar.addScope name, varObj.value 

		# Add the dependencies, mapped to the split up selector blocks
		if mode > 0
			bindings = parseTree.bindings.variables[varName]
			rvar.dependents = $wf.$actualizer.mapBindings(
				bindings, jsSelectors, individual, cssMap)

		# Store this variable
		variables[varName] = rvar

	return variables


# Remove unnecessary fields from included module objects
window.fashion.$actualizer.removeUnnecessaryModuleData = (runtimeData) ->

	for n, module of runtimeData.modules.blocks when module.runtimeCapabilities
		if module.runtimeObject
			runtimeData.modules.blocks[n] = module.runtimeObject
			

# Classes used in runtime code
# @prepros-prepend ../classes/runtime/runtime-data.coffee