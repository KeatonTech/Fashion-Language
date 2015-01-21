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


	it "should filter out comments", ()->
		result = parse("""
						// This is a one-line comment
						* {height: 30px;}

						/*  
						This is a multiline-style comment
						of the sort you might find in JS
						*/
						ul.test td:last-child {

							/*\
							|*| Mozilla-style comment
							\*/
							background: black;
						}

						/*
						selector {
							inside: comment;
						}
						*/
						""")

		expect(result.selectors.length).toBe(2)

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
		expect(nameExpression.bindings.variables[0]).toEqual(["contentDiv",0])


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
		expect(nameExpression.bindings.variables[0]).toEqual(["contentDiv",0])
		expect(nameExpression.bindings.variables[1]).toEqual(["contentSub",0])


	it "should allow nested selectors inside of variable selectors", ()->
		result = parse("""
						$contentDiv: .content;
						$contentDiv {
							width: 100px
							h3 {
								color: black;
							}
						}
						""")

		# Make sure the properties are marked as dynamic
		expect(result.selectors[0].properties[0].mode).toBe($wf.$runtimeMode.dynamic)

		# Make sure the expression for the name works
		v = (name) -> value: ".content"
		expect(result.selectors[0].name.evaluate(v)).toBe(".content")
		expect(result.selectors[1].name.evaluate(v)).toBe(".content h3")

		# Test linkback
		expect(result.selectors[0].name.bindings.variables[0]).toEqual(["contentDiv",0])
		expect(result.selectors[1].name.bindings.variables[0]).toEqual(["contentDiv",0])


	it "should allow nested variable selectors", ()->
		result = parse("""
						$contentDiv: .content;
						div {
							width: 100px;
							$contentDiv {
								color: black;
							}
						}
						""")

		# Make sure the properties are marked as dynamic
		expect(result.selectors[1].properties[0].mode).toBe($wf.$runtimeMode.dynamic)

		# Make sure the expression for the name works
		v = (name) -> value: ".content"
		expect(result.selectors[1].name.evaluate(v)).toBe("div .content")

		# Test linkback
		expect(result.selectors[1].name.bindings.variables[0]).toEqual(["contentDiv",0])


	it "should properly nest comma separated selectors", ()->
		result = parse("""
						div,article {
							a, p {
								color: red;
							}
						}
						""")

		# Check the name and order
		expect(result.selectors[0].name).toBe("div,article")
		expect(result.selectors[1].name).toBe("div a,div p,article a,article p")


	it "should properly nest comma separated selectors with variables", ()->
		result = parse("""
						$contentDiv1: .content;
						$contentDiv2: .stuff;
						div {
							width: 100px;
							$contentDiv1, $contentDiv2 {
								color: black;
							}
						}
						""")

		# Make sure the properties are marked as dynamic
		expect(result.selectors[1].properties[0].mode).toBe($wf.$runtimeMode.dynamic)

		# Make sure the expression for the name works
		v = (name) -> 
			switch name
				when 'contentDiv1' then value: ".content"
				else value: ".stuff"

		expect(result.selectors[1].name.evaluate(v)).toBe("div .content,div .stuff")


	it "should properly nest comma separated selectors with an &", ()->
		result = parse("""
						div,article {
							a, &:hover {
								color: red;
							}
						}
						""")

		# Check the name and order
		expect(result.selectors[0].name).toBe("div,article")
		expect(result.selectors[1].name).toBe("div a,div:hover,article a,article:hover")


	it "should remember the parent of nested selectors", ()->
		result = parse("""
						.level1 {
							div[l='2'] {
								#level3 {
									width: 100px;
								}
							}
						}
						""")

		# Check the name and order
		expect(result.selectors[2].name).toBe(".level1 div[l='2'] #level3")
		expect(result.selectors[2].parent.name).toBe(".level1 div[l='2']")
		expect(result.selectors[2].parent.parent.name).toBe(".level1")


	it "should error on mismatched brackets", ()->
		try
			result = parse("""
							.level1 {
								div[l='2'] {
									#level3 {
										width: 100px;
									}
							}
							""")
		catch e
			expect(e.constructor.name).toBe("FSBracketMismatchError")

