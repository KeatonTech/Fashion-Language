# This class keeps track of which capabilities are required in the runtime code
# Different types of runtime requirements (Javascript enum)
window.fashion.$runtimeCapability =
	variables: "dynamic-variables"
	scopedVariables: "scoped-variables"
	individualProps: "watch-selector"
	liveProps: "live-properties"

# Class to store these
class RuntimeCapabilities
	constuctor: ()->
		@capabilities = []

	add: (runtimeRequirement) ->
		if runtimeRequirement in @capabilities then return
		@capabilities.push runtimeRequirement