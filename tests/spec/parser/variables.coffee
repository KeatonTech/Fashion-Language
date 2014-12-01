window.fashiontests.parser.variables = () ->

	parse = window.fashion.$parser.parse
	type = window.fashion.$type
	unit = window.fashion.$unit

	it "should parse out string variables", ()->
		result = parse("$singleQuote: 'string';\n$doubleQuote: \"quote\";")

		# Check types
		expect(result.variables["singleQuote"]["type"]).toEqual(type.String);
		expect(result.variables["doubleQuote"]["type"]).toEqual(type.String);

		# Check values
		expect(result.variables["singleQuote"]["value"]).toEqual("string");
		expect(result.variables["doubleQuote"]["value"]).toEqual("quote");


	it "should parse out numerical variables", ()->
		result = parse( """
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
		result = parse( """
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