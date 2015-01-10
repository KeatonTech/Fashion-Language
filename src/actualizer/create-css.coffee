# Determines what functionality needs to be included in the generated JS
window.fashion.$actualizer.createCSS = (runtimeData, cssSelectors) ->
	evalFunction = $wf.$actualizer.evaluationFunction runtimeData

	# Accumulate CSS here
	css = ""

	# Convert each selector to a CSS string
	for id, selector of cssSelectors

		# Convert each property to a CSS string
		cssProperties = []
		for pid,property of selector.properties
			if !property.value? then console.log selector

			# These properties cannot be calculated at compile time
			if (selector.mode & $wf.$runtimeMode.globalDynamic) > 2 then continue

			# Values are computed differently if they're dynamic or have a transition
			value = property.value
			if selector.mode is $wf.$runtimeMode.static
				if typeof value is 'object' and value.value
					cssValue = evalFunction value.value 		# Static w/ Transition
				else cssValue = evalFunction value 				# Static w/o Transition
			else cssValue = evalFunction value 					# Dynamic / Live

			# Turn this property into a string
			cssProperties.push $wf.$actualizer.cssPropertyTemplate property, cssValue

		# Turn this selector into a string
		selectorName = evalFunction selector.name
		css += $wf.$actualizer.cssSelectorTemplate selectorName, cssProperties

	# Return the CSS
	return css;


# List of CSS browser prefixes used for special properties
window.fashion.$actualizer.cssPrefixes = ["", "-webkit-", "-moz-", "-ms-"]


# Separate transitions into their own properties, grouped by mode
window.fashion.$actualizer.separateTransitions = (parseTree) ->
	evalFunction = $wf.$actualizer.evaluationFunction null, parseTree
	prefixes = window.fashion.$actualizer.cssPrefixes
	transitionMode = 0

	# Collect each transition
	for id, selector of parseTree.selectors
		transitions = []

		# Go through each property 
		for pid,property of selector.properties
			if pid is "length" then continue
			if property.value.transition
				pt = property.value.transition
				pt.property = property.name
				transitions.push(pt)

				# Determine the mode of the transition
				transitionMode |= pt.easing.mode | pt.duration.mode | pt.delay.mode

		if transitionMode is $wf.$runtimeMode.static
			# Generate the static CSS string for the transition property
			strings = $wf.$actualizer.transitionStrings evalFunction, transitions
			if strings.length is 0 then continue
			value = strings.join(",")

		else
			# Generate an expression that will output the transition property
			value = $wf.$actualizer.transitionExpression transitions
			if !value then continue

		# Turn that transition into a brand new property object
		property = new Property "transition", value, transitionMode

		# Add it once for each prefix (you're welcome, developers)
		for prefix in prefixes
			selector.addProperty property.copyWithName prefix + "transition"


# Generate a list of property strings for transitions of a given mode
window.fashion.$actualizer.transitionStrings = (evalFunction, transitions) ->
	for t in transitions

		# "But Keaton", you say, "why are we evaluating expressions here? I thought we'd
		# already determined that this transition property was entirely static!"
		# Ah, you have much to learn, young padawan. Expressions *can* be static.
		duration = evalFunction t.duration
		easing = evalFunction t.easing
		delay = evalFunction t.delay

		# Put everything into the template
		$wf.$actualizer.cssTransitionTemplate t.property, t.duration, t.easing, t.delay


# Split the property into expression arrays, just like the parse would've done
window.fashion.$actualizer.transitionExpression = (transitions) ->
	for t in transitions
		[t.property, t.duration, t.easing, t.delay]


# Helpful function that returns a function that easily evaluates expressions
window.fashion.$actualizer.evaluationFunction = (runtimeData, parseTree) -> (value) ->
	window.fashion.$shared.evaluate.call(window.fashion.$shared, value, 
		if runtimeData then runtimeData.variables else parseTree.variables,
		$wf.$globals, $wf.$functions,
		if runtimeData then runtimeData.runtime else {})


# Templates used in generating CSS
# NOTE: These are copied into the runtime and used there as well

window.fashion.$actualizer.cssPropertyTemplate = (property, value) ->
	"#{property.name}: #{value}#{if property.important then " !important" else ""};"

window.fashion.$actualizer.cssSelectorTemplate = (selector, properties) ->
	"#{selector} {#{properties.join('')}}\n"

window.fashion.$actualizer.cssTransitionTemplate = (property, duration, easing, delay) ->
	"#{property} #{duration || '1s'} #{easing || ''}#{if delay then ' ' + delay else ''}"
