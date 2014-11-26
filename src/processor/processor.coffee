# Parses fashion code into a tree structure
window.fashion.$processor =

	# Entry point into the parser
	process: (parseTree) ->

		# Add a Javascript section to the parse tree
		# Used to allow modules to inject extra JS code into the compiled output
		parseTree["javascript"] = []

		# Process properties
		parseTree = window.fashion.$processor.properties parseTree, $wf.$properties

		# Pass it back
		# I know this shouldn't be necessary but let's stay safe
		return parseTree

# Includes
# @prepros-append ./properties.coffee