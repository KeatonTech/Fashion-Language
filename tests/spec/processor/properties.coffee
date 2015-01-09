window.fashiontests.processor.properties = ()->

	$wf = window.fashion
	parse = window.fashion.$parser.parse
	process = window.fashion.$processor.process
	PropertyModule = window.fashion.$class.PropertyModule


	it "should call the property compiler with the raw value", ()->

		# Add a spy block
		compileSpy = jasmine.createSpy "Compile Property"
		$wf.addProperty "testProperty", compileSpy

		# Parse and process a file with the block
		process parse("""
			body {
				testProperty: 10px;
			}
			""")

		# Expect the property compiler to have been called with the raw value
		expect(compileSpy).toHaveBeenCalledWith("10px")


	it "should call the property compiler with the value expression", ()->

		# Add a spy block
		compileSpy = jasmine.createSpy "Compile Property"
		$wf.addProperty "testExpressionProperty", compileSpy

		# Parse and process a file with the block
		process parse("""
			$propertyVal: 10px;
			body {
				testExpressionProperty: $propertyVal;
			}
			""")

		# Expect the property compiler to have been called with the raw value
		expect(compileSpy).toHaveBeenCalled()
		value = compileSpy.calls.mostRecent().args[0]
		expect(value.evaluate(() -> return value: 10)).toBe("10px")
		expect(value.evaluate(() -> return value: 20)).toBe("20px")


	it "should be able to determine the type and unit of arguments", ()->

		# Add a spy block
		compileSpy = jasmine.createSpy("Compile Property").and.callFake (value)->
			expect(typeof value).toBe("object")

			expect(@determineType value[0]).toBe($wf.$type.Number)
			expect(@determineUnit value[0]).toBe($wf.$unit.Number.px)

			expect(@determineType value[1]).toBe($wf.$type.Color)

			expect(@determineType value[2]).toBe($wf.$type.String)
			
			expect(@determineType value[3]).toBe($wf.$type.Number)
			expect(@determineUnit value[3]).toBe($wf.$unit.Number.ms)

		# Add the property
		$wf.addProperty "testTypes", compileSpy

		# Parse and process a file with the block
		process parse("""
			$duration: 100ms;
			body {
				testTypes: 10px red 'string value' $duration;
			}
			""")

		# Make sure the test can't cheat by not calling the function with expectations
		expect(compileSpy).toHaveBeenCalled()


	it "should be able to add new properties", ()->

		# Add a spy block
		compileSpy = jasmine.createSpy("Compile Property").and.callFake (value)->
			@setProperty "text-align", value

		# Add the property and note that it should replace itself
		$wf.addProperty "testAddAlign", new PropertyModule
			compile: compileSpy
			replace: false

		# Parse and process a file with the block
		parseTree = process parse("""
			body {
				testAddAlign: center;
			}
			""")

		# Make sure the property didn't get replaced
		expect(parseTree.selectors[0].properties.length).toBe(2)
		expect(parseTree.selectors[0].properties[0].name).toBe("testAddAlign")
		expect(parseTree.selectors[0].properties[0].value).toBe("center")
		expect(parseTree.selectors[0].properties[1].name).toBe("text-align")
		expect(parseTree.selectors[0].properties[1].value).toBe("center")


	it "should be able to replace itself with a different property", ()->

		# Add a spy block
		compileSpy = jasmine.createSpy("Compile Property").and.callFake (value)->
			@setProperty "text-align", value

		# Add the property and note that it should replace itself
		$wf.addProperty "testReplaceWithAlign", new PropertyModule
			compile: compileSpy
			replace: true

		# Parse and process a file with the block
		parseTree = process parse("""
			body {
				testReplaceWithAlign: center;
			}
			""")

		# Make sure the property got replaced
		expect(parseTree.selectors[0].properties.length).toBe(1)
		expect(parseTree.selectors[0].properties[0].name).toBe("text-align")
		expect(parseTree.selectors[0].properties[0].value).toBe("center")


	it "should be able to read other properties in the same selector", ()->

		# Add a spy block
		compileSpy = jasmine.createSpy("Compile Property").and.callFake (value)->
			expect(@getProperty "position").toBe("absolute")

		# Add the property and note that it should replace itself
		$wf.addProperty "testGetPositionInSelector", compileSpy

		# Parse and process a file with the block
		parseTree = process parse("""
			body {
				position: absolute;
				testGetPositionInSelector: center;
			}
			""")

		# Make sure the compile function actually does run
		expect(compileSpy).toHaveBeenCalled()


	it "should be able to read other properties in the different identical selectors", ()->

		# Add a spy block
		compileSpy = jasmine.createSpy("Compile Property").and.callFake (value)->
			expect(@getProperty "position").toBe("relative")

		# Add the property and note that it should replace itself
		$wf.addProperty "testGetPosition", compileSpy

		# Parse and process a file with the block
		parseTree = process parse("""
			body {
				testGetPosition: center;
			}
			body {
				position: relative;
			}
			""")

		# Make sure the compile function actually does run
		expect(compileSpy).toHaveBeenCalled()


