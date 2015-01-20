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
				@updateDependencies varName, scope


	# Install some useful functionality
	"$scopedFunctions": ()->

		# Install a helpful API function
		window.FASHION.setElementVariable = @setScopedVariableOnElement.bind FASHION.runtime