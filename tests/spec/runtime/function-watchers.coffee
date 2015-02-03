window.fashiontests.runtime.functionWatchers = ()->
	$wf = window.fashion

	# The style header interferes with a lot of these tests
	beforeEach ()->
		window.fsStyleHeader = $wf.styleHeader
		$wf.styleHeader = ""
		window.fsStyleHeaderRules = $wf.styleHeaderRules
		$wf.styleHeaderRules = 0

	afterEach ()->
		$wf.styleHeader = window.fsStyleHeader
		$wf.styleHeaderRules = window.fsStyleHeaderRules

	# Helper functions
	getRule = window.fashiontests.runtime.getRule

	# Test fashion code
	testFSS = (fss) -> 
		{css,js} = $wf.$actualizer.actualize $wf.$processor.process $wf.$parser.parse fss
		window.fashiontests.runtime.simulateRuntime css, js

	it "should watch function values and update expressions accordingly", ()->

		# Function test rig
		window.FSTCOLOR = "blue"

		# Add an event-based function for testing
		window.fashion.addFunction "fstColor",
			output: $wf.$type.Color
			watch: (c) -> window.addEventListener("FSTCHANGE", c)
			evaluate: () -> window.FSTCOLOR

		# Test function
		testFSS """
			.item {
				background-color: fstColor();
			}
			"""

		# Initial value
		expect(getRule(0).style.cssText).toBe "background-color: blue;"

		# Change the value and dispatch the event
		window.FSTCOLOR = "yellow"
		window.dispatchEvent new Event("FSTCHANGE")

		# New value
		expect(getRule(0).style.cssText).toBe "background-color: yellow;"