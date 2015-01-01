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
			transition[keyframe] = @parse(body).selectors

		# Add to the runtime runtimeObject
		@runtimeObject.transitions[name] = transition


	# Support code to be added to the javascript when this block is included
	runtimeObject: 

		# This will be populated with relevant transition data by the compiler
		transitions: {}


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
		transitionSheet = @getStylesheet "FASHION-transition::temporary-#{name}"
		propertySheet = @getStylesheet "FASHION-transition::properties-#{name}"

		# Go through each keyframe
		for keyframe, selectors of transition when keyframe[0] isnt '$'

			# Determine what time, in milliseconds, the keyframe should start executing
			if keyframe is "start" or keyframe is "begin" then startTime = 0
			else if keyframe is "finish" then startTime = duration + @transitionTiming.start
			else
				intStartTime = (parseFloat(keyframe.split('-')[0]) / 100 * duration) 
				startTime = intStartTime + @transitionTiming.start

			# Generate the magical function that'll be run later for each keyframe
			if keyframe.indexOf("-") isnt -1
				addSelectors = @transitionKeyframeRange(selectors, duration,
					transitionSheet.sheet, propertySheet.sheet, variables)
			else
				addSelectors = @transitionKeyframeSingle(selectors, duration,
					transitionSheet.sheet, propertySheet.sheet, variables)

			# Wait until the limelight is on this keyframe
			if startTime > 0
				@wait startTime, addSelectors.bind(this)
			else addSelectors.bind(this)()

		# Delete the sheet once we're done
		d = duration + @transitionTiming.start + @transitionTiming.end
		@wait d, ()=> @removeStylesheet transitionSheet


	# Add stuff for the each keyframe to the CSS
	transitionKeyframeSingle: (selectors, duration, tSheet, pSheet, variables) -> ()->

		# Lets the CSS 'settle' so that newly added transitions will be used
		settleDelay = @transitionTiming.settle

		# Go through each selector
		for id, selector of selectors
			properties = selector.properties

			# Separate out properties that need transitions applied to them
			smoothProperties = [];
			for property in properties
				if typeof property.value is 'object' and property.value.transition
					smoothProperties.push property

			# Add the transition rule to the temporary sheet
			tCSS = @generateCSSTransitions.call this, smoothProperties, duration, variables
			selName = @evaluate selector.name, 0, variables
			tSheet.insertRule "#{selName} {#{tCSS}}", tSheet.rules.length

			# Wait for that to percolate and then add the smooth properties
			@wait settleDelay, ((selName, properties) => ()=> 
				for property in properties
					pval = @evaluate property.value, 0, variables
					@setRuleOnSheet pSheet, selName, property.name, pval

			)(selName, properties)

		# Make sure coffeescript doesn't try and return an array
		return


	# Add stuff for the each keyframe to the CSS
	transitionKeyframeStatic: (selectors, duration, tSheet, pSheet, variables) -> ()->
		console.log "[FASHION] The transition block does not support ranged keyframes yet"


	# Generate CSS3 transition properties
	generateCSSTransitions: (properties, duration, variables) ->
		csstext = "transition: "
		for property in properties when property.value.transition
			t = property.value.transition
			l = parseFloat(@evaluate t.duration, 0, variables) / 100 * duration
			msLength = if l? then "#{l}ms" else t.duration
			csstext += "#{property.name} #{msLength} #{t.easing||''} #{t.delay||''},"

		csstext = csstext.substr(0, csstext.length - 1) + ";"
		csstext = [csstext, "-webkit-"+csstext, "-moz-"+csstext, "-ms-"+csstext].join('')
		return csstext


window.fashion.$functions["trigger"] = new FunctionModule
	output: $wf.$type.None
	unit: ''
	mode: $wf.$runtimeMode.individual
	evaluate: (name, duration, variables) ->
		variables[k] = v.value for k,v of variables
		triggerFunction = FASHION.runtime.triggerTransition
		triggerFunction.call this, name.value, duration, variables