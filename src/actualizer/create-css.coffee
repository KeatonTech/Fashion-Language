# Determines what functionality needs to be included in the generated JS
window.fashion.$actualizer.createCSS = (runtimeData, cssSelectors) ->
	evalFunction = $wf.$actualizer.evaluationFunction runtimeData

	# Accumulate CSS here
	css = ""

	# Convert each selector to a CSS string
	for id, selector of cssSelectors

		# Convert each property to a CSS string
		cssProperties = []
		transitions = []
		for property in selector.properties
			value = property.value

			# Values are computed differently if they're dynamic or have a transition
			if selector.mode is $wf.$runtimeMode.static
				if typeof value is 'object' and value.value
					cssValue = value.value 						# Static w/ Transition
				else cssValue = value 							# Static w/o Transition
			else cssValue = evalFunction value 					# Dynamic / Live

			# If this property has a transition, add it to the transitions list
			if value.transition then transitions.push value.transition

			# Turn this property into a string
			cssProperties.push $wf.$actualizer.cssPropertyTemplate property.name, cssValue

		# Add transition properties here

		# Turn this selector into a string
		css += $wf.$actualizer.cssSelectorTemplate selector.name, cssProperties

	# Return the CSS
	return css;


# Helpful function that returns a function that easily evaluates expressions
window.fashion.$actualizer.evaluationFunction = (runtimeData) -> (value) ->
		window.fashion.$run.evaluate(value, 0, runtimeData.variables,
			$wf.$globals, $wf.$functions)


# Templates used in generating CSS
window.fashion.$actualizer.cssPropertyTemplate = (name, value) ->
	"#{name}: #{value};"

window.fashion.$actualizer.cssSelectorTemplate = (selector, properties) ->
	"#{selector} {#{properties.join('')}}\n"