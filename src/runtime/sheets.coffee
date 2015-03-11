$wf.addRuntimeModule "stylesheet-dom", [],

	# Add a new stylesheet to the page	
	addStylesheet: (id, className)->
		sheetElement = document.createElement "style"
		sheetElement.setAttribute("type", "text/css")
		if id then sheetElement.setAttribute("id", id)
		if className then sheetElement.setAttribute("class", className)
		head = document.head || document.getElementsByTagName('head')[0]
		head.appendChild(sheetElement)
		sheetElement.sheet.rules = sheetElement.sheet.rules || sheetElement.sheet.cssRules
		return sheetElement

	# Delete a stylesheet
	removeStylesheet: (element)-> 
		if !element or !element.parentNode then return
		element.parentNode.removeChild element

	# Create or return a stylesheet
	getStylesheet: (id)->
		if ss = document.getElementById(id) then return ss
		else return @addStylesheet id


$wf.addRuntimeModule "sheets", ["stylesheet-dom"],

	# Moves the sheet in the DOM to have the highest priority
	moveSheetToTop: (sheet) ->
		head = document.head || document.getElementsByTagName('head')[0]
		if head.lastChild is sheet then return
		@removeStylesheet sheet
		head.appendChild(sheet)


	# Sets a rule on a stylesheet, overwriting it if necessary
	setRuleOnSheet: (sheet, selector, property, value, prioritize = true) ->
		if sheet instanceof HTMLStyleElement then sheet = sheet.sheet
		if !sheet.rules then sheet.rules = sheet.cssRules

		# Try to overwrite an existing property
		for id,rule of sheet.rules when rule.selectorText is selector
			rule.style.setProperty property, value

			# Rearranges the sheet so that this new property has the highest priority
			if prioritize
				ruleText = rule.cssText
				sheet.deleteRule id
				sheet.insertRule ruleText, sheet.rules.length

			return

		# Create a new style instead
		sheet.insertRule "#{selector} {#{property}: #{value};}", sheet.rules.length