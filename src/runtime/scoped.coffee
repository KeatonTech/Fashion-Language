# Register the module that gets and sets dynamic variables
$wf.addRuntimeModule "scopedVariables", 
["evaluation", "elements", "stylesheet-dom", "variables", "individualizedHelpers"],

	# Try and find a scoped variable override value for the given element
	"getScopeOverride": (element, varName, scope) ->
		if typeof element is 'function' then element = element() # Unwrap Fashion Element
		while element?

			# If this element matches the scope, it might have an override
			if @matches element, scope
				if override = @getFashionAttribute element, "$"+varName
					return override

			element = element.parentNode

		return undefined


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
	"$scopedFunctions": ()->

		# Install a helpful API function
		window.FASHION.setElementVariable = @setScopedVariableOnElement.bind FASHION.runtime


# When the scoped variable shows up in selectors, we need some more complicated methods
$wf.addRuntimeModule "scopedVariableSelector", ["scopedVariables", "sheets", "selectors"],

	"addScopedSelectorOverride": (selectorId, elementId) ->
		selector = FASHION.selectors[selectorId]

		# Evaluate the name against the ID of the element with the scoped variable override
		element = document.getElementById elementId
		name = @evaluate selector.name, element

		# The compiler leaves a '##' flag in, specifying where the ID should go
		# This is always filtered out being being added to the CSS but if we catch it here
		# we can sub in our element ID so as to only affect its children.
		name = name.replace /\#\#/g,"#"+elementId

		# Generate and add a CSS rule to the scope sheet
		rule = @CSSRuleForSelector selector, element, name
		sheet = @getStylesheet(FASHION.config.scopedCSSID).sheet
		rules = sheet.rules || sheet.cssRules
		sheet.insertRule rule, rules.length

