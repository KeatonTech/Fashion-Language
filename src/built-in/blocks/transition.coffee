window.fashion.$blocks["transition"] = new BlockModule

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
		transitions: {}
		trigger: (name, duration, element) -> 
			duration = @timeInMs duration
			runtime = w.FASHION.blocks.transition
			
			# Get the transition object
			# TODO(keatontech): This probably shouldn't be hard-coded. Find a fix later.
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
					startTime = (parseFloat(keyframe.split('-')[0]) / 100 * duration) + 10

				# Wait until the limelight is on this keyframe
				addSelectors = runtime.addSelectors(selectors, duration, sheet, runtime)
				if startTime > 0
					wait startTime, addSelectors.bind(this)
				else addSelectors.bind(this)()

			# Delete the sheet once we're done
			wait duration + 12, ()-> sheetElement.parentElement.removeChild(sheetElement)


		# Add stuff for the each keyframe to the CSS
		addSelectors: (selectors, duration, sheet, runtime) -> ()->

			# Go through each selector
			for selector, properties of selectors

				# Separate out properties that need transitions applied to them
				jumpProperties = {}; smoothProperties = {};
				smoothCount = 0
				for property, valueObject of properties
					if typeof valueObject isnt 'object' or !valueObject.transition
						jumpProperties[property] = valueObject
					else 
						smoothProperties[property] = valueObject
						smoothCount++

				# Immidiately add the jump properties
				@addProperties selector, jumpProperties
				if smoothCount is 0 then continue

				# Add the transition rule to the temporary sheet
				transitionRule = runtime.generateTransitions smoothProperties, duration
				sheet.insertRule "#{selector} {#{transitionRule}}", sheet.rules.length

				# Wait for that to percolate and then add the smooth properties
				wait 1, ((selector, smoothProperties) => ()=> 
					@addProperties selector, smoothProperties
				)(selector, smoothProperties)

			# Make sure coffeescript doesn't try and return an array
			return


		# Generate CSS3 transition properties
		generateTransitions: (properties, duration) ->
			csstext = "transition: "
			for property, valueObject of properties when valueObject.transition
				t = valueObject.transition
				l = parseFloat(t.duration) / 100 * duration
				msLength = if l then "#{l}ms" else t.duration
				csstext += "#{property} #{msLength} #{t.easing||''} #{t.delay||''},"
			csstext = csstext.substr(0, csstext.length - 1) + ";"
			csstext = [csstext, "-webkit-"+csstext, "-moz-"+csstext, "-ms-"+csstext].join('')
			return csstext


window.fashion.$functions["trigger"] = new FunctionModule
	output: $wf.$type.None
	unit: ''
	mode: $wf.$runtimeMode.individual
	evaluate: (name, duration, element) ->
		w.FASHION.blocks.transition.trigger.call this, name.value, duration, element