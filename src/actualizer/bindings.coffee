# Add mapped bindings to globals and variables
window.fashion.$actualizer.addBindings = (runtimeData, parseTree, jsSels, indSels) ->

	# Bind variables
	for name, vObj of runtimeData.variables when vObj.mode isnt 0
		bindings = parseTree.bindings.variables[name]
		bindings = $wf.$actualizer.removeTriggerBindings bindings, jsSels, indSels
		vObj.dependents = $wf.$actualizer.mapBindings bindings, jsSels, indSels

	# Bind globals
	for name, global of runtimeData.modules.globals
		bindings = parseTree.bindings.globals[name]
		bindings = $wf.$actualizer.removeTriggerBindings bindings, jsSels, indSels
		global.dependents = $wf.$actualizer.mapBindings bindings, jsSels, indSels


# Filter out any dependencies pointing to trigger-mode properties
window.fashion.$actualizer.removeTriggerBindings = (bindings, jsSels, indSels)->
	triggerMode = $wf.$runtimeMode.triggered
	filteredBindings = []
	for binding in bindings when binding instanceof Array
		[selectorId, propertyId] = binding

		# Get the property, wherever it is
		property = jsSels[selectorId]?.properties[propertyId]
		property ||= indSels[selectorId]?.properties[propertyId]

		# Remove triggered properties
		if property and (property.mode & triggerMode) isnt triggerMode
			filteredBindings.push binding

	return filteredBindings


# Convert [selectorId, propertyId] bindings into [sheet, selectorId, propertyName] bindings
window.fashion.$actualizer.mapBindings = (bindings, jsSels, indSels) ->
	makeCamelCase = window.fashion.$actualizer.makeCamelCase
	for binding in bindings

		# Single binding, probably to a variable
		if not (binding instanceof Array)
			if binding[0] is "$" then ["v", binding.substr(1)]
			else 
				console.log "[FASHION] Could not bind to '#{binding}'"
				undefined

		# Array binding of form [selectorId, propertyId]
		else
			[selectorId, propertyId] = binding

			# Check to see if the property is in the non-individual selector list
			if property = jsSels[selectorId]?.properties[propertyId]
				["s", selectorId, makeCamelCase property.name]

			# Otherwise it must be an individual property
			else if property = indSels[selectorId]?.properties[propertyId]
				["i", selectorId, makeCamelCase property.name]

			# If it's neither one of those, we have a problem
			else
				console.log "[FASHION] Could not bind to #{JSON.stringify binding}"
				console.log new Error().stack
				undefined


# Convert CSS names into JS names
window.fashion.$actualizer.makeCamelCase = (cssName) ->
	if !cssName? then return ""
	cssName.replace /-([a-z])/gi, (full, letter) -> letter.toUpperCase();