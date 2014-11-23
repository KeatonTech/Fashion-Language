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
	jsText += window.fashion.$blueprint.basicRuntime()
	jsText += "\n" + addVariablesToWindow(tree.variables) + "\n"
	jsText += window.fashion.$blueprint.startRuntime()

	# Return the text
	return jsText

# Internal helper methods

addVariablesToWindow = (variables) ->
	styleObj = {}
	for name,obj of variables
		formattedVal = obj.value
		if obj.type is window.fashion.$type.String
			formattedVal = "\"#{formattedVal}\""

		styleObj[name] = formattedVal;
		styleObj["$" + name] = formattedVal;

	return "w.#{window.fashion.variableObject} = #{JSON.stringify styleObj};"

# Includes
# @prepros-append ./blueprint.coffee