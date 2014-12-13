window.fashiontests.parser.properties = ()->

	parse = window.fashion.$parser.parse

	it "should allow properties with no semi-colon", ()->
		result = parse("""
						p {
							height: 100px
							width: 200px
						}
						""")

		props = result.selectors[0].properties

		expect(props[0].name).toBe("height")
		expect(props[0].value).toBe("100px")

		expect(props[1].name).toBe("width")
		expect(props[1].value).toBe("200px")

	it "should allow one-line properties", ()->
		result = parse("p {height: 120px;}")
		expect(result.selectors[0].properties[0].name).toBe("height")
		expect(result.selectors[0].properties[0].value).toBe("120px")


	it "should allow multipart properties", ()->
		result = parse("""
						p {
							border: 2px solid black;
						}
						""")

		props = result.selectors[0].properties
		expectedProperty = ['2px','solid','black']
		expect(props[0].value).toEqual(expectedProperty)


	it "should account for strings in multipart properties", ()->
		result = parse("""
						p {
							text-style: "Times New Roman" italic;
							another: 'Times New Roman' italic;
						}
						""")

		props = result.selectors[0].properties
		expectedProperty = ['"Times New Roman"','italic']
		expect(props[0].value).toEqual(expectedProperty)

		expectedProperty = ["'Times New Roman'",'italic']
		expect(props[1].value).toEqual(expectedProperty)


	it "should allow comma-separated properties", ()->
		result = parse("""
						p {
							property: 1px, 2px;
						}
						""")

		props = result.selectors[0].properties
		expectedProperty = [['1px'], ['2px']]
		expect(props[0].value).toEqual(expectedProperty)


	it "should allow multipart comma-separated properties", ()->
		result = parse("""
						p {
							border: 2px solid black, 1px solid white;
						}
						""")

		props = result.selectors[0].properties
		expectedProperty = [['2px','solid','black'], ['1px','solid','white']]
		expect(props[0].value).toEqual(expectedProperty)


	it "should acknowledge !important on string properties", ()->
		result = parse("""
						p {
							height: 100px !important
						}
						""")

		props = result.selectors[0].properties
		expect(props[0].value).toBe("100px !important")


	it "should acknowledge !important on linked properties", ()->
		result = parse("""
						$height: 100px;
						p {
							height: $height !important
						}
						""")

		props = result.selectors[0].properties
		expect(props[0].value.important).toBe(true)


	it "should parse transitions", ()->
		result = parse("""
						$height: 100px;
						$width: 100px;
						$duration: 200ms;
						$delay: 100ms;
						p {
							height: [ease-out 1s] $height;
							width: [ease-in-out $duration $delay] $width;
						}
						""")

		props = result.selectors[0].properties
		height = props[0].value
		width = props[1].value

		# Test a basic transition (height)
		expect(height.transition.easing).toBe("ease-out")
		expect(height.transition.duration).toBe("1s")

		# Test a more advanced transition with a delay and a var link (width)
		expect(width.transition.easing).toBe("ease-in-out")
		#expect(width.transition.duration.link).toBe("$duration")
		#expect(width.transition.duration.dynamic).toBe(true)
		#expect(width.transition.delay.link).toBe("$delay")
		#expect(width.transition.delay.dynamic).toBe(true)

		# Test the backlink
		# expect(result.variables.duration.dependants.p).toEqual(["transition.width"])
		# expect(result.variables.delay.dependants.p).toEqual(["transition.width"])