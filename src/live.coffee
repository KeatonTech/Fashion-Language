# Global fashion stuff
# @prepros-prepend ./fashion.coffee

###
------------------------------------------------------------------------------

This Live version runs in the browser to dynamically compile Fashion files
into CSS and Javascript. It is not reccommended for production apps.

------------------------------------------------------------------------------
###

# Load and parse style and link tags
document.onreadystatechange = ()->
	if document.readyState is "complete"
		scriptIndex = 0

		# Load Fashion scripts on the page
		window.fashion.$loader.loadScriptsFromTags (scriptText)->

			# Start timer
			start = new Date().getTime()

			# Parse the scripts into a nice little tree
			parseTree = window.fashion.$parser.parse scriptText

			# Convert the tree into JS and CSS elements
			window.fashion.$actualizer.actualizeFullSheet parseTree, scriptIndex++

			# Print the runtime
			console.log "[FASHION] Compile finished in #{new Date().getTime() - start}ms"


# Include helper files, used by everything
# @prepros-append ./helpers/dom.coffee
# @prepros-append ./types/types.coffee

# Include the actual functional JS files
# @prepros-append ./loader/live.coffee
# @prepros-append ./parser/parser.coffee
# @prepros-append ./runtime/runtime.coffee
# @prepros-append ./actualizer/actualizer.coffee

# Include all of the built-in Fashion modules
# @prepros-append ./built-in/functions/functions.coffee