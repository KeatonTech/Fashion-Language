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


	it "should redo the watchers when arguments change", ()->

		# Function test rig
		window.FSTCOLOR = "yellow"
		window.FSTCOLOR2 = "orange"

		# Add an event-based function for testing
		window.fashion.addFunction "globalColor",
			output: $wf.$type.Color
			watch: (varName,c) -> 
				window.addEventListener("FSTCHANGE_"+varName.value, c)
				return () -> window.removeEventListener("FSTCHANGE_"+varName.value, c)
			evaluate: (varName) -> window[varName.value]

		# Test function
		testFSS """
			$varName: FSTCOLOR;
			.item {
				background-color: globalColor($varName);
			}
			"""

		# Initial value
		expect(getRule(0).style.cssText).toBe "background-color: yellow;"

		# Change the value and dispatch the event
		window.FSTCOLOR = "green"
		window.dispatchEvent new Event("FSTCHANGE_FSTCOLOR")

		# New initial value
		expect(getRule(0).style.cssText).toBe "background-color: green;"

		# Change the variable it's hooked to
		style.varName = "FSTCOLOR2"

		# Make sure the selector updated
		# New value
		expect(getRule(0).style.cssText).toBe "background-color: orange;"

		# Change the new value
		window.FSTCOLOR2 = "purple"
		window.dispatchEvent new Event("FSTCHANGE_FSTCOLOR2")

		# Make sure the watcher updated
		expect(getRule(0).style.cssText).toBe "background-color: purple;"

		# Change the new value but trigger the old event
		window.FSTCOLOR2 = "red"
		window.dispatchEvent new Event("FSTCHANGE_FSTCOLOR")

		# Make sure the old watcher was removed, leaving the new value unchanged
		expect(getRule(0).style.cssText).toBe "background-color: purple;"


