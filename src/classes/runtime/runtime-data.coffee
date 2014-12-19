# Format for the data included in the Javascript for the runtime
class RuntimeData
	constructor: (parseTree, selectors, variables) ->

		# Basic parsetree information
		@selectors = selectors
		@variables = variables

		# Dependencies
		@functions = parseTree.dependencies.functions

		# Used for individual properties
		@watchSelectors = []

		# Stores Fashion Javascript functions
		@runtime = {}

	addWatchSelector: (selectorName) -> @watchSelectors.push selectorName

	addRuntimeModule: (runtimeModule) ->
		for name, func of runtimeModule.functions
			if @runtime[name] then "[FASHION] Overwriting runtime function '#{name}'"
			@runtime[name] = func

#@prepros-append ./runtime-variable.coffee