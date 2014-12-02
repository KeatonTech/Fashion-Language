# Go through the parse tree and pull out properties defined by FASHION modules
window.fashion.$processor.blocks = (parseTree, blocks) ->
	funcs = window.fashion.$processor.api

	# Go through each selector (yes, this is tedious)
	for block in parseTree.blocks

		# Get the module that will process this block
		blockObj = blocks[block.type]
		if !blockObj then continue

		# Bind the API to this particular run state
		API =
			throwError: funcs.throwError.bind 0, block.type
			addRule: funcs.setProperty.bind 0, parseTree
			getProperty: funcs.setProperty.bind 0, parseTree
			addScript: funcs.addScript.bind 0, parseTree
			parseValue: funcs.parseValue,
			parse: $wf.$parser.parse,
			runtimeObject: parseTree.requirements.blocks[block.type]

		# Run the block module's compile function
		blockObj.compile.call API, block.arguments, block.body

	# Pass it back
	return parseTree
