# Stores a collection of functions that enable a chunk of functionality in generated code
class RuntimeModule
	constructor: (name, requires, functions) ->
		@name = name
		@requires = requires
		@functions = functions

		@initializers = []
		for key, f of functions
			# Indicates that function is an initializer
			if key[0] is "$" then @initializers.push key
				