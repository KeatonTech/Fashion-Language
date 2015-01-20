# Represents a non-global variable
# NOTE: Global variables are different from top-level variables
# Globals begin with @ and model properties of the browser using getter functions
# Top-level variables are just variables that aren't defined in any scope.
class Variable

	# This is basically all it has to do
	constructor: (name, defaultValue, scope = 0) ->
		if name[0] == "$" then name = name.substr(1)
		@name = name
		@mode = defaultValue?.mode || $wf.$runtimeMode.dynamic

		@raw = @value = defaultValue
		@scope = scope
		@topLevel = scope is 0

	# Add a type and unit to the variable
	annotateWithType: (type, unit, typedValue) ->
		@type = type
		@unit = unit
		if typedValue then @value = typedValue
		

window.fashion.$class.Variable = Variable