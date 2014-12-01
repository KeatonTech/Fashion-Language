window.fashiontests.parser.selectors = ()->

	parse = window.fashion.$parser.parse

	it "should parse complex selectors", ()->
		result = parse("""
						* {height: 30px;}
						ul.test td:last-child {
							background: black;
						}
						""")

		expect(result.selectors['*']['height']).toBe("30px")
		expect(result.selectors['ul.test td:last-child']['background']).toBe("black")


	it "should parse nested selectors", ()->
		result = parse("""
						.outer {
							opacity: 1.0;
							.middle {
								opacity: 0.5;
								.inner {opacity: 0.0;}
								&.super {opacity: 0.75;}
								height: 50px
							}
							height: 100px
						}
						""")

		# Check head values
		expect(result.selectors['.outer']['opacity']).toBe("1.0")
		expect(result.selectors['.outer .middle']['opacity']).toBe("0.5")
		expect(result.selectors['.outer .middle .inner']['opacity']).toBe("0.0")
		expect(result.selectors['.outer .middle.super']['opacity']).toBe("0.75")

		# Check tail values
		expect(result.selectors['.outer']['height']).toBe("100px")
		expect(result.selectors['.outer .middle']['height']).toBe("50px")


	it "should allow selectors to be variables", ()->
		result = parse("""
						$contentDiv: content;
						.$contentDiv {
							background: black;
						}
						""")

		expect(result.selectors['.$contentDiv']['background']).toBe("black")
		expect(result.variables.contentDiv.dependants).toEqual({".$contentDiv": [" "]})


	it "should allow variables to be part of selectors", ()->
		result = parse("""
						$contentDiv: .content;
						$contentSub: p;
						$contentDiv h3 $contentSub {
							color: black;
						}
						""")

		expect(result.selectors['$contentDiv h3 $contentSub']['color']).toBe("black")
		expect(result.variables.contentDiv.dependants).toEqual(
			{"$contentDiv h3 $contentSub": [" "]})
		expect(result.variables.contentSub.dependants).toEqual(
			{"$contentDiv h3 $contentSub": [" "]})
	