# Parses fashion code into a tree structure
window.fashion.$processor =

	# Entry point into the parser
	process: (parseTree) ->

		# Process blocks
		parseTree = window.fashion.$processor.blocks parseTree, $wf.$blocks

		# Process properties
		parseTree = window.fashion.$processor.properties parseTree, $wf.$properties

		# Pass it back
		# I know this shouldn't be necessary but let's stay safe
		return parseTree


# Helper methods that provide functionality to extensions
# @prepros-append ./api.coffee

# Processors that run code for different extensions
# @prepros-append ./blocks.coffee
# @prepros-append ./properties.coffee