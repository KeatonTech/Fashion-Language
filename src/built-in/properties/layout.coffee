$wf.$extend window.fashion.$properties,

	pin: new PropertyModule
		replace: true
		compile: (values)->

			# Validate
			if typeof values is "object"
				if values.length > 2 or values[0] instanceof Array
					@throwError "Valid arguments: '{x}px {y}px' or '{both}px'"


			# This is going to require absolute positioning
			# It could potentially work with relative too
			# TODO(keatontech): Yeah, try that!
			@setProperty "position", "absolute"

			# Do different things depending on the pin values
			leftExpr = rightExpr = topExpr = bottomExpr = undefined
			processPosition = (val)->
				switch val
					when "left" then leftExpr = "0px"
					when "right" then rightExpr = "0px"
					when "top" then topExpr = "0px"
					when "bottom" then bottomExpr = "0px"
					when "center"
						leftExpr = "@self.parent.width / 2 - @self.width / 2"
						topExpr = "@self.parent.height / 2 - @self.height / 2"
					else @throwError "Invalid position: #{val}"

			# Process each position argument
			if typeof values is "object"
				processPosition(values[0])
				if values.length is 2 then processPosition(values[1])
			else if typeof values is "string"
				processPosition(values)

			# Set an X value
			if leftExpr then @setProperty "left", @parseValue leftExpr
			else @setProperty "right", @parseValue rightExpr

			# Set a Y value
			if topExpr then @setProperty "top", @parseValue topExpr
			else @setProperty "bottom", @parseValue bottomExpr