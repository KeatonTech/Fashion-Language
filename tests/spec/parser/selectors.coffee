window.fashiontests.parser.selectors = ()->

	$wf = window.fashion
	parse = window.fashion.$parser.parse

	it "should parse complex selectors", ()->
		result = parse("""
						* {height: 30px;}
						ul.test td:last-child {
							background: black;
						}
						""")

		expect(result.selectors[0].name).toBe("*")
		expect(result.selectors[0].properties[0].value).toBe("30px")

		expect(result.selectors[1].name).toBe("ul.test td:last-child")
		expect(result.selectors[1].properties[0].value).toBe("black")


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

		# Check the name and order
		expect(result.selectors[0].name).toBe(".outer")
		expect(result.selectors[1].name).toBe(".outer .middle")
		expect(result.selectors[2].name).toBe(".outer .middle .inner")
		expect(result.selectors[3].name).toBe(".outer .middle.super")

		# Check head values
		expect(result.selectors[0].properties[0].value).toBe("1.0")
		expect(result.selectors[1].properties[0].value).toBe("0.5")
		expect(result.selectors[2].properties[0].value).toBe("0.0")
		expect(result.selectors[3].properties[0].value).toBe("0.75")

		# Make sure the properties are static
		expect(result.selectors[0].properties[0].mode).toBe($wf.$runtimeMode.static)

		# Check tail values
		# NOTE(keatontech): This is actually wrong because it rearranges selectors
		# 	That aught to get fixed later.
		expect(result.selectors[0].properties[1].value).toBe("100px")
		expect(result.selectors[1].properties[1].value).toBe("50px")


	it "should allow selectors to be variables", ()->
		result = parse("""
						$contentDiv: '.content';
						$contentDiv {
							background: black;
						}
						""")

		# Make sure the properties are still getting read
		expect(result.selectors[0].properties[0].value).toBe("black")
		expect(result.selectors[0].properties[0].mode).toBe($wf.$runtimeMode.dynamic)
		expect(result.selectors[0].mode).toBe($wf.$runtimeMode.dynamic)

		# Make sure the expression for the name works
		nameExpression = result.selectors[0].name
		v = (name) -> if name is "contentDiv" then value: ".content"
		expect(nameExpression.evaluate(v)).toBe(".content")

		# Test linkback
		expect(result.bindings.variables["contentDiv"].length).toBe(1)
		expect(result.bindings.variables["contentDiv"][0]).toBe(0)


	it "should allow variables to be part of selectors", ()->
		result = parse("""
						$contentDiv: .content;
						$contentSub: p;
						$contentDiv h3 $contentSub {
							color: black;
						}
						""")

		# Make sure the properties are marked as dynamic
		expect(result.selectors[0].properties[0].mode).toBe($wf.$runtimeMode.dynamic)

		# Make sure the expression for the name works
		nameExpression = result.selectors[0].name
		v = (name) -> switch name 
			when "contentDiv" then value: ".content"
			when "contentSub" then value: "p"
		expect(nameExpression.evaluate(v)).toBe(".content h3 p")

		# Test linkback
		expect(result.bindings.variables["contentDiv"].length).toBe(1)
		expect(result.bindings.variables["contentDiv"][0]).toBe(0)
		expect(result.bindings.variables["contentSub"].length).toBe(1)
		expect(result.bindings.variables["contentSub"][0]).toBe(0)
	