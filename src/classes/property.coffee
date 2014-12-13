# Represents a CSS property inside a selector
class Property
	constructor: (name, value, transition) -> 
		@name = name

		if transition 
			if typeof value isnt 'object'
				@value = {value: value, transition: transition}
			else
				@value = value
				@value.transition = transition
		else @value = value


# Represents a transition of a property
class PropertyTransition
	constructor: (easing, duration, delay) ->
		@easing = easing
		@duration = duration
		@delay = delay


window.fashion.$class.Property = Property
window.fashion.$class.PropertyTransition = PropertyTransition