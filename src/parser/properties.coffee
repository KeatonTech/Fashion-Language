
# Convert a raw variable object into one with a little more info
window.fashion.$parser.parseSelectorBody = (bodyString, selector, parseTree) ->
	propertyNumber = 0

	regex = ///
			[\s]*(\$?[\w\-\s]*)\:		# Property/Variable Name
			[\s]*(\[([\w\-\$\@]*)		# Transition Name
			[\s]*([\w\-\$\@\%]*)[\s]*	# Transition Duration (optional)
			([\w\-\$\@\%]*)\]){0,1}		# Transition Delay (optional)
			[\s]*([^;}\n]*?)			# Property/Variable Value or Expression
			[\s]*(\![A-z0-9\-]+?)?		# Flags (like !important or !static)
			[;}\n]						# Ending
			///g

	while property = regex.exec bodyString
		transition = undefined
		if property.length < 7 then continue # Sanity check

		# Create a value object
		value = $wf.$parser.parsePropertyValues property[6], parseTree, selector

		# Check to see if this is a variable declaration
		name = property[1]
		if name[0] == "$"
			#$wf.$parser.parseScopedVariable name, value, property, selector, parseTree
			continue;

		# Parse transition
		if property[3]
			transition = new PropertyTransition( # Easing, Duration, Delay
				$wf.$parser.parsePropertyValue(property[3], parseTree, false),
				$wf.$parser.parsePropertyValue(property[4], parseTree, false),
				$wf.$parser.parsePropertyValue(property[5], parseTree, false))

		# Compute the value mode of multi-part properties
		valueMode = 0
		if value?.mode? then valueMode = value.mode
		else if value instanceof Array
			for elm in value when elm?
				if elm instanceof Array
					valueMode |= elm2.mode for elm2 in elm when elm2?.mode?
				if elm.mode? then valueMode |= elm.mode

		# Create the property object
		mode = (selector.mode | valueMode) || 0
		pObj = new Property name, value, mode, transition

		# Note the important flag
		if property[7] is "!important" then pObj.important = true

		# Add the property to the properties object
		selector.addProperty(pObj)
		propertyNumber++


# Parse out variable declarations
window.fashion.$parser.parseScopedVariable = (name, value, flag, scopeSel, parseTree) ->

	if typeof value is 'array' and typeof value[0] is 'array'
		throw new Error "Variable declaration '#{name}' cannot have comma separated values"

	if flag is "!important"
		throw new Error "Variable declaration '#{name}' cannot be !important"

	$wf.$parser.addVariable parseTree, name, value, flag, scopeSel


# Splits a value up by commas if necessary and then evaluates it
window.fashion.$parser.parsePropertyValues = (value, parseTree, selector) ->

	# Commas mean array
	if value.indexOf(',') isnt -1
		split = window.fashion.$parser.splitByTopLevelCommas value

		# False alarm
		if split.length is 1
			return window.fashion.$parser.parsePropertyValue(split[0], parseTree, selector)

		# Build an array of processed values
		else
			ret = []
			split[i] = item.trim() for i,item of split
			for i,item of split
				ret[i] = window.fashion.$parser.parsePropertyValue(
					item, parseTree, selector, true, true)
			return ret

	# Just process the one value
	else return window.fashion.$parser.parsePropertyValue(value, parseTree, selector)


# Convert a property value into a linked object or expression, if necessary
window.fashion.$parser.parsePropertyValue = 
	(value, parseTree, selector, allowExpression = true, forceArray = false) ->

		# Check to see if we have a multi-piece property
		if forceArray or (typeof value is "string" and value.indexOf(" ") isnt -1)
			parts = $wf.$parser.splitByTopLevelSpaces value

			# False alarm!
			if !forceArray and parts.length is 1
				return window.fashion.$parser.parseSingleValue value, parseTree, selector

			# Accumulate all of the single values into an array and calculate the mode
			vals = ($wf.$parser.parseSingleValue(v, parseTree, selector) for v in parts)
			vals.mode = 0
			(vals.mode |= (val.mode || 0)) for val in vals
			return vals

		# We have a single-piece property
		else window.fashion.$parser.parseSingleValue value, parseTree, selector


# Shared regex used to identify expressions
# This doesn't consider whether or not they're within a string
# TODO(keatontech): Fix that
window.fashion.$parser.identifyExpression = () -> 
	///(
	([\s][\+\-\/\*\=][\s])|		# Operator with a space around it: dead givaway
	\s(\&\&|\|\|)\s|			# AND and OR
	if\s.*?\sthen\s|\selse\s| 	# Ternary operators
	[\(\)\[\]]|					# Parenthesis and brackets: definitely
	\@|\$ 						# Variables and globals
	)///g


# Convert a property value into a linked object or expression, if necessary
window.fashion.$parser.parseSingleValue = (value, parseTree, selector, isVar = false) ->
	if !value or typeof value isnt 'string' then return value

	# Check to see if it's an expression
	if value.match $wf.$parser.identifyExpression()
		return window.fashion.$parser.parseExpression(value, parseTree, selector
			window.fashion.$functions, window.fashion.$globals, true, isVar)

	# Nope, this is just a normal property
	return value
