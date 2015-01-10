window.fashiontests.runtime.selectors = ()->

	$wf = window.fashion

	# Test fashion code
	testFSS = (fss) -> 
		{css,js} = $wf.$actualizer.actualize $wf.$processor.process $wf.$parser.parse fss
		window.fashiontests.runtime.simulateRuntime css, js

	# Everybody do your share
	afterEach window.fashiontests.runtime.cleanup

	# Helper functions
	getRule = window.fashiontests.runtime.getRule


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
