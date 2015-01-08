# Possibly the shortest file in all of Fashion
class Expression
	constructor: (script, type, unit, bindings, runtimeMode) ->
		@script = script.toString()
		@setter = @script.indexOf("=") isnt -1
		@mode = runtimeMode
		@type = type
		@unit = unit
		@bindings = bindings || new ExpressionBindings()

	generate: ()-> 
		try @evaluate = Function("v","g","f","t","e",@script)
		catch e 
			console.log "[FASHION] Could not compile script '#{@script}'"
			console.log e


# Class to keep track of what 
class ExpressionBindings
	constructor: (startType, startVal)->
		@variables = []
		@globals = []
		@dom = []

		switch startType
			when "variable" then @addVariableBinding startVal
			when "global" then @addGlobalBinding startVal
			when "dom" then console.log "[FASHION] DOM Bindings not yet supported"


	addVariableBinding: (variableName) -> 
		if !(variableName in @variables) then @variables.push variableName

	# Global bindings are fairly straightforward
	addGlobalBinding: (globalName)->
		if !(globalName in @globals) then @globals.push globalName

	# Dom bindings are hard to generalize because they can occur relative to a selector
	# Therefore, we're just storing a big list of them
	# The runtime can try and do something a little smarter with this stuff
	addDOMBinding: (selectorId, selector, boundSelector, boundProperty)->
		console.log "[FASHION] DOM Bindings not yet supported"

	# Add another binding object to this one
	extend: (bindingObject) ->
		ext = (list,v) -> if !(v in list) then list.push v

		ext(@variables, v) for v in bindingObject.variables
		ext(@globals, v) for v in bindingObject.globals
		ext(@dom, v) for v in bindingObject.dom


# Make these accessible outside of Fashion
window.fashion.$class.Expression = Expression
window.fashion.$class.ExpressionBindings = ExpressionBindings