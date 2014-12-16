# Variables are created by the parser as individual objects, grouped by name
# This is much easier to deal with throughout the parsing stages, but annoying for runtime
# The runtime gets variables that implement this class
class RuntimeVariable
	constructor: (name, type, unit) ->
		@name = name
		@type = type
		@unit = unit

		@scopes = []
		@values = {}
		@dependents = []

		@default = undefined

	addScope: (name, defaultValue) ->
		@values[name] = defaultValue

		# Adding the global scope
		if name is 0 or name is '0' then @default = defaultValue

		# Adding a selector scope
		else @scopes.push name