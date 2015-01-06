window.fashiontests.actualizer.transitions = ()->

	$wf = window.fashion
	parse = window.fashion.$parser.parse
	process = window.fashion.$processor.process
	separateTransitions = window.fashion.$actualizer.separateTransitions
	prefixes = window.fashion.$actualizer.cssPrefixes


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
			expect(properties[parseInt(id) + 1].name).toBe("#{prefix}transition")
			expect(properties[parseInt(id) + 1].value).toBe("background-color 100ms linear")
			expect(properties[parseInt(id) + 1].mode).toBe($wf.$runtimeMode.static)


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

		str = "background-color 100ms linear,color 200ms ease-out"
		for id, prefix of prefixes
			expect(properties[parseInt(id) + 2].name).toBe("#{prefix}transition")
			expect(properties[parseInt(id) + 2].value).toBe(str)
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
			expect(properties[parseInt(id) + 1].name).toBe("#{prefix}transition")
			expect(properties[parseInt(id) + 1].value).toBe("background-color 100ms linear")
			expect(properties[parseInt(id) + 1].mode).toBe($wf.$runtimeMode.dynamic)
