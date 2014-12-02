# Loop through elements belonging to given selectors and add properties to them
window.fashion.$run.applyIndividualizedSelectors = (selectors)->
	@removeFashionStyles()

	# Go through each selector
	for selector, properties of selectors

		# Expand variables in the selector
		selector = window.fashion.$run.expandVariables selector, FASHION.variables

		# Get every element on the page that has this selector applied to it
		elements = document.querySelectorAll selector
		for element in elements

			# Use this in the expression
			e = @buildObjectForElement element

			acc = "/*FS>*/"
			for property, expression of properties
				
				# Check to see if this is a custom property
				propertyObject = w.FASHION.properties[property]

				# Let the custom property handle it itself
				if propertyObject and propertyObject['apply']
					if e["bind-#{property}"] is "true" then continue
					evaluateExpression = expression.evaluate.bind({},
						w.FASHION.variableProxy, w.FASHION.globals,
						w.FASHION.functions, w.FASHION.runtime, e)
					propertyObject['apply'](element, expression, evaluateExpression)
					element.setAttribute "bind-#{property}", "true"

				# Otherwise, run the expression and save its result
				else 
					value = expression.evaluate(
						w.FASHION.variableProxy, w.FASHION.globals,
						w.FASHION.functions, w.FASHION.runtime, e)
					acc += "#{property}: #{value};"


			# Add the properties to the object
			@addStyleToElement element, if acc.length > 7 then acc + "/*<FS*/" else ""


# Loop through each element with a style tag and remove the Fashion part
window.fashion.$run.removeFashionStyles = () ->
	elements = document.querySelectorAll "[style]"
	for element in elements
		style = element.getAttribute("style")
		if style.match /\/\*FS>\*\/(.*?)\/\*<FS\*\//g
			style = style.replace /\/\*FS>\*\/(.*?)\/\*<FS\*\//g, ""
			element.setAttribute "style", style

# Fashion objects contain HTML elements but also have some nice syntactic sugar
window.fashion.$run.buildObjectForElement = (element) ->
	if !element then return {}
	eObj = {element: element}

	# Attributes
	if element.attributes
		for attribute in element.attributes
			eObj[attribute.name] = attribute.value

	# Navigation (deferred until the user asks for it)
	Object.defineProperty eObj, "parent", 
		get: ()=> @buildObjectForElement element.parentNode

	# Positioning
	eObj.width = element.clientWidth
	eObj.height = element.clientHeight

	cs = window.getComputedStyle(element);
	if cs
		Object.defineProperty eObj, "outerWidth", 
			get: ()-> parseFloat(cs.marginLeft) + parseFloat(cs.marginRight) + eObj.width
		Object.defineProperty eObj, "outerHeight", 
			get: ()-> parseFloat(cs.marginTop) + parseFloat(cs.marginBottom) + eObj.height

	return eObj
	

# Extend the style property, or make one if it doesn't exist
window.fashion.$run.addStyleToElement = (element, style) ->
	if element.element then element = element.element
	currentStyle = element.getAttribute("style") || ""
	element.setAttribute("style", currentStyle + style)