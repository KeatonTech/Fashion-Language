# Parses fashion code into a tree structure
window.fashion.$parser =

	# Entry point into the parser
	parse: (fashionText) ->

		parseTree = new ParseTree()

		# Split the file into top-level sections
		parseTree = window.fashion.$parser.parseSections(fashionText, parseTree)

		# Parse the selector body into properties
		for key, body of parseTree.selectors
			nb = window.fashion.$parser.parseSelectorBody(body, parseTree.variables)
			parseTree.selectors[key] = nb

			# Take the dependancies field and link it back to the variables
			window.fashion.$parser.backlinkVariables(key, nb, parseTree.variables)

			# Add and link any globals
			window.fashion.$parser.backlinkGlobals(parseTree, key, nb, $wf.$globals)

		# Return parse object
		return parseTree


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
# @prepros-append ./variables.coffee
# @prepros-append ./properties.coffee
# @prepros-append ./expressions.coffee