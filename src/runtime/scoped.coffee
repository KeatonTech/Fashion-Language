# Register the module that gets and sets dynamic variables
$wf.addRuntimeModule "scopedVariables", 
["evaluation", "elements", "stylesheet-dom", "variables", "individualizedHelpers"],

	
	# Get the first element matching a scope
	"getParentForScope": (element, scope) ->
		if typeof element is 'function' then element = element() # Unwrap Fashion Element
		while element?
			# If this element matches the scope, it might have an override
			if @matches(element, scope) then return element

			element = element.parentNode
		return undefined


	# Try and find a scoped variable override value for the given element
	"getScopeOverride": (element, varName, scope) ->
		scopeElement = @getParentForScope element, scope
		if !scopeElement then return undefined
		return @getFashionAttribute scopeElement, "$"+varName


	# Function to set a value for a particular scope
	"setScopedVariableOnElement": (element, varName, value) ->
		if typeof element is 'function' then element = element() # Unwrap Fashion Element
		@setFashionAttribute element, "$" + varName, value

		# Whatever scopes this element applies to must be updated
		vObj = FASHION.variables[varName]
		for scope, value of vObj.values when scope isnt '0'
			if @matches element, scope

				# Normal dependencies
				@updateDependencies varName, scope

				# If any selectors depend on this scoped value they need special treatment
				vObj = FASHION.variables[varName]
				if !vObj.dependents[scope]? then continue
				for bindLink in vObj.dependents[scope] when bindLink.length is 2
					if bindLink[0] is 'v'
						# Update variables - not sure how this is going to go TBH
					else
						# Update the selector
						@addScopedSelectorOverride bindLink[1], element.id

	# Install some useful functionality
	"$initializeScoped": ()->

		# Install a helpful API function
		window.FASHION.setElementVariable = @setScopedVariableOnElement.bind FASHION.runtime

		# Go through each variable and find scoped ones with individualized properties
		indMode = @runtimeModes.individual
		for varName,vObj of FASHION.variables
			for scope,val of vObj.values when scope isnt '0'

				# If the variable's expression is individualized, we'll need to give each
				# matching element its own override right off the bat.
				if val? and val.evaluate? and (val.mode & indMode) is indMode
					@initializeIndividualScope varName, scope


# When the scoped variable shows up in selectors, we need some more complicated methods
$wf.addRuntimeModule "scopedVariableSelector", ["scopedVariables", "sheets", "selectors"],

	"addScopedSelectorOverride": (selectorId, element) ->
		selector = FASHION.selectors[selectorId]

		# Evaluate the name against the ID of the element with the scoped variable override
		if typeof element is 'string' then element = document.getElementById element
		name = @evaluate selector.name, element

		# The compiler leaves a '##' flag in, specifying where the ID should go
		# This is always filtered out being being added to the CSS but if we catch it here
		# we can sub in our element ID so as to only affect its children.
		name = name.replace /\#\#/g,"#"+element.id

		# Generate a CSS rule to the scope sheet
		rule = @CSSRuleForSelector selector, element, name
		sheet = @getStylesheet(FASHION.config.scopedCSSID).sheet
		rules = sheet.rules || sheet.cssRules

		# Make sure a new version of this will overwrite the old one
		if !selector.scopedRules then selector.scopedRules = {}
		if !selector.scopedRules[element.id]?
			selector.scopedRules[element.id] = rules.length
		else sheet.deleteRule selector.scopedRules[element.id]

		# Add the CSS rule
		sheet.insertRule rule, selector.scopedRules[element.id]



# When the scoped variable shows up in selectors, we need some more complicated methods
$wf.addRuntimeModule "scopedVariableIndividual", ["scopedVariables", "DOMWatcher"],

	"initializeIndividualScope": (varName, scope) ->
		variable = FASHION.variables[varName]
		scopeVal = variable.values[scope]

		for element in @elementsForSelector scope
			if !element.id then element.setAttribute('id', @generateRandomId())
			value = @evaluate scopeVal, element
			@setScopedVariableOnElement element, varName, value


	"addedIndividualScopedElements": (elements) ->
		indMode = @runtimeModes.individual
		for varName,vObj of FASHION.variables
			for scope,val of vObj.values when scope isnt '0'

				# If the variable's expression is individualized, we'll need to give each
				# matching element its own override right off the bat.
				if val? and val.evaluate? and (val.mode & indMode) is indMode
					for element in elements when @matches element, scope

						# Process each new element matching this variable's selector
						if !element.id then element.setAttribute('id', @generateRandomId())
						indValue = @evaluate val, element
						@setScopedVariableOnElement element, varName, indValue
