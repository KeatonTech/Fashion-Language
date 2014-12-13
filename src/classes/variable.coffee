# Represents a non-global variable
# NOTE: Global variables are different from top-level variables
# Globals begin with @ and model properties of the browser using getter functions
# Top-level variables are just variables that aren't defined in any scope.
class Variable

	# This is basically all it has to do
	constructor: (name, defaultValue, type, unit, scope = 0) ->
		@name = name
		@default = defaultValue
		@type = type
		@unit = unit
		@scope = scope
		@topLevel = scope is undefined