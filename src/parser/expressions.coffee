# This is probably the most complicated file in FASHION, just a heads up
# Its role is to disassemble an implicit expression in Fashion and then
# piece it back together as valid Javascript, implying units as it goes.

# Recursively convert an expression string into a parse tree
window.fashion.$parser.parseExpression = (expString, vars, funcs, globals, top = true) ->
	expander = $wf.$parser.expressionExpander

	# Create some space
	dependencies = []; functions = []; script = expString; 
	individualized = dynamic = false;

	# Track the types and units of things included in the expression
	types = []; units = []

	# Method to replace pieces of the expression string within the script
	scriptOffset = 0
	replaceInScript = (start, length, string)->
		script = $wf.$parser.spliceString script, start + scriptOffset, length, string
		scriptOffset += string.length - length

	# Detect functions and variables
	regex = ///(
			[\$\@]\(['"](.*?)['"]	# Binding function (selector)
			\,?\s?['"]?(.*?)['"]?\)	# Binding function (property - optional)
			([^\s]*)|				# Binding function (unit - optional)
			\@(self|this|parent)	# Relative element reference (name)
			\.([^\s]+)|				# Relative element reference (property)
			\$([\w\-]+)|			# Defined variable
			\@([\w\-]+)|			# Global variable
			([\-]{0,1}				# Number with unit (negative)
			([\.]{0,1}\d+|			# Number with unit (decimal at beginning)
			\d+(\.\d*)?)			# Number with unit (decimal in middle)
			[a-zA-Z]{1,4})|			# Number with unit (unit)
			([\w\-]*)\(|			# Function definition
			\(|\)					# Track depth (for matchParenthesis)
			)///g
	
	# Handle each piece
	shouldBreak = false
	while !shouldBreak and section = regex.exec expString
		start = section.index; length = section[0].length; end = start + length;

		# Pass off to the relevant expander functions
		if section[2] then eObj = expander.domBinding section[2], section[3], section[4]
		else if section[5] then eObj = expander.relativeObject section[5], section[6]
		else if section[7] then eObj = expander.localVariable section[7], vars
		else if section[8] then eObj = expander.globalVariable section[8], globals
		else if section[9] then eObj = expander.numberWithUnit section[9]
		else if section[12]
			contained = window.fashion.$parser.matchParenthesis regex, expString, end
			if !contained
				contained = expString.substring(end, expString.length - 1)
				shouldBreak = true

			length += contained.length + 1
			eObj = expander.function section[12], contained, vars, funcs, globals

		# Handle the expanded object (eObj)
		if !eObj then continue

		if eObj.script then replaceInScript start, length, eObj.script
		if eObj.dependencies then dependencies.push.apply dependencies, eObj.dependencies
		if eObj.functions then functions.push.apply functions, eObj.functions

		if eObj.dynamic == true then dynamic = true
		if eObj.individualized == true then individualized = true

		types.push(if eObj.type is undefined then $wf.$type.Unknown else eObj.type)
		units.push(eObj.unit || '')

	# Determine the type and unit of the complete expression
	{type: type, unit: unit} = $wf.$parser.determineExpressionType types, units

	# If the script sets a value, don't bother with units
	if expString.match /\s\=\s/g then unit = undefined

	# Wrap the script text in something useful
	# Top level returns a string, for the property
	# Other levels return an object, for function calls
	if top
		if unit then script = "return (#{script}) + '#{unit}'" 
		else script = "return #{script}" 

		# Attempt to make this function
		try
			# Function(variables, globals, functions, DOM Binding function, element)
			# "e" is only actually available for individualized expressions
			evaluate = Function("v","g","f","d","e",script)
		catch e
			console.log "[FASHION] Could not compile script: #{script}"
			throw e
			evaluate = undefined
	
	else script = "{value: #{script}, type: #{type}, unit: '#{unit}'}"

	# Return something useful for the parser
	return {
		type: type, unit: unit, 
		dynamic: dynamic, individualized: individualized,
		script: script, 
		evaluate: evaluate,
		dependencies: dependencies, functions: functions
	}


# Helper function to splice a string into another string
window.fashion.$parser.spliceString = (string, start, length, replacement) ->
	string.substr(0, start) + replacement + string.substr(start + length)


# Accumulate all text until the matching parenthesis
window.fashion.$parser.matchParenthesis = (regex, string, index) ->
	depth = 0
	acc = ""
	lastIndex = index
	while section = regex.exec string
		if section[0].indexOf("(") isnt -1 then depth++
		else if section[0].indexOf(")") isnt -1 then if depth-- is 0 then return acc
		else 
			acc += string.substr(lastIndex, (section.index - lastIndex) + section[0].length)
			lastIndex = section.index + section[0].length

# Determine the type and unit that an expression should return
# In the future conversions will go in here too.
window.fashion.$parser.determineExpressionType = (types, units) ->
	topType = topUnit = undefined
	for i, type of types

		# Figure out the expression's type
		if type is $wf.$type.Unknown then continue
		if !topType then topType = type
		else if type isnt topType 
			if type is $wf.$type.String then type = $wf.$type.String
			else
				console.log "[FASHION] Found mixed types in expression"
				return {}

		# Figure out the expression's unit
		if type is $wf.$type.Number
			unit = units[i]
			if unit is "" then continue
			if !topUnit then topUnit = unit
			else if unit isnt topUnit
				console.log "[FASHION] Conflicting units '#{unit}' and '#{typeUnit[1]}'"
				console.log "[FASHION] Unit conversion will be implemented in the future"
				return {}

	return {type: topType, unit: topUnit}


# Expand pieces of expressions into JSON objects containing JS code
window.fashion.$parser.expressionExpander =

	# Expand local variables
	localVariable: (name, vars) ->
		vObj = vars[name]
		if !vObj then return console.log "[FASHION] Variable $#{name} does not exist."

		return {
			type: vObj.type
			unit: vObj.unit
			dynamic: true
			script: "v.#{name}.value"
			dependencies: ["$#{name}"]
		}

	# Expand global variables
	globalVariable: (name, globals) ->
		name = name.toLowerCase()
		vObj = globals[name]
		if !vObj then return console.log "[FASHION] Variable $#{name} does not exist."

		return {
			type: vObj.type
			unit: vObj.unit
			dynamic: true
			script: "g.#{name}.get()"
			dependencies: ["@#{name}"]
		}

	# Expand numbers with units
	numberWithUnit: (value) ->
		numberType = window.fashion.$type.Number
		unittedValue = window.fashion.$run.getUnit(value, numberType, $wf.$type, $wf.$unit)
		if unittedValue.value is NaN then unittedValue.value = 0

		return {
			type: numberType,
			unit: unittedValue.unit
			script: unittedValue.value.toString()	
		}	

	# Expand relative object references (disguised as globals)
	relativeObject: (keyword, property) ->
		varName = if keyword is "parent" then "e.parent." else "e."

		# Determine the type based on the last property
		dotProperties = property.split(".")
		lastProperty = dotProperties[dotProperties.length - 1]

		if lastProperty in ["top","bottom","left","right","number","width","height"]
			type = $wf.$type.Number
			unit = "px"
		else 
			type = $wf.$type.String

		return {
			type: type, unit: unit,
			script: varName + property,
			dynamic: true
			individualized: true
		}

	# Expand DOM bindings
	domBinding: (selector, property, unit) ->
		individualized = selector.indexOf("self") isnt -1
		individualized ||= selector.indexOf("parent") isnt -1

		# Turn it into a full-on function call
		script = "d('#{selector}', #{'\'' + property + '\'' || 'undefined'}, e)" 

		return {
			type: if unit then $wf.$type.Number else $wf.$type.Unknown,
			unit: unit || "",
			script: script,
			dynamic: true
			individualized: individualized
		}

	# Expand functions, which involves expanding any arguments of theirs into expressions
	function: (name, argumentsString, vars, funcs, globals) ->

		fObj = funcs[name]
		if !fObj then return console.log "[FASHION] Function $#{name} does not exist."

		# Evaluate each argument separately
		if argumentsString.length > 1
			args = window.fashion.$parser.splitByTopLevelCommas argumentsString
			expressions = (for arg in args
				window.fashion.$parser.parseExpression(arg, vars, funcs, globals, false)
			)
		else expressions = []

		# Bundle everything together
		dependencies = []; functions = [name]; scripts = []; 
		individualized = fObj.individualized || false;
		dynamic = false;

		for expression in expressions
			if expression.dynamic is true then dynamic = true
			if expression.individualized is true then individualized = true
			dependencies.push.apply dependencies, expression.dependencies || []
			functions.push.apply functions, expression.functions || []
			scripts.push expression.script

		# Figure out units and such
		if fObj.unit isnt undefined then unit = fObj.unit
		else if fObj.unitFrom isnt undefined then unit = expressions[fObj.unitFrom].unit
		else unit = ""

		# Return a neat little package
		return {
			type: fObj.output, unit: unit,
			script: "f.#{name}.evaluate(#{scripts.join(',')})"
			dependencies: dependencies,
			functions: functions
			dynamic: dynamic
			individualized: individualized
		}
