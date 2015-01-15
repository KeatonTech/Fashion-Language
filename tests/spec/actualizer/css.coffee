window.fashiontests.actualizer.css = ()->

	$wf = window.fashion
	parse = window.fashion.$parser.parse
	process = window.fashion.$processor.process
	actualize = (parseTree) -> window.fashion.$actualizer.actualize parseTree, 0
	prefixes = window.fashion.$actualizer.cssPrefixes


	# The style header interferes with a lot of these tests
	beforeEach ()->
		window.fsStyleHeader = $wf.styleHeader
		$wf.styleHeader = ""

	afterEach ()->
		$wf.styleHeader = window.fsStyleHeader


	it 'should generate CSS identical to the input for static files', () ->
		{css} = actualize process parse """
			body {
				background-color: blue;
				width: 100%;
				content: "body string";
			}
			"""

		cssString = 'body {background-color: blue;width: 100%;content: "body string";}\n'
		expect(css).toBe(cssString)


	it 'should maintain the !important tag', () ->
		parseTree = process parse """
			$width: 100px;
			body {
				background-color: blue !important;
				width: $width / 2 !important
			}
			"""

		{css} = actualize parseTree

		cssString = 'body {background-color: blue !important;width: 50px !important;}\n'
		expect(css).toBe(cssString)


	it 'should be able to lookup variable values', () ->
		{css} = actualize process parse """
			$minHeight: 100px;
			body {
				width:100%;
				min-height: $minHeight;
			}
			"""

		cssString = """
			body {width: 100%;min-height: 100px;}

			"""

		expect(css).toBe(cssString)


	it 'should ignore empty selectors', () ->
		{css} = actualize process parse """
			body {
				background-color: blue;
				width: 100%;
				content: "body string";
			}
			p {}
			"""

		cssString = 'body {background-color: blue;width: 100%;content: "body string";}\n'
		expect(css).toBe(cssString)


	it 'should allow nesting-only selectors', () ->
		{css} = actualize process parse """
			body {
				p {
					background-color: blue;
					width: 100%;
					content: "body string";
				}
			}
			"""

		cssString = 'body p {background-color: blue;width: 100%;content: "body string";}\n'
		expect(css).toBe(cssString)


	it 'should be able to evaluate expressions', () ->
		{css} = actualize process parse """
			$height: 100px;
			body {
				width: $height * 2;
				height: $height;
			}
			"""

		cssString = """
			body {width: 200px;height: 100px;}

			"""

		expect(css).toBe(cssString)


	it 'should ignore individual properties but include a hider', () ->
		{css} = actualize process parse """
			$height: 100px;
			body {
				width: $height * 2;
				height: $height;
				color: @self.color;
			}
			"""

		cssString = """
			body {width: 200px;height: 100px;}
			body {visibility: hidden;}

			"""

		expect(css).toBe(cssString)


	it 'should generate multi-part properties with embedded expressions', () ->
		{css} = actualize process parse """
			$borderWidth: 1px;
			body {
				border: $borderWidth solid black;
			}
			"""

		cssString = 'body {border: 1px solid black;}\n'
		expect(css).toBe(cssString)


	it 'should generate multiple multi-part properties with embedded expressions', () ->
		{css} = actualize process parse """
			$borderWidth: 1px;
			body {
				border: $borderWidth solid black, $borderWidth * 2 solid red;
			}
			"""

		cssString = 'body {border: 1px solid black, 2px solid red;}\n'
		expect(css).toBe(cssString)


	it 'should generate the CSS for transitions', () ->
		{css} = actualize process parse """
			body {
				border: 1px solid black;
				background-color: [linear 100ms] blue;
			}
			"""

		cssString = 'body {border: 1px solid black;background-color: blue;'
		for prefix in prefixes
			cssString += "#{prefix}transition: background-color 100ms linear ;"
		cssString += "}\n"

		expect(css).toBe(cssString)


	it 'should generate the CSS for dynamic transitions', () ->
		{css} = actualize process parse """
			$duration: 314ms;
			body {
				background-color: [linear $duration] blue;
			}
			"""

		cssString = 'body {background-color: blue;'
		for prefix in prefixes
			cssString += "#{prefix}transition: background-color 314ms linear ;"
		cssString += "}\n"

		expect(css).toBe(cssString)


	it 'should apply a constant header to the CSS', ()->
		$wf.styleHeader = window.fsStyleHeader
		{css} = actualize process parse """
			$not: empty;
			"""

		expect(css).toBe($wf.styleHeader)
