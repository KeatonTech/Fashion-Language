# Set up the environment
if !window.fashiontests then window.fashiontests = {}
window.fashiontests.runtime = {}


# Add the test to the window
window.fashiontests.runtime.simulateRuntime = (css,js) ->

	# Add a temporary stylesheet
	window.fashion.$dom.addStylesheet css

	# Simulate JS
	eval(js)


# Remove all traces of the test from window
window.fashiontests.runtime.cleanup = ()->

	# Remove the normal stylesheet
	sheet = document.getElementById window.fashion.cssId
	if sheet? then sheet.parentNode.removeChild sheet

	# Remove the individual stylesheet
	sheet = document.getElementById window.fashion.runtimeConfig.individualCSSID
	if sheet? then sheet.parentNode.removeChild sheet

	# Remove the scoped stylesheet
	sheet = document.getElementById window.fashion.runtimeConfig.scopedCSSID
	if sheet? then sheet.parentNode.removeChild sheet

	# Remove all individual scoped stylesheets
	sheets = document.getElementsByClassName window.fashion.runtimeConfig.scopedCSSID
	for sheet in sheets
		if sheet? then sheet.parentNode.removeChild sheet

	# Remove the JS stuff
	window.FASHION = undefined
	window.FSMIN = undefined
	window.style = undefined

	# Remove the test block
	if tdiv = document.getElementById "FSTESTBLOCK"
		document.body.removeChild tdiv

	# Remove the DOM observer
	window.FSDOMWATCHERS = undefined
	if window.FSOBSERVER?
		window.FSOBSERVER.disconnect()
		delete window.FSOBSERVER

	window.FASHION_NO_OBSERVE = false


# Get a CSS rule
window.fashiontests.runtime.getRule = (id, sheetId = window.fashion.cssId) ->
	sheet = document.getElementById sheetId
	rules = sheet.sheet.rules || sheet.sheet.cssRules
	if id > rules.length then console.log "[FASHION] No rule at index #{id}"
	return rules[id]


# Create a testing block
window.fashiontests.runtime.testDiv = (html) ->
	testDiv = document.createElement "div"
	testDiv.id = "FSTESTBLOCK"
	testDiv.innerHTML = html
	document.body.appendChild testDiv
	return "FSTESTBLOCK"