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
		capabilities: ["colors"],
		evaluate: (h,s,b) -> 
			{r,g,b} = @hsbTOrgb h, s, b
			"rgb(#{parseInt r.value},#{parseInt g.value},#{parseInt b.value})"

	"hsba": new FunctionModule
		output: $wf.$type.Color,
		capabilities: ["colors"],
		evaluate: (h,s,b,a) -> 
			{r,g,b} = @hsbTOrgb h, s, b
			"rgba(#{parseInt r.value},#{parseInt g.value},#{parseInt b.value},#{a.value})"


	# COLOR MANIPULATION FUNCTIONS

	# Give a color an alpha value
	"changeAlpha": new FunctionModule
		output: window.fashion.$type.Color,
		capabilities: ["colors"]
		evaluate: (color, newAlpha)->
			c = @cssTOjs color.value, this
			"rgba(#{c.r},#{c.g},#{c.b},#{newAlpha.value})"

	# Brighten a color linearly
	"brighten": new FunctionModule
		output: window.fashion.$type.Color,
		capabilities: ["colors"]
		evaluate: (color, brightenPercent)->
			percent = brightenPercent.value
			adj = 1 + (if percent > 1 then percent / 100 else percent)

			# Convert the color input into something usable
			c = @cssTOjs color.value, this

			# Brighten
			c.r = parseInt Math.max c.r * adj, 0
			c.g = parseInt Math.max c.g * adj, 0
			c.b = parseInt Math.max c.b * adj, 0

			# Return in RGBA format
			"rgba(#{c.r},#{c.g},#{c.b},#{c.a})"

	# Darken a color linearly
	"darken": new FunctionModule
		output: window.fashion.$type.Color,
		capabilities: ["colors"]
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
			"rgba(#{c.r},#{c.g},#{c.b},#{c.a})"
			