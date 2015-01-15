# This is probably the most complicated file in Fashion, just a heads up
# Its role is to disassemble an implicit expression in Fashion and then
# piece it back together as valid Javascript, implying units as it goes.

# Recursively convert an expression string into a parse tree
# NOTE(keatontech): Yes, this is a very long function that violates the 40 line rule.
# I'm accepting suggestions for how to fix that.
window.fashion.$parser.parseExpression = 
(expString, parseTree, funcs, globals, top = true, hideUnits = false, wrap = true) ->

	expander = $wf.$parser.expressionExpander
	matchParens = window.fashion.$parser.matchParenthesis

	# top: Expression is not within another expression, should include 'return'
	# hideUnits: Expression is pre-unitted by another expression, do not append
	# wrap: Expression should return an object including its type and unit
	makeExpression = $wf.$parser.makeExpression.bind this, top, hideUnits, wrap

	# Create some space
	script = expString; 
	mode = $wf.$runtimeMode.static
	bindings = new ExpressionBindings

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
			\@(self|this|parent)\.?	# Relative element reference (name)
			([a-zA-Z0-9\-\_\.]*)|	# Relative element reference (property)
			\$([\w\-]+)|			# Defined variable
			\@([\w\-]+)|			# Global variable
			(\#[0-9A-Fa-f]{3,6})| 	# CSS Hex Color (passthrough)
			([\-]{0,1}				# Number with unit (negative)
			([\.]\d+|				# Number with unit (decimal at beginning)
			\d+(\.\d+)*)			# Number with unit (decimal in middle)
			[a-zA-Z]{1,4})|			# Number with unit (unit)
			([\w\-\@\$]*)\(|		# Function definition
			\)([^\s\)]*)|			# Pull out function units
			if(.*?)then(.*?)		# Coffeescript-style ternary operator
			else(.*)|				# With else
			if(.*?)then(.*)|		# Without else
			\`(.*?)\`				# Raw value passthrough (prevents string coersion)
			)///g
	
	# Handle each piece
	shouldBreak = false
	matchCount = 0
	while !shouldBreak and section = regex.exec expString
		matchCount++
		eObj = undefined
		start = section.index; length = section[0].length; end = start + length;

		# Sets a local variable (top-level or scoped)
		if section[2]
			eObj = expander.localVariable section[2], parseTree, true
			isSetter = true

		# @self, @this or @parent objects
		else if section[3] then eObj = expander.relativeObject section[3], section[4]

		# Local variable (top-level or scoped)
		else if section[5]
			eObj = expander.localVariable section[5], parseTree

		# Global variable
		else if section[6]
			eObj = expander.globalVariable section[6], globals, parseTree

		# CSS Hex Color
		else if section[7] then eObj = expander.hexColor section[7]

		# Number with unit (constant)
		else if section[8] then eObj = expander.numberWithUnit section[8]

		# Functions
		else if section[11]

			# We have to match parenthesis to get the whole function body
			{body: contained, unit: tailingUnit} = matchParens regex, expString, end
			if !contained
				contained = expString.substring(end, expString.length - 1)
				shouldBreak = true

			# Track how long this function call is in the script
			length += contained.length + 1
			if tailingUnit then length += tailingUnit.length

			# Wow this function has a lot of arguments!
			eObj = expander.function section[11], contained, tailingUnit, arguments

		# Ternary with else
		if section[13] 
			eObj = expander.ternary section[13], section[14], section[15], arguments, top

		# Ternary without else
		if section[16] 
			eObj = expander.ternary section[16], section[17], undefined, arguments, top

		# Passthrough a CSS/JS constant
		if section[18]
			eObj = expander.constant section[18]



		# Not all of these will generate something useful
		if !eObj then continue

		# Handle the expanded object (eObj)
		if eObj.script then replaceInScript start, length, eObj.script
		if eObj.mode then mode |= eObj.mode
		if eObj.bindings then bindings.extend eObj.bindings

		types.push(if eObj.type is undefined then $wf.$type.Unknown else eObj.type)
		units.push(eObj.unit || '')


	# If nothing matched, we can coerce it into a string, boolean or number 
	if matchCount is 0
		if !expString.match(/[^0-9\-\.\s]/)
			# Unitless number
			return makeExpression expString, $wf.$type.Number, '', undefined, 0
		else if expString.toLowerCase() is "true" or expString.toLowerCase() is "false"
			# Javascript Boolean
			return makeExpression expString, $wf.$type.Boolean, '', undefined, 0
		else
			# String or constant
			expString = JSON.stringify expString.trim()
			return makeExpression expString, $wf.$type.String, '', undefined, 0

	# Determine the type and unit of the complete expression
	{type: type, unit: unit} = $wf.$parser.determineExpressionType types, units, expString

	# If the script sets a value, don't bother with units
	if isSetter then unit = undefined
	
	# Return something useful for the parser
	expr = makeExpression script, type, unit, bindings, mode
	if top then expr.generate() # Create a function based on the script
	return expr


# Make a new expression object and wrap its script
window.fashion.$parser.makeExpression = 
(top, hideUnits, wrap, script, type, unit, bind, mode) ->
	script = $wf.$parser.wrapExpressionScript top, hideUnits, wrap, script, type, unit
	return new Expression script, type, unit, bind, mode


# Wrap the script text in something useful
# Top level returns a string, for the property
# Other levels return an object, for function calls
window.fashion.$parser.wrapExpressionScript = (top, hideUnits, wrap, script, type, unit) ->
	if !wrap
		if !hideUnits and unit and typeof unit is "string"
			"(#{script}) + '#{unit}'"
		else "#{script}" 
	else if top
		if !hideUnits and unit and typeof unit is "string"
			"return (#{script}) + '#{unit}'"
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
			return {body: acc, unit: section[12]}
		else
			acc += string.substr(lastIndex, (section.index - lastIndex) + section[0].length)
			lastIndex = section.index + section[0].length

	console.log "[FASHION] Could not match parens: #{string}"


# Determine the type and unit that an expression should return
# In the future conversions will go in here too.
window.fashion.$parser.determineExpressionType = (types, units, expression) ->
	topType = topUnit = undefined
	for i, type of types

		# Figure out the expression's type
		if type is $wf.$type.Unknown then continue
		if !topType then topType = type
		else if type isnt topType 
			if type is $wf.$type.String then topType = $wf.$type.String
			else
				console.log "[FASHION] Found mixed types in expression: '#{expression}'"
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

	# Expand css/js constants
	constant: (match) ->
		return new Expression match, $wf.$type.Unknown, "", undefined, 0		

	# Expand css hex colors
	hexColor: (match) ->
		return new Expression JSON.stringify(match), $wf.$type.Color, "", undefined, 0	

	# Expand local variables
	localVariable: (name, parseTree, isSetter = false) ->
		vars = parseTree.variables
		selectors = vars[name]
		if !selectors then return console.log "[FASHION] Variable $#{name} does not exist."

		# Anything with a non-top-level variable needs to be individualized
		isIndividual = false
		type = unit = mode = -1
		for selector, vObj of selectors
			if selector isnt 0 then isIndividualized = false
			type = vObj.type
			unit = vObj.unit
			mode = vObj.mode

		if isSetter 
			# Setters do not need to be linked. This setter just uses a straight up equals
			script = "v('#{name}'#{if isIndividual then ',e' else ''}).value ="

		else
			# Link this variable in the parse tree
			bindings = new ExpressionBindings "variable", name
			script = "v('#{name}'#{if isIndividual then ',e' else ''}).value"

		# Has to account for the fact that variables can also be expressions
		mode = if isIndividual then mode | $wf.$runtimeMode.individual else mode
		return new Expression script, type, unit, bindings, mode


	# Expand global variables
	globalVariable: (name, globals, parseTree) ->
		name = name.toLowerCase()
		vObj = globals[name]
		if !vObj then return console.log "[FASHION] Variable $#{name} does not exist."

		# Add a global-module dependency
		parseTree.addGlobalDependency name, vObj
		bindings = new ExpressionBindings "global", name

		script = "g.#{name}.get()"
		return new Expression script, vObj.type, vObj.unit, bindings, vObj.mode


	# Expand numbers with units
	numberWithUnit: (value) ->
		numberType = window.fashion.$type.Number
		mstatic = $wf.$runtimeMode.static
		unitValue = window.fashion.$shared.getUnit(value, numberType, $wf.$type, $wf.$unit)
		if unitValue.value is NaN then unitValue.value = 0
		return new Expression unitValue.value, numberType, unitValue.unit, false, mstatic


	# Expand relative object references (disguised as globals)
	relativeObject: (keyword, property) ->

		# Handle parent
		if keyword is "parent" then property = ".parent"+property

		# Determine the type based on the last property
		dotProperties = property.split(".")
		lastProperty = dotProperties[dotProperties.length - 1]

		# Try and guess the type of the value
		if !property?
			type = $wf.$type.Element

		else if lastProperty in ["top","bottom","left","right","number","width","height"]
			type = $wf.$type.Number
			unit = "px"
		else 
			type = $wf.$type.String

		# Generate a very simple script that looks up a property of the object
		if property then script = "e('#{property}','#{keyword}')"

		# If there's no property, make it return the object itself
		else script = "e(void 0, #{JSON.stringify keyword})"

		return new Expression script, type, unit, false, $wf.$runtimeMode.individual


	# Expand functions, which involves expanding any arguments of theirs into expressions
	function: (name, argumentsString, inputUnit, parseArgs) ->
		[ogstring, parseTree, funcs, globals] = parseArgs
		vars = parseTree.variables

		# Make sure the function actually exists before continuing on
		fObj = funcs[name]
		if !fObj then return console.log "[FASHION] Function $#{name} does not exist."

		# Evaluate each argument separately
		if argumentsString.length > 1
			args = window.fashion.$parser.splitByTopLevelCommas argumentsString
			expressions = []
			namedArgs = []
			for arg in args

				# Named argument
				if argComponents = arg.match /([a-zA-Z0-9\-\'\"]+)\s*\:\s*(.*)/
					objectProp = "'#{argComponents[1]}': "
					objectProp += window.fashion.$parser.parseExpression(
						argComponents[2], parseTree, funcs, globals, 0).script
					namedArgs.push objectProp

				# Normal argument
				else
					expressions.push window.fashion.$parser.parseExpression(
						arg, parseTree, funcs, globals, false)

			# Add the named arguments as an object at the end
			if namedArgs.length > 0 then expressions.push script: "{#{namedArgs.join(',')}}"
			
		else expressions = []

		# Bundle everything together
		scripts = ["t"]
		mode = fObj.mode
		bindings = new ExpressionBindings
		for expr in expressions when expr.script?
			mode |= expr.mode
			scripts.push expr.script
			bindings.extend expr.bindings

		# Figure out the return units of the function
		if fObj.unit isnt "" then unit = fObj.unit
		else if fObj.unitFrom isnt undefined then unit = expressions[fObj.unitFrom].unit
		else unit = ""

		# Add the function dependency to the parse tree
		parseTree.addFunctionDependency name, fObj

		# Return a neat little package
		script = "f['#{name}'].get.call(#{scripts.join(',')})"
		return new Expression script, fObj.type, inputUnit || unit, bindings, mode


	# Expand ternary operators
	ternary: (ifExp, trueExp, falseExp, parseArgs, top) ->
		[ogstring, parseTree, funcs, globals] = parseArgs
		bindings = new ExpressionBindings
		mode = 0

		# Expand all the arguments
		parse = (arg) -> 
			e = window.fashion.$parser.parseExpression(
				arg, parseTree, funcs, globals, false, true, false)
			bindings.extend e.bindings
			mode |= e.mode
			return e

		ifExp = parse ifExp.trim()
		trueExp = parse trueExp.trim()
		falseExp = parse falseExp.trim()

		# Type checking
		if trueExp.type isnt falseExp.type
			return console.log "[FASHION] Ternary results must return the same type"
		if trueExp.unit isnt falseExp.unit
			return console.log "[FASHION] Ternary results must return the same unit"

		# JS-style ternary
		script = "(#{ifExp.script} ? #{trueExp.script} : #{falseExp.script})"
		return new Expression script, trueExp.type, trueExp.unit, bindings, mode

