# Functions to expose to 
window.fashion.$processor.api = 

	# Throws an error
	throwError: (property, error) -> console.log "[FASHION: #{property}] #{error}"

	# Sets a property in the parse tree
	setProperty: (parseTree, selector, insertIndex, name, value) ->

		# Make sure the selector exists (it really always should)
		properties = parseTree.selectors[selector]
		if !properties then return false

		# Guarantee inheritance order
		index = 0
		for k,v in properties
			index++
			if index < insertIndex then continue
			if k is name then return false

		# Add the property
		properties[name] = value


	# Gets a property from the parse tree
	getProperty: (parseTree, selector, property) ->

		# Make sure the selector exists (it really always should)
		properties = parseTree.selectors[selector]
		if !properties then return false
		return properties[property]


	# Add a rule (selector + properties) to the parse tree
	addRule: (parseTree, selector, properties) ->

		# If it already exists, add the new properties to the end
		if parseTree.selectors[selector]
			$wf.$extend parseTree.selectors[selector], properties

		# Add the new selector
		else parseTree.selectors[selector] = properties


	# Add a script to the runtime
	addScript: (parseTree, script) ->

		# Make sure the parse tree has the requisite script array
		if !parseTree["javascript"] then parseTree["javascript"] = []
		parseTree.javascript.push script


	# Parse a value
	parseValue: (value) ->
		if !value or typeof value isnt "string" then return ""
		return $wf.$parser.parseSingleValue value
