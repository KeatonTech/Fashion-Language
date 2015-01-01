# Go through the parse tree and pull out properties defined by FASHION modules
window.fashion.$processor.blocks = (parseTree, blocks) ->
	funcs = window.fashion.$processor.api

	# Go through each selector (yes, this is tedious)
	for bID,block of parseTree.blocks

		# Get the module that will process this block
		blockObj = blocks[block.type]
		if !blockObj then continue

		# Bind the API to this particular run state
		API =
			throwError: funcs.throwError.bind 0, block.type
			addRule: funcs.addRule.bind 0, parseTree
			addScript: funcs.addScript.bind 0, parseTree
			parseValue: funcs.parseValue,
			parse: funcs.parseBody.bind 0, parseTree
			runtimeObject: parseTree.dependencies.blocks[block.type].runtimeObject
			addVariable: funcs.addVariable.bind 0, parseTree

		# Run the block module's compile function
		blockObj.compile.call API, block.arguments, block.body

	# Pass it back
	return parseTree


# Used for parsing the interior of blocks
window.fashion.$processor.api.parseBody = (parseTree, body) ->
	$wf.$parser.parse body, parseTree

# Used for parsing the interior of blocks
window.fashion.$processor.api.addVariable = (parseTree, name, value) ->
	$wf.$parser.addVariable parseTree, name, value
