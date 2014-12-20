# Format for the data included in the Javascript for the runtime
class RuntimeData
	constructor: (parseTree, selectors, variables) ->
		@config = $wf.runtimeConfig

		# Basic parsetree information
		@selectors = selectors
		@variables = variables

		# Dependencies
		@modules = parseTree.dependencies
		for name,block of @modules.blocks
			@modules.blocks[name] = block.runtimeObject

		# Stores Fashion Javascript functions
		@runtime = {}

	addIndividualSelector: (selector) ->
		if !@individual then @individual = []
		@individual.push selector

	addRuntimeModule: (runtimeModule) ->
		for name, func of runtimeModule.functions
			if @runtime[name] then return
			@runtime[name] = func

#@prepros-append ./runtime-variable.coffee