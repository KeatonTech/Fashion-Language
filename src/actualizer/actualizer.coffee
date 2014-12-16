# The actualizer turns a parse tree into CSS and Javascript
# So named because it makes Fashion *actually* do something
window.fashion.$actualizer = 

	# Generate a whole new document
	# scriptIndex allows multiple Fashion scripts to be used on a page without colliding
	actualize: (parseTree, scriptIndex) ->

		# Split each selector to into pieces with homogenous property modes
		{selectors: hSelectors, map: hMap} = $wf.$actualizer.regroupProperties parseTree
				

	
# Includes
# @prepros-append ./regrouper.coffee