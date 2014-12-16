# Format for the data included in the Javascript for the runtime
class RuntimeData
	constructor: (selectors, variables, scripts) ->
		@selectors = selectors
		@variables = variables
		@scripts = scripts

		@watchSelectors = []

	addWatchSelector: (selectorName) -> @watchSelectors.push selectorName


#@prepros-append ./runtime-variable.coffee