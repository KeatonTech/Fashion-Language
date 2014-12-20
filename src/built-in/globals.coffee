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