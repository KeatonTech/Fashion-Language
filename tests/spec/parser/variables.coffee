window.fashiontests.parser.variables = () ->

	parse = window.fashion.$parser.parse
	type = window.fashion.$type
	unit = window.fashion.$unit

	it "should parse out string variables", ()->
		result = parse("$singleQuote: 'string';\n$doubleQuote: \"quote\";")

		# Check values
		expect(result.variables["singleQuote"][0].value).toEqual("string");
		expect(result.variables["doubleQuote"][0].value).toEqual("quote");


	it "should parse out numerical variables", ()->
		result = parse( """
						$noUnit: 10;
						$pxUnit: 20px;
						$decimalEmUnit: .1em;
						$negativeMsUnit: -20ms;
						""")

		# Check values
		expect(result.variables["noUnit"][0]["value"]).toEqual(10);
		expect(result.variables["pxUnit"][0]["value"]).toEqual(20);
		expect(result.variables["decimalEmUnit"][0]["value"]).toEqual(0.1);
		expect(result.variables["negativeMsUnit"][0]["value"]).toEqual(-20);


	it "should allow multiple variables per line", () ->
		result = parse("$singleQuote: 's1';$doubleQuote: \"s2\";")

		# Check values
		expect(result.variables["singleQuote"][0]["value"]).toEqual("s1");
		expect(result.variables["doubleQuote"][0]["value"]).toEqual("s2");