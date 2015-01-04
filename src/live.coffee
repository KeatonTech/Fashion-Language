# Wrap everything to prevent global leaks
# @prepros-prepend ./helpers/prepros/wrap-header.coffee

# Global fashion stuff
# @prepros-prepend ./fashion.coffee

###
------------------------------------------------------------------------------

This Live version runs in the browser to dynamically compile Fashion files
into CSS and Javascript. It is not reccommended for production apps.

------------------------------------------------------------------------------
###

# More constants
window.fashion.live = {
	loadedEvent: "fashion-loaded"
}

# Useful later
currentScript = document.currentScript || document.scripts[document.scripts.length - 1]

# Load and parse style and link tags
document.addEventListener 'readystatechange', ()->
	if document.readyState is "complete"

		# Load Fashion scripts on the page
		window.fashion.$loader.loadStyles (scriptText)->

			# Start timer
			start = new Date().getTime()

			# Parse the scripts into a nice little tree
			parseTree = window.fashion.$parser.parse scriptText

			# Process that nice little tree to expand out things like properties
			parseTree = window.fashion.$processor.process parseTree

			# Convert the tree into JS and CSS elements
			{css, js} = window.fashion.$actualizer.actualize parseTree

			# Print the compile time
			console.log "[FASHION] Compile finished in #{new Date().getTime() - start}ms"
			start = new Date().getTime()

			# Add those elements to the page
			$wf.$dom.addStylesheet css
			$wf.$dom.addScript js

			# Print the load time
			console.log "[FASHION] Page initialize finished in #{new Date().getTime() - start}ms"

			# Trigger the loaded event
			event = new Event(window.fashion.live.loadedEvent)
			event.variableObject = window[window.fashion.variableObject]
			document.dispatchEvent event

			# Remove all the compiler code, including this
			$wf.removeCompiler()


# Remove the uncompiled stuff from the DOM, just to simplify things
window.fashion.removeCompiler = ()->

	deleteAll = (elements) ->
		element.parentNode.removeChild(element) for element in elements

	deleteAll document.querySelectorAll "[type='text/x-fashion']"
	currentScript.parentNode.removeChild currentScript


# Include helper files, used by everything
# @prepros-append ./helpers/basic.coffee
# @prepros-append ./helpers/dom.coffee
# @prepros-append ./helpers/stringify.coffee
# @prepros-append ./classes/parser/parsetree.coffee
# @prepros-append ./classes/modules.coffee
# @prepros-append ./types/types.coffee
# @prepros-append ./types/runtime-modes.coffee

# Include the actual functional JS files
# @prepros-append ./loader/live.coffee
# @prepros-append ./parser/parser.coffee
# @prepros-append ./processor/processor.coffee
# @prepros-append ./shared/shared.coffee
# @prepros-append ./actualizer/actualizer.coffee
# @prepros-append ./runtime/runtime.coffee

# Include all of the built-in Fashion modules
# @prepros-append ./built-in/functions/functions.coffee
# @prepros-append ./built-in/properties/properties.coffee
# @prepros-append ./built-in/blocks/blocks.coffee
# @prepros-append ./built-in/globals.coffee

# Wrap everything to prevent globals from leaking
# @prepros-append ./helpers/prepros/wrap-footer.coffee
