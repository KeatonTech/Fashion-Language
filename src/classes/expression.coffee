# Possibly the shortest file in all of Fashion
class Expression
	constructor: (script, type, unit, isDynamic, isIndividualized) ->
		@script = script
		if script.indexOf "return" is 0
			try @evaluate = Function("v","g","f","t","e",script)

		@type = type
		@unit = unit

		@dynamic = isDynamic
		@individualized = isIndividualized

window.fashion.$class.Expression = Expression