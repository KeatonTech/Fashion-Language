window.fashiontests.actualizer.transitions = ()->

	$wf = window.fashion
	parse = window.fashion.$parser.parse
	process = window.fashion.$processor.process
	separateTransitions = window.fashion.$actualizer.separateTransitions
	prefixes = window.fashion.$actualizer.cssPrefixes
	evaluate = window.fashion.$shared.evaluate


	it "should pull transitions out into their own objects", ()->
		parseTree = process parse """
			body {
				background-color: [linear 100ms] blue;
			}
			"""
		separateTransitions parseTree

		properties = parseTree.selectors[0].properties
		expect(properties[0].name).toBe("background-color")
		for id, prefix of prefixes
			property = properties[parseInt(id) + 1]
			expect(property.name).toBe("#{prefix}transition")
			expect(evaluate property.value).toBe("background-color 100ms linear ")
			expect(property.mode).toBe($wf.$runtimeMode.static)


	it "should combine multiple transitions into one property", ()->
		parseTree = process parse """
			body {
				background-color: [linear 100ms] blue;
				color: [ease-out 200ms] red;
			}
			"""
		separateTransitions parseTree

		properties = parseTree.selectors[0].properties
		expect(properties[0].name).toBe("background-color")
		expect(properties[1].name).toBe("color")

		str = "background-color 100ms linear , color 200ms ease-out "
		for id, prefix of prefixes
			expect(properties[parseInt(id) + 2].name).toBe("#{prefix}transition")
			expect(evaluate properties[parseInt(id) + 2].value).toBe(str)
			expect(properties[parseInt(id) + 2].mode).toBe($wf.$runtimeMode.static)


	it "should turn dynamic transitions into dynamic properties", ()->
		parseTree = process parse """
			$duration: 100ms;
			body {
				background-color: [linear $duration] blue;
			}
			"""
		separateTransitions parseTree

		properties = parseTree.selectors[0].properties
		for id, prefix of prefixes
			property = properties[parseInt(id) + 1]
			expect(property.name).toBe("#{prefix}transition")
			expect(property.value[0][0]).toBe("background-color")
			expect(property.value[0][1].bindings.variables[0]).toEqual(["duration",0])
			expect(property.value[0][2]).toBe("linear")
			expect(property.mode).toBe($wf.$runtimeMode.dynamic)
