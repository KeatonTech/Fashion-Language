window.fashion.$dom =

	addElementToHead: (element)->
		head = document.head || document.getElementsByTagName('head')[0]
		head.appendChild(element)

	addStylesheet: (styleText, index) ->
		sheet = document.createElement "style"
		sheet.setAttribute("type", "text/css")
		sheet.setAttribute("id", "#{window.fashion.cssId}#{index}")
		$wf.$dom.addElementToHead sheet
		
		# Add the rules one-by-one
		# Not really sure why the browser can't just do this part itself.
		styleRules = styleText.split("\n")
		for id, rule of styleRules when rule.length > 3
			sheet.sheet.insertRule rule, id

	addScript: (scriptText) ->
		script = document.createElement "script"
		script.setAttribute("type", "text/javascript")
		script.text = scriptText
		$wf.$dom.addElementToHead script

	incrementSheetIndex: (sheet) ->
		val = parseInt sheet.getAttribute("data-count")
		sheet.setAttribute("data-count", val+1)
		return val

	getSheetIndex: (sheet) ->
		return parseInt sheet.getAttribute("data-index")