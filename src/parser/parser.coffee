# Parses fashion code into a tree structure
window.fashion.$parser =

	# Entry point into the parser
	parse: (fashionText, extendsTree) ->

		parseTree = new ParseTree(extendsTree)

		# Remove comments
		fashionText = $wf.$parser.removeComments fashionText

		# Split the file into top-level sections
		parseTree = $wf.$parser.parseSections(fashionText, parseTree)

		# Parse each selector body into individual properties and variables
		for i, sel of parseTree.selectors
			$wf.$parser.parseSelectorBody(sel.body, sel, parseTree)

		# Return parse object
		return parseTree


# Remove comments
window.fashion.$parser.removeComments = (fashionText) ->
	return fashionText.replace /\/\*[\s\S]*?\*\/|\/\/.*?\n/g, ""


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


# Splits a string by commas, but only those not inside parenthesis or quotes
# or those that are part of expressions
window.fashion.$parser.splitByTopLevelSpaces = (value) ->
	depth = 0
	sq = dq = bt = false
	acc = ""
	ret = []

	# Go through, counting the depth
	regex = ///(
			[^\(\)\"\'\`\s]*\(|	# Match function calls
			\)|\"|\'|\`|		# Match quotes and parenthesis to track depth
			([^\`\s]+			# Match the beginning of an operation ({x} + y)
			(\s+[\+\-\/\*\=]\s+ # Match the operator (x{ + }y)
			|[\+\/\*\=])		# Match the operator (x{+}y)
			)+[^\`\s]+			# Match the end of an operation or repeat (x + {y})
			|\s+(\&\&|\|\|)\s+ 	# Match AND and OR
			|\s+(==|!==)\s+ 	# Match equality and inequality
			|if\s+|\s+then\s+	# Match ternary operators
			|\s+else\s+			# Match the optional else condition of ternaries
			|\s|				# Split on these spaces
			[^\(\)\"\'\`\s]+	# Get the stuff in between to accumulate it
			)///g

	while token = regex.exec value
		if token[0] is " " and depth is 0 and !sq and !dq and !bt
			ret.push acc
			acc = ""
			continue;

		if token[0][token[0].length - 1] is "(" then depth++
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
# @prepros-append ./variables.coffee
# @prepros-append ./errors.coffee
