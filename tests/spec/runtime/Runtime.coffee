#TODO(keatontech): This.
describe "Runtime", ()->
	
	# Test the processing of normal, top-level variables
	describe "Variables", window.fashiontests.runtime.variables

	# Test the processing of element scoped variables
	describe "Scoped Variables", window.fashiontests.runtime.scoped

	# Test the processing of individual properties
	describe "Individual Properties", window.fashiontests.runtime.individual

#@prepros-prepend ./runtime-header.coffee
#@prepros-prepend ./variables.coffee
#@prepros-prepend ./individual.coffee
#@prepros-prepend ./scoped.coffee
