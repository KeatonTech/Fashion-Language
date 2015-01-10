window.fashiontests.runtime.variables = ()->

	$wf = window.fashion

	# Test fashion code
	testFSS = (fss) -> 
		{css,js} = $wf.$actualizer.actualize $wf.$processor.process $wf.$parser.parse fss
		window.fashiontests.runtime.simulateRuntime css, js

	# Everybody do your share
	afterEach window.fashiontests.runtime.cleanup

	# Helper functions
	getRule = window.fashiontests.runtime.getRule


	it 'should watch for changes to the variable object', ()->
		testFSS """
			$color: blue;
			"""

		# Change the color
		style.color = "red"
		
		# Check the style object and check FASHION's internal representation
		expect(style.color).toBe("red")
		expect(FASHION.variables.color.default).toBe("red")


	it 'should change selectors when variables change', () ->
		testFSS """
			$color: blue;
			div {
				background-color: $color;
			}
			"""

		# Initial state
		expect(getRule(0).style.cssText).toBe "background-color: blue;"

		# Change the color
		style.color = "red"
		
		# New state
		expect(getRule(0).style.cssText).toBe "background-color: red;"


	it 'should change dynamically named selectors when variables change', () ->
		testFSS """
			$id: start;
			#$id {
				background-color: red;
			}
			"""

		# Initial state
		expect(getRule(0).selectorText).toBe "#start"

		# Change the color
		style.id = "end"
		
		# New state
		expect(getRule(0).selectorText).toBe "#end"


	it 'should maintain the !important tag on changed selectors', () ->
		testFSS """
			$color: blue;
			div {
				background-color: $color !important;
			}
			"""

		# Initial state
		expect(getRule(0).style.cssText).toBe "background-color: blue !important;"

		# Change the color
		style.color = "red"
		
		# New state
		expect(getRule(0).style.cssText).toBe "background-color: red !important;"


	it 'should change transition durations and delays', () ->
		testFSS """
			$duration: 300ms;
			$delay: 200ms;
			div {
				background-color: [ease-out $duration $delay] red;
			}
			"""

		# Initial state
		expect(getRule(0).style.transition).toBe "background-color 300ms ease-out 200ms"

		# Change the color
		style.duration = 500
		style.delay = 100
		
		# New state
		expect(getRule(0).style.transition).toBe "background-color 500ms ease-out 100ms"


	it 'should change variables that rely on other variables', () ->
		testFSS """
			$padding: 10px;
			$width: 400px - 2 * $padding;
			div {
				width: $width;
			}
			"""

		# Initial state
		expect(getRule(0).style.cssText).toBe "width: 380px;"

		# Change the color
		style.padding = 100;
		
		# New state
		expect(getRule(0).style.cssText).toBe "width: 200px;"

