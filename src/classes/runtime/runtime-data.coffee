# Format for the data included in the Javascript for the runtime
class RuntimeData
	constructor: (selectors, variables) ->

		# Basic parsetree information
		@selectors = selectors
		@variables = variables

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