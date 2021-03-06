$wf.$extend window.fashion.$functions, 
	
	# Do these seem stupid to you?
	# Well, okay, fine, they kind of are.
	# But it simplifies the expression parser code.
	# They do also prevent floats from screwing up the format.

	"rgb": new FunctionModule
		output: $wf.$type.Color
		evaluate: (r,g,b) -> 
			"rgb(#{parseInt r.value},#{parseInt g.value},#{parseInt b.value})"

	"rgba": new FunctionModule
		output: $wf.$type.Color
		evaluate: (r,g,b,a) -> 
			"rgba(#{parseInt r.value},#{parseInt g.value},#{parseInt b.value},#{a.value})"

	# NOTE: HSL() passes through to the default CSS implementation of HSL, which is now
	# relatively well supported. However, HSB() is compiled into RGB() by Fashion.
	# in other words, if you want good browser support, use HSB() instead.
	"hsl": new FunctionModule
		output: $wf.$type.Color
		evaluate: (h,s,l) -> 
			"hsl(#{parseInt h.value},#{parseInt s.value}%,#{parseInt l.value}%)"

	"hsla": new FunctionModule
		output: $wf.$type.Color
		evaluate: (h,s,l,a) -> 
			"hsla(#{parseInt h.value},#{parseInt s.value}%,#{parseInt l.value}%,#{a.value})"


	# NON STANDARD CSS COLORS

	"hsb": new FunctionModule
		output: $wf.$type.Color,
		requires: ["colors"]
		evaluate: (h,s,b) -> 
			{r,g,b} = @hsbTOrgb h.value, s.value, b.value
			"rgb(#{parseInt r},#{parseInt g},#{parseInt b})"

	"hsba": new FunctionModule
		output: $wf.$type.Color,
		requires: ["colors"]
		evaluate: (h,s,b,a) -> 
			{r,g,b} = @hsbTOrgb h.value, s.value, b.value
			"rgba(#{parseInt r},#{parseInt g},#{parseInt b},#{a.value})"


	# COLOR GENERATION FUNCTIONS

	"randomColor": new FunctionModule
		output: $wf.$type.Color
		watch: (rate, c) -> 
			if !rate.value then return 
			i = setInterval c, rate.value
			return ()-> clearInterval(i)

		evaluate: (rate) ->
			[r,g,b] = [Math.random()*255, Math.random()*255, Math.random()*255]
			"rgb(#{parseInt r},#{parseInt g},#{parseInt b})"


	"randomBrightColor": new FunctionModule
		output: $wf.$type.Color
		requires: ["colors"]
		watch: (rate, c) -> 
			if !rate.value then return 
			i = setInterval c, rate.value
			return ()-> clearInterval(i)

		evaluate: (rate) ->
			randomHue = Math.random() * 360
			{r,g,b} = @hsbTOrgb randomHue, 80, 80
			"rgb(#{parseInt r},#{parseInt g},#{parseInt b})"


	"randomDarkColor": new FunctionModule
		output: $wf.$type.Color
		requires: ["colors"]
		watch: (rate, c) -> 
			if !rate.value then return 
			i = setInterval c, rate.value
			return ()-> clearInterval(i)
			
		evaluate: (rate) ->
			randomHue = Math.random() * 360
			{r,g,b} = @hsbTOrgb randomHue, 80, 30
			"rgb(#{parseInt r},#{parseInt g},#{parseInt b})"


	# COLOR MANIPULATION FUNCTIONS

	# Give a color an alpha value
	"changeAlpha": new FunctionModule
		output: window.fashion.$type.Color,
		requires: ["colors"]
		evaluate: (color, newAlpha)->
			c = @cssTOjs color.value, this
			"rgba(#{c.r},#{c.g},#{c.b},#{newAlpha.value})"

	# Invert a color
	"invert": new FunctionModule
		output: window.fashion.$type.Color,
		requires: ["colors"]
		evaluate: (color)->

			# Convert the color input into something usable
			c = @cssTOjs color.value, this

			# Brighten
			c.r = parseInt 255 - c.r
			c.g = parseInt 255 - c.g
			c.b = parseInt 255 - c.b

			# Return in RGBA format
			"rgba(#{c.r},#{c.g},#{c.b},#{c.a || 1})"

	# Brighten a color linearly
	"brighten": new FunctionModule
		output: window.fashion.$type.Color,
		requires: ["colors"]
		evaluate: (color, brightenPercent)->
			percent = brightenPercent.value
			adj = (if percent > 1 then percent / 100 else percent)

			# Convert the color input into something usable
			c = @cssTOjs color.value, this

			# Brighten
			c.r = parseInt Math.min c.r + (255-c.r) * adj, 255
			c.g = parseInt Math.min c.g + (255-c.g) * adj, 255
			c.b = parseInt Math.min c.b + (255-c.b) * adj, 255

			# Return in RGBA format
			"rgba(#{c.r},#{c.g},#{c.b},#{c.a || 1})"

	# Darken a color linearly
	"darken": new FunctionModule
		output: window.fashion.$type.Color,
		requires: ["colors"]
		evaluate: (color, darkenPercent)->
			percent = darkenPercent.value
			adj = 1 - (if percent > 1 then percent / 100 else percent)

			# Convert the color input into something usable
			c = @cssTOjs color.value, this

			# Darken
			c.r = parseInt Math.max c.r * adj, 0
			c.g = parseInt Math.max c.g * adj, 0
			c.b = parseInt Math.max c.b * adj, 0

			# Return in RGBA format
			"rgba(#{c.r},#{c.g},#{c.b},#{c.a || 1})"
			