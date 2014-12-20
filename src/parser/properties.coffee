
# Convert a raw variable object into one with a little more info
window.fashion.$parser.parseSelectorBody = (bodyString, selector, parseTree) ->
	linkId = selector.index

	regex = ///
			[\s]*(\$?[\w\-\s]*)\:		# Property/Variable Name
			[\s]*(\[([\w\-\$\@]*)		# Transition Name
			[\s]*([\w\-\$\@\%]*)[\s]*	# Transition Duration (optional)
			([\w\-\$\@\%]*)\]){0,1}		# Transition Delay (optional)
			[\s]*([^;}\n]*?)			# Property/Variable Value or Expression
			[\s]*(!important)?			# Important flag
			[;}\n]						# Ending
			///g

	while property = regex.exec bodyString
		transition = undefined
		if property.length < 7 then continue # Sanity check

		# Create a value object
		value = $wf.$parser.parsePropertyValues property[6], linkId, parseTree

		# Check to see if this is a variable declaration
		name = property[1]
		if name[0] == "$"
			$wf.$parser.parseScopedVariable name, value, property, selector.name, parseTree
			continue;

		# Parse transition
		if property[3]
			transition = new PropertyTransition( # Easing, Duration, Delay
				$wf.$parser.parsePropertyValue(property[3], linkId, parseTree, false),
				$wf.$parser.parsePropertyValue(property[4], linkId, parseTree, false),
				$wf.$parser.parsePropertyValue(property[5], linkId, parseTree, false))

		# Note the important flag
		if property[7] is "!important"
			if typeof value is "string" then value += " !important"
			if typeof value is "object" then value.important = true

		# Add the property to the properties object
		mode = (selector.mode | value.mode) || 0
		selector.addProperty(new Property name, value, mode, transition)


# Parse out variable declarations
window.fashion.$parser.parseScopedVariable = (name, value, property, scope, parseTree) ->

	if typeof value is 'array' and typeof value[0] is 'array'
		throw new Error "Variable declaration '#{name}' cannot have comma separated values"

	if property[3]
		throw new Error "Variable declaration '#{name}' cannot have a transition"
	if property[7]
		throw new Error "Variable declaration '#{name}' cannot be !important"

	$wf.$parser.addVariable parseTree, name, value, scope


# Splits a value up by commas if necessary and then evaluates it
window.fashion.$parser.parsePropertyValues = (value, linkId, parseTree) ->

	# Commas mean array
	if value.indexOf(',') isnt -1
		value = window.fashion.$parser.splitByTopLevelCommas value

		# False alarm
		if value.length is 1
			return window.fashion.$parser.parsePropertyValue(value[0], linkId, parseTree)

		# Build an array of processed values
		else
			value[i] = item.trim() for i,item of value
			for i,item of value
				value[i] = window.fashion.$parser.parsePropertyValue(
					item, linkId, parseTree, true, true)
			return value

	# Just process the one value
	else return window.fashion.$parser.parsePropertyValue(value, linkId, parseTree)


# Convert a property value into a linked object or expression, if necessary
window.fashion.$parser.parsePropertyValue = 
	(value, linkId, parseTree, allowExpression = true, forceArray = false) ->

		# Check to see if we have a multi-piece property
		if forceArray or (typeof value is "string" and value.indexOf(" ") isnt -1)
			parts = $wf.$parser.splitByTopLevelSpaces value

			# False alarm!
			if !forceArray and parts.length is 1
				return window.fashion.$parser.parseSingleValue value, linkId, parseTree

			# Accumulate all of the single values into an array and calculate the mode
			values = ($wf.$parser.parseSingleValue(val, linkId, parseTree) for val in parts)
			values.mode = 0
			(values.mode |= (val.mode || 0)) for val in values
			return values

		# We have a single-piece property
		else window.fashion.$parser.parseSingleValue value, linkId, parseTree


# Shared regex used to identify expressions
# This doesn't consider whether or not they're within a string
# TODO(keatontech): Fix that
window.fashion.$parser.identifyExpression = () -> 
	///(
	([\s][\+\-\/\*\=][\s])|	# Operator with a space around it: dead givaway
	\s(\&\&|\|\|)\s|		# AND and OR
	[\(\)\[\]]|				# Parenthesis and brackets: definitely
	\@|\$ 					# Variables and globals
	)///g


# Convert a property value into a linked object or expression, if necessary
window.fashion.$parser.parseSingleValue = (value, linkId, parseTree) ->
	if !value or typeof value isnt 'string' then return value

	# Check to see if it's an expression
	if value.match $wf.$parser.identifyExpression()
		return window.fashion.$parser.parseExpression(value, linkId, parseTree,
			window.fashion.$functions, window.fashion.$globals)

	# Nope, this is just a normal property
	return value
