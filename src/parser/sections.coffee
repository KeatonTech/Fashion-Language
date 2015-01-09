# Separate the text into a list of selectors
# variables, and blocks
window.fashion.$parser.parseSections = (fashionText, parseTree) ->

	# Regex parses out the important bits, but doesn't count brackets
	regex = ///(
			[\s]*(							# Padded with whitespace
			\$([\w\-]+)\:[\s]*(.*?)			# Variable definitions
			\s*(![A-z0-9\-]+?)?[;\n]| 		# Flags on variables, like !static
			\@([\w\-]+)[\s]*(.*?)[\s]*\{| 	# Beginning of blocks
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

			# Add the block object
			parseTree.addBlock
				type: segment[6],
				arguments: blockArgs,
				body: window.fashion.$parser.parseBlock fashionText, regex, startIndex

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

		# Pass in variable declarations.
		else if segment[3] and segment[4]
			topSel.addToBody fashionText.substring(segment.index, lastIndex)

		# We need to go deeper.
		else if segment[8]

			# Generate the name of this new selector
			name = $wf.$parser.nestSelector topSel.rawName, segment[8]

			# Add this selector
			selectors.push($wf.$parser.createSelector(parseTree, name))
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
		ostring = ostring.trim()
		for istring in inner.split ","
			istring = istring.trim()

			# Properties prefixed with '&' are part of the same object
			if istring[0] is "&"
				acc.push ostring + istring.substr(1);
			else
				acc.push ostring + " " + istring

	return acc.join ","


# Make a new selector and parse the variables out of its name, if necessary
window.fashion.$parser.createSelector = (parseTree, name) ->

	# Create the selector and add it to the parse tree
	selector = new Selector(name)
	parseTree.addSelector selector

	# If there are no variables, return here
	if name.indexOf("$") == -1 then return selector

	# Little mini expression generator going on here
	script = "return "; lastIndex = 0
	bindings = new ExpressionBindings()

	# Search for variable names
	regex = /\$([\w\-]+)/g
	while foundVar = regex.exec name

		# Add the previous piece to the expression
		if foundVar.index > lastIndex
			script += "'#{name.substring(lastIndex, foundVar.index)}'+"
		lastIndex = foundVar.index + foundVar[0].length

		# Create a variable sub-expression
		expander = $wf.$parser.expressionExpander.localVariable
		vExpr = expander foundVar[1], parseTree

		# Use its results
		bindings.extend vExpr.bindings
		script += vExpr.script + "+"

	# Add the end of the string if necessary
	if name.length > lastIndex then script += "'#{name.substr(lastIndex)}'+"

	# Make an expression from this whole mess
	trimmed = script.substr(0, script.length - 1)
	dmode = selector.mode = $wf.$runtimeMode.dynamic
	selector.name = new Expression(trimmed, $wf.$type.String, 0, bindings, dmode)
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
		else if segment[6] then bracketDepth++ # Nested Block
		else if segment[8] then bracketDepth++ # Nested Selector

	# Return the selectors
	return fashionText.substring(startIndex, endIndex - 1).trim()
