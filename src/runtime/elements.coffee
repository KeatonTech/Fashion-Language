$wf.addRuntimeModule "elements", [],

	elementFunction: (element)-> (property, keyword) =>
		if !element? then return

		# Return the element directly
		if !property? then return element
		
		# Handle properties that 'bubble up'
		if property.indexOf("parent") is 0
			if property is "parent" then return element.parentNode
			parentProperty = property.replace("parent.","")
			return @elementFunction(element.parentNode)(parentProperty)

		# Simple handlers
		if property is "width" then return element.clientWidth
		if property is "height" then return element.clientHeight

		# All else has failed, lookup the attribute
		return @getFashionAttribute(element,property) || element.getAttribute(property)


	# Fashion keeps its own set of attributes in JS, separate from HTML
	setFashionAttribute: (element, key, value) ->
		if typeof element isnt 'string' then element = element.id
		if !window.FASHION.elements[element] then window.FASHION.elements[element] = {}
		window.FASHION.elements[element][key] = value


	getFashionAttribute: (element, key) ->
		if typeof element isnt 'string' then element = element.id
		if !window.FASHION.elements[element] then undefined
		window.FASHION.elements[element]?[key]