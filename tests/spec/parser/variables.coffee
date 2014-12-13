window.fashiontests.parser.variables = () ->

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
		expect(result.variables["noUnit"][0]["unit"]).toEqual(false);
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
						$colorRGB: rgb(200,100,50);
						$colorRGBA: rgba(200,100,50,0.5);
						""")

		# Check types
		expect(result.variables["colorConst"][0]["type"]).toEqual(type.Color);
		expect(result.variables["colorHex"][0]["type"]).toEqual(type.Color);
		expect(result.variables["colorRGB"][0]["type"]).toEqual(type.Color);
		expect(result.variables["colorRGBA"][0]["type"]).toEqual(type.Color);

		# Check units
		expect(result.variables["colorConst"][0]["unit"]).toEqual(unit.Color.Const);
		expect(result.variables["colorHex"][0]["unit"]).toEqual(unit.Color.Hex);
		expect(result.variables["colorRGB"][0]["unit"]).toEqual(unit.Color.RGB);
		expect(result.variables["colorRGBA"][0]["unit"]).toEqual(unit.Color.RGBA);

