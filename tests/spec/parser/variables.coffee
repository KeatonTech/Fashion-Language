window.fashiontests.parser.variables = () ->

	$wf = window.fashion
	parse = window.fashion.$parser.parse
	type = window.fashion.$type
	unit = window.fashion.$unit

	it "should parse out string variables", ()->
		result = parse("$singleQuote: 'string';\n$doubleQuote: \"quote\";")

		# Check types
		expect(result.variables["singleQuote"][0].type).toEqual(type.String);
		expect(result.variables["doubleQuote"][0].type).toEqual(type.String);

		# Check (trimmed) values
		expect(result.variables["singleQuote"][0].value).toEqual("string");
		expect(result.variables["doubleQuote"][0].value).toEqual("quote");


	it "should parse out numerical variables", ()->
		result = parse( """
						$noUnit: 10;
						$pxUnit: 20px;
						$decimalEmUnit: .1em;
						$negativeMsUnit: -20ms;
						""")

		# Check types
		expect(result.variables["noUnit"][0]["type"]).toEqual(type.Number);
		expect(result.variables["pxUnit"][0]["type"]).toEqual(type.Number);
		expect(result.variables["decimalEmUnit"][0]["type"]).toEqual(type.Number);
		expect(result.variables["negativeMsUnit"][0]["type"]).toEqual(type.Number);

		# Check units
		expect(result.variables["noUnit"][0]["unit"]).toEqual('');
		expect(result.variables["pxUnit"][0]["unit"]).toEqual(unit.Number.px);
		expect(result.variables["decimalEmUnit"][0]["unit"]).toEqual(unit.Number.em);
		expect(result.variables["negativeMsUnit"][0]["unit"]).toEqual(unit.Number.ms);

		# Check values
		expect(result.variables["noUnit"][0]["value"]).toEqual(10);
		expect(result.variables["pxUnit"][0]["value"]).toEqual(20);
		expect(result.variables["decimalEmUnit"][0]["value"]).toEqual(0.1);
		expect(result.variables["negativeMsUnit"][0]["value"]).toEqual(-20);


	it "should parse out color variables", ()->
		result = parse( """
						$colorConst: red;
						$colorHex: #da0;
						$colorRGB: rgb(200,100,50.4);
						$colorRGBA: rgba(200,100.01,50,0.5);
						""")

		# Check types
		expect(result.variables["colorConst"][0]["type"]).toEqual(type.Color);
		expect(result.variables["colorHex"][0]["type"]).toEqual(type.Color);
		expect(result.variables["colorRGB"][0]["type"]).toEqual(type.Color);
		expect(result.variables["colorRGBA"][0]["type"]).toEqual(type.Color);

		# Check values
		expect(result.variables["colorConst"][0]["value"]).toEqual("red");
		expect(result.variables["colorHex"][0]["value"]).toEqual("#da0");

		rgbExpression = result.variables["colorRGB"][0].value.evaluate
		expect(rgbExpression(0,0,$wf.$functions)).toEqual("rgb(200,100,50)");

		rgbaExpression = result.variables["colorRGBA"][0].value.evaluate
		expect(rgbaExpression(0,0,$wf.$functions)).toEqual("rgba(200,100,50,0.5)");


	it "should allow variables to rely on other variables", ()->
		result = parse( """
						$main: 10px;
						$copy: $main;
						""")


		# Check values
		expect(result.variables["main"][0]["value"]).toEqual(10);
		expect(result.variables["copy"][0]["value"].script).toBeDefined();

		v = (name) -> if name is "main" then value: 10
		expect(result.variables["copy"][0]["value"].evaluate(v)).toBe(10);
		v = (name) -> if name is "main" then value: 20
		expect(result.variables["copy"][0]["value"].evaluate(v)).toBe(20);

		# Check types
		expect(result.variables["main"][0]["type"]).toEqual(type.Number);
		expect(result.variables["copy"][0]["type"]).toEqual(type.Number);

		# Check units
		expect(result.variables["main"][0]["unit"]).toEqual(unit.Number.px);
		expect(result.variables["copy"][0]["unit"]).toEqual(unit.Number.px);

		# Check link
		link = result.variables["copy"][0]["value"].bindings
		expect(link.variables[0]).toEqual(["main",0])
		

	it "should allow variables to be expressions", ()->
		result = parse( """
						$main: 10px;
						$offset: 3px;
						$height: $main / 2 + $offset;
						""")


		# Check values
		expect(result.variables["main"][0]["value"]).toEqual(10);
		expect(result.variables["offset"][0]["value"]).toEqual(3);

		v = (name) -> if name is "main" then value: 10 else if "offset" then value: 3
		expect(result.variables["height"][0]["value"].evaluate(v)).toBe(8);
		v = (name) -> if name is "main" then value: 20 else if "offset" then value: 5
		expect(result.variables["height"][0]["value"].evaluate(v)).toBe(15);

		# Check link
		link = result.variables["height"][0]["value"].bindings
		expect(link.variables[0]).toEqual(["main",0])
		expect(link.variables[1]).toEqual(["offset",0])


	it "should allow variables within selectors", ()->

		result = parse( """
						.menu {
							$selected: 'main';
						}
						""")

		expect(result.variables["selected"][".menu"]["value"]).toEqual("main");
		expect(result.variables["selected"][".menu"]["type"]).toEqual(type.String);


	it "should allow variables within nested selectors", ()->

		result = parse( """
						.menu {
							.main {
								$isSelected: true;
							}
						}
						""")

		expect(result.variables["isSelected"][".menu .main"]["value"]).toEqual("true");
		expect(result.variables["isSelected"][".menu .main"]["type"]).toEqual type.Unknown


	it "should accept variable definitions without semicolons", ()->

		result = parse( """
						$var1: 1px
						.menu {
							$var2: 10px
						}
						""")

		expect(result.variables["var1"][0]["value"]).toEqual(1);
		expect(result.variables["var1"][0]["type"]).toEqual type.Number

		expect(result.variables["var2"][".menu"]["value"]).toEqual(10);
		expect(result.variables["var2"][".menu"]["type"]).toEqual type.Number


	it "should not accept top-level individualized variable definitions", ()->

		try
			result = parse( """
							$var1: @self.color;
							""")
		catch e
			expect(e.constructor.name).toBe("FSIndividualVarError")


	it "should accept non-top-level individualized variable definitions", ()->

		result = parse( """
						div {
							$var1: @self.color;
						}
						""")

		expect(result.variables["var1"]).toBeDefined()
		expect(result.variables["var1"]["div"].mode).toBe($wf.$runtimeMode.individual)


	it "should not accept variables with comma-separated values", ()->

		try
			result = parse( """
							$var1: red, blue;
							""")
		catch e
			expect(e.constructor.name).toBe("FSMultipartVariableError")


	it "should not accept variables marked as important", ()->

		try
			result = parse( """
							$var1: 100px !important;
							""")
		catch e
			expect(e.constructor.name).toBe("FSImportantVarError")