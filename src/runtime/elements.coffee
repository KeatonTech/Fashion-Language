$wf.addRuntimeModule "elements", [],

	createElementObject: (DOMElement) ->

		if !DOMElement then return {}
		eObj = {element: DOMElement}

		# Attributes
		if DOMElement.attributes
			for attribute in DOMElement.attributes
				eObj[attribute.name] = attribute.value

		# Navigation (deferred until the user asks for it)
		Object.defineProperty eObj, "parent", 
			get: ()=> @createElementObject DOMElement.parentNode

		# Positioning
		eObj.width = DOMElement.clientWidth
		eObj.height = DOMElement.clientHeight

		cs = window.getComputedStyle(DOMElement);
		if cs
			Object.defineProperty eObj, "outerWidth", 
				get: ()-> parseFloat(cs.marginLeft) + parseFloat(cs.marginRight) + eObj.width
			Object.defineProperty eObj, "outerHeight", 
				get: ()-> parseFloat(cs.marginTop) + parseFloat(cs.marginBottom) + eObj.height

		# Functionality
		eObj.addEventListener = (evt, func, bubble) ->
			DOMElement.addEventListener evt, func, bubble

		return eObj