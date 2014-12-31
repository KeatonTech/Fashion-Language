# Add dependencies to each variable/module object, based on homogenous selectors
window.fashion.$actualizer.mapBindings = (bindings, selectors, individual, map) ->

	if !bindings then return
	hDependents = []
	bindingTree = $wf.$actualizer.createBindingTree bindings
	for selectorOrName, values of bindingTree

		# Variable bindings don't need to be mapped
		if selectorOrName[0] is "$"
			hDependents.push selectorOrName

		# Selector bindings
		else
			selectorOrName = parseInt selectorOrName # We know it's a selector now
			if !map[selectorOrName] then continue
			for selectorId in map[selectorOrName]

				# We should get rid of static properties; the JS doesn't know about those
				if typeof selectorId is "number"
					selector = selectors[selectorId]
					if selector and selector.mode isnt $wf.$runtimeMode.static
						hDependents.push selectorId

				# If it's a string, it's probably an individual property
				# We have to test these to see if they actually depend on the variable
				else
					selector = individual[parseInt(selectorId.substr(1))]
					if !selector
						console.log "[FASHION] Selector at #{selectorId} does not exist"
						continue

					if values is true
						hDependents.push selectorId

					else 
						depends = false
						for property in selector.properties
							if property.id in values then depends = true
						if depends then hDependents.push selectorId

	return hDependents


# Convert the list of property bindings (like: [1,1], [1,2], [2,4]) into a more useful
# tree structure (like: {1: [1,2], 2: [4]}). This is another example where the parse
# format, though nice and simple for sake of the parser's code structure (and my
# personal vendetta on object oriented programming), sometimes needs some help.
window.fashion.$actualizer.createBindingTree = (bindings) ->
	bindingTree = {}
	for bindingLink in bindings
		if bindingLink instanceof Array and bindingLink.length is 2
			if !bindingTree[bindingLink[0]] then bindingTree[bindingLink[0]] = []
			bindingTree[bindingLink[0]].push bindingLink[1]
		else
			bindingTree[bindingLink] = true
	return bindingTree


# Generate dependents for globals and other modules
window.fashion.$actualizer.addBindings = (runtimeData, parseTree, selectors, map) ->
	$wf.$actualizer.bindGlobals runtimeData, parseTree.bindings.globals, selectors, map


# Generate mapped dependent selectors for global modules
window.fashion.$actualizer.bindGlobals = (runtimeData, globalBindings, selectors, map) ->
	for name, global of runtimeData.modules.globals
		bindings = globalBindings[name]
		global.dependents = $wf.$actualizer.mapBindings(
			bindings, selectors, runtimeData.individual, map)