# The actualizer turns a parse tree into CSS and Javascript
# So named because it makes Fashion *actually* do something
window.fashion.$actualizer = 

	# Generate a whole new document
	actualizeFullSheet: (parseTree, index) ->

		# Create the stylesheets and get a selector mapping
		selMap = window.fashion.$actualizer.makeDomStyleFromTree parseTree, index

		# Create a javascript file with all of the necessary logic
		window.fashion.$actualizer.addScriptFromTree parseTree, selMap

		# Return everything
		return true

	
# Includes
# @prepros-append ./css.coffee
# @prepros-append ./javascript/javascript.coffee