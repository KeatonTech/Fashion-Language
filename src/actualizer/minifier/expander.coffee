# This code is sent to the client to unpack the minified runtime data.
# Should it be in the runtime folder? Maybe.
# But it's more closely related to the minifier stuff.
# Just try and keep code in here short.

window.fashion.$actualizer.minifier.expandRuntimeData = (minData, expandTo) ->

	# Return an object from an array
	expanderFunctions = 

		s: (s) -> {id: s[1], name: expand(s[2]), mode: s[3], properties: expand(s[4])}
		p: (p) -> {name: p[1], mode: p[2], value: expand(p[3])}
		e: (e) -> {
			mode: e[1], type: e[2], unit: e[3], setter: e[4], 
			evaluate: Function("v","g","f","t","e",e[5])}
		v: (v) -> {
			name: v[1], type: v[2], unit: v[3], default: expand(v[4]),
			dependents: v[5], scopes: v[6], values:expand(v[7])}


	# Function that'll convert an array of arrays into an array of objects
	expand = (vals) ->
		if not (vals instanceof Array) then return vals 
		if vals.length is 0 then return 0
		if typeof vals[0] is 'string' and expanderFunctions[vals[0]]
			expanderFunctions[vals[0]](vals)
		else
			r = []
			for a in vals
				if expanderFunctions[a[0]]
					r.push expanderFunctions[a[0]](a)
				else r.push a
			return r


	# Expand each selector
	for selector in minData[0]
		selobj = expand selector
		expandTo.selectors[selobj.id] = selobj

	# Expand each variable
	for variable in minData[1]
		vobj = expand variable
		expandTo.variables[vobj.name] = vobj

	# Expand each individual selector
	if minData[2]
		for selector in minData[2]
			selobj = expand selector
			expandTo.individual[selobj.id] = selobj
