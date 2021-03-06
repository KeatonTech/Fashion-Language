window.fashiontests.actualizer.js = ()->

	$wf = window.fashion
	parse = window.fashion.$parser.parse
	process = window.fashion.$processor.process
	actualize = (parseTree) -> window.fashion.$actualizer.actualize parseTree, 0


	it 'should include all necessary runtime data', () ->
		{js} = actualize process parse """
			$colorVar: blue;
			body {
				background-color: $colorVar;
				width: 100%;
			}
			"""

		window.FASHION = {}
		eval(js)

		expect(window.FASHION.variables.colorVar.default).toBe('blue')
		expect(window.FASHION.selectors[0].name).toBe('body')
		expect(window.FASHION.selectors[0].properties.length).toBe(1)
		expect(window.FASHION.selectors[0].properties[0].name).toBe('background-color')


	# NOTE: These next 3 expectations depend on method names from runtime code,
	#		they may have to be changed as the structure of runtime code changes

	it 'should include all necessary basic runtime functions', () ->
		{js} = actualize process parse """
			$colorVar: blue;
			body {
				background-color: $colorVar;
				width: 100%;
			}
			"""

		window.FASHION = {}
		eval(js)

		# Check existence of core dependencies for variable processing
		expect(window.FASHION.runtime.evaluate).toBeDefined()
		expect(window.FASHION.runtime.setVariable).toBeDefined()
		expect(window.FASHION.runtime.$initWatchers).toBeDefined()
		expect(window.FASHION.runtime.regenerateSelector).toBeDefined()
		expect(window.FASHION.runtime.throwError).toBeDefined()
		expect(window.FASHION.runtime.determineType).toBeDefined()

		# Check non-existence of dependencies for individual properties & globals
		expect(window.FASHION.runtime.regenerateIndividualSelector).not.toBeDefined()
		expect(window.FASHION.runtime.createElementObject).not.toBeDefined()
		expect(window.FASHION.runtime.updateGlobal).not.toBeDefined()
		expect(window.FASHION.runtime.$initializeIndividualProperties).not.toBeDefined()


	it 'should include all necessary runtime functions for individual properties', () ->
		{js} = actualize process parse """
			body {
				background-color: @self.color;
				width: 100%;
			}
			"""

		window.FASHION = {}
		eval(js)

		# Check existence of core dependencies for variable processing
		expect(window.FASHION.runtime.evaluate).toBeDefined()
		expect(window.FASHION.runtime.regenerateSelector).toBeDefined()
		expect(window.FASHION.runtime.throwError).toBeDefined()
		expect(window.FASHION.runtime.regenerateIndividualSelector).toBeDefined()
		expect(window.FASHION.runtime.elementFunction).toBeDefined()
		expect(window.FASHION.runtime.$initializeIndividualProperties).toBeDefined()

		# No variables
		expect(window.FASHION.runtime.determineType).not.toBeDefined()
		expect(window.FASHION.runtime.setVariable).not.toBeDefined()
		expect(window.FASHION.runtime.$initWatchers).not.toBeDefined()

		# Still no globals
		expect(window.FASHION.runtime.updateGlobal).not.toBeDefined()


	it 'should include all necessary runtime functions for globals', () ->
		{js} = actualize process parse """
			$bg: red;
			body {
				background-color: $bg;
				width: @width;
			}
			"""

		window.FASHION = {}
		window.FSREADYTEST = (func) -> 
		eval(js.replace(/FSREADY\(/g,"FSREADYTEST("))

		# Check existence of core dependencies for variable processing
		expect(window.FASHION.runtime.evaluate).toBeDefined()
		expect(window.FASHION.runtime.regenerateSelector).toBeDefined()
		expect(window.FASHION.runtime.throwError).toBeDefined()
		expect(window.FASHION.runtime.updateGlobal).toBeDefined()

		# This one does have variables
		expect(window.FASHION.runtime.determineType).toBeDefined()
		expect(window.FASHION.runtime.setVariable).toBeDefined()
		expect(window.FASHION.runtime.$initWatchers).toBeDefined()

		# No individual properties
		expect(window.FASHION.runtime.regenerateIndividualSelector).not.toBeDefined()
		expect(window.FASHION.runtime.createElementObject).not.toBeDefined()
		expect(window.FASHION.runtime.$initializeIndividualProperties).not.toBeDefined()


	it 'should include a list of individual selectors', () ->
		{js} = actualize process parse """
			div {
				background-color: @self.color;
				on-click: max(0,1)px;
			}
			p {
				pin: center;
			}
			"""

		window.FASHION = {}
		eval(js)

		# Temporary layout given by current regrouper
		divIndividual = window.FASHION.individual[0]
		expect(divIndividual.properties[0].name).toBe("background-color")
		expect(divIndividual.properties[1].name).toBe("on-click")

		pIndividual = window.FASHION.individual[1]
		expect(pIndividual.properties[0].name).toBe("top")
		expect(pIndividual.properties[1].name).toBe("left")


	it 'should properly map variable bindings to the separated CSS selectors', () ->
		{js} = actualize process parse """
			$padding: 10px;
			div {
				padding: $padding;
				color: white;
			}
			p {
				pin: center;
				padding: $padding;
			}
			"""

		window.FASHION = {}
		eval(js)

		expect(FASHION.variables["padding"].dependents[0][0]).toEqual(['s',0,'padding'])
		expect(FASHION.variables["padding"].dependents[0][1]).toEqual(['s',1,'padding'])


	it 'should properly map selector variable bindings to the separated CSS selectors', () ->
		{js} = actualize process parse """
			$id: test;
			body {
				color: blue;
			}
			#$id {
				color: white;
			}
			"""

		window.FASHION = {}
		eval(js)

		# Make sure it's linked up right
		expect(FASHION.variables["id"].dependents[0][0]).toEqual(['s',1])


	it 'should leave out static variables', () ->
		{js} = actualize process parse """
			$padding: 10px !static;
			div {
				padding: $padding;
				color: white;
			}
			p {
				pin: center;
				padding: $padding;
			}
			"""

		window.FASHION = {}
		eval(js)

		expect(JSON.stringify FASHION.selectors).toBe("{}");


	it 'should not bind variables to trigger properties', () ->
		{js} = actualize process parse """
			$clickProperty: 10px;
			$clickSet: 10px;
			div {
				on-click: set("clickProperty", $clickSet, 0);
			}
			"""

		window.FASHION = {}
		eval(js)

		expect(FASHION.variables["clickSet"].dependents[0]).not.toBeDefined()


	it 'should properly map variable bindings to the individual CSS selectors', () ->
		{js} = actualize process parse """
			$padding: 10px;
			div {
				padding: $padding;
				color: white;
			}
			p {
				pin: center;
				padding-left: @self.left + $padding;
			}
			"""

		window.FASHION = {}
		eval(js)

		expect(FASHION.variables["padding"].dependents[0][0]).toEqual(['s',0,'padding'])
		expect(FASHION.variables["padding"].dependents[0][1]).toEqual(['i',1,'paddingLeft'])


	it 'should bind variables to other variables', () ->
		{js} = actualize process parse """
			$padding: 10px;
			$width: 1000px - 2 * $padding;
			div {
				width: $width;
			}
			"""

		window.FASHION = {}
		eval(js)

		expect(FASHION.variables["padding"].dependents[0].length).toBe(1);
		expect(FASHION.variables["padding"].dependents[0][0]).toEqual(['v','width','0']);


	it 'should properly map global bindings to the separated CSS selectors', () ->
		{js} = actualize process parse """
			div {
				width: @height;
				height: @height;
				color: white;
			}
			"""

		window.FASHION = {}
		eval(js.replace(/FSREADY\(/g,"FSREADYTEST("))

		expect(FASHION.modules.globals["height"].dependents[0]).toEqual(['s',0,'width'])
		expect(FASHION.modules.globals["height"].dependents[1]).toEqual(['s',0,'height'])


	it 'should mark !important properties as !important', () ->
		{js} = actualize process parse """
			$color: blue;
			div {
				color: $color !important;
				background-color: $color;
			}
			"""

		window.FASHION = {}
		eval(js.replace(/FSREADY\(/g,"FSREADYTEST("))

		expect(FASHION.selectors[0].properties[0].important).toEqual(1)
		expect(FASHION.selectors[0].properties[1].important).toEqual(0)
