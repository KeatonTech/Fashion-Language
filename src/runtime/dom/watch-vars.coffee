# Wait for a change in the style object
window.fashion.$run.defineProperties = 
	(variables = FASHION.variables, objectName = FASHION.config.variableObject)->

		# Where to put all of these variables
		container = undefined
		if objectName
			container = window[objectName] = {}
		else 
			container = window

		# And another container, to be used in expressions
		proxy = w.FASHION.variableProxy = {}

		# Add each variable as a property
		for varName, varObj of variables

			# Make the property object
			propObject = 
				get: ((varObj)-> ()-> varObj.value)(varObj)
				set: ((varName, varObj)=> (newValue)=> 
					@updateVariable varName, newValue
				)(varName, varObj)

			# Add it as a property to the container
			Object.defineProperty container, varName, propObject
			Object.defineProperty container, "$" + varName, propObject

			# Add it to the variable proxy
			proxy[varName] = {}
			Object.defineProperty proxy[varName], "value", propObject


# Wait for a change in the style object
window.fashion.$run.watchGlobals = (globals = FASHION.globals) ->
	for name,gObj of globals
		gObj.watch ((gObj)=> ()=>
			for selector, properties of gObj.dependants
				@updateSelector selector
		)(gObj)