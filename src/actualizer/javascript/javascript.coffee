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
	jsText += window.fashion.$actualizer.addGlobals(tree) + "\n"
	jsText += window.fashion.$blueprint.startRuntime()

	# Return the text
	return jsText

# Adds globals as needed
window.fashion.$actualizer.addGlobals = (tree, globals = $wf.$globals) ->
	if JSON.stringify(tree.globals) is "{}" then return ""
	acc = "w.FASHION.globals = {\n"

	# Add each used global
	for name, obj of tree.globals
		if !globals[name] then continue
		obj[k] = v for k,v of globals[name]
		objString = """
					{type: #{obj.type}, unit: '#{obj.unit}', dependants: #{JSON.stringify obj.dependants}, 
					get: #{obj.get.toString()}, watch: #{obj.watch.toString()}}
					"""
		acc += "#{name}: #{objString.replace('\n','')},\n"

	# Package it all up nicely
	return acc.substr(0, acc.length - 2) + "};"

# Includes
# @prepros-append ./blueprint.coffee