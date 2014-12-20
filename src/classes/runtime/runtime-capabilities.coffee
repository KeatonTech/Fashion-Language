# This class keeps track of which capabilities are required in the runtime code
# Different types of runtime requirements (Javascript enum)
window.fashion.$runtimeCapability =
	variables: "variables"
	scopedVariables: "scopedVariables"
	individualProps: "individualized"
	liveProps: "liveProperties"

# Class to store these
class RuntimeCapabilities
	constuctor: () ->
		@capabilities = window.fashion.runtimeModules

	add: (runtimeRequirement) ->
		if !@capabilities then @capabilities = window.fashion.runtimeModules
		if runtimeRequirement in @capabilities then return
		@capabilities.push runtimeRequirement

	addDependencies: (requirements) ->
		@add(requirement) for requirement in requirements

	has: (requirement) ->
		if !@capabilities then return false
		return (requirement in @capabilities)