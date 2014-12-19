# Format for the data included in the Javascript for the runtime
class RuntimeData
	constructor: (parseTree, selectors, variables) ->
		@config = $wf.runtimeConfig

		# Basic parsetree information
		@selectors = selectors
		@variables = variables

		# Dependencies
		@globals = parseTree.dependencies.globals
		@functions = parseTree.dependencies.functions

		# Used for individual properties
		@watchSelectors = []

		# Stores Fashion Javascript functions
		@runtime = {}

	addWatchSelector: (selectorName) -> @watchSelectors.push selectorName

	addRuntimeModule: (runtimeModule) ->
		for name, func of runtimeModule.functions
			if @runtime[name] then return
			@runtime[name] = func

#@prepros-append ./runtime-variable.coffee