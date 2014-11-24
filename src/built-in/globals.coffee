window.fashion.$globals =

	width:
		type: $wf.$type.Number
		unit: "px"
		get: () -> window.innerWidth
		watch: (onchange) -> window.addEventListener "resize", onchange, false

	height:
		type: $wf.$type.Number
		unit: "px"
		get: () -> window.innerHeight
		watch: (onchange) -> window.addEventListener "resize", onchange, false

	scrolly:
		type: $wf.$type.Number
		unit: "px"
		get: () -> window.scrollY
		watch: (onchange) -> window.addEventListener "onscroll", onchange

	scrollx:
		type: $wf.$type.Number
		unit: "px"
		get: () -> window.scrollX
		watch: (onchange) -> window.addEventListener "onscroll", onchange

	mousey:
		type: $wf.$type.Number
		unit: "px"
		get: () -> window.mouseY || 0
		watch: (onchange) -> 
			window.addEventListener "mousemove", (e)->
				window.mouseY = e.pageY
				onchange()

	mousex:
		type: $wf.$type.Number
		unit: "px"
		get: () -> window.mouseX || 0
		watch: (onchange) -> 
			window.addEventListener "mousemove", (e)->
				window.mouseX = e.pageX
				onchange()