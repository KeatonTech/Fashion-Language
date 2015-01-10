# Functions to make the outputted Javascript as small as possible
window.fashion.$actualizer.minifier =

	# Convert the runtime data object into much smaller nested arrays
	runtimeData: (runtimeData) -> 
		$wfam = window.fashion.$actualizer.minifier
		sid = iid = 0
		[
			($wfam.selector(id, s) for id,s of runtimeData.selectors),
			($wfam.variable(v) for id,v of runtimeData.variables),
			($wfam.selector(id, s) for id,s of runtimeData.individual)
		]

	# Minify a single selector
	# FORMAT: ['s', id, cssIndex, name, mode, properties]
	selector: (id, selObj) ->
		$wfam = window.fashion.$actualizer.minifier
		if !selObj or not (selObj instanceof Selector) then return

		# The name can either be a constant value or an expression
		if selObj.name instanceof Expression
			name = $wfam.expression selObj.name
		else name = selObj.name

		# Go through each property
		properties = []
		for pid, rawProperty of selObj.properties
			properties.push $wfam.property rawProperty

		# Return the selector object
		return ["s", parseInt(id), selObj.rule, name, selObj.mode, properties]


	# Minify a single property
	# FORMAT: ['p', name, mode, value]
	property: (propObj) ->
		$wfam = window.fashion.$actualizer.minifier
		if !propObj or not (propObj instanceof Property) then return

		# Array of values (multipart and multi-value)
		# Can I just say, I am so sorry
		if propObj.value instanceof Array
			value = []
			for subVal in propObj.value
				if subVal instanceof Expression
					value.push $wfam.expression subVal
				else value.push subVal 

		# Nope, just a normal property
		else if propObj.value instanceof Expression
			value = $wfam.expression propObj.value
		else value = propObj.value

		# Return the selector object
		important = if propObj.important then 1 else 0
		return ["p", propObj.name, propObj.mode, important, value]


	# Minify an expression
	# FORMAT: ['e', mode, type, unit, setter, script]
	expression: (exprObj) ->
		if !exprObj or not (exprObj instanceof Expression) then return

		# Return the selector object
		["e", exprObj.mode, exprObj.type, exprObj.unit, exprObj.setter, exprObj.script]


	# Minify a runtime variable object
	# FORMAT: ['v', name, type, unit, default, dependents, scopes?, values?]
	variable: (varObj) ->
		$wfam = window.fashion.$actualizer.minifier
		if !varObj or not (varObj instanceof RuntimeVariable) then return

		# The default value can either be a constant value or an expression
		if varObj.default instanceof Expression
			defaultVal = $wfam.expression varObj.default
		else defaultVal = varObj.default

		# Go through each value and condense them into expressions if necessary
		values = []
		for v in varObj.values
			if v instanceof Expression
				values.push $wfam.expression v
			else values.push v

		# Return the selector object
		r = [
				"v",
				varObj.name, varObj.type, varObj.unit, varObj.mode,
				defaultVal, varObj.dependents
			]
		if varObj.scopes then r.push.apply r, [varObj.scopes, values]
		return r


# Function that expands this data back into a nice tree
# @prepros-append ./expander.coffee
