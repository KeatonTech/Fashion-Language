describe "CSS Actualizer", ()->
	actualizer = window.fashion.$actualizer
	makeSheets = actualizer.generateStyleProperties
	makeRules = actualizer.propertiesToCSS
	splitProperties = actualizer.splitProperties
	type = window.fashion.$type

	describe "Property Splitter", () ->

		it "should split out static properties", () ->

			# None of these properties change, should be a pretty easy task
			properties = {
				color: "black"
				"text-size": "12pt"
			}
			result = splitProperties properties, {}

			expect(result.props.static).toEqual {'color': 'black','text-size': '12pt';}
			expect(result.props.dynamic).toEqual {}
			expect(result.props.individual).toEqual {}
			expect(result.transitions).toEqual []


		it "should split out dynamic properties", () ->

			# None of these properties change, should be a pretty easy task
			properties = {
				color: {dynamic: true, link: "$color"}
				"text-size": {dynamic: true, link: "$size"}
			}
			variables = {
				color: {type: type.Color, value: "red"}
				size: {type: type.Number, value: 12, unit: "px"}
			}

			result = splitProperties properties, variables

			expect(result.props.dynamic.color).not.toBeUndefined()
			expect(result.props.dynamic['text-size']).not.toBeUndefined()
			expect(result.props.static).toEqual {}
			expect(result.props.individual).toEqual {}
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

			result = splitProperties properties, variables

			expect(result.props.dynamic.margin).not.toBeUndefined()
			expect(result.props.static).toEqual {'border': '3px 3px', 'padding': ['2px','2px']}
			expect(result.props.individual).toEqual {}
			expect(result.transitions).toEqual []