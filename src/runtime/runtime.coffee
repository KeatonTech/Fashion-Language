# Code modules that can be included in the generated Javascript.
window.fashion.$runtimeModules = {}

# Class for runtime modules
#@prepros-prepend ../classes/runtime/runtime-module.coffee

# Function that registers a new runtime modules
window.fashion.addRuntimeModule = (name, dependencies, functions) ->
	window.fashion.$runtimeModules[name] = new RuntimeModule name, dependencies, functions

# Register shared functions
$wf.addRuntimeModule "types", [],
	determineType: window.fashion.$shared.determineType
	getUnit: window.fashion.$shared.getUnit
	timeInMs: window.fashion.$shared.timeInMs

$wf.addRuntimeModule "evaluation", ["variables"],
	evaluate_Shared: window.fashion.$shared.evaluate
	evaluate: (value, element) ->
		@evaluate_Shared(
			value,
			FASHION.variables, FASHION.globals, FASHION.functions, # Runtime data
			FASHION.runtime,	# Runtime functions, passed to functions
			element
		)

# Register basic functionality
$wf.addRuntimeModule "errors", [],
	throwError: (message) -> console.log "[FASHION] Runtime error: #{message}";
	
# Here come the rest of the modules!
#@prepros-append ./variables.coffee
#@prepros-append ./selectors.coffee