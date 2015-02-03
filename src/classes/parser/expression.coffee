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
		# VarLookup, Globals, Functions, Runtime, ExpressionLookup, ExtraVar
		try @evaluate = Function("v","g","f","t","e","x",@script)
		catch e 
			console.log "[FASHION] Could not compile script '#{@script}'"
			console.log e


# Class to keep track of what 
class ExpressionBindings
	constructor: (startType, startVal)->
		@variables = []
		@globals = []
		@functions = []

		switch startType
			when "variable" then @addVariableBinding startVal
			when "global" then @addGlobalBinding startVal
			when "function" then @addFunctionBinding startVal


	addVariableBinding: (variableName) -> 
		if !(variableName in @variables) then @variables.push variableName

	# Global bindings only need to bind to the global name
	addGlobalBinding: (globalName)->
		if !(globalName in @globals) then @globals.push globalName

	# Function bindings need to attach to the function and its arguments
	addFunctionBinding: (functionName, functionArgs, bindings, mode)->
		script = "f['#{functionName}'].watch.call(#{functionArgs.join(',')},x)"
		e = new Expression script, $wf.$type.None, 0, bindings, mode
		e.generate()
		@functions.push [functionName, e]

	# Dom bindings are hard to generalize because they can occur relative to a selector
	# Therefore, we're just storing a big list of them
	# The runtime can try and do something a little smarter with this stuff
	addDOMBinding: (selectorId, selector, boundSelector, boundProperty)->
		console.log "[FASHION] DOM Bindings not yet supported"

	# Add another binding object to this one
	extend: (bindingObject) ->
		if !bindingObject? or !bindingObject.variables? then return
		ext = (list,v) -> if !(v in list) then list.push v

		ext(@variables, v) for v in bindingObject.variables
		ext(@globals, v) for v in bindingObject.globals
		ext(@functions, v) for v in bindingObject.functions

	# Return a shallow copy of the bindings object
	copy: ()->
		nb = new ExpressionBindings
		nb.extend this
		return nb


# Make these accessible outside of Fashion
window.fashion.$class.Expression = Expression
window.fashion.$class.ExpressionBindings = ExpressionBindings