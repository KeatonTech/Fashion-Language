window.fashion.$globals =

	width: new GlobalModule
		type: $wf.$type.Number
		unit: "px"
		get: () -> window.innerWidth
		watch: (onchange) -> window.addEventListener "resize", onchange, false

	height: new GlobalModule
		type: $wf.$type.Number
		unit: "px"
		get: () -> window.innerHeight
		watch: (onchange) -> window.addEventListener "resize", onchange, false

	scrolly: new GlobalModule
		type: $wf.$type.Number
		unit: "px"
		get: () -> window.scrollY
		watch: (onchange) -> window.addEventListener "onscroll", onchange

	scrollx: new GlobalModule
		type: $wf.$type.Number
		unit: "px"
		get: () -> window.scrollX
		watch: (onchange) -> window.addEventListener "onscroll", onchange

	mousey: new GlobalModule
		type: $wf.$type.Number
		unit: "px"
		get: () -> window.mouseY || 0
		watch: (onchange) -> 
			window.addEventListener "mousemove", (e)->
				window.mouseY = e.pageY
				onchange()

	mousex: new GlobalModule
		type: $wf.$type.Number
		unit: "px"
		get: () -> window.mouseX || 0
		watch: (onchange) -> 
			window.addEventListener "mousemove", (e)->
				window.mouseX = e.pageX
				onchange()

	pixelratio: new GlobalModule
		type: $wf.$type.Number
		get: () -> window.devicePixelRatio
		watch: (onchange) ->
			lastRatio = window.devicePixelRatio
			setInterval((()->
				if window.devicePixelRatio isnt lastRatio then onchange()
				lastRatio = window.devicePixelRatio
			),1000)

	browserwebkit: new GlobalModule
		type: $wf.$type.Boolean
		get: () -> /WebKit/.test(navigator.userAgent)
		watch: (onchange) -> return false

	ismobile: new GlobalModule
		type: $wf.$type.Boolean
		get: () -> window.orientation? and window.innerWidth < 800
		watch: (onchange) -> return false