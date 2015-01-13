$wf.addRuntimeModule "individualized", 
["selectors", "elements", "stylesheet-dom", "individualizedHelpers"],

	# Start up by listing each element that matches each individual selector
	$initializeIndividualProperties: ()->

		# Create a new stylesheet just for individual properties
		FASHION.individualSheet = @addStylesheet("#{FASHION.config.individualCSSID}").sheet

		# Figure out which elements each selector applies to
		@updateSelectorElements(selector) for id,selector of FASHION.individual

		# Generate each selector
		@regenerateIndividualSelector(id) for id,selector of FASHION.individual

		# Use a mutation observer to watch for changes to the dom
		@watchForDOMAddition()

		# Publish function that lets fashion know to recompute the individual elements
		window.FASHION.pageChanged = window.FASHION.domChanged = @pageChanged.bind(this)


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


	# Called from setPropertyOnSelector
	setPropertyOnIndividual: (selectorId, propertyName) ->

		# Get the selector object from fashion
		selector = FASHION.individual[selectorId]

		# For each element in the selector
		for id, individual of selector.elements

			# If this element doesn't have a rule yet, make one
			if !individual.cssid? or individual.cssid is -1
				@regenerateElementSelector selector, id, individual
				continue

			# Get the rule from the stylesheet
			rule = FASHION.individualSheet.rules[individual.cssid]

			# Go through each property looking for ones with the given name
			# There could be multiple properties that match, usually as fallbacks
			for pObj in selector.properties when @makeCamelCase(pObj) is propertyName

				# Generate the CSS property and set it as a style on our rule
				rule.style[propertyName] = @CSSRuleForProperty pObj, individual.element, true


	# Recalculate the CSS value of an individual selector block for each matching element
	regenerateIndividualSelector: (selectorId) ->

		# Get the selector
		selector = FASHION.individual[selectorId]
		if !selector then @throwError "Could not find individual selector #{selectorId}"

		# If the selector name changed, re-list the elements it applies to
		if @evaluate(selector.name) isnt selector.elementsSelector
			@updateSelectorElements selector

		# Go through each element
		for id, element of selector.elements
			@regenerateElementSelector(selector, id, element)


	# Generate a specific selector on a specific element
	regenerateElementSelector: (selector, id, element) ->

		# Delete the old rule if necessary
		if element.cssid isnt -1
			FASHION.individualSheet.deleteRule element.cssid
		else element.cssid = FASHION.individualSheet.rules.length

		# Generate the CSS rule
		css = @CSSRuleForSelector selector, element.element, "##{id}"

		# Add it to the individual sheet
		FASHION.individualSheet.insertRule css, element.cssid


	# Now for some fun stuff!
	watchForDOMAddition: ()->
		if window.FASHION_NO_OBSERVE is true then return
		window.FSOBSERVER = new MutationObserver (mutations)->
			if !window.FSOBSERVER? or !window.FASHION? or !FASHION.runtime.addedElements? or
				window.FASHION_NO_OBSERVE is true then return

			for mutation in mutations when mutation.addedNodes.length > 0
				FASHION.runtime.addedElements mutation.addedNodes
			return true

		window.FSOBSERVER.observe(document.body, {childList: true, subtree: true});


	# Re-query the page for each individual selector
	# Optional addedElements property allows it to not look through every single object
	pageChanged: (addedElements)->

		# We have a special case for this
		if addedElements? then return @addedElements(addedElements)

		# Otherwise, build a list of added elements ourselves
		addedElements = []
		for id,selector of FASHION.individual
			matchedElements = @elementsForSelector selector.elementsSelector
			for element in matchedElements when !selector.elements[element.id]
				addedElements.push element
		@addedElements(addedElements)


	# Elements added to the page
	addedElements: (elements) ->
		if !FASHION? then return
		for element in elements
			matches = element.matches || element.webkitMatchesSelector ||
				element.mozMatchesSelector || element.msMatchesSelector

			# Go through each individual selector that matches the element
			for id,indObj of FASHION.individual when !indObj.elements[element.id]
				if !element.matches indObj.name then continue
				if !element.id then element.setAttribute('id', @generateRandomId())
				indElement = {element: element, cssid: -1}
				indObj.elements[element.id] = indElement
				@regenerateElementSelector indObj, element.id, indElement


$wf.addRuntimeModule "individualizedHelpers", [],

	# Generate a random, unique element ID
	generateRandomId: (length = 20)->
		guid = (Math.round(Math.random()*36).toString(36) for i in [0..length]).join("")
		return FASHION.config.idPrefix + guid


	# Just a wrapper around query selector all, could be replaced by another thing
	elementsForSelector: (selectorName) ->
		Array.prototype.slice.call document.querySelectorAll selectorName
