# Functions to expose to 
window.fashion.$processor.api = 

	# Throws an error
	throwError: (property, error) -> console.log "[FASHION: #{property}] #{error}"

	# Sets a property in the parse tree
	setProperty: (selector, insertIndex, name, value) ->

		# Create a property
		property = new Property name, value, value.mode || $wf.$runtimeMode.static

		# Add the property
		selector.insertProperty property, insertIndex+1


	# Gets a property from the parse tree
	getProperty: (parseTree, selectorName, propertyName) ->
		rval = undefined
		parseTree.forEachMatchingSelector selectorName, (selector)->
			selector.forEachPropertyNamed propertyName, (property)->
				if rval then return false
				rval = property.value
			if rval then return false
		return rval


	# Add a rule (selector + properties) to the parse tree
	addRule: (parseTree, selectorName, body) ->

		# Create the selector object
		selector = $wf.$parser.createSelector parseTree, selectorName

		# Parse the properties and add them
		$wf.$parser.parseSelectorBody body + "\n", selector, parseTree


	# Add a script to the runtime
	addScript: (parseTree, script) ->
		parseTree.addScript script


	# Parse a value
	parseValue: (parseTree, bindLink, value) ->
		if !value or typeof value isnt "string" then return ""
		return $wf.$parser.parseSingleValue value, bindLink, parseTree

	# Get the type of a value expressed as a string
	determineType: (value) ->
		if value.type then return value.type
		else if typeof value is 'string'
			window.fashion.$shared.determineType(value, $wf.$type, $wf.$typeConstants)
		else $wf.$type.Unknown

	# Get the unit of a number value
	determineUnit: (value) ->
		if value.unit then return value.unit
		else if typeof value is 'string'
			window.fashion.$shared.getUnit(value,$wf.$type.Number,$wf.$type,$wf.$unit).unit
		else ''