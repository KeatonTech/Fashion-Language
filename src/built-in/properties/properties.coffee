window.fashion.$properties =

	"text-style": new PropertyModule
		replace: true
		compile: (values)->

			# Store a list of font families
			families = []

			# Each item in the property should be considered independantly
			compileSingleValue = (value) =>
				if !(typeof value is 'string') then return

				if value[0] is "'" or value[0] is '"'
					return families.push value

				switch value
					when "serif" then families.push "serif"
					when "sans-serif" then families.push "sans-serif"
					when "monospace" then families.push "monospace"

					when "italic" then @setProperty "font-style", "italic"
					when "oblique" then @setProperty "font-style", "oblique"
					when "bold" then @setProperty "font-weight", "bolder"
					when "light" then @setProperty "font-weight", "lighter"
					when "underline" then @setProperty "text-decoration", "underline"
					when "overline" then @setProperty "text-decoration", "overline"
					when "line-through" then @setProperty "text-decoration", "line-through"
					when "strikethrough" then @setProperty "text-decoration", "line-through"

				if value.indexOf("pt") isnt -1 or value.indexOf("px") isnt -1
					@setProperty "font-size", value

			# Run that function
			if values instanceof Array then compileSingleValue(v) for v in values
			else compileSingleValue(values)

			# Add the font families
			@setProperty "font-family", families.join(", ")

# Include other properties
#@prepros-append ./layout.coffee
#@prepros-append ./triggers.coffee
#@prepros-append ./gradient.coffee
#@prepros-append ./dom.coffee