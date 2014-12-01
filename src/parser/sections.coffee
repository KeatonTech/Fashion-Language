# Separate the text into a list of selectors
# variables, and blocks
window.fashion.$parser.parseSections = (fashionText) ->

	# Everything needs to get put somewhere
	variables = {}; selectors = {}; blocks = []

	# Regex parses out the important bits, but doesn't count brackets
	regex = ///(
			[\s]*(							# Padded with whitespace
			\$([\w\-]+)\:[\s]*(.*?)\;|		# Variable definitions
			\@([\w\-]+)[\s]*(.*?)[\s]*\{| 	# Beginning of blocks
			(.*?)[\s]*?\{)|					# Beginning of selector
			\{|\}							# Opening and closing brackets
			)///g


	while segment = regex.exec fashionText
		if segment.length < 8 or !segment[0] then break # Sanity Check

		# Parse out variables
		if segment[3] and segment[4]
			variables[segment[3]] = {raw: segment[4]}

		# Parse blocks
		else if segment[5]
			startIndex = segment.index + segment[0].length

			# Parse out the arguments
			if segment[6] then blockArgs = $wf.$parser.splitByTopLevelSpaces segment[6]
			else blockArgs = []

			blocks.push
				type: segment[5],
				arguments: blockArgs,
				body: window.fashion.$parser.parseBlock fashionText, regex, startIndex

		# Parse selectors
		else if segment[7]
			newSels = window.fashion.$parser.parseSelector(
				fashionText, segment[7], regex, segment.index + segment[0].length)

			# Make sure we don't end up with any duplicate selectors
			for sObj in newSels
				if selectors[sObj.name] then selectors[sObj.name] += sObj.value
				else selectors[sObj.name] = sObj.value

		# Otherwise we might have a problem
		# TODO(keatontech): Better error handling here
		else console.log "There's a problem somewhere in your file. Sorry."

	# Return something nice
	return {variables: variables, selectors: selectors, blocks: blocks, globals: {}}


# Separate nested selectors into a flat list of selectors
# and retrieves their properties.
window.fashion.$parser.parseSelector = (fashionText, name, regex, lastIndex) ->

	# Some helpful variables
	selectors = [{name: name, value: ""}]
	bracketDepth = 1
	selectorStack = []

	# Figure out what to name nested selectors
	selectorStack = []
	selectorStack.push name

	# Continue parsing as long as we're inside the original brackets
	while bracketDepth > 0 and segment = regex.exec fashionText

		# Add the elapsed text to the top selector
		stackName = selectorStack[selectorStack.length - 1]
		for sel in selectors
			if sel.name is stackName 
				topSel = sel
				break

		topSel.value += fashionText.substring(lastIndex, segment.index)
		lastIndex = segment.index + segment[0].length

		# Simple enough.
		if segment[0] is "}"
			selectorStack.pop()
			bracketDepth--

		# We need to go deeper.
		else if segment[7]

			# Selectors that start with & don't have a space
			name = undefined
			if segment[7][0] is "&"
				name = stackName + segment[7].substr(1)
			else
				name = stackName + " " + segment[7]

			# Add this selector
			selectorStack.push name
			selectors.push {name: name, value: ""}

			# Selector segments include a bracket
			bracketDepth++

	# Return the selectors
	return selectors


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
		else if segment[5] then bracketDepth++ # Nested Block
		else if segment[7] then bracketDepth++ # Nested Selector

	# Return the selectors
	return fashionText.substring(startIndex, endIndex - 1).trim()
