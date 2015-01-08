window.fashiontests.actualizer.components = ()->

	$wf = window.fashion
	actualizer = $wf.$actualizer
	rm = window.fashion.$runtimeMode


	it "should accurately split properties", ()->
		combinedMode = rm.individual | rm.triggered

		# Test Data: Mock selectors and properties
		selectors = [
			{name: "t1", mode: 0, properties: [
				{name: "t1p1", mode: rm.static}
				{name: "t1p2", mode: rm.individual}
			]}
			{name: "t2", mode: 1, properties: [
				{name: "t2p1", mode: rm.dynamic}
			]}
			{name: "t3", mode: 0, properties: [
				{name: "t3p1", mode: combinedMode}
			]}
		]

		# Run the splitter function
		{cssSels:css, individualSels:individual} = actualizer.splitIndividual selectors

		# Check to make sure each map has the correct selectors
		expect(css[0]).toBeDefined()
		expect(css[1]).toBeDefined()
		expect(css[2]).not.toBeDefined()

		expect(individual[0]).toBeDefined()
		expect(individual[1]).not.toBeDefined()
		expect(individual[2]).toBeDefined()

		# Check to make sure each selector has the correct number of properties
		expect(css[0].properties.length).toBe(1)
		expect(css[1].properties.length).toBe(1)
		expect(individual[0].properties.length).toBe(1)
		expect(individual[2].properties.length).toBe(1)

		# Check to make sure each selector has the correct properties
		expect(css[0].properties[0].name).toBe("t1p1")
		expect(css[1].properties[0].name).toBe("t2p1")

		expect(individual[0].properties[0].name).toBe("t1p2")
		expect(individual[2].properties[0].name).toBe("t3p1")


	it "should convert CSS property names to JS", ()->
		convert = actualizer.makeCamelCase

		expect(convert()).toBe("")
		expect(convert "margin").toBe("margin")
		expect(convert "margin-left").toBe("marginLeft")
		expect(convert "text-align").toBe("textAlign")
		expect(convert "border-width-right").toBe("borderWidthRight")
		expect(convert "-webkit-transform").toBe("WebkitTransform")
		expect(convert "-webkit-border-radius").toBe("WebkitBorderRadius")


	###
	These two functions no longer exist but I'm leaving their tests because they might be
	helpful for writing tests for the new system

	it "should map bindings based on whether they are dynamic or individual", ()->

		jsSels = {
			0: {properties: {
				0: {name: "width"}
				3: {name: "border-radius"}
			}},
			1: {properties: {
				0: {name: "border-color-top"}
			}},
		}

		indSels = {
			0: {properties: {
				1: {name: "height"}
				2: {name: "background-color"}
			}},
			2: {properties: {
				0: {name: "-webkit-transform"}
			}},
		}

		bindings = [[0,0],[0,2],"$var",[0,3],[1,0],[2,0]]

		# Run the dependency mapper
		deps = window.fashion.$actualizer.addBindings bindings, jsSels, indSels
		
		expect(deps.length).toBe(6)
		expect(deps[0]).toEqual(["s",0,"width"])
		expect(deps[1]).toEqual(["i",0,"backgroundColor"])
		expect(deps[2]).toEqual(["v","var"])
		expect(deps[3]).toEqual(["s",0,"borderRadius"])
		expect(deps[4]).toEqual(["s",1,"borderColorTop"])
		expect(deps[5]).toEqual(["i",2,"WebkitTransform"])


	it "should remove bindings to triggered properties", ()->
		jsSels = {
			0: {properties: {
				0: {name: "width", mode: 0}
			}},
			1: {properties: {
				0: {name: "height", mode: $wf.$runtimeMode.triggered}
			}},
		}

		indSels = {
			0: {properties: {
				1: {name: "top", mode: $wf.$runtimeMode.triggered}
			}},
			2: {properties: {
				0: {name: "bottom", mode: 0}
			}},
		}

		bindings = [[0,0],[0,1],[1,0],[2,0]]
		
		culled = window.fashion.$actualizer.removeTriggerBindings bindings, jsSels, indSels

		expect(culled.length).toBe(2);
		expect(culled[0]).toEqual([0,0])
		expect(culled[1]).toEqual([2,0])

	###
