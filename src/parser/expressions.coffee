# This is probably the most complicated file in Fashion, just a heads up
# Its role is to disassemble an implicit expression in Fashion and then
# piece it back together as valid Javascript, implying units as it goes.

# Recursively convert an expression string into a parse tree
# NOTE(keatontech): Yes, this is a very long function that violates the 40 line rule.
# I'm accepting suggestions for how to fix that.
window.fashion.$parser.parseExpression = 
(expString, linkId, parseTree, funcs, globals, top = true) ->

	expander = $wf.$parser.expressionExpander
	matchParens = window.fashion.$parser.matchParenthesis

	# Create some space
	script = expString; 
	mode = $wf.$runtimeMode.static

	# Track the types and units of things included in the expression
	types = []; units = []
	isSetter = false;

	# Method to replace pieces of the expression string within the script
	scriptOffset = 0
	replaceInScript = (start, length, string)->
		script = $wf.$parser.spliceString script, start + scriptOffset, length, string
		scriptOffset += string.length - length

	# Detect functions and variables
	regex = ///(
			\$([\w\-]+)\s*?\=|		# Expression sets a variable
			\@(self|this|parent)	# Relative element reference (name)
			\.?([^\s\)]*)|			# Relative element reference (property)
			\$([\w\-]+)|			# Defined variable
			\@([\w\-]+)|			# Global variable
			([\-]{0,1}				# Number with unit (negative)
			([\.]\d+|				# Number with unit (decimal at beginning)
			\d+(\.\d+)*)			# Number with unit (decimal in middle)
			[a-zA-Z]{1,4})|			# Number with unit (unit)
			([\w\-\@\$]*)\(|		# Function definition
			\(|\)([\S]*)			# Track depth and pull out function units
			)///g
	
	# Handle each piece
	shouldBreak = false
	while !shouldBreak and section = regex.exec expString
		start = section.index; length = section[0].length; end = start + length;

		# Sets a local variable (top-level or scoped)
		if section[2]
			eObj = expander.localVariable section[2], linkId, parseTree, true
			isSetter = true

		# @self, @this or @parent objects
		else if section[3] then eObj = expander.relativeObject section[3], section[4]

		# Local variable (top-level or scoped)
		else if section[5]
			eObj = expander.localVariable section[5], linkId, parseTree

		# Global variable
		else if section[6]
			eObj = expander.globalVariable section[6], globals, parseTree

		# Number with unit (constant)
		else if section[7] then eObj = expander.numberWithUnit section[7]

		# Functions
		else if section[10]

			# We have to match parenthesis to get the whole function body
			{body: contained, unit: tailingUnit} = matchParens regex, expString, end
			if !contained
				contained = expString.substring(end, expString.length - 1)
				shouldBreak = true

			# Track how long this function call is in the script
			length += contained.length + 1
			if tailingUnit then length += tailingUnit.length

			# Wow this function has a lot of arguments!
			eObj = expander.function(section[10], contained, tailingUnit, linkId, 
				parseTree, funcs, globals)


		# Not all of these will generate something useful
		if !eObj then continue

		# Handle the expanded object (eObj)
		if eObj.script then replaceInScript start, length, eObj.script
		if eObj.mode then mode |= eObj.mode

		types.push(if eObj.type is undefined then $wf.$type.Unknown else eObj.type)
		units.push(eObj.unit || '')


	# Determine the type and unit of the complete expression
	{type: type, unit: unit} = $wf.$parser.determineExpressionType types, units

	# If the script sets a value, don't bother with units
	if isSetter then unit = undefined

	# Wrap the script with return statements and such
	script = $wf.$parser.wrapExpressionScript script, top, type, unit
	
	# Return something useful for the parser
	expr = new Expression script, type, unit, mode
	if top then expr.generate() # Create a function based on the script
	return expr


# Wrap the script text in something useful
# Top level returns a string, for the property
# Other levels return an object, for function calls
window.fashion.$parser.wrapExpressionScript = (script, top, type, unit) ->
	if top
		if unit and typeof unit is "string" then "return (#{script}) + '#{unit}'"
		else "return #{script}" 
	else "{value: #{script}, type: #{type}, unit: '#{unit}'}"


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
			return {body: acc, unit: section[11]}
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


# Expands simple expressions with only one component into Expression objects
window.fashion.$parser.expressionExpander =

	# Expand local variables
	localVariable: (name, selectorId, parseTree, isSetter = false) ->
		vars = parseTree.variables
		selectors = vars[name]
		if !selectors then return console.log "[FASHION] Variable $#{name} does not exist."

		# Anything with a non-top-level variable needs to be individualized
		isIndividual = false
		type = unit = -1
		for selector, vObj of selectors
			if selector isnt 0 then isIndividualized = false
			type = vObj.type
			unit = vObj.unit

		
		if isSetter 
			# Setters do not need to be linked. This setter just uses a straight up equals
			script = "v('#{name}'#{if isIndividual then ',e' else ''}).value ="

		else
			# Link this variable in the parse tree
			parseTree.addVariableBinding selectorId, name
			script = "v('#{name}'#{if isIndividual then ',e' else ''}).value"

		# Has to account for the fact that variables can also be expressions
		mode = $wf.$runtimeMode.generate(true, isIndividual)
		return new Expression script, type, unit, mode


	# Expand global variables
	globalVariable: (name, globals, parseTree) ->
		name = name.toLowerCase()
		vObj = globals[name]
		if !vObj then return console.log "[FASHION] Variable $#{name} does not exist."

		# Add a global-module dependency
		parseTree.addGlobalDependency name, vObj

		dynamicMode = $wf.$runtimeMode.dynamic
		script = "g.#{name}.get()"
		return new Expression script, vObj.type, vObj.unit, dynamicMode


	# Expand numbers with units
	numberWithUnit: (value) ->
		numberType = window.fashion.$type.Number
		staticMode = $wf.$runtimeMode.static
		unitValue = window.fashion.$shared.getUnit(value, numberType, $wf.$type, $wf.$unit)
		if unitValue.value is NaN then unitValue.value = 0
		return new Expression unitValue.value, numberType, unitValue.unit, staticMode


	# Expand relative object references (disguised as globals)
	relativeObject: (keyword, property) ->
		varName = if keyword is "parent" then "e.parent" else "e"

		# Determine the type based on the last property
		dotProperties = property.split(".")
		lastProperty = dotProperties[dotProperties.length - 1]

		# Try and guess the type of the value
		if lastProperty in ["top","bottom","left","right","number","width","height"]
			type = $wf.$type.Number
			unit = "px"
		else 
			type = $wf.$type.String

		# Generate a very simple script that looks up a property of the object
		script = varName
		if property then script += "." + property
		return new Expression script, type, unit, $wf.$runtimeMode.individual


	# Expand functions, which involves expanding any arguments of theirs into expressions
	function: (name, argumentsString, inputUnit, linkId, parseTree, funcs, globals) ->
		vars = parseTree.variables

		# Make sure the function actually exists before continuing on
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
		scripts = ["t"]
		mode = fObj.mode
		for expr in expressions when expr instanceof Expression
			mode |= expr.mode
			scripts.push expr.script

		# Figure out the return units of the function
		if fObj.unit isnt "" then unit = fObj.unit
		else if fObj.unitFrom isnt undefined then unit = expressions[fObj.unitFrom].unit
		else unit = ""

		# Add the function dependency to the parse tree
		parseTree.addFunctionDependency name, fObj

		# Return a neat little package
		script = "f['#{name}'].get.call(#{scripts.join(',')})"
		return new Expression script, fObj.type, inputUnit || unit, mode
