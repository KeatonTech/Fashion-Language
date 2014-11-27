{
	"variables": {
		"mainColor": {
			"type": "Color",
			"value": "red",
			"dependants": {"h3": ["color"]}
		},
		"headerHeight": {
			"type": "Number",
			"unit": "px",
			"value": "100",
			"dependants": {"h3": ["height"]}
		},
		"animDuration": {
			"type": "Number",
			"unit": "ms",
			"value": "200",
			"dependants": {"h3": ["transition.height"]}
		}
	},
	"selectors": {
		"h3": {
			"color": {
				"link": "$mainColor"
			},
			"height": {
				"link": "$headerHeight",
				"transition": {
					"easing": "Linear",
					"duration": {
						"link": "$animDuration"
					}
				}
			},
			"font": ["'Helvetica'", "sans-serif"]
			"font-size": "18pt",
			"padding-top": {
				"dependencies": ["$headerHeight"],
				"functions": [],
				"dynamic": true,
				"individualized": false,
				"evaluate": function(v, g, f){
					return v.headerHeight / 2;
				}
			}
		}
	},
	"blocks": [
		{
			"type": "transition",
			"arguments": "slide-in-section",
			"body": "bunch_of_text"
		}
	],
	"globals": {
		"width": {
			"dependants": []
		},
	},
	"requirements": {
		"globals": ["width"],
		"functions": ["min", "max"]
	},
	"javascript": [
		"w.FASHION.transitions.push(/* transition object */)"
	]
}