window.fashion.$dom =

	addElementToHead: (element)->
		head = document.head || document.getElementsByTagName('head')[0]
		head.appendChild(element)

	addStylesheet: (styleText, id = window.fashion.cssId) ->
		sheet = document.createElement "style"
		sheet.setAttribute("type", "text/css")
		sheet.setAttribute("id", "#{id}")
		$wf.$dom.addElementToHead sheet
		
		# Add the rules one-by-one
		# Not really sure why the browser can't just do this part itself.
		# But IE has some trouble counting so we have to help it along.
		sheet.sheet.reallength = 0
		styleRules = styleText.split("\n")
		for id, rule of styleRules when rule.length > 3
			try 
				sheet.sheet.insertRule rule, id
			catch e
				# This is sloppy but it's very hard to change indices at this point
				sheet.sheet.insertRule "#FSIGNORE {}", id
			sheet.sheet.reallength++

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