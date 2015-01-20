# Separate the text into a list of selectors
# variables, and blocks
window.fashion.$parser.parseSections = (fashionText, parseTree) ->

	# Regex parses out the important bits, but doesn't count brackets
	regex = ///(
			[\s]*(							# Padded with whitespace
			\$([\w\-]+)\:[\s]*(.*?)			# Variable definitions
			\s*(![A-z0-9\-]+?)?[;\n]| 		# Flags on variables, like !static
			\@([\w\-]+)[\s]*				# Block header
			(.*?)[\s]*[\{\n;]|				# Block arguments and body
			(.*?)[\s]*?\{)|					# Beginning of selector
			\{|\}							# Opening and closing brackets
			)///g


	while segment = regex.exec fashionText
		if segment.length < 8 or !segment[0] then break # Sanity Check

		# Parse out top-level variables
		if segment[3] and segment[4]
			$wf.$parser.addVariable parseTree, segment[3], segment[4], segment[5]

		# Parse blocks
		else if segment[6]
			startIndex = segment.index + segment[0].length

			# Parse out the arguments
			if segment[7] then blockArgs = $wf.$parser.splitByTopLevelSpaces segment[7]
			else blockArgs = [] 

			# Get the block's body, if it exists
			hasBody = segment[0].indexOf("{") isnt -1
			if hasBody
				body = window.fashion.$parser.parseBlock fashionText, regex, startIndex
			else body = ""

			# Add the block object
			parseTree.addBlock
				type: segment[6],
				arguments: blockArgs,
				body: body

			# Add the block dependency
			parseTree.addBlockDependency segment[6], $wf.$blocks[segment[6]]

		# Parse selectors and add them to the parse tree
		else if segment[8]
			window.fashion.$parser.parseSelector(parseTree, fashionText, segment[8],
				regex, segment.index + segment[0].length)

		# Otherwise we might have a problem
		# TODO(keatontech): Better error handling here. Heh.
		else 
			console.log "[FASHION] Problem around '#{segment[0]}';"

	# Return something nice
	return parseTree


# Separate nested selectors into a flat list of selectors
# and retrieves their properties.
window.fashion.$parser.parseSelector = (parseTree, fashionText, name, regex, lastIndex) ->

	# This object will be populated with selectors & their bodies and returned
	selectors = [$wf.$parser.createSelector(parseTree, name)]

	bracketDepth = 1 	# Track how nested the current selector is.
	selectorStack = [0] # Stack to track names and inheritance of nested selectors

	# Continue parsing as long as we're inside the original brackets
	while bracketDepth > 0 and segment = regex.exec fashionText

		# Add the elapsed text to the top selector
		topSel = selectors[selectorStack[selectorStack.length - 1]]
		topSel.addToBody fashionText.substring(lastIndex, segment.index)
		lastIndex = segment.index + segment[0].length

		# Simple enough.
		if segment[0] is "}"
			selectorStack.pop()
			bracketDepth--

		# Pass in variable declarations and blocks
		else if segment[3] and segment[4]
			name = segment[3]
			value = segment[4]

			flag = value.match /![a-zA-Z\-]*?$/
			value.replace flag, ""

			$wf.$parser.parseScopedVariable name, value, flag, topSel, parseTree

		# Pass through blocks
		else if segment[6]
			topSel.addToBody fashionText.substring(segment.index, lastIndex)

		# We need to go deeper.
		else if segment[8]

			# Generate the name of this new selector
			name = $wf.$parser.nestSelector topSel.rawName, segment[8]

			# Add this selector
			selectors.push($wf.$parser.createSelector(parseTree, name, topSel))
			selectorStack.push selectors.length - 1

			# Selector segments include a bracket
			bracketDepth++

	# Return the selectors
	return selectors


# Generates a nested selector from an inner one and an outer one
window.fashion.$parser.nestSelector = (outer, inner) ->
	acc = []
	if !outer then return inner
	if !inner then return outer

	for ostring in outer.split ","
		ostring = ostring.trim() + "##"
		for istring in inner.split ","
			istring = istring.trim()

			# Selectors prefixed with '&' are part of the same object
			if istring[0] is "&"
				acc.push ostring + istring.substr(1);

			# Selectors prefixed with '^' use Fashion's selector combination algoritm
			# This means 'any element that matches this selector and has a parent matching
			# the parent selector, or itself matches the parent selector'
			else if istring[0] is "^"
				combined = $wf.$shared.combineSelectors ostring, istring.substr(1)
				if !combined
					console.log "[FASHION] Could not combine selectors."
					console.log ostring, istring.substr(1)
					acc.push ostring + " " + istring
				else acc.push combined

			# Otherwise, selectors are assumed to be direct children
			else
				acc.push ostring + " " + istring

	return acc.join ","


# Make a new selector and parse the variables out of its name, if necessary
window.fashion.$parser.createSelector = (parseTree, name, nestParent) ->

	# Create the selector and add it to the parse tree
	selector = new Selector(name, undefined, nestParent)
	parseTree.addSelector selector

	# If there are no variables, return here (and strip the ## ID marker)
	if name.indexOf("$") == -1
		selector.name = selector.name.replace /\#\#/g, ""
		return selector

	# Little mini expression generator going on here
	script = "return "; lastIndex = 0
	bindings = new ExpressionBindings()

	# Search for variable names
	regex = /\$([\w\-]+)/g
	mode = $wf.$runtimeMode.dynamic
	while foundVar = regex.exec name

		# Add the previous piece to the expression
		if foundVar.index > lastIndex
			script += "'#{name.substring(lastIndex, foundVar.index)}'+"
		lastIndex = foundVar.index + foundVar[0].length

		# Create a variable sub-expression
		expander = $wf.$parser.expressionExpander.localVariable
		vExpr = expander foundVar[1], parseTree, nestParent
		if !vExpr then continue

		# Use its results
		bindings.extend vExpr.bindings
		script += vExpr.script + "+"

		# If the variable is scoped, we'll need to note that
		if (vExpr.mode & $wf.$runtimeMode.scoped) is $wf.$runtimeMode.scoped
			parseTree.addRequirements [$wf.$runtimeCapability.scopedSelector]
			mode |= $wf.$runtimeMode.scoped

	# Add the end of the string if necessary
	if name.length > lastIndex then script += "'#{name.substr(lastIndex)}'+"

	# Make an expression from this whole mess
	trimmed = script.substr(0, script.length - 1)

	# If the value is not scoped, we can remove the ## ID placeholder
	if (mode & $wf.$runtimeMode.scoped) isnt $wf.$runtimeMode.scoped
		trimmed = trimmed.replace /\#\#/g, ""

	selector.mode = mode
	selector.name = new Expression(trimmed, $wf.$type.String, 0, bindings, mode)
	selector.name.generate()
	return selector


# Get everything inside a block as text by counting brackets
window.fashion.$parser.parseBlock = (fashionText, regex, startIndex) ->
	# Some helpful variables
	bracketDepth = 1
	endIndex = startIndex

	# Continue parsing as long as we're inside the original brackets
	while bracketDepth > 0 and segment = regex.exec fashionText

		# Figure out where to start
		endIndex = segment.index + segment[0].length

		# Simple enough.
		if segment[0] is "}" then bracketDepth--
		else if segment[0] is "{" then bracketDepth++
		else if segment[8] then bracketDepth++ # Nested Selector
		else if segment[6] 
			if segment[0].indexOf("{") isnt -1
				bracketDepth++ # Nested Block

	# Return the selectors
	return fashionText.substring(startIndex, endIndex - 1).trim()
