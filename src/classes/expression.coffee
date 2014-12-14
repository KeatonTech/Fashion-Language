# Possibly the shortest file in all of Fashion
class Expression
	constructor: (script, type, unit, runtimeMode) ->
		@script = script.toString()
		@mode = runtimeMode
		@type = type
		@unit = unit

	generate: ()-> 
		try @evaluate = Function("v","g","f","t","e",@script)
		catch e 
			console.log "[FASHION] Could not compile script '#{@script}'"
			console.log e

window.fashion.$class.Expression = Expression