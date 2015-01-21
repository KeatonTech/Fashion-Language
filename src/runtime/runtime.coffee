# Code modules that can be included in the generated Javascript.
window.fashion.$runtimeModules = {}

# Class for runtime modules
#@prepros-prepend ../classes/runtime/runtime-module.coffee

# Function that registers a new runtime modules
window.fashion.addRuntimeModule = (name, requires, functions) ->
	window.fashion.$runtimeModules[name] = new RuntimeModule name, requires, functions

# Register shared functions
$wf.addRuntimeModule "types", [],
	determineType: window.fashion.$shared.determineType
	getUnit: window.fashion.$shared.getUnit
	timeInMs: window.fashion.$shared.timeInMs

$wf.addRuntimeModule "evaluation", [],
	evaluate_Shared: window.fashion.$shared.evaluate
	evaluate: (value, element, extraVariables) ->

		# Add extra variables if necessary
		if extraVariables?
			vars = extraVariables
			vars[n] = v for n,v of FASHION.variables when not vars[n]?
		else vars = FASHION.variables

		# Call the shared function
		@evaluate_Shared(
			value,							# The value object containing the expression
			vars, 							# Variables used in the document
			FASHION.modules.globals, 		# Globals that can be used in expressions
			FASHION.modules.functions,		# Functions that can be used in expressions		
			FASHION.runtime,				# Runtime functions, passed to functions
			element							# The current element - for individualized
		)

$wf.addRuntimeModule "colors", [], window.fashion.color

# Register basic functionality
$wf.addRuntimeModule "errors", [],
	throwError: (message) -> 
		console.log "[FASHION] Runtime error: #{message}";
		console.log new Error().stack;

$wf.addRuntimeModule "wait", [], wait: (d,f)-> setTimeout f,d

# Here come the rest of the modules!
#@prepros-append ./variables.coffee
#@prepros-append ./selectors.coffee
#@prepros-append ./individualized.coffee
#@prepros-append ./dom-watcher.coffee
#@prepros-append ./globals.coffee
#@prepros-append ./elements.coffee
#@prepros-append ./sheets.coffee
#@prepros-append ./scoped.coffee