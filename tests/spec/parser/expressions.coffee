window.fashiontests.parser.expressions = ()->

	parse = window.fashion.$parser.parse

	it "should allow variables in expressions", ()->
		result = parse("""
					$fullHeight: 30px;
					div {
						height: $fullHeight / 3;
					}
					""")

		expression = result.selectors.div.height
		expect(expression.dynamic).toBe(true)
		expect(expression.individualized).toBe(false)
		expect(expression.unit).toBe("px")
		expect(expression.evaluate({fullHeight: {value: 30}})).toBe("10px")
		expect(expression.evaluate({fullHeight: {value: 60}})).toBe("20px")

		# Test the backlink
		expect(result.variables.fullHeight.dependants.div).toEqual(["height"])

	it "should allow untyped variables in expressions", ()->
		result = parse( """
						$heightDivisor: 3;
						div {
							height: 30px / $heightDivisor;
						}
						""")

		expression = result.selectors.div.height
		expect(expression.dynamic).toBe(true)
		expect(expression.individualized).toBe(false)
		expect(expression.unit).toBe("px")
		expect(expression.evaluate({heightDivisor: {value: 3}})).toBe("10px")
		expect(expression.evaluate({heightDivisor: {value: 10}})).toBe("3px")

		# Test the backlink
		expect(result.variables.heightDivisor.dependants.div).toEqual(["height"])


	it "should parse functions with no arguments", ()->
		result = parse( """
						div {
							height: random();
						}
						""")

		expression = result.selectors.div.height
		expect(expression.functions).toEqual(['random'])

		expressionResult = expression.evaluate {}, {}, $wf.$functions
		expect(parseFloat(expressionResult)).toBeGreaterThan(0)
		expect(parseFloat(expressionResult)).toBeLessThan(1)


	it "should parse functions with 1 argument", ()->
		result = parse( """
						div {
							height: round(11.4);
						}
						""")

		expression = result.selectors.div.height
		expect(expression.functions).toEqual(['round'])

		expressionResult = expression.evaluate {}, {}, $wf.$functions
		expect(parseFloat(expressionResult)).toBe(11)


	it "should allow functions in expressions", ()->
		result = parse( """
						$maxHeight: 300px;
						div {
							height: min($maxHeight, @height);
						}
						""")

		expression = result.selectors.div.height
		expect(expression.functions).toEqual(['min'])
		locals = {maxHeight: {value: 300}}
		globals = {height: {get: () -> 400}}

		expressionResult = expression.evaluate locals, globals, $wf.$functions
		expect(expressionResult).toBe("300px")


	it "should allow math inside function arguments", ()->
		result = parse( """
						$maxHeight: 300px;
						div {
							height: min($maxHeight * 2, @height);
						}
						""")

		expression = result.selectors.div.height
		expect(expression.functions).toEqual(['min'])
		locals = {maxHeight: {value: 300}}
		globals = {height: {get: () -> 400}}

		expressionResult = expression.evaluate locals, globals, $wf.$functions
		expect(expressionResult).toBe("400px")


	it "should allow nested functions", ()->
		result = parse( """
						$maxHeight: 300px;
						$minHeight: 100px;
						div {
							height: max(min($maxHeight, @height), $minHeight);
						}
						""")

		expression = result.selectors.div.height
		expect(expression.functions).toEqual(['max','min'])
		locals = {maxHeight: {value: 300}, minHeight: {value: 100}}

		globals = {height: {get: () -> 50}}
		expressionResult = expression.evaluate locals, globals, $wf.$functions
		expect(expressionResult).toBe("100px")

		globals = {height: {get: () -> 150}}
		expressionResult = expression.evaluate locals, globals, $wf.$functions
		expect(expressionResult).toBe("150px")

		globals = {height: {get: () -> 500}}
		expressionResult = expression.evaluate locals, globals, $wf.$functions
		expect(expressionResult).toBe("300px")


	### MAYBE THIS WILL COME BACK LATER
	it "should allow bindings in expressions", ()->
		result = parse("""
						div {
							height: @('#sidebar')px;
						}
						""")

		bindSpy = jasmine.createSpy('spy').and.returnValue(10)
		thisObj = {querySelector: bindSpy}

		expression = result.selectors.div.height
		expect(expression.dynamic).toBe(true)
		expect(expression.individualized).toBe(false)
		expect(expression.unit).toBe("px")
		expect(expression.evaluate({},{},$wf.$functions,thisObj)).toBe("10px")

		expect(bindSpy).toHaveBeenCalledWith("#sidebar")
	###

	it "should allow alternate-property bindings in expressions", ()->
		result = parse( """
						div {
							height: @('#sidebar', 'width')px;
						}
						""")

		bindSpy = jasmine.createSpy('spy').and.returnValue({})
		thisObj = {
			querySelector: bindSpy
			getComputedStyle: ()-> {width: 20}
		}

		expression = result.selectors.div.height
		expect(expression.dynamic).toBe(true)
		expect(expression.individualized).toBe(false)
		expect(expression.unit).toBe("px")
		expect(expression.evaluate({},{},$wf.$functions,thisObj)).toBe("20px")

		expect(bindSpy).toHaveBeenCalledWith("#sidebar")


	it "should allow !important on expressions", ()->
		result = parse( """
						$fullHeight: 30px;
						div {
							height: $fullHeight / 3 !important;
						}
						""")

		expression = result.selectors.div.height
		expect(expression.evaluate({fullHeight: {value: 30}})).toBe("10px")
		expect(expression.important).toBe(true)
		expect(expression.individualized).toBe(false)
		expect(expression.unit).toBe("px")


	it "should recognize expressions that need to be individualized", ()->
		result = parse( """
						div {
							height: @('', 'width', @self)px / 1.5;
						}
						""")

		expression = result.selectors.div.height
		expect(expression.individualized).toBe(true)
		expect(expression.unit).toBe("px")


	it "should recognize setter expressions", ()->
		result = parse( """
						$selected: "divName";
						div {
							on-click: $selected = @self.id;
						}
						""")

		expression = result.selectors.div['on-click']
		expect(expression.individualized).toBe(true)
		expect(expression.type).toBe($wf.$type.String);
		expect(expression.unit).toBe(undefined);


	it "should apply units to relative variables", ()->
		result = parse( """
						div {
							width: @self.width;
						}
						""")

		expression = result.selectors.div.width
		expect(expression.individualized).toBe(true)
		expect(expression.type).toBe($wf.$type.Number);
		expect(expression.unit).toBe("px");