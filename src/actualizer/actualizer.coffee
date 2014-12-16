# The actualizer turns a parse tree into CSS and Javascript
# So named because it makes Fashion *actually* do something
window.fashion.$actualizer = 

	# Generate a whole new document
	# scriptIndex allows multiple Fashion scripts to be used on a page without colliding
	actualize: (parseTree, scriptIndex) ->

		# Split each selector to into pieces with homogenous property modes
		{selectors: selectors, map: hMap} = $wf.$actualizer.regroupProperties parseTree

		# CSS doesn't care about individual blocks; JS doesn't care about static blocks
		cssSelectors = $wf.$actualizer.cullSelectors selectors, $wf.$runtimeMode.scoped
		jsSelectors = $wf.$actualizer.cullSelectors selectors, $wf.$runtimeMode.static

		# Generate a runtime data object containing everything the Javascript will need
		runtimeData = $wf.$actualizer.generateRuntimeData parseTree, jsSelectors, hMap

		# Create the CSS file as a string
		css = $wf.$actualizer.createCSS runtimeData, cssSelectors

		# Figure out what capabilities will be needed in the Javascript
		capabilities = $wf.$actualizer.determineRuntimeCapabilities runtimeData

		# Generate the JS Here

		# Return two strings, one for JS and one for CSS
		return {css: css, js: ""}


# Returns an object that contains only selectors that need to be included in runtime data
window.fashion.$actualizer.cullSelectors = (allSelectors, cullMode) ->
	nonStaticSelectors = {}
	for id, selector of allSelectors
		if (selector.mode & cullMode) isnt cullMode
			nonStaticSelectors[id] = selector
	return nonStaticSelectors


# Other pieces of the actualizer
# @prepros-append ./regrouper.coffee
# @prepros-append ./runtime-data.coffee
# @prepros-append ./create-css.coffee
# @prepros-append ./capabilities.coffee
