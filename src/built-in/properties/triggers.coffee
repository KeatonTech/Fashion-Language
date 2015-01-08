$wf.$extend window.fashion.$properties, new class then constructor: ->

	# Events that fire stopPropagation and are only handled by one element
	caughtEvents = [
		"click", "dblclick", "mousedown", "mouseup",
		"drag", "dragdrop", "dragend", "drop",
		"blur", "change", "focus", "focusin", "focusout",
		"submit", "reset", "keydown", "keyup"
	]

	applyForCaughtEvent = (evt) -> 
		body = 	"""
				if(element.getAttribute('data-hastrigger-#{evt}'))return;
				element.addEventListener('#{evt}', function(eo){
					eo.stopPropagation();
					evaluate();
				}, false);
				element.setAttribute('data-hastrigger-#{evt}', 'true');
				"""
		return new Function "element", "value", "evaluate", body

	for evt in caughtEvents
		@["on-#{evt}"] = new PropertyModule
			replace: true
			mode: ($wf.$runtimeMode.triggered | $wf.$runtimeMode.individual)
			"apply": applyForCaughtEvent(evt)


	# Events whose propogation is not stopped
	propogatedEvents = [
		"mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover",
		"dragenter", "dragexit", "draggesture", "dragleave", "dragover", "dragstart"
	]

	applyForPropogatedEvent = (evt) -> 
		body = 	"""
				if(element.getAttribute('data-hastrigger-#{evt}'))return;
				element.addEventListener('#{evt}', evaluate, false);
				element.setAttribute('data-hastrigger-#{evt}', 'true');
				"""
		return new Function "element", "value", "evaluate", body

	for evt in propogatedEvents
		@["on-#{evt}"] = new PropertyModule
			replace: true
			mode: ($wf.$runtimeMode.triggered | $wf.$runtimeMode.individual)
			"apply": applyForPropogatedEvent(evt)