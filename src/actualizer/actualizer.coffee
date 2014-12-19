# The actualizer turns a parse tree into CSS and Javascript
# So named because it makes Fashion *actually* do something
window.fashion.$actualizer = 

	# Generate a whole new document
	# scriptIndex allows multiple Fashion scripts to be used on a page without colliding
	actualize: (parseTree) ->

		# Separate transitions out into their own properties
		$wf.$actualizer.separateTransitions parseTree

		# Split each selector to into pieces with homogenous property modes
		{selectors: selectors, map: hMap} = $wf.$actualizer.regroupProperties parseTree

		# CSS doesn't care about individual blocks; JS doesn't care about static blocks
		cssSelectors = $wf.$actualizer.cullSelectors selectors, $wf.$runtimeMode.individual
		jsSelectors = $wf.$actualizer.cullSelectors selectors, $wf.$runtimeMode.static

		# Generate a runtime data object containing everything the Javascript will need
		runtimeData = $wf.$actualizer.generateRuntimeData parseTree, jsSelectors, hMap

		# Figure out what capabilities will be needed in the Javascript
		capabilities = $wf.$actualizer.determineRuntimeCapabilities runtimeData

		# Add all of the necessary runtime functions to the runtime data
		$wf.$actualizer.addRuntimeFunctions runtimeData, parseTree, capabilities

		# Create the CSS file as a string
		css = $wf.$actualizer.createCSS runtimeData, cssSelectors

		# Create the JS file as a string
		js = $wf.$actualizer.createJS runtimeData, parseTree.scripts

		# Return two strings, one for JS and one for CSS
		return {css: css, js: js}


# Returns an object that contains only selectors that need to be included in runtime data
window.fashion.$actualizer.cullSelectors = (allSelectors, cullMode) ->
	nonStaticSelectors = {}
	for id, selector of allSelectors
		if selector.mode isnt cullMode
			nonStaticSelectors[id] = selector
	return nonStaticSelectors


# Header added to Javascript Files
window.fashion.$actualizer.createJS = (runtimeData, scripts) ->
	"""
	/*\\
	|*| GENERATED BY FASHION #{$wf.version}
	|*| #{$wf.url} - #{$wf.author}
	\\*/
	window.#{$wf.runtimeObject} = #{$wf.$stringify runtimeData};
	#{scripts.join('\n')}
	"""


# Other pieces of the actualizer
# @prepros-append ./regrouper.coffee
# @prepros-append ./runtime-data.coffee
# @prepros-append ./create-css.coffee
# @prepros-append ./capabilities.coffee
