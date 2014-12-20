window.fashion.$blocks["transition"] = new BlockModule

	# This block does property manipulation, so that must be added to the runtime
	capabilities: ["selectors", "evaluation"]

	# Compile the block (acts as a parser mostly)
	compile: (args, body) ->
		[name] = args

		regex = ///(\s* 				# Trim leading spaces
				([0-9\-\.\s\%]+?\%|		# Keyframe value
				start)					# Special case for start
 				\s?\{|\}|\{				# Watch depth
				)///g

		keyframes = {}
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
				acc = ""
				lastAcc = segment[0].length + segment.index
				depth++

			# Track depth
			if segment[0] == "{" then depth++
			else if segment[0] == "}"
				depth--
				if depth is 0
					keyframes[currentKeyframe] = acc;
					acc = ""
					currentKeyframe = ""

		# Parse each inner body
		transition = {}
		for keyframe, body of keyframes
			transition[keyframe] = @parse(body).selectors

		# Add to the runtime runtimeObject
		@runtimeObject.transitions[name] = transition


	# Support code to be added to the javascript when this block is included
	runtimeObject: 

		# This will be populated with relevant transition data by the compiler
		transitions: {}

		# Tweak this timing if browsers are having problems
		startDelay: 10
		endDelay: 2
		settleDelay: 1 

		# Helper function to make coffeescript nicer
		wait: (d, f) -> setTimeout f, d

		# Function that starts the ball rolling
		trigger: (name, duration, element) -> 
			duration = @timeInMs duration
			runtime = FASHION.modules.blocks.transition
			
			# Get the transition object
			transition = runtime.transitions[name]

			# Create a new stylesheet for temporary CSS3 transition properties
			sheetElement = document.createElement "style"
			sheetElement.setAttribute("type", "text/css")
			head = document.head || document.getElementsByTagName('head')[0]
			head.appendChild(sheetElement)
			sheet = sheetElement.sheet

			# Go through each keyframe
			for keyframe, selectors of transition
				if keyframe is "start"
					startTime = 0
				else
					intStartTime = (parseFloat(keyframe.split('-')[0]) / 100 * duration)
					startTime = intStartTime + runtime.startDelay

				# Wait until the limelight is on this keyframe
				addSelectors = runtime.addSelectorsFunc(selectors, duration, sheet, runtime)
				if startTime > 0
					runtime.wait startTime, addSelectors.bind(this)
				else addSelectors.bind(this)()

			# Delete the sheet once we're done
			d = duration + runtime.startDelay + runtime.endDelay
			runtime.wait d, ()-> sheetElement.parentElement.removeChild(sheetElement)


		# Add stuff for the each keyframe to the CSS
		addSelectorsFunc: (selectors, duration, sheet, runtime) -> ()->
			settleDelay = FASHION.modules.blocks.transition.settleDelay

			# Go through each selector
			for id, selector of selectors
				properties = selector.properties

				# Separate out properties that need transitions applied to them
				jumpProperties = []; smoothProperties = [];
				smoothCount = 0
				for property in properties
					if typeof property.value isnt 'object' or !property.value.transition
						jumpProperties.push property
					else 
						smoothProperties.push property
						smoothCount++

				# Immidiately add the jump properties
				@addSelector selector.name, jumpProperties
				if smoothCount is 0 then continue

				# Add the transition rule to the temporary sheet
				tCSS = runtime.generateTransitions.call this, smoothProperties, duration
				selName = @evaluate selector.name
				sheet.insertRule "#{selName} {#{tCSS}}", sheet.rules.length

				# Wait for that to percolate and then add the smooth properties
				runtime.wait settleDelay, ((selector, smoothProperties) => ()=> 
					@addSelector selector.name, smoothProperties
				)(selector, smoothProperties)

			# Make sure coffeescript doesn't try and return an array
			return


		# Generate CSS3 transition properties
		generateTransitions: (properties, duration) ->
			csstext = "transition: "
			for property in properties when property.value.transition
				t = property.value.transition
				l = parseFloat(@evaluate t.duration) / 100 * duration
				msLength = if l then "#{l}ms" else t.duration
				csstext += "#{property.name} #{msLength} #{t.easing||''} #{t.delay||''},"

			csstext = csstext.substr(0, csstext.length - 1) + ";"
			csstext = [csstext, "-webkit-"+csstext, "-moz-"+csstext, "-ms-"+csstext].join('')
			return csstext


window.fashion.$functions["trigger"] = new FunctionModule
	output: $wf.$type.None
	unit: ''
	mode: $wf.$runtimeMode.individual
	evaluate: (name, duration, element) ->
		triggerFunction = FASHION.modules.blocks.transition.trigger
		triggerFunction.call this, name.value, duration, element