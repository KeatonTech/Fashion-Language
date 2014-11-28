# THESE FUNCTIONS CAN ONLY BE RUN IN THE LIVE ENVIRONMENT

# Loop through elements belonging to given selectors and add properties to them
window.fashion.$run.applyIndividualizedSelectors = (selectors)->

	# Go through each selector
	for selector, properties of selectors

		# Get every element on the page that has this selector applied to it
		elements = document.querySelectorAll selector
		for element in elements

			# Use this in the expression
			e = @buildObjectForElement element

			acc = ""
			for property, expression of properties
				
				# Check to see if this is a custom property
				propertyObject = w.FASHION.properties[property]

				# Let the custom property handle it itself
				if propertyObject and propertyObject['apply']
					propertyObject['apply'](expression, e)

				# Otherwise, run the expression and save its result
				else 
					value = expression.evaluate(
						w.FASHION.variables, w.FASHION.globals,
						w.FASHION.functions, {}, e)
					acc += "#{property}: #{value};"

			# Add the properties to the object
			@addStyleToElement element, acc


# Fashion objects contain HTML elements but also have some nice syntactic sugar
window.fashion.$run.buildObjectForElement = (element) ->
	eObj = {element: element}

	Object.defineProperty eObj, "id", {get: ()-> element.getAttribute('id')}
	Object.defineProperty eObj, "class", {get: ()-> element.getAttribute('class')}
	Object.defineProperty eObj, "name", {get: ()-> element.getAttribute('name')}

	return eObj
	

# Extend the style property, or make one if it doesn't exist
window.fashion.$run.addStyleToElement = (element, style) ->
	if element.element then element = element.element
	currentStyle = element.getAttribute("style") || ""
	element.setAttribute("style", currentStyle + style)