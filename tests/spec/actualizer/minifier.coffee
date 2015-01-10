window.fashiontests.actualizer.minifier = ()->

	$wf = window.fashion
	parse = window.fashion.$parser.parse
	process = window.fashion.$processor.process
	actualize = (parseTree) -> window.fashion.$actualizer.actualize parseTree, 0

	it 'should minify selectors and variables', () ->

		{js} = actualize process parse """
			$size: 10px;
			body {
				padding: $size;
				width: $size;
			}
			"""

		window.FASHION = {}
		eval(js)

		expect(window.FSMIN.length).toBe(3);

		# Selectors
		expect(window.FSMIN[0].length).toBe(1);
		expect(window.FSMIN[0][0]).toContain('body');
		expect(window.FSMIN[0][0]).toContain($wf.$runtimeMode.static);

		# Properties (This section might be a little overly specific)
		expect(window.FSMIN[0][0][5][0]).toContain("padding");
		expect(window.FSMIN[0][0][5][0][4][0]).toBe("e");
		expect(window.FSMIN[0][0][5][1]).toContain("width");
		expect(window.FSMIN[0][0][5][1][4][0]).toBe("e");

		# Variables
		expect(window.FSMIN[1].length).toBe(1);
		expect(window.FSMIN[1][0]).toContain('size');
		expect(window.FSMIN[1][0]).toContain(10);
		expect(window.FSMIN[1][0]).toContain('px');

		# No individual properties
		expect(window.FSMIN[2].length).toBe(0)


	it 'should expand minified selectors and variables', () ->

		# Actual minified data taken from the above example
		minData = [[
			["s",0,1,"body",1,[
				["p","padding",1,0,["e",1,1,"px","return (v('size').value) + 'px'"]],
				["p","width",1,0,["e",1,1,"px","return (v('size').value) + 'px'"]]
			]]],[
			["v","size",1,"px",1,10,[],{"0":10}]]
		]

		# Expand this data into a blank runtime data object
		rd = {selectors: {}, variables: {}}
		window.fashion.$actualizer.minifier.expandRuntimeData minData, rd

		# See how it did on selectors
		expect(rd.selectors[0].name).toBe("body")
		expect(rd.selectors[0].mode).toBe(1)
		expect(rd.selectors[0].properties.length).toBe(2)

		# Properties
		props = rd.selectors[0].properties
		expect(props[0].name).toBe("padding")
		expect(props[0].mode).toBe(1)
		expect(props[0].value.evaluate).toBeDefined()
		expect(props[1].name).toBe("width")
		
		# Variables
		expect(rd.variables["size"].name).toBe("size")
		expect(rd.variables["size"].default).toBe(10)
		expect(rd.variables["size"].unit).toBe("px")
		expect(rd.variables["size"].mode).toBe(1)
		expect(rd.variables["size"].type).toBe($wf.$type.Number)


	it 'should minify individual properties', () ->

		{js} = actualize process parse """
			body {
				color: @self.color;
			}
			"""

		window.FASHION = {}
		eval(js)

		# Individual properties
		expect(window.FSMIN[2].length).toBe(1)

		# Selectors
		expect(window.FSMIN[2].length).toBe(1);
		expect(window.FSMIN[2][0]).toContain('body');
		expect(window.FSMIN[2][0]).toContain($wf.$runtimeMode.static);

		# Properties (This section might be a little overly specific)
		expect(window.FSMIN[2][0][5][0]).toContain("color");
		expect(window.FSMIN[2][0][5][0]).toContain($wf.$runtimeMode.individual);
		expect(window.FSMIN[2][0][5][0][4][0]).toBe("e");
		

	it 'should expand individual properties', ()->

		# Whew, dense. Again, this is the data from before
		data = [[],[],[["s",0,0,"body",1,[["p","color",7,0,["e",7,2,null,"return e.color"]]]]]]

		# Expand this data into a blank runtime data object
		rd = {selectors: {}, variables: {}, individual: {}}
		window.fashion.$actualizer.minifier.expandRuntimeData data, rd

		# See how it did on individual selectors
		expect(rd.individual[0].name).toBe("body")
		expect(rd.individual[0].mode).toBe(1)
		expect(rd.individual[0].properties.length).toBe(1)

		# ... and their properties
		props = rd.individual[0].properties
		expect(props[0].name).toBe("color")
		expect(props[0].mode).toBe(7)
		expect(props[0].value.evaluate).toBeDefined()


	it 'should minify multipart properties', () ->

		{js} = actualize process parse """
			$size: 10px;
			body {
				border: $size solid black;
			}
			"""

		window.FASHION = {}
		eval(js)

		# Properties (This section might be a little overly specific)
		expect(window.FSMIN[0][0][5][0]).toContain("border");
		expect(window.FSMIN[0][0][5][0][4][0][0]).toBe("e");
		expect(window.FSMIN[0][0][5][0][4][1]).toBe("solid");
		expect(window.FSMIN[0][0][5][0][4][2]).toBe("black");


	it 'should minify dynamic properties', () ->

		{js} = actualize process parse """
			$id: test;
			#$id {
				border: blue;
			}
			"""

		window.FASHION = {}
		eval(js)

		# Selectors
		expect(window.FSMIN[0].length).toBe(1);
		expect(window.FSMIN[0][0][3][0]).toBe('e');
		expect(window.FSMIN[0][0]).toContain($wf.$runtimeMode.dynamic);


