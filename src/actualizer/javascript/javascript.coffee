# Creates a script and adds it to the page
window.fashion.$actualizer.addScriptFromTree = (tree, selMap, rules) ->
	jsText = $wf.$actualizer.createScriptFromTree tree, selMap, rules
	jsElement = $wf.$dom.makeScriptTag jsText
	window.fashion.$dom.addElementToHead jsElement
	return jsElement


# Generates a Javascript file with all the logic necessary to run the Fashion file
window.fashion.$actualizer.createScriptFromTree = (tree, selMap, rules) ->

	# Start off the file by setting up the constant runtime object
	jsText = window.fashion.$blueprint.initialize tree, selMap
	jsText += window.fashion.$blueprint.basicRuntime() + "\n"
	jsText += window.fashion.$actualizer.addSelectorsToJS rules
	jsText += window.fashion.$actualizer.addGlobalsToJS(tree) + "\n"

	# Add requirements
	tr = tree.requirements
	jsText += "w.FASHION.functions = #{window.fashion.$stringify tr.functions};\n"
	jsText += "w.FASHION.properties = #{window.fashion.$stringify tr.properties};\n"
	jsText += "w.FASHION.blocks = #{window.fashion.$stringify tr.blocks};\n"

	# Add scripts that the modules have generated
	jsText += s for s in tree.javascript

	# Start this thing off
	jsText += window.fashion.$blueprint.startRuntime()

	# Return the text
	return jsText


# Adds selectors as needed (dynamic & individualized, not static)
window.fashion.$actualizer.addSelectorsToJS = (rules) ->
	selectors =
		dynamic: rules.javascript.dynamic
		individual: rules.javascript.individual
	return "w.FASHION.selectors = #{window.fashion.$stringify selectors};\n"

# Adds globals as needed
window.fashion.$actualizer.addGlobalsToJS = (tree, globals = $wf.$globals) ->
	if JSON.stringify(tree.globals) is "{}" then return ""
	acc = "w.FASHION.globals = {"

	# Add each used global
	for name, obj of tree.globals
		if !globals[name] then continue
		obj[k] = v for k,v of globals[name]
		objString = window.fashion.$stringify obj
		acc += "#{name}: #{objString.replace('\n','')},\n"

	# Package it all up nicely
	return acc.substr(0, acc.length - 2) + "};"

# Includes
# @prepros-append ./blueprint.coffee