# Add dependencies to each variable/module object, based on homogenous selectors
window.fashion.$actualizer.mapBindings = (bindings, selectors, map) ->
	hDependents = []
	for boundSelectorId in bindings

		# Variable bindings don't need to be mapped
		if typeof boundSelectorId is 'string' and boundSelectorId[0] is "$"
			hDependents.push boundSelectorId

		# Selector bindings
		else
			for selectorId in map[boundSelectorId]

				# We should get rid of static properties; the JS doesn't know about those
				if typeof selectorId is "number"
					selector = selectors[selectorId]
					if selector and selector.mode isnt $wf.$runtimeMode.static
						hDependents.push selectorId

				# If it's a string, it's probably an individual property
				else hDependents.push selectorId

	return hDependents


# Generate dependents for globals and other modules
window.fashion.$actualizer.addBindings = (runtimeData, parseTree, selectors, map) ->
	$wf.$actualizer.bindGlobals runtimeData, parseTree.bindings.globals, selectors, map


# Generate mapped dependent selectors for global modules
window.fashion.$actualizer.bindGlobals = (runtimeData, globalBindings, selectors, map) ->
	for name, global of runtimeData.modules.globals
		bindings = globalBindings[name]
		global.dependents = $wf.$actualizer.mapBindings bindings, selectors, map