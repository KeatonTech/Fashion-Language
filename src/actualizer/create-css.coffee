# Determines what functionality needs to be included in the generated JS
window.fashion.$actualizer.createCSS = (runtimeData, cssSelectors) ->
	evalFunction = $wf.$actualizer.evaluationFunction runtimeData.variables

	# Accumulate CSS here
	css = ""

	# Convert each selector to a CSS string
	for id, selector of cssSelectors

		# Convert each property to a CSS string
		cssProperties = []
		for property in selector.properties
			value = property.value

			# Values are computed differently if they're dynamic or have a transition
			if selector.mode is $wf.$runtimeMode.static
				if typeof value is 'object' and value.value
					cssValue = evalFunction value.value 		# Static w/ Transition
				else cssValue = evalFunction value 				# Static w/o Transition
			else cssValue = evalFunction value 					# Dynamic / Live

			# Turn this property into a string
			cssProperties.push $wf.$actualizer.cssPropertyTemplate property.name, cssValue

		# Turn this selector into a string
		selectorName = evalFunction selector.name
		css += $wf.$actualizer.cssSelectorTemplate selectorName, cssProperties

	# Return the CSS
	return css;


# List of CSS browser prefixes used for special properties
window.fashion.$actualizer.cssPrefixes = ["", "-webkit-", "-moz-", "-ms-"]


# Separate transitions into their own properties, grouped by mode
window.fashion.$actualizer.separateTransitions = (parseTree) ->
	evalFunction = $wf.$actualizer.evaluationFunction parseTree.variables
	prefixes = window.fashion.$actualizer.cssPrefixes

	# Collect each transition
	for id, selector of parseTree.selectors
		transitions = []

		# Go through each property 
		for property in selector.properties
			if property.value.transition
				pt = property.value.transition
				pt.property = property.name
				transitions.push(pt)

				# Determine the mode of the transition
				pt.mode = pt.easing.mode | pt.duration.mode | pt.delay.mode

		# Go through each mode and add it as a property if necessary
		modes = $wf.$runtimeMode
		for mode in [modes.static, modes.dynamic, modes.individual, modes.live]

			# Generate the CSS strings for properties of this mode
			strings = $wf.$actualizer.transitionStrings evalFunction, transitions, mode
			if strings.length is 0 then continue
			string = strings.join(",")

			# Make a new property
			property = new Property "transition", string, mode

			# Add it once for each prefix
			for prefix in prefixes
				selector.addProperty property.copyWithName prefix + "transition"


# Generate a list of property strings for transitions of a given mode
window.fashion.$actualizer.transitionStrings = (evalFunction, transitions, runtimeMode) ->
	(for t in transitions when t.mode is runtimeMode

		# Evaluate the properties if necessary
		duration = if t.duration.script then evalFunction t.duration else t.duration
		easing = if t.easing.script then evalFunction t.easing else t.easing
		delay = if t.delay.script then evalFunction t.delay else t.delay

		# Put everything into the template
		$wf.$actualizer.cssTransitionTemplate t.property, duration, easing, delay
	)


# Helpful function that returns a function that easily evaluates expressions
window.fashion.$actualizer.evaluationFunction = (variables) -> (value) ->
	window.fashion.$shared.evaluate.call(window.fashion.$shared, value, variables,
		$wf.$globals, $wf.$functions)


# Templates used in generating CSS
# NOTE: These are copied into the runtime and used there as well

window.fashion.$actualizer.cssPropertyTemplate = (name, value) ->
	"#{name}: #{value};"

window.fashion.$actualizer.cssSelectorTemplate = (selector, properties) ->
	"#{selector} {#{properties.join('')}}\n"

window.fashion.$actualizer.cssTransitionTemplate = (property, duration, easing, delay) ->
	"#{property} #{duration || '1s'} #{easing || ''}#{if delay then ' ' + delay else ''}"
