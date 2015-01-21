window.fashiontests.runtime.scoped = ()->

	$wf = window.fashion

	# Test fashion code
	testFSS = (fss) -> 
		{css,js} = $wf.$actualizer.actualize $wf.$processor.process $wf.$parser.parse fss
		window.fashiontests.runtime.simulateRuntime css, js

	# Everybody do your share
	beforeEach window.fashiontests.runtime.cleanup # Not sure why this fixes stuff
	afterEach window.fashiontests.runtime.cleanup

	# Helper functions
	getStaticRule = window.fashiontests.runtime.getRule
	getIndRule = (rule) ->
		return window.fashiontests.runtime.getRule rule, $wf.runtimeConfig.individualCSSID

	# Add HTML to the page
	testDiv = window.fashiontests.runtime.testDiv

	# The style header interferes with a lot of these tests
	beforeEach ()->
		window.fsStyleHeader = $wf.styleHeader
		$wf.styleHeader = ""
		window.fsStyleHeaderRules = $wf.styleHeaderRules
		$wf.styleHeaderRules = 0

	afterEach ()->
		$wf.styleHeader = window.fsStyleHeader
		$wf.styleHeaderRules = window.fsStyleHeaderRules


	it "should override variables based on scope", ()->

		# Testing setup
		id = testDiv """
			<div class="nestedItem"></div>
			<div class="outsideItem"></div>
		"""

		testFSS """
			$color: red;
			.nestedItem {
				$color: blue;
				background-color: $color;
			}
			.outsideItem {
				background-color: $color;
			}
			"""

		# Check each rule
		expect(getIndRule(0).style.backgroundColor).toBe("blue")
		expect(getStaticRule(0).style.backgroundColor).toBe("red")


	it "should be able to change variables for specific elements", ()->

		# Testing setup
		id = testDiv """
			<div class="item" id="testColorChange"></div>
			<div class="item" id="testColorNotChange"></div>
		"""

		testFSS """
			.item {
				$color: blue;
				background-color: $color;
			}
			"""

		# Check the beginning values
		expect(getIndRule(0).style.backgroundColor).toBe("blue")
		expect(getIndRule(1).style.backgroundColor).toBe("blue")

		# Set the color variable on this element
		element = document.getElementById "testColorChange"
		FASHION.setElementVariable element, "color", "rgb(200, 100, 50)"

		# Check the new value (only the first one should have changed)
		expect(getIndRule(0).style.backgroundColor).toBe("rgb(200, 100, 50)")
		expect(getIndRule(1).style.backgroundColor).toBe("blue")


	it "should work in selectors", ()->

		# Testing setup
		id = testDiv """
			<div id="select1" class="select">
				<p class="i1">Selected</p>
				<p class="i2">Not Selected</p>
			</div>
			<div id="select2" class="select">
				<p class="i1">Selected</p>
				<p class="i2">Not Selected</p>
			</div>
		"""

		testFSS """
			.select {
				$selected: i1;
				p {
					color: black;
				}
				.$selected {
					color: red;
				}
			}
			"""

		# Check the beginning values
		s1i1 = window.getComputedStyle document.querySelectorAll("#select1 .i2")[0]
		expect(s1i1.color).toBe("rgb(0, 0, 0)")

		s2i1 = window.getComputedStyle document.querySelectorAll("#select2 .i2")[0]
		expect(s2i1.color).toBe("rgb(0, 0, 0)")

		# Set the color variable on this element
		element = document.getElementById "select1"
		FASHION.setElementVariable element, "selected", "i2"

		# Check the beginning values
		s1i1 = window.getComputedStyle document.querySelectorAll("#select1 .i2")[0]
		expect(s1i1.color).toBe("rgb(255, 0, 0)")

		s2i1 = window.getComputedStyle document.querySelectorAll("#select2 .i2")[0]
		expect(s2i1.color).toBe("rgb(0, 0, 0)")


	it "should work in combined selectors", ()->

		# Testing setup
		id = testDiv """
			<article>
				<div id="select1" class="select">
					<p class="i1">Selected</p>
					<p class="i2">Not Selected</p>
				</div>
				<div id="select2" class="select">
					<p class="i1">Selected</p>
					<p class="i2">Not Selected</p>
				</div>
			</article>
		"""

		testFSS """
			.select {
				$selected: i1;
				p {
					color: black;
				}
				^article .$selected {
					color: red;
				}
			}
			"""

		# Check the beginning values
		s1i1 = window.getComputedStyle document.querySelectorAll("#select1 .i2")[0]
		expect(s1i1.color).toBe("rgb(0, 0, 0)")

		s2i1 = window.getComputedStyle document.querySelectorAll("#select2 .i2")[0]
		expect(s2i1.color).toBe("rgb(0, 0, 0)")

		# Set the color variable on this element
		element = document.getElementById "select1"
		FASHION.setElementVariable element, "selected", "i2"

		# Check the beginning values
		s1i1 = window.getComputedStyle document.querySelectorAll("#select1 .i2")[0]
		expect(s1i1.color).toBe("rgb(255, 0, 0)")

		s2i1 = window.getComputedStyle document.querySelectorAll("#select2 .i2")[0]
		expect(s2i1.color).toBe("rgb(0, 0, 0)")


	it "should assign overrides to each element for individualized scoped variables", ()->

		# Testing setup
		id = testDiv """
			<div class="item" color="rgb(221, 170, 0)"><h2 id="t1"></h2></div>
			<div class="item" color="rgb(0, 153, 255)"><h2 id="t2"></h2></div>
		"""

		testFSS """
			.item {
				$color: @self.color;
				h2 {
					color: $color;
				}
			}
			"""

		# Check the beginning values
		expect(getIndRule(0).style.color).toBe("rgb(221, 170, 0)")
		expect(getIndRule(1).style.color).toBe("rgb(0, 153, 255)")

		# Make sure the rules are applied to the right element
		expect(getIndRule(0).selectorText).toBe("#t1")
		expect(getIndRule(1).selectorText).toBe("#t2")


	it "should process new elements with individualized scope variables", (done)->

		# Testing setup
		id = testDiv """
			<div class="item" color="rgb(221, 170, 0)"><h2 id="t1"></h2></div>
			<div class="item" color="rgb(221, 170, 0)"><h2 id="t2"></h2></div>
		"""

		testFSS """
			.item {
				$color: @self.color;
				h2 {
					color: $color;
				}
			}
			"""

		wait = (d,f) -> setTimeout f,d
		wait 1, ()->

			# Add a new element using appendChild
			ct = document.getElementById(id)
			ct.innerHTML += """
				<div class="item" color="rgb(32, 64, 128)"><h2 id="a1"></h2></div>'
				"""

			wait 1, ()->
				# Make sure that worked
				expect(getIndRule(2).style.color).toBe("rgb(32, 64, 128)")
				expect(getIndRule(2).selectorText).toBe("#a1")
				done()
