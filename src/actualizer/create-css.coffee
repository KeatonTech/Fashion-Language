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

			# These properties cannot be calculated at compile time
			if (property.mode & $wf.$runtimeMode.globalDynamic) > 2 then continue

			# Values are computed differently if they're dynamic or have a transition
			value = property.value
			if property.mode is $wf.$runtimeMode.static
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

		# Generate an expression that will output the transition property
		value = ([t.property, t.duration, t.easing, t.delay] for t in transitions)
		if !value || value.length is 0 then continue

		# Turn that transition into a brand new property object
		property = new Property "transition", value, transitionMode

		# Add it once for each prefix (you're welcome, developers)
		for prefix in prefixes
			selector.addProperty property.copyWithName prefix + "transition"


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
	"#{selector.replace(/\#\#/g,'')} {#{properties.join('')}}\n"

window.fashion.$actualizer.cssTransitionTemplate = (property, duration, easing, delay) ->
	"#{property} #{duration || '1s'} #{easing || ''}#{if delay then ' ' + delay else ''}"
