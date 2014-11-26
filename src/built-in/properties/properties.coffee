window.fashion.$properties =

	"text-style":
		compile: (values)->

			# Each item in the property should be considered independantly
			compileSingleValue = (value) =>
				if !(typeof value is 'string') then return

				if value[0] is "'" or value[0] is '"'
					return @setProperty "font-family", value

				switch value
					when "italic" then @setProperty "font-style", "italic"
					when "oblique" then @setProperty "font-style", "oblique"
					when "bold" then @setProperty "font-weight", "bolder"
					when "light" then @setProperty "font-weight", "lighter"
					when "underline" then @setProperty "text-decoration", "underline"
					when "overline" then @setProperty "text-decoration", "overline"
					when "line-through" then @setProperty "text-decoration", "line-through"
					when "strikethrough" then @setProperty "text-decoration", "line-through"

			# Run that function
			if values instanceof Array then compileSingleValue(v) for v in values
			else compileSingleValue(values)