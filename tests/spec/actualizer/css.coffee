window.fashiontests.actualizer.css = ()->

	$wf = window.fashion
	parse = window.fashion.$parser.parse
	process = window.fashion.$processor.process
	actualize = (parseTree) -> window.fashion.$actualizer.actualize parseTree, 0


	it 'should generate CSS identical to the input for static files', () ->
		{css: css} = actualize process parse """
			body {
				background-color: blue;
				width: 100%;
				content: "body string";
			}
			"""

		cssString = 'body {background-color: blue;width: 100%;content: "body string";}\n'
		expect(css).toBe(cssString)


	it 'should be able to lookup variable values', () ->
		{css: css} = actualize process parse """
			$minHeight: 100px;
			body {
				width:100%;
				min-height: $minHeight;
			}
			"""

		cssString = """
			body {width: 100%;}
			body {min-height: 100px;}

			"""

		expect(css).toBe(cssString)


	it 'should be able to evaluate expressions', () ->
		{css: css} = actualize process parse """
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


	it 'should ignore individual properties', () ->
		{css: css} = actualize process parse """
			$height: 100px;
			body {
				width: $height * 2;
				height: $height;
				color: @self.color;
			}
			"""

		cssString = """
			body {width: 200px;height: 100px;}

			"""

		expect(css).toBe(cssString)
		