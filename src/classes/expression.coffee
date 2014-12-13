# Possibly the shortest file in all of Fashion
class Expression
	constructor: (script, isDynamic, isIndividualized) ->
		@script = script
		@evaluate = Function("v","g","f","t","e",script)
		@dynamic = isDynamic
		@individualized = isIndividualized

window.fashion.$class.Expression = Expression