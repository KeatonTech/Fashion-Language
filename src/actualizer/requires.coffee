# Different types of runtime requirements (Javascript enum)
window.fashion.$runtimeCapability =
	variables: "variables"
	scopedVariables: "scopedVariables"
	scopedSelector: "scopedVariableSelector"
	scopedIndividual: "scopedVariableIndividual"
	individualProps: "individualized"
	liveProps: "liveProperties"
	globals: "globals"
	
# Determines what functionality needs to be included in the generated JS
window.fashion.$actualizer.autoAddRequirements = (runtimeData, parseTree) ->
	add = parseTree.addRequirements.bind parseTree

	# If there are variables, we'll need some bindings and watchers
	if JSON.stringify(runtimeData.variables) isnt "{}"
		add [$wf.$runtimeCapability.variables]

		# If any of them are scoped, we'll need that too
		for name, variable of runtimeData.variables
			if variable.scopes.length > 0
				add [$wf.$runtimeCapability.scopedVariables]

	# Check for individual properties
	if $wf.$actualizer.hasPropertyMode parseTree.selectors, $wf.$runtimeMode.individual
		add [$wf.$runtimeCapability.individualProps]

	# Check for live properties
	if $wf.$actualizer.hasPropertyMode parseTree.selectors, $wf.$runtimeMode.live
		add [$wf.$runtimeCapability.liveProps]

	# Check for globals
	if JSON.stringify(runtimeData.modules.globals) isnt "{}"
		add [$wf.$runtimeCapability.globals]


# Test the runtime data to see if it has a selector block with the given mode
window.fashion.$actualizer.hasPropertyMode = (selectors, mode) ->
	for id, selectorBlock of selectors
		for pid, property of selectorBlock.properties
			if (property.mode & mode) is mode
				return true
	return false


# Load all of the runtime functions for the given capabilities
window.fashion.$actualizer.addRuntimeFunctions = (runtimeData, parseTree) ->
	if !parseTree.requires then return

	# Add all of the modules that the requested capabilities depend on
	cid = 0
	while cid < parseTree.requires.length
		moduleName = parseTree.requires[cid++]
		if moduleName is undefined then continue

		module = $wf.$runtimeModules[moduleName]
		if !module then return console.log "[FASHION] Could not find module #{moduleName}"

		# Add dependencies to the capabilities
		parseTree.addRequirements module.requires

		# Add this module to the runtime
		runtimeData.addRuntimeModule module

		# If the module has initializers, add them to the parse tree scripts
		if module.initializers.length > 0
			for key in module.initializers
				functionName = "window.#{$wf.runtimeObject}.runtime.#{key}.bind(FASHION.runtime)"
				parseTree.addScript "FSREADY(#{functionName});"


