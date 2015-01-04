window.fashion.color =

	# CSS ----------------------------------------------------------------------------------

	# Convert a CSS value into an RGB object
	cssTOjs: (cssString, colorTools = $wf.color) ->
		if cssString[0] is "#" then return colorTools.hexTOrgb cssString
		if rgbMatch = cssString.match /rgba?\((.*?),(.*?),([^,]*),?(.*?)\)/
			r: parseInt rgbMatch[1]
			g: parseInt rgbMatch[2]
			b: parseInt rgbMatch[3]
			a: parseFloat rgbMatch[4] || 1


	# HEX ----------------------------------------------------------------------------------

	# Convert a CSS hex value to a JS RGB object
	hexTOrgb: (hex) ->
		# Protect against empty colors
		if hex is undefined then return {r:0, g:0, b:0}

	    # Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace shorthandRegex, (m, r, g, b) -> r + r + g + g + b + b;

		# Parse the long form
		result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if !result then return {r:0,g:0,b:0}
		return {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		}

	# Turn RGB values into hexadecimal
	rgbTOhex: (r,g,b) ->
		# If user passes object in instead of channels
		if typeof r is 'object' then [r,g,b] = [r.r,r.g,r.b]

		ntoHex = (c) ->
			if typeof c is 'string' then c = parseInt(c)
			hex = c.toString(16);
			if hex.length == 1 then "0" + hex else hex;
		return "#"+ntoHex(parseInt(r))+ntoHex(parseInt(g))+ntoHex(parseInt(b));


	# HSB ----------------------------------------------------------------------------------

	# Convert an HSB value to an RGB value
	hsbTOrgb: (h,s,b) ->
		# If user passes object in instead of channels
		if typeof h is 'object' then [h,s,b] = [h.h,h.s,h.b]

		# Tweet-sized HSB calculator
		# I'm very proud of this, I've never seen a shorter one
		# Most people use massive switch statements
		m=Math;s=s/100;b=b/100;
		c = (o) -> return 255*(s*b*m.max(m.min(m.abs(((h+o)/60%6)-3)-1,1),0)+b*(1-s))
		return {r: c(0),g: c(240),b: c(120)}

	# Other way around, convert RGB to HSB
	rgbTOhsb: (r,g,b) ->
		# If user passes object in instead of channels
		if typeof r is 'object' then [r,g,b] = [r.r,r.g,r.b]

		# Value is just the maximum channel
		# Calculated here to prevent rounding errors
		val = Math.max(r, g, b)

		# Convert from 8-bit format to ratio format
		r /= 255; g /= 255; b /= 255;

		# Find the greatest and least channel
		max = Math.max(r, g, b)
		min = Math.min(r, g, b)

		# Color has no hue (all channels are the same)
		if max is min then return {h: 0, s: 0, b: val}

		# Calculate a primary channel differential
		pcd = max - min

		# Calculate a secondary differential and offset based on the minimum channel
		switch min
			when r then [scd,hof] = [g-b, 3]
			when g then [scd,hof] = [b-r, 5]
			when b then [scd,hof] = [r-g, 1]

		# Calculate hue from the ratio of the differentials and the offset
		# NOTE: Hue is initially calculated in [0..6] and then scaled up
		h = ((hof - scd/pcd)*60) % 360

		# Calculate saturation
		s = pcd/max * 255

		return {h: h, s: s, b: val}
