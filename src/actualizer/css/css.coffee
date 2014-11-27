# Calls propertiesToCSS on each selector and collects the results into sheets
window.fashion.$actualizer.generateStyleProperties = (selectors, variables) ->
		rules = {dynamic: [], static: [], individual: [], final: {dynamic: [], static: []}}

		# Loop over every selector
		for selector, properties of selectors

			# Expand out any variables in the selector string
			newSelector = window.fashion.$run.expandVariables selector, variables

			# Separate styles based on whether or not they'll actually change
			selectorIsDynamic = newSelector isnt selector

			# Process the property
			attr = window.fashion.$actualizer.propertiesToCSS properties, variables

			# Helper function to turn strings into rule objects
			wrap = (
				(newSelector) -> (cssString)-> {name: newSelector, value: cssString}
			)(newSelector)

			# Combine the properties into CSS Rules
			ps = attr.props
			if attr.props.dynamic.length > 0
				rules.dynamic.push wrap "#{newSelector} {#{ps.dynamic.join('')}}" 
			if attr.props.static.length > 0
				rules.static.push wrap "#{newSelector} {#{ps.static.join('')}}" 
			if attr.props.individual.length > 0
				rules.individual.push wrap "#{newSelector} {#{ps.individual.join('')}}"

			# Add transition properties
			tCSS = window.fashion.$actualizer.addTransitions(attr.transitions)

			# Add a 'final' state that includes the CSS rules and the transitions
			if tCSS.static then rules.final.static.push wrap(
				"#{newSelector} {#{ps.static.join('')}#{tCSS.static}}")
			if tCSS.dynamic then rules.final.dynamic.push wrap(
				"#{newSelector} {#{ps.dynamic.join('')}#{tCSS.dynamic}}")

		# Return lists of static and dynamic CSS rules
		return rules

# Turn an array of properties into 3 strings
window.fashion.$actualizer.propertiesToCSS = (properties, variables, evalFunction) ->
	if !evalFunction then evalFunction = window.fashion.$run.evaluate

	# Get some space
	str = {dynamic: [], static: [], individual: []};
	transitions = []

	# Loop over every property in the selector
	for property, valueObject of properties

		# Evaluate the property into a string value
		if valueObject instanceof Array

			# Multi-component multi-value. Eg: "border: 1px solid black, 2px solid red;"
			if valueObject[0] instanceof Array
				val = (for vi in valueObject
					(for vo in vi
						evalFunction(vo, 0, variables, $wf.$type, {}, $wf.$globals)
					).join(" ")
				).join(", ")

			# Multi-value. Eg: "border: 1px solid black;"
			else val = (for vi in valueObject
				evalFunction(vi, 0, variables, $wf.$type, {}, $wf.$globals)
			).join(" ")

		# Single-value. Eg: "font-size: 12pt;"
		else val = evalFunction valueObject, 0, variables, $wf.$type, {}, $wf.$globals

		# Turn it into a CSS property
		css = "#{property}: #{val};"

		# Check to see if the value has a transition
		if typeof valueObject is 'object' and valueObject['transition']
			transitions[property] = valueObject.transition

		# Add the property to the appropriate string
		if valueObject instanceof Array
			if (true for vi in valueObject when vi["individualized"])[0]
				str.individual.push css
			else if (true for vi in valueObject when vi["dynamic"])[0]
				str.dynamic.push css
			else str.static.push css

		else if typeof valueObject is 'object'
			if valueObject["individualized"] is true then str.individual.push css
			else if valueObject["dynamic"] is true then str.dynamic.push css
			else str.static.push css

		else str.static.push css
	
	# Return something useful
	return {props: str, transitions: transitions}


# Add transition properties 
window.fashion.$actualizer.addTransitions = (transitions) ->
	tStatic = tDynamic = "transition: "
	hasStatic = hasDynamic = false
	for property, t of transitions

		# Determine if the transition is dynamic or static
		isDynamic = t.easing and typeof t.easing is 'object' and t.easing.dynamic
		isDynamic &= t.duration and typeof t.duration is 'object' and t.duration.dynamic
		isDynamic &= t.delay and typeof t.delay is 'object' and t.delay.dynamic

		# Generate a string of the transition
		tString = "#{property} #{t.duration || '1s'} #{t.easing || ''} #{t.delay || ''},"
		if isDynamic then tDynamic += tString else tStatic += tString
		if isDynamic then hasDynamic = true else hasStatic = true

	# Replace last comma with a semicolon
	tStatic = tStatic.substr(0, tStatic.length - 1) + ";"
	tDynamic = tDynamic.substr(0, tDynamic.length - 1) + ";"

	# Browser prefixing
	tStatic = [tStatic, "-webkit-"+tStatic, "-moz-"+tStatic, "-ms-"+tStatic].join('')
	tDynamic = [tDynamic, "-webkit-"+tDynamic, "-moz-"+tDynamic, "-ms-"+tDynamic].join('')

	# Return transition rules
	return {
		static: (if hasStatic then tStatic else false)
		dynamic: (if hasDynamic then tDynamic else false)
	}

# Include functions to move the CSS onto the page, for the Live version
# @prepros-append ./dom.coffee