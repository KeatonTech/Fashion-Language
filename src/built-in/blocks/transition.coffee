window.fashion.$blocks["transition"] = new BlockModule

	# This block does property manipulation, so that must be added to the runtime
	capabilities: ["transitionBlock"]

	# Compile the block (acts as a parser mostly)
	compile: (args, body) ->
		[name] = args

		regex = ///(\s* 						# Trim leading spaces
				([0-9\-\.\s\%]+?\%|				# Keyframe value
				start|begin|finish)\s?\{|		# Special cases for start & finish
				\$([\w\-]+)\:[\s]*(.*?)[;\n]|	# Variable definitions
 				\}|\{							# Watch depth
				)///g

		keyframes = {}
		transition = {}
		depth = lastAcc = 0
		currentKeyframe = acc = ""

		# Go through regex matches to get the inner bodies of each keyframe
		count = 1000
		while --count > 0 and segment = regex.exec body

			# Add everything we've found to the body
			acc += body.substring(lastAcc, segment.index)
			lastAcc = segment.index

			# Detect a keyframe value
			if segment[2] and depth is 0
				currentKeyframe = segment[2]

				# Add support for ranged keyframes, if necessary
				if segment[2].indexOf("-") > 0
					@requireModule "transitionRangeBlock"

				depth++
				acc = ""
				lastAcc = segment[0].length + segment.index

			# Detect a variable definition
			if segment[3] and segment[4] and depth is 0
				if !transition['$vars'] then transition['$vars'] = []
				transition['$vars'].push segment[3]
				@addVariable segment[3], segment[4]

			# Track depth
			if segment[0] == "{" then depth++
			else if segment[0] == "}"
				depth--
				if depth is 0
					keyframes[currentKeyframe] = acc;
					acc = ""
					currentKeyframe = ""

		# Parse each inner body
		for keyframe, body of keyframes
			parsedBody = @parse(body)
			delete parsedBody.variables
			transition[keyframe] = parsedBody

		# Add to the runtime runtimeObject
		@runtimeObject.transitions[name] = transition


	# Support code to be added to the javascript when this block is included
	runtimeObject: 

		# This will be populated with relevant transition data by the compiler
		transitions: {}


# Runtime functions to run normal transitions
$wf.addRuntimeModule "transitionBlock", ["wait", "selectors", "types", "sheets"],

	# Easily adjustable delays, may need to vary browser-by-browser
	# These just make sure the browser 'digests' everything in the right order
	# All times in milliseconds
	transitionTiming:
		start: 10 		# Time between 'start' and '0%'
		end: 5			# Time between the last keyframe and the stylesheet being deleted
		settle: 1 		# Time between adding a transition and adding a property

	# Function that starts the ball rolling
	triggerTransition: (name, duration, variables) -> 
		duration = @timeInMs duration
		transition = FASHION.modules.blocks.transition.transitions[name]
		if !transition? then return @throwError "Transition '#{name}' does not exist"

		# Create a stylesheets for transition properties and for resulting properties
		transitionSheet = @addStylesheet undefined, "FASHION-transition::temporary-#{name}"
		propertySheet = @getStylesheet "FASHION-transition::properties-#{name}"

		# Make sure these have priority over older transitions
		@moveSheetToTop propertySheet

		# Go through each keyframe
		for keyframe, parseTree of transition when keyframe[0] isnt '$'

			# Set up timed triggers for other transitions
			@transitionDelayTriggers duration, variables, keyframe, parseTree.blocks

			# Set up timed function calls for modifying selectors
			@transitionDelaySelectors(
				duration, variables, keyframe, transitionSheet, parseTree.selectors)
			
		# Delete the sheet once we're done
		d = duration + @transitionTiming.start + @transitionTiming.end
		@wait d, ()=> @removeStylesheet transitionSheet


	# Set up time delays for triggering other transitions
	transitionDelayTriggers: (duration, variables, keyframe, blocks) ->
		startTime = @transitionStartTime duration, keyframe

		for block in blocks when block.type is "trigger"
			[name, transDuration] = block.arguments

			# Strip the quotes from the name, if necessary
			if name[0] is "'" or name[0] is '"' or name[0] is "`"
				name = name.substring 1, name.length - 1

			# Convert the duration into a millisecond duration (from %, s, ms, or unitless)
			if transDuration.indexOf('%') is transDuration.length - 1
				transDuration = parseFloat(transDuration) / 100 * duration
			else transDuration = @timeInMs transDuration			

			# When the time comes, make it go
			@wait startTime, @triggerTransition.bind this, name, transDuration, variables


	# Set up time delays for selectors
	transitionDelaySelectors: (duration, variables, keyframe, tSheet, selectors) ->

		startTime = @transitionStartTime duration, keyframe

		# Generate the magical function that'll be run later for each keyframe
		if keyframe.indexOf("-") isnt -1
			addSelectors = @transitionKeyframeRange(keyframe, selectors, duration,
				tSheet.sheet, variables)
		else
			addSelectors = @transitionKeyframeSingle(selectors, duration,
				tSheet.sheet, variables)

		# Wait until the limelight is on this keyframe
		if startTime > 0
			@wait startTime, addSelectors.bind(this)
		else addSelectors.bind(this)()


	# Given a keyframe and a duration, what time should the transition start
	transitionStartTime: (duration, keyframe) ->

		# Determine what time, in milliseconds, the keyframe should start executing
		if keyframe is "start" or keyframe is "begin" then return 0
		else if keyframe is "finish" then return duration + @transitionTiming.start
		else
			intStartTime = (parseFloat(keyframe.split('-')[0]) / 100 * duration) 
			return intStartTime + @transitionTiming.start


	# Add stuff for the each keyframe to the CSS
	transitionKeyframeSingle: (selectors, duration, tSheet, variables) -> ()->

		# Get the property sheet
		# This used to get passed in, but moving it around the <head> confuses chrome
		pSheet = @getStylesheet "FASHION-transition::properties-#{name}"

		# Go through each selector
		for id, selector of selectors
			@transitionSelector selector, duration, tSheet, pSheet, variables

		# Make sure coffeescript doesn't try and return an array
		return


	# Add properties for a single selector to the transition
	transitionSelector: (selector, duration, tSheet, pSheet, variables, selName) ->
		properties = selector.properties

		# Separate out properties that need transitions applied to them
		smoothProperties = [];
		for property in properties
			if typeof property.value is 'object' and property.value.transition
				smoothProperties.push property

		# Add the transition rule to the temporary sheet
		tCSS = @generateCSSTransitions.call this, smoothProperties, duration, variables
		selName = selName || @evaluate selector.name, 0, variables
		tSheet.insertRule "#{selName} {#{tCSS}}", tSheet.rules.length

		# Wait for that to percolate and then add the smooth properties
		@wait @transitionTiming.settle, ((selName, properties) => ()=> 
			for property in properties
				pval = @evaluate property.value, 0, variables
				if property.important then pval += " !important"
				@setRuleOnSheet pSheet, selName, property.name, pval

		)(selName, properties)


	# Generate CSS3 transition properties
	generateCSSTransitions: (properties, duration, variables) ->
		csstext = "transition: "
		for property in properties when property.value.transition
			t = property.value.transition
			if t.duration.indexOf "%" isnt -1
				l = parseFloat(@evaluate t.duration, 0, variables) / 100 * duration
				msLength = if l? then "#{l}ms" else t.duration
			else msLength = t.duration
			csstext += "#{property.name} #{msLength} #{t.easing||''} #{t.delay||''},"

		csstext = csstext.substr(0, csstext.length - 1) + ";"
		csstext = [csstext, "-webkit-"+csstext, "-moz-"+csstext, "-ms-"+csstext].join('')
		return csstext


# Runtime functions to run transitions including keyframe ranges
$wf.addRuntimeModule "transitionRangeBlock", ["individualizedHelpers"],

	# Add stuff for the each keyframe to the CSS
	transitionKeyframeRange: (keyframe, selectors, duration, tSheet, variables) -> ()->

		# Figure out the actual duration we're working with
		startTime = (parseFloat(keyframe.split('-')[0]) / 100 * duration)
		endTime = (parseFloat(keyframe.split('-')[1]) / 100 * duration)
		if endTime <= startTime then return @throwError "Range must start before it ends."
		spanDuration = endTime - startTime

		# Get the property sheet
		# This used to get passed in, but moving it around the <head> confuses chrome
		pSheet = @getStylesheet "FASHION-transition::properties-#{name}"

		# Go through each selector
		for selectorId, selector of selectors
			selName = @evaluate selector.name, 0, variables

			# Get the elements that apply to this selector
			selElements = @elementsForSelector selName
			slice = spanDuration / selElements.length

			# Each one gets its very own transition applied to it!
			for order, element of selElements
				if !element.id then element.setAttribute('id', @generateRandomId())

				# Delay each element based on its order in the sequence
				# TODO: Allow for other orderings
				@wait slice * order, ((selector, element) => () =>

					# Perform the transition
					name = "##{element.id}"
					addSelector = @transitionSelector.bind this
					addSelector selector, duration, tSheet, pSheet, variables, name

				)(selector, element)
		

# Trigger function, used inside of expressions and triggers
window.fashion.$functions["trigger"] = new FunctionModule
	output: $wf.$type.None
	unit: ''
	mode: $wf.$runtimeMode.individual
	evaluate: (name, duration, variables) ->
		variables[k] = v.value for k,v of variables
		triggerFunction = FASHION.runtime.triggerTransition
		triggerFunction.call this, name.value, duration, variables


# Trigger block, used inside transitions to trigger other transitions
window.fashion.$blocks["trigger"] = new BlockModule
	compile: (args, body) ->
		if args.length is 0
			@throwError "Must specify transition name and duration"
		else if args.length is 1
			@throwError "Must specify a duration"
