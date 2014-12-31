$wf.addRuntimeModule "elements", [],

	elementFunction: (element)-> (property, keyword) ->

		# Return the element directly
		if !property? and keyword? then return element
		
		# Handle properties that 'bubble up'
		if property.indexOf(".parent") is 0
			parentProperty = property.replace(".parent","")
			return @elementFunction(element.parentNode)(parentProperty)

		# Simple handlers
		if property is "width" then return element.clientWidth
		if property is "height" then return element.clientHeight

		# All else has failed, lookup the attribute
		return element.getAttribute(property)