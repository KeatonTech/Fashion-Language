window.fashiontests.modules.transition = ()->

	parse = window.fashion.$parser.parse
	process = window.fashion.$processor.process

	it "should parse simple transitions into transition objects", ()->

		parseTree = process parse("""
			@transition my-transition {
				start {
					#item {opacity: 0.0;}
				}
				50% {
					#item {opacity: 1.0;}
				}
				100% {
					#item {opacity: 0.5;}
					#item2 {display: block;}
				}
			}
			""")

		transitions = parseTree.dependencies.blocks.transition.runtimeObject.transitions
		expect(transitions['my-transition']).toBeDefined()
		expect(transitions['my-transition']['start']).toBeDefined()
		expect(transitions['my-transition']['50%']).toBeDefined()
		expect(transitions['my-transition']['100%']).toBeDefined()

		startSelector = transitions['my-transition']['start'].selectors[0]
		expect(startSelector.name).toBe("#item")
		expect(startSelector.properties[0].name).toBe("opacity")
		expect(startSelector.properties[0].value).toBe("0.0")

		midSelector = transitions['my-transition']['50%'].selectors[0]
		expect(midSelector.properties[0].name).toBe("opacity")
		expect(midSelector.properties[0].value).toBe("1.0")

		endSelectors = transitions['my-transition']['100%'].selectors
		expect(endSelectors[0].properties[0].name).toBe("opacity")
		expect(endSelectors[0].properties[0].value).toBe("0.5")
		expect(endSelectors[1].properties[0].name).toBe("display")
		expect(endSelectors[1].properties[0].value).toBe("block")


	it "should add CSS transitions where appropriate", ()->

		parseTree = process parse("""
			@transition my-transition {
				start {
					#item {opacity: [ease-out 100%] 0.0;}
				}
				100% {
					#item {opacity: 1.0;}
				}
			}
			""")

		transitions = parseTree.dependencies.blocks.transition.runtimeObject.transitions
		startProperty = transitions['my-transition']['start'].selectors[0].properties[0]
		expect(startProperty.value.transition).toBeDefined()
		expect(startProperty.value.transition.easing).toBe("ease-out")
		expect(startProperty.value.transition.duration).toBe("100%")


	it "should support keyframe ranges", ()->

		parseTree = process parse("""
			@transition my-transition {
				start {
					.class {opacity: 0.0;}
				}
				0%-50% {
					.class {opacity: [ease-out 50%] 1.0;}
				}
				50% - 100% {
					.class2 {color: red;}
				}
			}
			""")

		transitions = parseTree.dependencies.blocks.transition.runtimeObject.transitions
		expect(transitions['my-transition']['start']).toBeDefined()
		expect(transitions['my-transition']['0%-50%']).toBeDefined()
		expect(transitions['my-transition']['50% - 100%']).toBeDefined()

		expect(transitions['my-transition']['0%-50%'].selectors[0].name).toBe(".class")
		expect(transitions['my-transition']['50% - 100%'].selectors[0].name).toBe(".class2")


	it "should be able to read variables defined outside", ()->

		parseTree = process parse("""
			$offColor: #336;
			$onColor: #da0;

			@transition highlight {
				0% {
					#item {background-color: $offColor;}
				}
				100% {
					#item {background-color: $onColor;}
				}
			}
			""")

		transitions = parseTree.dependencies.blocks.transition.runtimeObject.transitions
		startProperty = transitions['highlight']['0%'].selectors[0].properties[0]
		endProperty = transitions['highlight']['100%'].selectors[0].properties[0]

		# Make sure they're both scripts
		expect(startProperty.value.script).toBeDefined()
		expect(endProperty.value.script).toBeDefined()

		# Make sure bindings didn't get into the original parse tree
		expect(startProperty.value.bindings.variables[0]).toBe("offColor")
		expect(endProperty.value.bindings.variables[0]).toBe("onColor")


	it "should be able to read variables defined inside", ()->

		parseTree = process parse("""
			@transition highlight {
				$itemId: #item;
				0% {
					$itemId {background-color: black;}
				}
				100% {
					$itemId {background-color: red;}
				}
			}
			""")

		transitions = parseTree.dependencies.blocks.transition.runtimeObject.transitions

		expect(transitions['highlight']['0%'].selectors[0].name.script).toBeDefined()
		expect(transitions['highlight']['100%'].selectors[0].name.script).toBeDefined()

		expect(transitions['highlight']['0%'].selectors[0].properties[0].value).toBe "black"
		expect(transitions['highlight']['100%'].selectors[0].properties[0].value).toBe "red"

		expect(transitions['highlight']["$vars"]).toEqual(["itemId"])

