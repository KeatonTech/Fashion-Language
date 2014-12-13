# Parses fashion code into a tree structure
window.fashion.$processor =

	# Entry point into the parser
	process: (parseTree) ->

		# Add type and unit information to each variable
		parseTree.forEachVariable (variable)-> $wf.$processor.addTypeInformation(variable)

		# Now that that's all done, list all of the module requirements for the parse tree
		window.fashion.$processor.listRequirements parseTree

		# Process blocks
		parseTree = window.fashion.$processor.blocks parseTree, $wf.$blocks

		# Process properties
		parseTree = window.fashion.$processor.properties parseTree, $wf.$properties

		# Pass it back
		# I know this shouldn't be necessary but let's stay safe
		return parseTree


	# Keep track of all of the modules that will be required in the Javascript
	listRequirements: (parseTree) ->
		parseTree.requirements = {globals: {}, functions: {}, blocks: {}, properties: {}}
		req = parseTree.requirements

		# Add properties, globals and functions from the selector tree
		for selector, properties of parseTree.selectors
			for property, value of properties when typeof value is "object"

				# Add properties
				if $wf.$properties[property]
					req.properties[property] = $wf.$properties[property]

				# Add globals
				if value.dependencies
					for vName in value.dependencies
						if vName[0] is "@"
							gName = vName.substr(1)
							if $wf.$globals[gName]
								req.globals[gName] = $wf.$globals[property]

				# Add functions
				if value.functions
					for fName in value.functions
						if $wf.$functions[fName]
							req.functions[fName] = $wf.$functions[fName]

		# Add blocks from the blocks list
		for block in parseTree.blocks
			bName = block.type
			if $wf.$blocks[bName]
				req.blocks[bName] = $wf.$blocks[bName]["runtimeObject"]

# Helper methods that provide functionality to extensions
# @prepros-append ./api.coffee

# Processors that run code for different extensions
# @prepros-append ./variables.coffee
# @prepros-append ./blocks.coffee
# @prepros-append ./properties.coffee