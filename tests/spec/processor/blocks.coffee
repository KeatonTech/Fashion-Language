window.fashiontests.processor.blocks = ()->

	$wf = window.fashion
	parse = window.fashion.$parser.parse
	process = window.fashion.$processor.process
	BlockModule = window.fashion.$class.BlockModule


	it "should call the block compiler with the arguments and body", ()->

		# Add a spy block
		compileSpy = jasmine.createSpy "Compile Block"
		$wf.addBlock "testBlock", compileSpy

		# Parse and process a file with the block
		process parse("""
			@testBlock arg1 arg2 {
				here {
					is: the argument;
				}
				body
			}
			""")

		args = ["arg1", "arg2"]
		body = "here {\n\t\tis: the argument;\n\t}\n\tbody"
		expect(compileSpy).toHaveBeenCalledWith args, body


	it "should allow blocks to modify their runtime object", ()->

		# Create a fake compile function
		compileSpy = jasmine.createSpy("Compile Block").and.callFake (args, body)->
			@runtimeObject.instances.push body

		# Add a spy block with an 'instances' array in its runtime object
		$wf.addBlock "runtimeObjectTest", new BlockModule
			compile: compileSpy
			runtimeObject: {instances: []}

		# Parse and process a file with the block
		parseTree = process parse("@runtimeObjectTest arg1 arg2 {body}")

		# Make sure the runtime object has changed
		block = parseTree.dependencies.blocks["runtimeObjectTest"]
		expect(block.runtimeObject.instances[0]).toBe("body")


	it "should be able to add scripts to the parse tree", ()->

		# Create a fake compile function
		compileSpy = jasmine.createSpy("Compile Block").and.callFake (args, body)->
			@addScript "alert('Hello World');"

		# Add a spy block with an 'instances' array in its runtime object
		$wf.addBlock "addScriptTest", compileSpy

		# Parse and process a file with the block
		parseTree = process parse("@addScriptTest {}")

		# Make sure the runtime object has changed
		expect(parseTree.scripts[0]).toBe("alert('Hello World');")


	it "should be able to add rules as strings", ()->

		# Create a fake compile function
		compileSpy = jasmine.createSpy("Compile Block").and.callFake (args, body)->
			@addRule "table", "border: $#{args[0]} solid black"

		$wf.addBlock "addRulesTest", compileSpy

		# Parse and process a file with the block
		parseTree = process parse("""
			$borderWidth: 1px;
			@addRulesTest borderWidth {body}
			""")

		# Make sure the property was added
		expect(parseTree.selectors[0].name).toBe("table")
		expect(parseTree.selectors[0].properties[0].name).toBe("border")
		expect(parseTree.selectors[0].properties[0].value[0].script).toBeDefined()

		# Make sure the variable backlink was established
		val = parseTree.selectors[0].properties[0].value[0]
		expect(val.bindings.variables[0]).toEqual(["borderWidth",0])


	it "should be able to parse its body as a full fashion document", ()->

		# Create a fake compile function
		compileSpy = jasmine.createSpy("Compile Block").and.callFake (args, body)->

			# Parse the block's body as its own Fashion document
			parseTree = @parse body

			# Make sure the parse tree gave us useful results
			expect(parseTree.variables["innerBlockVariable"][0].value).toBe(10)
			expect(parseTree.selectors[0].name).toBe(".innerBlockSelector")
			expect(parseTree.selectors[0].properties[0].name).toBe("innerBlockProperty")
			expect(parseTree.selectors[0].properties[0].value.script).toBeDefined()

		$wf.addBlock "parserTest", compileSpy

		# Parse and process a file with the block
		parseTree = process parse("""
			@parserTest {
				$innerBlockVariable: 10px;
				.innerBlockSelector {
					innerBlockProperty: $innerBlockVariable;
				}
			}
			""")

		# Make sure the test can't cheat by not calling the function with expectations
		expect(compileSpy).toHaveBeenCalled()


	it "should be able to use variables defined outside its body", ()->

		# Create a fake compile function
		compileSpy = jasmine.createSpy("Compile Block").and.callFake (args, body)->

			# Parse the block's body as its own Fashion document
			parseTree = @parse body

			# Make sure the parse tree gave us useful results
			expect(parseTree.variables["borderWidth"][0].value).toBe(1)
			expect(parseTree.selectors[0].name).toBe(".innerBlockSelector")
			expect(parseTree.selectors[0].properties[0].name).toBe("border")

		$wf.addBlock "parserVariableTest", compileSpy

		# Parse and process a file with the block
		parseTree = process parse("""
			$borderWidth: 1px;
			@parserVariableTest {
				.innerBlockSelector {
					border: $borderWidth solid black;
				}
			}
			""")

		# Make sure the test can't cheat by not calling the function with expectations
		expect(compileSpy).toHaveBeenCalled()

