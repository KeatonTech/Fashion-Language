window.fashiontests.parser.blocks = ()->
	parse = window.fashion.$parser.parse


	it "should parse the block body and properties", ()->
		result = parse( """
						@block property1 property2 {
							block body
						}
						""")

		block = result.blocks[0]
		expect(block.arguments.length).toBe(2)
		expect(block.arguments[0]).toBe("property1")
		expect(block.arguments[1]).toBe("property2")
		expect(block.body).toBe("block body")
		expect(block.type).toBe("block")


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