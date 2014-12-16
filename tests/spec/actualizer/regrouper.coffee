window.fashiontests.actualizer.regrouper = ()->

	$wf = window.fashion
	parse = window.fashion.$parser.parse
	process = window.fashion.$processor.process

	regrouper = window.fashion.$actualizer.regroupProperties
	groupPropertiesWithMode = window.fashion.$actualizer.groupPropertiesWithMode


	it "should group properties by mode", ()->

		# Parse and process a file with the block
		parseTree = process parse("""
			$dynamic: 'test';
			body {
				property1: $dynamic;
				property2: static;
				property3: random($dynamic);
				property4: 10px;
			}
			""")

		properties = parseTree.selectors[0].properties
		groupPropertiesWithMode properties, $wf.$runtimeMode.dynamic

		# Expect the property compiler to have been called with the raw value
		expect(properties[0].name).toBe("property2")
		expect(properties[1].name).toBe("property4")
		expect(properties[2].name).toBe("property1")
		expect(properties[3].name).toBe("property3")


	it "should avoid rearranging properties that would change how the CSS works", ()->

		# Parse and process a file with the block
		parseTree = process parse("""
			$dynamic: 10px;
			body {
				margin-top: $dynamic;
				padding-top: $dynamic;
				margin-bottom: $dynamic;
				margin: 0 auto;
				border-top: $dynamic;
			}
			""")

		properties = parseTree.selectors[0].properties
		groupPropertiesWithMode properties, $wf.$runtimeMode.dynamic

		# Expect the property compiler to have been called with the raw value
		expect(properties[0].name).toBe("margin-top")
		expect(properties[1].name).toBe("margin-bottom")
		expect(properties[2].name).toBe("margin")
		expect(properties[3].name).toBe("padding-top")
		expect(properties[4].name).toBe("border-top")


	it "should split a selector into multiple pieces grouped by mode", ()->

		# Parse and process a file with the block
		parseTree = process parse("""
			$dynamic: 'test';
			body {
				property1: $dynamic;
				property2: static;
				property3: random($dynamic);
				property4: @self.id;
				property5: 10px;
			}
			""")

		# Run the regrouper
		{selectors: newSelectors, map: expansionMap} = regrouper parseTree

		# Test the map, make sure the new selectors are both acknowledged as children
		expect(expansionMap.length).toBe(1)
		expect(expansionMap[0]).toEqual([0,1,2])

		# Test the new selectors
		expect(newSelectors.length).toBe(3)
		expect(newSelectors[0].properties.length).toBe(2)	# Static
		expect(newSelectors[1].properties.length).toBe(2)	# Dynamic
		expect(newSelectors[2].properties.length).toBe(1)	# Individual


	it "should continue to work even if properties cannot be fully grouped", ()->

		# Parse and process a file with the block
		parseTree = process parse("""
			$dynamic: 'test';
			body {
				margin-top: $dynamic;
				padding-top: $dynamic;
				margin-bottom: $dynamic;
				margin: 0 auto;
				border-top: $dynamic;
			}
			""")

		# Run the regrouper
		{selectors: newSelectors, map: expansionMap} = regrouper parseTree

		# Test the map, make sure the new selectors are both acknowledged as children
		expect(expansionMap.length).toBe(1)
		expect(expansionMap[0]).toEqual([0,1,2])

		# Test the new selectors
		expect(newSelectors.length).toBe(3)
		expect(newSelectors[0].properties.length).toBe(2)	# Dynamic
		expect(newSelectors[0].properties[0].mode).toBe($wf.$runtimeMode.dynamic)
		expect(newSelectors[1].properties.length).toBe(1)	# Static
		expect(newSelectors[1].properties[0].mode).toBe($wf.$runtimeMode.static)
		expect(newSelectors[2].properties.length).toBe(2)	# Dynamic
		expect(newSelectors[2].properties[0].mode).toBe($wf.$runtimeMode.dynamic)


	it "should work with multiple selectors", ()->

		# Parse and process a file with the block
		parseTree = process parse("""
			$dynamic: 'test';
			body {
				property1: $dynamic;
				property2: static;
				property3: random($dynamic);
				property4: @self.id;
				property5: 10px;
			}
			""")

		# Run the regrouper
		{selectors: newSelectors, map: expansionMap} = regrouper parseTree

		# Test the map, make sure the new selectors are both acknowledged as children
		expect(expansionMap.length).toBe(1)
		expect(expansionMap[0]).toEqual([0,1,2])

		# Test the new selectors
		expect(newSelectors.length).toBe(3)
		expect(newSelectors[0].properties.length).toBe(2)	# Static
		expect(newSelectors[1].properties.length).toBe(2)	# Dynamic
		expect(newSelectors[2].properties.length).toBe(1)	# Individual
