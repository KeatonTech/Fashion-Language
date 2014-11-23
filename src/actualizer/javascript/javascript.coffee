# Creates a script and adds it to the page
window.fashion.$actualizer.addScriptFromTree = (tree, selMap) ->
	jsText = window.fashion.$actualizer.createScriptFromTree tree, selMap
	jsElement = window.fashion.$dom.makeScriptTag jsText
	window.fashion.$dom.addElementToHead jsElement
	return jsElement

# Generates a Javascript file with all the logic necessary to run the Fashion file
window.fashion.$actualizer.createScriptFromTree = (tree, selMap) ->

	# Start off the file by setting up the constant runtime object
	jsText = window.fashion.$blueprint.initialize tree, selMap
	jsText += window.fashion.$blueprint.basicRuntime() + "\n"
	jsText += window.fashion.$blueprint.startRuntime()

	# Return the text
	return jsText

# Includes
# @prepros-append ./blueprint.coffee