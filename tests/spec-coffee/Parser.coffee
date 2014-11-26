describe "Parser", ()->
	parse = window.fashion.$parser.parse
	type = window.fashion.$type
	unit = window.fashion.$unit

	# Test the variable parser
	describe "Variables", () ->

		it "should parse out string variables", ()->
			result = parse("$singleQuote: 'string';\n$doubleQuote: \"quote\";")

			# Check types
			expect(result.variables["singleQuote"]["type"]).toEqual(type.String);
			expect(result.variables["doubleQuote"]["type"]).toEqual(type.String);

			# Check values
			expect(result.variables["singleQuote"]["value"]).toEqual("string");
			expect(result.variables["doubleQuote"]["value"]).toEqual("quote");


		it "should parse out numerical variables", ()->
			result = parse(	"""
							$noUnit: 10;
							$pxUnit: 20px;
							$decimalEmUnit: .1em;
							$negativeMsUnit: -20ms;
							""")

			# Check types
			expect(result.variables["noUnit"]["type"]).toEqual(type.Number);
			expect(result.variables["pxUnit"]["type"]).toEqual(type.Number);
			expect(result.variables["decimalEmUnit"]["type"]).toEqual(type.Number);
			expect(result.variables["negativeMsUnit"]["type"]).toEqual(type.Number);

			# Check units
			expect(result.variables["noUnit"]["unit"]).toEqual(false);
			expect(result.variables["pxUnit"]["unit"]).toEqual(unit.Number.px);
			expect(result.variables["decimalEmUnit"]["unit"]).toEqual(unit.Number.em);
			expect(result.variables["negativeMsUnit"]["unit"]).toEqual(unit.Number.ms);

			# Check values
			expect(result.variables["noUnit"]["value"]).toEqual(10);
			expect(result.variables["pxUnit"]["value"]).toEqual(20);
			expect(result.variables["decimalEmUnit"]["value"]).toEqual(0.1);
			expect(result.variables["negativeMsUnit"]["value"]).toEqual(-20);


		it "should parse out color variables", ()->
			result = parse(	"""
							$colorConst: red;
							$colorHex: #da0;
							$colorRGB: rgb(200,100,50);
							$colorRGBA: rgba(200,100,50,0.5);
							""")

			# Check types
			expect(result.variables["colorConst"]["type"]).toEqual(type.Color);
			expect(result.variables["colorHex"]["type"]).toEqual(type.Color);
			expect(result.variables["colorRGB"]["type"]).toEqual(type.Color);
			expect(result.variables["colorRGBA"]["type"]).toEqual(type.Color);

			# Check units
			expect(result.variables["colorConst"]["unit"]).toEqual(unit.Color.Const);
			expect(result.variables["colorHex"]["unit"]).toEqual(unit.Color.Hex);
			expect(result.variables["colorRGB"]["unit"]).toEqual(unit.Color.RGB);
			expect(result.variables["colorRGBA"]["unit"]).toEqual(unit.Color.RGBA);


		it "should allow multiple variables per line", () ->
			result = parse("$singleQuote: 's1';$doubleQuote: \"s2\";")

			# Check values
			expect(result.variables["singleQuote"]["value"]).toEqual("s1");
			expect(result.variables["doubleQuote"]["value"]).toEqual("s2");


	# Test the nested selector parser
	describe "Selectors", () ->

		it "should parse complex selectors", ()->
			result = parse(	"""
							* {height: 30px;}
							ul.test td:last-child {
								background: black;
							}
							""")

			expect(result.selectors['*']['height']).toBe("30px")
			expect(result.selectors['ul.test td:last-child']['background']).toBe("black")


		it "should parse nested selectors", ()->
			result = parse(	"""
							.outer {
								opacity: 1.0;
								.middle {
									opacity: 0.5;
									.inner {opacity: 0.0;}
									&.super {opacity: 0.75;}
									height: 50px
								}
								height: 100px
							}
							""")

			# Check head values
			expect(result.selectors['.outer']['opacity']).toBe("1.0")
			expect(result.selectors['.outer .middle']['opacity']).toBe("0.5")
			expect(result.selectors['.outer .middle .inner']['opacity']).toBe("0.0")
			expect(result.selectors['.outer .middle.super']['opacity']).toBe("0.75")

			# Check tail values
			expect(result.selectors['.outer']['height']).toBe("100px")
			expect(result.selectors['.outer .middle']['height']).toBe("50px")


		it "should allow selectors to be variables", ()->
			result = parse(	"""
							$contentDiv: content;
							.$contentDiv {
								background: black;
							}
							""")

			expect(result.selectors['.$contentDiv']['background']).toBe("black")
			expect(result.variables.contentDiv.dependants).toEqual({".$contentDiv": [" "]})


		it "should allow variables to be part of selectors", ()->
			result = parse(	"""
							$contentDiv: .content;
							$contentSub: p;
							$contentDiv h3 $contentSub {
								color: black;
							}
							""")

			expect(result.selectors['$contentDiv h3 $contentSub']['color']).toBe("black")
			expect(result.variables.contentDiv.dependants).toEqual(
				{"$contentDiv h3 $contentSub": [" "]})
			expect(result.variables.contentSub.dependants).toEqual(
				{"$contentDiv h3 $contentSub": [" "]})


	# Test the nested selector parser
	describe "Properties", () ->

		it "should allow properties with no semi-colon", ()->
			result = parse(	"""
							p {
								height: 100px
								width: 200px
							}
							""")

			sels = result.selectors.p
			expect(sels.height).toBe("100px")
			expect(sels.width).toBe("200px")

		it "should allow one-line properties", ()->
			result = parse("p {height: 120px;}")
			expect(result.selectors.p.height).toBe("120px")


		it "should allow multipart properties", ()->
			result = parse(	"""
							p {
								border: 2px solid black;
							}
							""")

			sels = result.selectors.p
			expectedProperty = ['2px','solid','black']
			expect(sels.border).toEqual(expectedProperty)


		it "should account for strings in multipart properties", ()->
			result = parse(	"""
							p {
								text-style: "Times New Roman" italic;
								another: 'Times New Roman' italic;
							}
							""")

			sels = result.selectors.p
			expectedProperty = ['"Times New Roman"','italic']
			expect(sels["text-style"]).toEqual(expectedProperty)

			expectedProperty = ["'Times New Roman'",'italic']
			expect(sels["another"]).toEqual(expectedProperty)


		it "should allow comma-separated properties", ()->
			result = parse(	"""
							p {
								property: 1px, 2px;
							}
							""")

			sels = result.selectors.p
			expectedProperty = [['1px'], ['2px']]
			expect(sels.property).toEqual(expectedProperty)


		it "should allow multipart comma-separated properties", ()->
			result = parse(	"""
							p {
								border: 2px solid black, 1px solid white;
							}
							""")

			sels = result.selectors.p
			expectedProperty = [['2px','solid','black'], ['1px','solid','white']]
			expect(sels.border).toEqual(expectedProperty)


		it "should acknowledge !important on string properties", ()->
			result = parse(	"""
							p {
								height: 100px !important
							}
							""")

			sels = result.selectors.p
			expect(sels.height).toBe("100px !important")


		it "should link variables", ()->
			result = parse(	"""
							$height: 100px;
							p {
								height: $height;
							}
							""")

			sels = result.selectors.p

			# Test a basic transition (height)
			expect(sels.height.link).toBe("$height")
			expect(sels.height.dynamic).toBe(true)

			# Test the backlink
			expect(result.variables.height.dependants.p).toEqual(["height"])


		it "should link globals", ()->
			result = parse(	"""
							div {
								height: @height;
							}
							""")

			expect(result.selectors.div.height.dynamic).toBe(true)
			expect(result.selectors.div.height.link).toBe("@height")


		it "should acknowledge !important on linked properties", ()->
			result = parse(	"""
							$height: 100px;
							p {
								height: $height !important
							}
							""")

			sels = result.selectors.p
			expect(sels.height.link).toBe("$height")
			expect(sels.height.important).toBe(true)


		it "should parse transitions", ()->
			result = parse(	"""
							$height: 100px;
							$width: 100px;
							$duration: 200ms;
							$delay: 100ms;
							p {
								height: [ease-out 1s] $height;
								width: [ease-in-out $duration $delay] $width;
							}
							""")

			sels = result.selectors.p

			# Test a basic transition (height)
			expect(sels.height.transition.easing).toBe("ease-out")
			expect(sels.height.transition.duration).toBe("1s")

			# Test a more advanced transition with a delay and a var link (width)
			expect(sels.width.transition.easing).toBe("ease-in-out")
			expect(sels.width.transition.duration.link).toBe("$duration")
			expect(sels.width.transition.duration.dynamic).toBe(true)
			expect(sels.width.transition.delay.link).toBe("$delay")
			expect(sels.width.transition.delay.dynamic).toBe(true)

			# Test the backlink
			expect(result.variables.duration.dependants.p).toEqual(["transition.width"])
			expect(result.variables.delay.dependants.p).toEqual(["transition.width"])


	# Test the expression parser
	describe "Expressions", () ->

		it "should allow variables in expressions", ()->
			result = parse(	"""
							$fullHeight: 30px;
							div {
								height: $fullHeight / 3;
							}
							""")

			expression = result.selectors.div.height
			expect(expression.dynamic).toBe(true)
			expect(expression.evaluate({fullHeight: {value: 30}})).toBe("10px")
			expect(expression.evaluate({fullHeight: {value: 60}})).toBe("20px")

			# Test the backlink
			expect(result.variables.fullHeight.dependants.div).toEqual(["height"])


		it "should allow untyped variables in expressions", ()->
			result = parse(	"""
							$heightDivisor: 3;
							div {
								height: 30px/$heightDivisor;
							}
							""")

			expression = result.selectors.div.height
			expect(expression.dynamic).toBe(true)
			expect(expression.evaluate({heightDivisor: {value: 3}})).toBe("10px")
			expect(expression.evaluate({heightDivisor: {value: 10}})).toBe("3px")

			# Test the backlink
			expect(result.variables.heightDivisor.dependants.div).toEqual(["height"])


		it "should allow !important on expressions", ()->
			result = parse(	"""
							$fullHeight: 30px;
							div {
								height: $fullHeight / 3 !important;
							}
							""")

			expression = result.selectors.div.height
			expect(expression.evaluate({fullHeight: {value: 30}})).toBe("10px")
			expect(expression.important).toBe(true)

