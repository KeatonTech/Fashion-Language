$wf.$extend window.fashion.$properties, new class then constructor: ->

	events = [
		"click", "dblclick", "mousedown", "mouseup",
		"mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover",
		"drag", "dragdrop", "dragend", "drop",
		"dragenter", "dragexit", "draggesture", "dragleave", "dragover", "dragstart",
		"blur", "change", "focus", "focusin", "focusout",
		"submit", "reset"
	]

	applyForEvent = (evt) -> 
		body = "element.addEventListener('#{evt}', evaluate, false);"
		return new Function "element", "value", "evaluate", body

	for evt in events
		@["on-#{evt}"] = new PropertyModule
			replace: true
			mode: $wf.$runtimeMode.individual
			"apply": applyForEvent(evt)