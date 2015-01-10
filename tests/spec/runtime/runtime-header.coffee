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

	# Remove the stylesheet
	sheet = document.getElementById window.fashion.cssId
	sheet.parentNode.removeChild sheet

	# Remove the JS stuff
	window.FASHION = undefined
	window.FSMIN = undefined
	window.style = undefined


# Get a CSS rule
window.fashiontests.runtime.getRule = (id) ->
	sheet = document.getElementById window.fashion.cssId
	rules = sheet.sheet.rules || sheet.sheet.cssRules
	return rules[id]