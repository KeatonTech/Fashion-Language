# @prepros-prepend ../classes/runtime/runtime-capabilities.coffee
	
# Determines what functionality needs to be included in the generated JS
window.fashion.$actualizer.determineRuntimeCapabilities = (runtimeData, selectors) ->
	capabilities = new RuntimeCapabilities()

	# If there are variables, we'll need some bindings and watchers
	if JSON.stringify(runtimeData.variables) isnt "{}"
		capabilities.add $wf.$runtimeCapability.variables

		# If any of them are scoped, we'll need that too
		for variable in runtimeData.variables
			if variable.scopes.length > 0
				capabilities.add $wf.$runtimeCapability.scopedVariables

	# Check for individual properties
	if $wf.$actualizer.hasPropertyMode selectors, $wf.$runtimeMode.individual
		capabilities.add $wf.$runtimeCapability.individualProps

	# Check for live properties
	if $wf.$actualizer.hasPropertyMode selectors, $wf.$runtimeMode.live
		capabilities.add $wf.$runtimeCapability.liveProps

	# Check for globals
	if JSON.stringify(runtimeData.modules.globals) isnt "{}"
		capabilities.add $wf.$runtimeCapability.globals

	# Add capabilities from the modules used in the runtime
	$wf.$actualizer.addModuleCapabilities capabilities, runtimeData

	# Return the object
	return capabilities


# Test the runtime data to see if it has a selector block with the given mode
window.fashion.$actualizer.hasPropertyMode = (selectors, mode) ->
	for id, selectorBlock of selectors
		if selectorBlock.mode is mode
			return true
	return false


# Load all of the runtime functions for the given capabilities
window.fashion.$actualizer.addRuntimeFunctions = (runtimeData, parseTree, capabilities) ->
	if !capabilities.capabilities then return

	# Add all of the modules that the requested capabilities depend on
	cid = 0
	while cid < capabilities.capabilities.length
		moduleName = capabilities.capabilities[cid++]
		if moduleName is undefined then continue

		module = $wf.$runtimeModules[moduleName]
		if !module then return console.log "[FASHION] Could not find module #{moduleName}"

		# Add dependencies to the capabilities
		capabilities.addDependencies module.dependencies

		# Add this module to the runtime
		runtimeData.addRuntimeModule module

		# If the module has initializers, add them to the parse tree scripts
		if module.initializers.length > 0
			for key in module.initializers
				functionName = "window.#{$wf.runtimeObject}.runtime.#{key}.bind(FASHION.runtime)"
				parseTree.addScript "FSREADY(#{functionName});"


# Adds in capabilities from runtime module
window.fashion.$actualizer.addModuleCapabilities = (capabilities, runtimeData) ->

	for n, module of runtimeData.modules.blocks when module?.runtimeCapabilities
		capabilities.addDependencies module.runtimeCapabilities

	for n, module of runtimeData.modules.properties when module?.runtimeCapabilities
		capabilities.addDependencies module.runtimeCapabilities

	for n, module of runtimeData.modules.functions when module?.runtimeCapabilities
		capabilities.addDependencies module.runtimeCapabilities

	for n, module of runtimeData.modules.globals when module?.runtimeCapabilities
		capabilities.addDependencies module.runtimeCapabilities
