window.fashiontests.modules.colors = ()->

	$wf = window.fashion
	parse = window.fashion.$parser.parse
	process = window.fashion.$processor.process
	actualize = (parseTree) -> window.fashion.$actualizer.actualize parseTree, 0

	it 'should convert HSB into RGB', ()->
		{css} = actualize process parse """
			div {
				color: hsb(0,100,100);
			}
			"""

		expect(css).toContain("rgb(255,0,0)")


	it 'should convert HSBA into RGBA', ()->
		{css} = actualize process parse """
			div {
				color: hsba(120,100,100,0.5);
			}
			"""

		expect(css).toContain("rgba(0,255,0,0.5)")


	it 'should generate RGB values from CSS colors', ()->
		cssToRgb = $wf.color.cssTOjs

		expect(cssToRgb "#fff").toEqual {r:255,g:255,b:255}
		expect(cssToRgb "#ff5c5c").toEqual {r:255,g:92,b:92}
		expect(cssToRgb "rgb(255,0,128)").toEqual {r:255,g:0,b:128,a:1}
		expect(cssToRgb "rgba(255,0,128,0.5)").toEqual {r:255,g:0,b:128,a:0.5}