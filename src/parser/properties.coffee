# Convert a raw variable object into one with a little more info
window.fashion.$parser.parseSelectorBody = (bodyString, vars) ->
	properties = {}

	regex = ///
			[\s]*([\w\-\s]*)\:			# Property Name
			[\s]*(\[([\w\-\$\@]*)		# Transition Name
			[\s]*([\w\-\$\@]*)[\s]*		# Transition Duration (optional)
			([\w\-\$\@]*)\]){0,1}		# Transition Delay (optional)
			[\s]*(.*?)					# Property Value or Expression
			[\s]*(!important)?			# Important flag
			[;}\n]						# Ending
			///g

	while property = regex.exec bodyString
		if property.length < 7 then continue # Sanity check
		value = property[6]

		# Split it into multiple values if necessary
		if value.indexOf(',') isnt -1
			value = value.split(",");
			value[i] = item.trim() for i,item of value
			for i,item of value
				value[i] = window.fashion.$parser.parsePropertyValue(item, vars, true, true)

		# Just process the one value
		else value = window.fashion.$parser.parsePropertyValue(value, vars)

		# Parse transition
		if property[3]
			if typeof value isnt 'object' then value = {value: value}
			value.transition =
				easing: window.fashion.$parser.parsePropertyValue(property[3], vars,false)
				duration: window.fashion.$parser.parsePropertyValue(property[4], vars,false)
				delay: window.fashion.$parser.parsePropertyValue(property[5], vars,false)

		# Note the important flag
		if property[7] is "!important"
			if typeof value is "string" then value += " !important"
			if typeof value is "object" then value.important = true

		# Add the property to the properties object
		properties[property[1]] = value;

	# Return the properties object
	return properties


# Convert a property value into a linked object or expression, if necessary
window.fashion.$parser.parsePropertyValue = 
	(value, variables, allowExpression = true, forceArray = false) ->

		# Pass expressions through
		if allowExpression and value.match /[\+\/\*\(\)\=]/g
			return window.fashion.$parser.parseSingleValue value, variables, true

		# Check to see if we have a multi-piece property
		if forceArray or (typeof value is "string" and value.indexOf(" ") isnt -1)
			parts = value.match /(["'][^'"]*["']|[\S]+)/g
			console.log parts

			# False alarm!
			if !forceArray and parts.length is 1 then return (
				window.fashion.$parser.parseSingleValue value, variables, allowExpression)

			# Accumulate all of the single values into an array.
			return (for piece in parts
				window.fashion.$parser.parseSingleValue piece, variables, allowExpression
			)

		# We have a single-piece property
		else window.fashion.$parser.parseSingleValue value, variables, allowExpression

# Convert a property value into a linked object or expression, if necessary
window.fashion.$parser.parseSingleValue = (value, variables, allowExpression = true) ->
	valueObject = {dynamic: false}
	hasVariable = false

	# Check if there's a variable involved
	if value.indexOf("$") isnt -1 or value.indexOf("@") isnt -1

		# Get the list of variables involved
		vars = valueObject.dependencies = value.match /(\$([\w\-\$]*)|\@([\w\-\$]*))/g
		valueObject.dynamic = true
		hasVariable = vars.length > 0

		# This is a pure link, no expression necessary
		if vars.length is 1 and vars[0] is value
			if vars[0][0] is "@" then vars[0] = vars[0].toLowerCase()
			valueObject.link = vars[0];
			return valueObject;

	# Check to see if it's an expression
	if allowExpression and value.match /[\+\/\*\(\)\=]/g
		return window.fashion.$parser.parseExpression(
			value, variables, window.fashion.$functions, window.fashion.$globals)

	# Back up plan, in case we missed some spaces or something
	else if hasVariable
		valueObject.link = vars[0];
		return valueObject;

	# Nope, this is just a normal property
	return value
