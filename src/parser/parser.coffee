# Parses fashion code into a tree structure
window.fashion.$parser =

	# Entry point into the parser
	parse: (fashionText) ->

		# Split the file into top-level sections
		parsed = window.fashion.$parser.parseSections(fashionText)

		# Add type and unit information to each variable
		for key, variable of parsed.variables
			parsed.variables[key] = window.fashion.$parser.parseVariable(variable)

		# Parse the selector body into properties
		for key, body of parsed.selectors
			nb = window.fashion.$parser.parseSelectorBody(body, parsed.variables)
			parsed.selectors[key] = nb

			# Take the dependancies field and link it back to the variables
			window.fashion.$parser.backlinkDependencies(key, nb, parsed.variables)

		# Return parse object
		return parsed

# Includes
# @prepros-append ./sections.coffee
# @prepros-append ./variables.coffee
# @prepros-append ./properties.coffee
# @prepros-append ./expressions.coffee