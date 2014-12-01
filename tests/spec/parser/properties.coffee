window.fashiontests.parser.properties = ()->

	parse = window.fashion.$parser.parse

	it "should allow properties with no semi-colon", ()->
		result = parse("""
						p {
							height: 100px
							width: 200px
						}
						""")

		sels = result.selectors.p
		expect(sels.height).toBe("100px")
		expect(sels.width).toBe("200px")

	it "should allow one-line properties", ()->
		result = parse("p {height: 120px;}")
		expect(result.selectors.p.height).toBe("120px")


	it "should allow multipart properties", ()->
		result = parse("""
						p {
							border: 2px solid black;
						}
						""")

		sels = result.selectors.p
		expectedProperty = ['2px','solid','black']
		expect(sels.border).toEqual(expectedProperty)


	it "should account for strings in multipart properties", ()->
		result = parse("""
						p {
							text-style: "Times New Roman" italic;
							another: 'Times New Roman' italic;
						}
						""")

		sels = result.selectors.p
		expectedProperty = ['"Times New Roman"','italic']
		expect(sels["text-style"]).toEqual(expectedProperty)

		expectedProperty = ["'Times New Roman'",'italic']
		expect(sels["another"]).toEqual(expectedProperty)


	it "should allow comma-separated properties", ()->
		result = parse("""
						p {
							property: 1px, 2px;
						}
						""")

		sels = result.selectors.p
		expectedProperty = [['1px'], ['2px']]
		expect(sels.property).toEqual(expectedProperty)


	it "should allow multipart comma-separated properties", ()->
		result = parse("""
						p {
							border: 2px solid black, 1px solid white;
						}
						""")

		sels = result.selectors.p
		expectedProperty = [['2px','solid','black'], ['1px','solid','white']]
		expect(sels.border).toEqual(expectedProperty)


	it "should acknowledge !important on string properties", ()->
		result = parse("""
						p {
							height: 100px !important
						}
						""")

		sels = result.selectors.p
		expect(sels.height).toBe("100px !important")


	it "should link variables", ()->
		result = parse("""
						$height: 100px;
						p {
							height: $height;
						}
						""")

		sels = result.selectors.p

		# Test a basic transition (height)
		expect(sels.height.link).toBe("$height")
		expect(sels.height.dynamic).toBe(true)

		# Test the backlink
		expect(result.variables.height.dependants.p).toEqual(["height"])


	it "should link globals", ()->
		result = parse("""
						div {
							height: @height;
						}
						""")

		expect(result.selectors.div.height.dynamic).toBe(true)
		expect(result.selectors.div.height.link).toBe("@height")


	it "should acknowledge !important on linked properties", ()->
		result = parse("""
						$height: 100px;
						p {
							height: $height !important
						}
						""")

		sels = result.selectors.p
		expect(sels.height.link).toBe("$height")
		expect(sels.height.important).toBe(true)


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

		sels = result.selectors.p

		# Test a basic transition (height)
		expect(sels.height.transition.easing).toBe("ease-out")
		expect(sels.height.transition.duration).toBe("1s")

		# Test a more advanced transition with a delay and a var link (width)
		expect(sels.width.transition.easing).toBe("ease-in-out")
		expect(sels.width.transition.duration.link).toBe("$duration")
		expect(sels.width.transition.duration.dynamic).toBe(true)
		expect(sels.width.transition.delay.link).toBe("$delay")
		expect(sels.width.transition.delay.dynamic).toBe(true)

		# Test the backlink
		expect(result.variables.duration.dependants.p).toEqual(["transition.width"])
		expect(result.variables.delay.dependants.p).toEqual(["transition.width"])