window.fashiontests.parser.expressions = ()->

	$wf = window.fashion
	parse = window.fashion.$parser.parse
	FunctionModule = window.fashion.$class.FunctionModule

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
		expect(expression.bindings.variables[0]).toEqual(["fullHeight",0])
		expect(pExpression.bindings.variables[0]).toEqual(["fullHeight",0])


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
		expect(expression.bindings.variables[0]).toEqual(["heightDivisor",0])


	it "should allow scoped variables in expressions", ()->
		result = parse( """
						div.class {
							$color: pink;
							color: $color;
						}
						""")

		expression = result.selectors[0].properties[0].value

		# Test the expression
		v = (name, scope) -> 
			expect(scope).toBe("div.class")
			return value: "pink"
		expect(expression.evaluate(v)).toBe("pink")

		# Test the backlink
		expect(expression.bindings.variables[0]).toEqual(["color","div.class"])


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
		expect(result.selectors[0].properties[0].important).toBe(true)
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
		

	it "should deal with parenthesis in expressions", ()->
		result = parse( """
						$padding: 10px;
						$contentWidth: 100px;
						div {
							width: @width / 2 - ($contentWidth - $padding) / 2
						}
						""")

		locals = (name) -> switch name 
			when "contentWidth" then value: 100
			when "padding" then value: 10
		globals = {width: {get: () -> 400}}
		expression = result.selectors[0].properties[0].value
		expressionResult = expression.evaluate locals, globals, $wf.$functions
		expect(expressionResult).toBe("155px")


	it "should deal with multiple parenthesis in expressions", ()->
		result = parse( """
						div {
							width: max(100px, min(0px, @width))
						}
						""")

		globals = {width: {get: () -> 400}}
		expression = result.selectors[0].properties[0].value
		expressionResult = expression.evaluate (()->), globals, $wf.$functions
		expect(expressionResult).toBe("100px")


	it "should pass through CSS hex colors", ()->

		# Test function
		$wf.addFunction "test", new FunctionModule (colorVal) ->
			expect(colorVal.type).toBe($wf.$type.Color)

		result = parse( """
						div {
							color: test(#f00)
						}
						""")

		expression = result.selectors[0].properties[0].value
		expressionResult = expression.evaluate (()->), (()->), $wf.$functions

		# Clean up
		delete $wf.$functions['test']


	it "should parse ternary operations", ()->
		result = parse( """
						$selected: true;
						div {
							color: if $selected then red else blue;
						}
						""")

		expression = result.selectors[0].properties[0].value
		expressionResult = expression.evaluate (()->value: true)
		expect(expressionResult).toBe("red")


	it "should parse ternary operations with equality expressions", ()->
		result = parse( """
						$selected: true;
						div {
							color: if $selected == false then #f00 else #00f;
						}
						""")

		expression = result.selectors[0].properties[0].value
		expressionResult = expression.evaluate (()->value: true)
		expect(expressionResult).toBe("#00f")


	it "should parse ternary as function arguments", ()->
		result = parse( """
						$selected: true;
						div {
							width: max(if $selected then 200px else 100px, 150px);
						}
						""")

		expression = result.selectors[0].properties[0].value

		expressionResult = expression.evaluate (()->value: true), 0, $wf.$functions
		expect(expressionResult).toBe("200px")

		expressionResult = expression.evaluate (()->value: false), 0, $wf.$functions
		expect(expressionResult).toBe("150px")


	it "should not accept ternaries with different return types", ()->
		try
			result = parse( """
							$selected: true;
							div {
								width: if $selected then 200px else #f00;
							}
							""")

		catch e
			expect(e.constructor.name).toBe("FSETernaryTypeError")


	it "should not accept expressions with mismatched parenthesis", ()->
		try
			result = parse( """
							$color: #d00;
							div {
								color: changeAlpha(darken($color);
							}
							""")

		catch e
			expect(e.constructor.name).toBe("FSEParenthesisMismatchError")


	it "should not accept expressions with mismatched types", ()->
		try
			result = parse( """
							div {
								padding: #f00 + 0px;
							}
							""")

		catch e
			expect(e.constructor.name).toBe("FSEMixedTypeError")


	it "should not accept expressions that use variables that don't exist", ()->
		try
			result = parse( """
							div {
								padding: $padding;
							}
							""")

		catch e
			expect(e.constructor.name).toBe("FSENonexistentVariableError")


	it "should not accept expressions that use variables that don't exist in scope", ()->
		try
			result = parse( """
							p {
								$padding: 10px;
							}
							div {
								padding: $padding;
							}
							""")

		catch e
			expect(e.constructor.name).toBe("FSEVariableScopeError")


	it "should not accept expressions that use globals that don't exist", ()->
		try
			result = parse( """
							div {
								padding: @padding;
							}
							""")

		catch e
			expect(e.constructor.name).toBe("FSENonexistentGlobalError")


	it "should not accept expressions that use functions that don't exist", ()->
		try
			result = parse( """
							div {
								padding: padding();
							}
							""")

		catch e
			expect(e.constructor.name).toBe("FSENonexistentFunctionError")