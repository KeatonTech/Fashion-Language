# This is probably the most complicated file in Fashion, just a heads up
# Its role is to disassemble an implicit expression in Fashion and then
# piece it back together as valid Javascript, implying units as it goes.

# Recursively convert an expression string into a parse tree
window.fashion.$parser.parseExpression = 
(expString, linkId, parseTree, funcs, globals, top = true) ->

	expander = $wf.$parser.expressionExpander
	matchParens = window.fashion.$parser.matchParenthesis

	# Create some space
	script = expString; 
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
			\@(self|this|parent)	# Relative element reference (name)
			\.?([^\s\)]*)|			# Relative element reference (property)
			\$([\w\-]+)|			# Defined variable
			\@([\w\-]+)|			# Global variable
			([\-]{0,1}				# Number with unit (negative)
			([\.]{0,1}\d+|			# Number with unit (decimal at beginning)
			\d+(\.\d*)?)			# Number with unit (decimal in middle)
			[a-zA-Z]{1,4})|			# Number with unit (unit)
			([\w\-\@\$]*)\(|		# Function definition
			\(|\)([\S]*)			# Track depth and pull out function units
			)///g
	
	# Handle each piece
	shouldBreak = false
	while !shouldBreak and section = regex.exec expString
		start = section.index; length = section[0].length; end = start + length;

		# Pass off to the relevant expander functions
		if section[2] then eObj = expander.relativeObject section[2], section[3]
		else if section[4] then eObj = expander.localVariable section[4], linkId, parseTree
		else if section[5] then eObj = expander.globalVariable section[5], globals,parseTree
		else if section[6] then eObj = expander.numberWithUnit section[6]
		else if section[9]
			{body: contained, unit: funit} = matchParens regex, expString, end
			if !contained
				contained = expString.substring(end, expString.length - 1)
				shouldBreak = true

			length += contained.length + 1
			if funit then length += funit.length
			eObj = expander.function(section[9], contained, funit, 
				linkId, parseTree, funcs, globals)

		# Handle the expanded object (eObj)
		if !eObj then continue
		if eObj.script then replaceInScript start, length, eObj.script

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
		if unit and typeof unit is "string" then script = "return (#{script}) + '#{unit}'"
		else script = "return #{script}" 

		# Attempt to make this function
		try
			# Function(variables, globals, functions, execution environment, element)
			# "e" is only actually available for individualized expressions
			evaluate = Function("v","g","f","t","e",script)
		catch e
			console.log "[FASHION] Could not compile script: #{script}"
			throw e
			evaluate = undefined
	
	else script = "{value: #{script}, type: #{type}, unit: '#{unit}'}"
	
	# Return something useful for the parser
	return new Expression script, type, unit, dynamic, individualized


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
		else if section[0].indexOf(")") isnt -1 and depth-- is 0
			acc += string.substr(lastIndex, (section.index - lastIndex))
			return {body: acc, unit: section[10]}
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
			if type is $wf.$type.String then topType = $wf.$type.String
			else
				console.log "[FASHION] Found mixed types in expression"
				return {}

		# Figure out the expression's unit
		if type is $wf.$type.Number or type is $wf.$type.Color
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
	localVariable: (name, selectorId, parseTree) ->
		vars = parseTree.variables
		selectors = vars[name]
		if !selectors then return console.log "[FASHION] Variable $#{name} does not exist."

		# Anything with a non-top-level variable needs to be individualized
		isIndividualized = false
		type = unit = -1
		for selector, vObj of selectors
			if selector isnt 0 then isIndividualized = false
			type = vObj.type
			unit = vObj.unit

		# The script depends on whether it's individualized or not
		if isIndividualized then script = "v.f('#{name}').value" # f for find
		else script = "v.t.#{name}.value" # t for top

		# Link this variable in the parse tree
		parseTree.addVariableBinding selectorId, name

		return {
			type: type, unit: unit
			dynamic: true, individualized: isIndividualized
			script: script
		}

	# Expand global variables
	globalVariable: (name, globals, parseTree) ->
		name = name.toLowerCase()
		vObj = globals[name]
		if !vObj then return console.log "[FASHION] Variable $#{name} does not exist."

		# Add a dependency
		parseTree.addGlobalDependency name, vObj

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
		varName = if keyword is "parent" then "e.parent" else "e"

		# Determine the type based on the last property
		dotProperties = property.split(".")
		lastProperty = dotProperties[dotProperties.length - 1]

		if lastProperty in ["top","bottom","left","right","number","width","height"]
			type = $wf.$type.Number
			unit = "px"
		else 
			type = $wf.$type.String

		script = varName
		if property then script += "." + property

		return {
			type: type, unit: unit,
			script: script,
			dynamic: true
			individualized: true
		}

	# Expand functions, which involves expanding any arguments of theirs into expressions
	function: (name, argumentsString, inputUnit, linkId, parseTree, funcs, globals) ->
		vars = parseTree.variables

		fObj = funcs[name]
		if !fObj then return console.log "[FASHION] Function $#{name} does not exist."

		# Evaluate each argument separately
		if argumentsString.length > 1
			args = window.fashion.$parser.splitByTopLevelCommas argumentsString
			expressions = (for arg in args
				window.fashion.$parser.parseExpression(
					arg, linkId, parseTree, funcs, globals, false)
			)
		else expressions = []

		# Bundle everything together
		scripts = ["t"]; 
		individualized = fObj.individualized || false;
		dynamic = fObj.dynamic || false;

		for expression in expressions
			if expression.dynamic is true then dynamic = true
			if expression.individualized is true then individualized = true
			scripts.push expression.script

		# Figure out units and such
		if fObj.unit isnt undefined then unit = fObj.unit
		else if fObj.unitFrom isnt undefined then unit = expressions[fObj.unitFrom].unit
		else unit = ""

		# Add the dependency
		parseTree.addFunctionDependency name, fObj

		# Return a neat little package
		return {
			type: fObj.output, unit: inputUnit || unit,
			script: "f['#{name}'].evaluate.call(#{scripts.join(',')})"
			dynamic: dynamic
			individualized: individualized
		}
