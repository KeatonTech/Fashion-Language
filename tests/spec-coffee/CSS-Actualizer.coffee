describe "CSS Actualizer", ()->
	actualizer = window.fashion.$actualizer
	makeSheets = actualizer.generateStyleProperties
	makeRules = actualizer.propertiesToCSS
	type = window.fashion.$type

	describe "Rule Maker", () ->

		it "should turn static properties into CSS rules", () ->

			# None of these properties change, should be a pretty easy task
			properties = {
				color: "black"
				"text-size": "12pt"
			}
			result = makeRules properties, {}

			expect(result.props.static).toEqual ["color: black;", "text-size: 12pt;"]
			expect(result.props.dynamic).toEqual []
			expect(result.props.individual).toEqual []
			expect(result.transitions).toEqual []


		it "should turn dynamic properties into CSS rules", () ->

			# None of these properties change, should be a pretty easy task
			properties = {
				color: {dynamic: true, link: "$color"}
				"text-size": {dynamic: true, link: "$size"}
			}
			variables = {
				color: {type: type.Color, value: "red"}
				size: {type: type.Number, value: 12, unit: "px"}
			}

			result = makeRules properties, variables

			expect(result.props.dynamic).toEqual ["color: red;", "text-size: 12px;"]
			expect(result.props.static).toEqual []
			expect(result.props.individual).toEqual []
			expect(result.transitions).toEqual []


		it "should identify whether multipart properties are static or dynamic", () ->

			# None of these properties change, should be a pretty easy task
			properties = {
				border: "3px 3px"
				padding: ["2px", "2px"]
				margin: [{dynamic: true, link: "$size"}, "2px"]
			}
			variables = {
				size: {type: type.Number, value: 12, unit: "px"}
			}

			result = makeRules properties, variables

			expect(result.props.dynamic).toEqual ["margin: 12px 2px;"]
			expect(result.props.static).toEqual ["border: 3px 3px;", "padding: 2px 2px;"]
			expect(result.props.individual).toEqual []
			expect(result.transitions).toEqual []