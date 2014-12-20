# Represents a CSS property inside a selector
class Property
	constructor: (name, value, runtimeMode = $wf.$runtimeMode.static, transition) -> 
		@name = name
		@mode = runtimeMode

		if transition 
			if typeof value isnt 'object'
				@value = {value: value, transition: transition}
			else
				@value = value
				@value.transition = transition
		else @value = value

	# Creates a copy of the property with a new name
	# Useful for browser prefixing
	copyWithName: (name) ->
		new Property name, @value, @mode


# Represents a transition of a property
class PropertyTransition
	constructor: (easing, duration, delay) ->
		@easing = easing
		@duration = duration
		@delay = delay


window.fashion.$class.Property = Property
window.fashion.$class.PropertyTransition = PropertyTransition