$wf.addRuntimeModule "individualized", ["selectors", "elements"],

	# Start up by listing each element that matches each individual selector
	$initializeIndividualProperties: ()->
		#if !FASHION.individual then return

		# Create a new stylesheet just for individual properties
		sheet = document.createElement "style"
		sheet.setAttribute("type", "text/css")
		sheet.setAttribute("id", "#{FASHION.config.individualCSSID}")
		document.head.appendChild sheet
		FASHION.individualSheet = sheet.sheet

		# Fix for firefox
		if !FASHION.individualSheet.rules
			FASHION.individualSheet.rules = FASHION.individualSheet.cssRules

		# Figure out which elements each selector applies to
		@updateSelectorElements(selector) for id,selector of FASHION.individual

		# Generate each selector
		@regenerateIndividualSelector(selector) for id,selector of FASHION.individual


	# List elements for selector
	updateSelectorElements: (selector) ->

		# Clear any existing CSS rules
		for id, individual of selector.elements when individual.cssid isnt -1
			FASHION.individualSheet.deleteRule individual.cssid

		# TODO: Make this work with scoped variables
		selectorName = @evaluate selector.name
		selector.elementsSelector = selectorName
		selector.elements = {}

		# Lookup selectors
		matchedElements = @elementsForSelector selectorName

		# Go through and make sure each element has an ID. Make one if it doesn't
		for element in matchedElements
			if !element.id then element.setAttribute('id', @generateRandomId())
			selector.elements[element.id] = {element: element, cssid: -1}


	# Generate a random, unique element ID
	generateRandomId: (length = 20)->
		guid = (Math.round(Math.random()*36).toString(36) for i in [0..length]).join("")
		return FASHION.config.idPrefix + guid


	# Just a wrapper around query selector all, could be replaced by another thing
	elementsForSelector: (selectorName) ->
		Array.prototype.slice.call document.querySelectorAll selectorName


	# Recalculate the CSS value of an individual selector block for each matching element
	regenerateIndividualSelector: (selector) ->
		for id, individual of selector.elements

			# Delete the old rule if necessary
			if individual.cssid isnt -1
				FASHION.individualSheet.deleteRule individual.cssid
			else individual.cssid = FASHION.individualSheet.rules.length

			# Generate the current element object
			element = @createElementObject individual.element

			# Generate the CSS rule
			css = @CSSRuleForSelector selector, element, "##{id}"

			# Add it to the individual sheet
			FASHION.individualSheet.insertRule css, individual.cssid		


