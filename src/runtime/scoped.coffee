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
		val = @getFashionAttribute scopeElement, "$"+varName
		return [@elementFunction(scopeElement), val]


	# Function to set a value for a particular scope
	"setScopedVariableOnElement": (element, varName, value) ->
		if typeof element is 'function' then element = element() # Unwrap Fashion Element
		@setFashionAttribute element, "$" + varName, value

		# Whatever scopes this element applies to must be updated
		vObj = FASHION.variables[varName]
		for scope, value of vObj.values when scope isnt '0'
			if @matches element, scope

				# Normal dependencies
				@regenerateVariableDependencies varName, scope

				# If any selectors depend on this scoped value they need special treatment
				if !vObj.dependents[scope]? then continue
				for bindLink in vObj.dependents[scope]
					if bindLink[0] is 'v'
						nVal = @variableValue bindLink[1], @elementFunction(element), scope
						@setScopedVariableOnElement element, bindLink[1], nVal
						# Update variables - not sure how this is going to go TBH
						
					else if bindLink[0] is 'i'
						# Update an individualized property
						if !@addIndividualScopedSelectorOverride? then continue
						@addIndividualScopedSelectorOverride bindLink[1], element

					else
						# Update the selector
						if !@addScopedSelectorOverride? then continue
						@addScopedSelectorOverride bindLink[1], element

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

	# Add a dynamic rule for the given scope
	"addScopedSelectorOverride": (selectorId, element) ->
		selector = FASHION.selectors[selectorId]

		# Generate a rule with the scoped name
		name = @getScopedSelectorName selector, element
		rule = @CSSRuleForSelector selector, element, name

		# We have a sheet for this stuff
		sheet = @getStylesheet(FASHION.config.scopedCSSID).sheet
		sheet.rules = sheet.rules || sheet.cssRules

		# Make sure a new version of this will overwrite the old one
		if !selector.scopedRules then selector.scopedRules = {}
		if !selector.scopedRules[element.id]?
			selector.scopedRules[element.id] = sheet.rules.length
		else sheet.deleteRule selector.scopedRules[element.id]

		# Add the CSS rule
		sheet.insertRule rule, selector.scopedRules[element.id]
	

	# Add an individualized rule for each element matching the selector for the given scope
	"addIndividualScopedSelectorOverride": (selectorId, element) ->
		selector = FASHION.individual[selectorId]
		if !selector then @throwError "Could not find individual selector #{selectorId}"

		# Delete any existing individual rules for this element
		if !selector.scopedRules then selector.scopedRules = {}
		if selector.scopedRules[element.id]?
			sheet = document.getElementById selector.scopedRules[element.id]
			sheet.parentNode.removeChild sheet

		# Get every element matching this selector
		name = @getScopedSelectorName selector, element
		matches = @elementsForSelector name
		if matches.length is 0 then return

		# Generate a new sheet for these rule overrides
		sheetId = FASHION.config.scopedIndCSSPrefix + @generateRandomId()
		sheet = @addStylesheet(sheetId,FASHION.config.scopedCSSID).sheet
		selector.scopedRules[element.id] = sheetId
		
		# Go through adding rules
		for matchElement in matches
			rule = @CSSRuleForSelector selector, matchElement, name
			sheet.insertRule rule, 0
		''

	# Generates the specific selector for the given element
	"getScopedSelectorName": (selector, element) ->
		if typeof element is 'string' then element = document.getElementById element
		name = @evaluate selector.name, element
		name = name.replace /\#\#/g,"#"+element.id
		return name


# Special handling for when the scoped variable is set by an individualized expression
$wf.addRuntimeModule "scopedVariableIndividual", ["scopedVariables", "DOMWatcher"],

	# Add overrides for each element matching the scope selector
	"initializeIndividualScope": (varName, scope) ->
		variable = FASHION.variables[varName]
		scopeVal = variable.values[scope]

		for element in @elementsForSelector scope
			if !element.id then element.setAttribute('id', @generateRandomId())
			value = @evaluate scopeVal, element
			@setScopedVariableOnElement element, varName, value


	# Callback from the DOM Watcher, to add overrides when new elements get added
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


	# This function needs to be registered with the DOM watcher
	"$registerScopedVariableIndividual": ()->
		@registerDomWatcher "addNodes", @addedIndividualScopedElements
