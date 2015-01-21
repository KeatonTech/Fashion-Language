# This code is sent to the client to unpack the minified runtime data.
# Should it be in the runtime folder? Maybe.
# But it's more closely related to the minifier stuff.
# Just try and keep code in here short.

window.fashion.$actualizer.minifier.expandRuntimeData = (minData, expandTo) ->

	# Return an object from an array
	expanderFunctions = 

		s: (s) -> {rule: s[2], name: expand(s[3]), mode: s[4], properties: expand(s[5])}
		p: (p) -> {name: p[1], mode: p[2], important: p[3], value: expand(p[4])}
		e: (e) -> {
			mode: e[1], type: e[2], unit: e[3], setter: e[4], 
			evaluate: Function("v","g","f","t","e",e[5])}
		v: (v) -> {
			name: v[1], type: v[2], unit: v[3], mode: v[4], default: expand(v[5]),
			dependents: v[6], values:expandObj(v[7])}


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

	# Function that'll convert an object of arrays into an object of objects
	expandObj = (valObj) ->
		if not (typeof valObj is 'object') then return valObj
		r = {}
		for k,a of valObj
			if expanderFunctions[a[0]]
				r[k] = expanderFunctions[a[0]](a)
			else r[k] = a
		return r


	# Expand each selector
	for selector in minData[0]
		selobj = expand selector
		selobj.sheet = "s"
		expandTo.selectors[selector[1]] = selobj

	# Expand each variable
	for variable in minData[1]
		vobj = expand variable
		expandTo.variables[vobj.name] = vobj

	# Expand each individual selector
	if minData[2]
		for selector in minData[2]
			selobj = expand selector
			selobj.sheet = "i"
			expandTo.individual[selector[1]] = selobj
