# Add mapped bindings to globals and variables
window.fashion.$actualizer.addBindings = (runtimeData, jsSels, indSels) ->

	# CSS Properties can depend on variables
	$wf.$actualizer.bindSelectors runtimeData, jsSels, "s"
	$wf.$actualizer.bindSelectors runtimeData, indSels, "i"

	# Variables can also depend on variables
	$wf.$actualizer.bindVariables runtimeData


# Go through each selector and bind any expressions
window.fashion.$actualizer.bindSelectors = (runtimeData, selectors, sheet) ->
	tmode = $wf.$runtimeMode.triggered

	# Loopdie loopdie loop
	for sid, selector of selectors

		# Check to see if the selector is dynamic
		if selector.name instanceof Expression
			bindLink = [sheet, parseInt(sid)]
			$wf.$actualizer.bindExpression runtimeData, selector.name, bindLink

		# Go through each property
		for pid, property of selector.properties

			# Ignore triggered properties
			if (property.mode & tmode) is tmode then continue

			# Generate the bind link, an array with the necessary data for runtime
			bindLink = [sheet, parseInt(sid), $wf.$actualizer.makeCamelCase property.name]

			# Go through pulling all the expressions out of the property value
			if property.value instanceof Array
				for csval in property.value

					if csval instanceof Array
						for ccmp in csval

							if ccmp instanceof Expression
								$wf.$actualizer.bindExpression runtimeData, ccmp, bindLink

					else if csval instanceof Expression
						$wf.$actualizer.bindExpression runtimeData, csval, bindLink

			else if property.value instanceof Expression
				$wf.$actualizer.bindExpression runtimeData, property.value, bindLink


# Go through each variable and bind any expressions
window.fashion.$actualizer.bindVariables = (runtimeData) ->
	for varName, vObj of runtimeData.variables

		# Variables can be bound to different things in different scopes
		for scope, scopeValue of vObj.values

			# If the variable's value is an expression, it can depend on other variables
			if scopeValue instanceof Expression
				bindLink = ["v", varName, scope]
				$wf.$actualizer.bindExpression runtimeData, scopeValue, bindLink


# Add bindings from an expression
window.fashion.$actualizer.bindExpression = (runtimeData, expression, bindLink) ->

	# Add variable bindings
	for varName in expression.bindings.variables
		vObj = runtimeData.variables[varName]
		if !vObj
			console.log "[FASHION] Could not bind to nonexistent variable: '#{varName}'"
		else
			vObj.addDependent bindLink

	# Add global bindings
	for globalName in expression.bindings.globals
		gObj = runtimeData.modules.globals[globalName]
		if !gObj
			console.log "[FASHION] Could not bind to nonexistent global: '#{varName}'"
		else
			if !gObj.dependents? then gObj.dependents = []
			if bindLink in gObj.dependents then continue
			gObj.dependents.push bindLink


# Convert CSS names into JS names
window.fashion.$actualizer.makeCamelCase = (cssName) ->
	if !cssName? then return ""
	cssName.replace /-([a-z])/gi, (full, letter) -> letter.toUpperCase();