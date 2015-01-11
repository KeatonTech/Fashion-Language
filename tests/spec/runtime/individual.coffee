window.fashiontests.runtime.individual = ()->

	$wf = window.fashion

	# Test fashion code
	testFSS = (fss) -> 
		{css,js} = $wf.$actualizer.actualize $wf.$processor.process $wf.$parser.parse fss
		window.fashiontests.runtime.simulateRuntime css, js

	# Everybody do your share
	beforeEach window.fashiontests.runtime.cleanup # Not sure why this fixes stuff but it does
	afterEach window.fashiontests.runtime.cleanup

	# Helper functions
	getIndRule = (rule) ->
		return window.fashiontests.runtime.getRule rule, $wf.runtimeConfig.individualCSSID

	# Add HTML to the page
	testDiv = window.fashiontests.runtime.testDiv


	it "should read attributes", ()->

		# Testing setup
		id = testDiv """
			<div class="item" color="red"></div>
			<div class="item" color="blue"></div>
			<div class="item" color="green"></div>
		"""

		testFSS """
			.item {
				background-color: @self.color;
			}
			"""

		# Check each rule
		expect(getIndRule(0).style.backgroundColor).toBe("red")
		expect(getIndRule(1).style.backgroundColor).toBe("blue")
		expect(getIndRule(2).style.backgroundColor).toBe("green")


	it "should not get confused by empty selectors", ()->

		# Testing setup
		id = testDiv """
			<div class="item" color="red"></div>
			<div class="item2" color="blue"></div>
			<div class="item3" color="green"></div>
		"""

		testFSS """
			.item2 {}
			.item {
				background-color: @self.color;
			}
			.item3 {}
			"""

		# Check each rule
		expect(getIndRule(0).style.backgroundColor).toBe("red")


	it "should automatically process new elements added with appendChild", (done)->

		# Testing setup
		id = testDiv """
			<div class="item" color="red"></div>
		"""

		testFSS """
			.item {
				background-color: @self.color;
			}
			"""

		wait = (d,f) -> setTimeout f,d
		wait 1, ()->
			# Add a new element using appendChild
			newDiv = document.createElement "div"
			newDiv.setAttribute "class", "item"
			newDiv.setAttribute "color", "yellow"
			document.getElementById(id).appendChild newDiv

			wait 1, ()->
				# Make sure that worked
				expect(getIndRule(1).style.backgroundColor).toBe("yellow")
				done()


	it "should automatically process new elements added with innerHTML", (done)->

		# Testing setup
		id = testDiv """
			<div class="item" color="red"></div>
		"""

		testFSS """
			.item {
				background-color: @self.color;
			}
			"""

		wait = (d,f) -> setTimeout f,d
		wait 1, ()->
			# Add a new element using appendChild
			ct = document.getElementById(id)
			ct.innerHTML += '<div class="item" color="orange"></div>'

			wait 1, ()->
				# Make sure that worked
				expect(getIndRule(1).style.backgroundColor).toBe("orange")
				done()


	it "should manually process additions, for browsers without O.o()", (done)->

		# Flag to tell fashion not to use O.o()
		# Generally useful for simulating older browsers during developement
		window.FASHION_NO_OBSERVE = true

		# Testing setup
		id = testDiv """
			<div class="item" color="red"></div>
		"""

		testFSS """
			.item {
				background-color: @self.color;
			}
			"""

		wait = (d,f) -> setTimeout f,d
		wait 1, ()->
			# Add a new element using appendChild
			ct = document.getElementById(id)
			ct.innerHTML += '<div class="item" color="purple"></div>'

			wait 1, ()->
				# Make sure the mock worked
				expect(getIndRule(1)).not.toBeDefined()

				# Tell Fashion to review the page
				FASHION.pageChanged()

				wait 1, ()->
					# Make sure that worked
					expect(getIndRule(1).style.backgroundColor).toBe("purple")

					# De-mock
					window.FASHION_NO_OBSERVE = false
					done()
