window.fashiontests.actualizer.js = ()->

	$wf = window.fashion
	parse = window.fashion.$parser.parse
	process = window.fashion.$processor.process
	actualize = (parseTree) -> window.fashion.$actualizer.actualize parseTree, 0

	it 'should include all necessary runtime data', () ->
		{js} = actualize process parse """
			$colorVar: blue;
			body {
				background-color: $colorVar;
				width: 100%;
			}
			"""

		window.FASHION = {}
		eval(js)

		expect(window.FASHION.variables.colorVar.default).toBe('blue')
		expect(window.FASHION.selectors[0]).toBeUndefined()
		expect(window.FASHION.selectors[1].name).toBe('body')
		expect(window.FASHION.selectors[1].properties.length).toBe(1)
		expect(window.FASHION.selectors[1].properties[0].name).toBe('background-color')