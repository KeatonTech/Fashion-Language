# Register the module that gets and sets dynamic variables
$wf.addRuntimeModule "variables", ["evaluation", "types"],

	# This is shared functionality so we can just bind around the existing function
	getVariable_Shared: window.fashion.$shared.getVariable
	getVariable: (varName, element) -> 
		@getVariable_Shared(
			FASHION.variables, FASHION.globals, FASHION.functions, FASHION.runtime,
			varName, element
		)

	# Set the value of a variable
	setVariable: (varName, value, element) ->
		console.log "Setting #{varName} to #{value}"

# Register the module that gets and sets dynamic variables
$wf.addRuntimeModule "watchVariables", [],
	$initWatchers: ()->
		console.log "test"