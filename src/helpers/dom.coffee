window.fashion.$dom =

	addElementToHead: (element)->
		head = document.head || document.getElementsByTagName('head')[0]
		head.appendChild(element)

	makeStylesheet: (className, index, isDynamic) ->
		sheet = document.createElement "style"
		sheet.setAttribute("type", "text/css")
		sheet.setAttribute("class", className)
		sheet.setAttribute("data-count", "0")
		sheet.setAttribute("data-index", index)
		if isDynamic then sheet.setAttribute("id", "#{window.fashion.cssId}#{index}")
		return sheet

	makeScriptTag: (scriptText) ->
		script = document.createElement "script"
		script.text = scriptText
		return script

	incrementSheetIndex: (sheet) ->
		val = parseInt sheet.getAttribute("data-count")
		sheet.setAttribute("data-count", val+1)
		return val

	getSheetIndex: (sheet) ->
		return parseInt sheet.getAttribute("data-index")