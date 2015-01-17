# Is it weird to have something from $parser in modules?
# Yes but it's only ever used here and it's short
# Might as well keep the family together
$wf.$parser.parseColorStops = (colorValues) ->
	for id, value of colorValues
		color = ""
		stop = 100 * (id / (colorValues.length - 1))

		# Supports: red 0%, blue 90%, green 100%;
		if value.length is 2
			[color, stop] = value

		# Supports: red, blue, green;
		else color = value[0]

		# String format
		color + " " + stop + "%"


# Simple syntactic sugar for CSS gradients
$wf.$extend window.fashion.$properties,

	"gradient-vertical": new PropertyModule
		replace: true
		compile: (values)->
			colorStops = $wf.$parser.parseColorStops values

			# Webkit (Chrome 10+, Safari 5.1+)
			grd = "-webkit-linear-gradient(top, #{colorStops.join(',')})"
			@setProperty "background", grd

			# Gecko (FF 3.6+)
			grd = "-moz-linear-gradient(top, #{colorStops.join(',')})"
			@setProperty "background", grd

			# Trident (IE10+)
			grd = "-ms-linear-gradient(top, #{colorStops.join(',')})"
			@setProperty "background", grd

			# Opera (Opera 11.1+)
			grd = "-o-linear-gradient(top, #{colorStops.join(',')})"
			@setProperty "background", grd
			
			# Standard CSS format
			grd = "linear-gradient(to bottom, #{colorStops.join(',')})"
			@setProperty "background", grd


	"gradient-horizontal": new PropertyModule
		replace: true
		compile: (values)->
			colorStops = $wf.$parser.parseColorStops values

			# Webkit (Chrome 10+, Safari 5.1+)
			grd = "-webkit-linear-gradient(left, #{colorStops.join(',')})"
			@setProperty "background", grd

			# Gecko (FF 3.6+)
			grd = "-moz-linear-gradient(left, #{colorStops.join(',')})"
			@setProperty "background", grd

			# Trident (IE10+)
			grd = "-ms-linear-gradient(left, #{colorStops.join(',')})"
			@setProperty "background", grd

			# Opera (Opera 11.1+)
			grd = "-o-linear-gradient(left, #{colorStops.join(',')})"
			@setProperty "background", grd
			
			# Standard CSS format
			grd = "linear-gradient(to right, #{colorStops.join(',')})"
			@setProperty "background", grd


	"gradient-radial": new PropertyModule
		replace: true
		compile: (values)->
			colorStops = $wf.$parser.parseColorStops values

			# Webkit (Chrome 10+, Safari 5.1+)
			grd = "-webkit-radial-gradient(center, ellipse cover, #{colorStops.join(',')})"
			@setProperty "background", grd

			# Gecko (FF 3.6+)
			grd = "-moz-radial-gradient(center, ellipse cover, #{colorStops.join(',')})"
			@setProperty "background", grd

			# Trident (IE10+)
			grd = "-ms-radial-gradient(center, ellipse cover, #{colorStops.join(',')})"
			@setProperty "background", grd

			# Opera (Opera 11.1+)
			grd = "-o-radial-gradient(center, ellipse cover, #{colorStops.join(',')})"
			@setProperty "background", grd
			
			# Standard CSS format
			grd = "radial-gradient(ellipse at center, #{colorStops.join(',')})"
			@setProperty "background", grd


