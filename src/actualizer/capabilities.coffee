# Determines what functionality needs to be included in the generated JS
window.fashion.$actualizer.determineRuntimeCapabilities = (runtimeData) ->
	capabilities = new RuntimeCapabilities()

	# If there are variables, we'll need some bindings and watchers
	if runtimeData.variables.length > 0
		capabilities.add $wf.$runtimeCapability.variables

		# If any of them are scoped, we'll need that too
		for variable in runtimeData.variables
			if variable.scopes.length > 0
				capabilities.add $wf.$runtimeCapability.scopedVariables

	# Check for individual properties
	if $wf.$actualizer.hasPropertyMode runtimeData, $wf.$runtimeMode.individual
		capabilities.add $wf.$runtimeCapability.individualProps

	# Check for live properties
	if $wf.$actualizer.hasPropertyMode runtimeData, $wf.$runtimeMode.live
		capabilities.add $wf.$runtimeCapability.liveProps

	# Return the object
	return capabilities


window.fashion.$actualizer.hasPropertyMode = (runtimeData, mode) ->
	for selectorBlock in runtimeData.selectors
		if selectorBlock.mode is mode then return true
	return false


# @prepros-prepend ../classes/runtime/runtime-capabilities.coffee