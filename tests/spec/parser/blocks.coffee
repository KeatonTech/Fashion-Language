window.fashiontests.parser.blocks = ()->

	$wf = window.fashion
	parse = window.fashion.$parser.parse

	# NOTE(keatontech): Maybe the parser should be written with dependency injection
	# 	so that we don't have to use real blocks here.
	# 	That sounds like a pain though...

	it "should parse the block body and properties", ()->
		result = parse( """
						@transition property1 property2 {
							block body
						}
						""")

		block = result.blocks[0]
		expect(block.arguments.length).toBe(2)
		expect(block.arguments[0]).toBe("property1")
		expect(block.arguments[1]).toBe("property2")
		expect(block.body).toBe("block body")
		expect(block.type).toBe("transition")

		# Test the back-link
		expect(result.dependencies.blocks["transition"]).toBe($wf.$blocks.transition)


	it "should parse blocks with no properties", ()->
		result = parse( """
						@block-type {
							block body 2
						}
						""")

		block = result.blocks[0]
		expect(block.arguments.length).toBe(0)
		expect(block.body).toBe("block body 2")
		expect(block.type).toBe("block-type")


	it "should parse one-line blocks", ()->
		result = parse( """
						@block_type a1 { block body 3 }
						""")

		block = result.blocks[0]
		expect(block.arguments.length).toBe(1)
		expect(block.arguments[0]).toBe("a1")
		expect(block.body).toBe("block body 3")
		expect(block.type).toBe("block_type")


	it "should parse blocks without bodies, ending in semicolon", ()->
		result = parse( """
						@import 'test.fss';
						""")

		block = result.blocks[0]
		expect(block.arguments.length).toBe(1)
		expect(block.arguments[0]).toBe("'test.fss'")
		expect(block.body).toBe("")
		expect(block.type).toBe("import")


	it "should parse blocks without bodies, ending in a new line", ()->
		result = parse( """
						@trigger 'fade-out' 100ms

						""")

		block = result.blocks[0]
		expect(block.arguments.length).toBe(2)
		expect(block.arguments[0]).toBe("'fade-out'")
		expect(block.arguments[1]).toBe("100ms")
		expect(block.body).toBe("")
		expect(block.type).toBe("trigger")


	it "should parse blocks with nested brackets", ()->
		result = parse( """
						@outer-block {
							selector: {
								property: 1;
							}
						}
						""")

		block = result.blocks[0]
		expect(block.arguments.length).toBe(0)
		expect(block.body).toBe("""
								selector: {
										property: 1;
									}
								""")
		expect(block.type).toBe("outer-block")


	it "should parse blocks with complex expression properties", ()->
		result = parse( """
						@client (@width < 10) 'this is a message' {
							selector: {property: 1}
						}
						""")

		block = result.blocks[0]
		expect(block.arguments.length).toBe(2)
		expect(block.arguments[0]).toBe("(@width < 10)")
		expect(block.arguments[1]).toBe("'this is a message'")
		expect(block.body).toBe("selector: {property: 1}")
		expect(block.type).toBe("client")