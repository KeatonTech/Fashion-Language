window.fashiontests.parser.expressions = ()->

	$wf = window.fashion
	parse = window.fashion.$parser.parse

	it "should allow variables in expressions", ()->
		result = parse("""
					$fullHeight: 30px;
					div {
						height: $fullHeight / 3;

						p {
							height: $fullHeight / 3 - 4;
						}
					}
					""")

		expression = result.selectors[0].properties[0].value
		pExpression = result.selectors[1].properties[0].value
		v = (name) -> return value: 30

		expect(expression.mode).toBe($wf.$runtimeMode.dynamic)
		expect(expression.unit).toBe("px")

		# Run the function and make sure it calculates the right value
		expect(expression.evaluate(v)).toBe("10px")
		expect(pExpression.evaluate(v)).toBe("6px")

		# Change the value and try again
		v = (name) -> return value: 60
		expect(expression.evaluate(v)).toBe("20px")
		expect(pExpression.evaluate(v)).toBe("16px")

		# Test the backlink
		expect(result.bindings.variables["fullHeight"].length).toBe(2)
		expect(result.bindings.variables["fullHeight"][0]).toBe(0)
		expect(result.bindings.variables["fullHeight"][1]).toBe(1)


	it "should allow untyped variables in expressions", ()->
		result = parse( """
						$heightDivisor: 3;
						div {
							height: 30px / $heightDivisor;
						}
						""")

		expression = result.selectors[0].properties[0].value
		expect(expression.mode).toBe($wf.$runtimeMode.dynamic)
		expect(expression.unit).toBe("px")

		# Test the expression
		v = (name) -> return value: 3
		expect(expression.evaluate(v)).toBe("10px")

		v = (name) -> return value: 10
		expect(expression.evaluate(v)).toBe("3px")

		# Test the backlink
		expect(result.bindings.variables["heightDivisor"][0]).toBe(0)


	it "should parse functions with no arguments", ()->
		result = parse( """
						div {
							height: random();
						}
						""")

		expression = result.selectors[0].properties[0].value
		expect(expression.mode).toBe($wf.$functions.random.mode || 0)

		# Test the expression
		expressionResult = expression.evaluate {}, {}, $wf.$functions
		expect(parseFloat(expressionResult)).toBeGreaterThan(0)
		expect(parseFloat(expressionResult)).toBeLessThan(1)

		# Make sure the function was added to the dependencies
		expect(result.dependencies.functions["range"]).toBe($wf.$functions.range)


	it "should parse functions with 1 argument", ()->
		result = parse( """
						div {
							height: round(11.4);
						}
						""")

		expression = result.selectors[0].properties[0].value

		# Test the expression
		expressionResult = expression.evaluate {}, {}, $wf.$functions
		expect(parseFloat(expressionResult)).toBe(11)

		# Make sure the function was added to the dependencies
		expect(result.dependencies.functions["round"]).toBe($wf.$functions.round)


	it "should allow functions with variable and global arguments", ()->
		result = parse( """
						$maxHeight: 300px;
						div {
							height: min($maxHeight, @height);
						}
						""")

		expression = result.selectors[0].properties[0].value

		# Test the expression
		locals = (name) -> if name is "maxHeight" then return value: 300
		globals = {height: {get: () -> 400}}
		expressionResult = expression.evaluate locals, globals, $wf.$functions
		expect(expressionResult).toBe("300px")

		# Make sure the function was added to the dependencies
		expect(result.dependencies.functions["min"]).toBe($wf.$functions.min)
		expect(result.dependencies.globals["height"]).toBe($wf.$globals.height)


	it "should allow math inside function arguments", ()->
		result = parse( """
						$maxHeight: 300px;
						div {
							height: min($maxHeight * 2, @height);
						}
						""")

		expression = result.selectors[0].properties[0].value

		# Test the expression
		locals = ()-> return value: 100
		globals = {height: {get: () -> 400}}
		expressionResult = expression.evaluate locals, globals, $wf.$functions
		expect(expressionResult).toBe("200px")

		# Make sure the function was added to the dependencies
		expect(result.dependencies.functions["min"]).toBe($wf.$functions.min)
		expect(result.dependencies.globals["height"]).toBe($wf.$globals.height)


	it "should allow nested functions", ()->
		result = parse( """
						$maxHeight: 300px;
						$minHeight: 100px;
						div {
							height: max(min($maxHeight, @height), $minHeight);
						}
						""")

		expression = result.selectors[0].properties[0].value
		locals = (name) -> switch name 
			when "maxHeight" then value: 300
			when "minHeight" then value: 100


		globals = {height: {get: () -> 50}}
		expressionResult = expression.evaluate locals, globals, $wf.$functions
		expect(expressionResult).toBe("100px")

		globals = {height: {get: () -> 150}}
		expressionResult = expression.evaluate locals, globals, $wf.$functions
		expect(expressionResult).toBe("150px")

		globals = {height: {get: () -> 500}}
		expressionResult = expression.evaluate locals, globals, $wf.$functions
		expect(expressionResult).toBe("300px")

		# Make sure the function was added to the dependencies
		expect(result.dependencies.functions["min"]).toBe($wf.$functions.min)
		expect(result.dependencies.functions["max"]).toBe($wf.$functions.max)
		expect(result.dependencies.globals["height"]).toBe($wf.$globals.height)


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
	

	it "should allow alternate-property bindings in expressions", ()->
		result = parse( """
						div {
							height: @('#sidebar', 'width')px;
						}
						""")
		console.log result

		bindSpy = jasmine.createSpy('spy').and.returnValue({})
		thisObj = {
			querySelector: bindSpy
			getComputedStyle: ()-> {width: 20}
		}

		expression = result.selectors[0].properties[0].value
		expect(expression.mode).toBe($wf.$runtimeMode.dynamic)
		expect(expression.unit).toBe("px")
		expect(expression.evaluate({},{},$wf.$functions)).toBe("20px")

		expect(bindSpy).toHaveBeenCalledWith("#sidebar", 'width')
	###


	it "should allow !important on expressions", ()->
		result = parse( """
						$fullHeight: 30px;
						div {
							height: $fullHeight / 3 !important;
						}
						""")

		expression = result.selectors[0].properties[0].value
		expect(expression.evaluate(() -> return value: 30)).toBe("10px")
		expect(expression.important).toBe(true)
		expect(expression.mode).toBe($wf.$runtimeMode.dynamic)
		expect(expression.unit).toBe("px")


	it "should recognize expressions that need to be individualized", ()->
		result = parse( """
						div {
							height: @('', 'width', @self)px / 1.5;
						}
						""")

		expression = result.selectors[0].properties[0].value
		expect(expression.mode).toBe($wf.$runtimeMode.individual)
		expect(expression.unit).toBe("px")
		expect(expression.setter).toBe(false);


	it "should recognize setter expressions", ()->
		result = parse( """
						$selected: "divName";
						div {
							on-click: $selected = @self.id;
						}
						""")

		expression = result.selectors[0].properties[0].value
		expect(expression.mode).toBe($wf.$runtimeMode.individual)
		expect(expression.type).toBe($wf.$type.String);
		expect(expression.unit).toBe(undefined);
		expect(expression.setter).toBe(true);


	it "should apply units to relative variables", ()->
		result = parse( """
						div {
							width: @self.width;
						}
						""")

		expression = result.selectors[0].properties[0].value
		expect(expression.mode).toBe($wf.$runtimeMode.individual)
		expect(expression.type).toBe($wf.$type.Number);
		expect(expression.unit).toBe("px");
		