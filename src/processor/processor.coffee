# Parses fashion code into a tree structure
window.fashion.$processor =

	# Entry point into the parser
	process: (parseTree) ->

		# Add a Javascript section to the parse tree
		# Used to allow modules to inject extra JS code into the compiled output
		parseTree["javascript"] = []

		# Process properties
		parseTree = window.fashion.$processor.properties parseTree, $wf.$properties

		# Now that that's all done, list all of the module requirements for the parse tree
		window.fashion.$processor.listRequirements parseTree

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
			if bName in $wf.$blocks
				req.blocks[bName] = $wf.$blocks[bName]

# Includes
# @prepros-append ./properties.coffee