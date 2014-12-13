# Parses fashion code into a tree structure
window.fashion.$parser =

	# Entry point into the parser
	parse: (fashionText) ->

		parseTree = new ParseTree()

		# Split the file into top-level sections
		parseTree = $wf.$parser.parseSections(fashionText, parseTree)

		# Parse each selector body into individual properties and variables
		for i, sel of parseTree.selectors
			$wf.$parser.parseSelectorBody(sel.body, sel, parseTree)

		# Return parse object
		return parseTree


# Adds a variable object
window.fashion.$parser.addVariable = (parseTree, name, value) ->

	# Make a variable object
	variableObject = new Variable name, value
	parseTree.addVariable variableObject

	# Make sure the variable has a value
	val = variableObject.raw || variableObject.value
	if !val then return {}

	# Add a type
	type = window.fashion.$run.determineType(val, $wf.$type, $wf.$typeConstants)

	# Add units, if necessary
	unittedValue = window.fashion.$run.getUnit(val, type, $wf.$type, $wf.$unit)
	typedValue = unittedValue['value']
	unit = unittedValue['unit']

	# Update the variable object
	variableObject.annotateWithType type, unit, typedValue


# Splits a string by commas, but only those not inside parenthesis
window.fashion.$parser.splitByTopLevelCommas = (value) ->
	depth = 0
	acc = ""
	ret = []

	# Go through, counting the depth
	regex = /(\(|\)|\,|[^\(\)\,]+)/g
	while token = regex.exec value
		if token[0] is "," and depth is 0
			ret.push acc
			acc = ""
			continue;

		if token[0] is "(" then depth++
		if token[0] is ")" then depth--

		acc += token[0]

	# Return an array of values
	ret.push acc
	return ret


# Splits a string by commas, but only those not inside parenthesis
window.fashion.$parser.splitByTopLevelSpaces = (value) ->
	depth = 0
	sq = dq = bt = false
	acc = ""
	ret = []

	# Go through, counting the depth
	regex = /(\(|\)|\"|\'|\`|\s|[^\(\)\"\'\`\s]+)/g
	while token = regex.exec value
		if token[0] is " " and depth is 0 and !sq and !dq and !bt
			ret.push acc
			acc = ""
			continue;

		if token[0] is "(" then depth++
		if token[0] is ")" then depth--

		if token[0] is "'" and !dq and !bt then sq = !sq
		if token[0] is '"' and !sq and !bt then dq = !dq
		if token[0] is "`" and !dq and !sq then bt = !bt

		acc += token[0]

	# Return an array of values
	ret.push acc
	return ret

# Includes
# @prepros-append ./sections.coffee
# @prepros-append ./properties.coffee
# @prepros-append ./expressions.coffee