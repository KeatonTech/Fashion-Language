# The actualizer turns a parse tree into CSS and Javascript
# So named because it makes Fashion *actually* do something
window.fashion.$actualizer = 

	# Generate a whole new document
	actualize: (parseTree) ->
		rMode = $wf.$runtimeMode

		# Separate transitions out into their own properties
		$wf.$actualizer.separateTransitions parseTree

		# Split each selector to into pieces with homogenous property modes
		{selectors: selectors, map: hMap} = $wf.$actualizer.regroupProperties parseTree

		# CSS doesn't care about individual blocks, so they get stripped out here
		{sel: cssSelectors, map: cssMap, offsets: cullOffsets} = 
			$wf.$actualizer.cullIndividuality(selectors, hMap)

		# Javascript doesn't need to know about static blocks, so they are filtered out here
		jsSels = $wf.$actualizer.filterStatic(cssSelectors)

		# Get all the individual selectors on their own, for the javascript
		indSels = $wf.$actualizer.addIndividualProperties selectors, cullOffsets

		# Generate a runtime data object containing everything the Javascript will need
		runtimeData = $wf.$actualizer.generateRuntimeData parseTree, jsSels, indSels, cssMap

		# Add bindings (selector dependents) for globals and functions to the runtime data
		$wf.$actualizer.addBindings runtimeData, parseTree, jsSels, cssMap

		# Figure out what runtime capabilities will be needed in the Javascript
		capabilities = $wf.$actualizer.determineRuntimeCapabilities runtimeData, selectors
		$wf.$actualizer.addRuntimeFunctions runtimeData, parseTree, capabilities

		# Remove unnecessary module fields from the runtime data (keeps stuff clean)
		$wf.$actualizer.removeUnnecessaryModuleData runtimeData

		# Create the CSS file as a string
		css = $wf.$actualizer.createCSS runtimeData, cssSelectors

		# Convert the runtime data into a more compressed format for transport
		miniRuntimeData = $wf.$actualizer.minifier.runtimeData runtimeData

		# Create the JS file as a string
		js = $wf.$actualizer.createJS runtimeData, miniRuntimeData, parseTree.scripts

		# Return two strings, one for JS and one for CSS
		return {css: css, js: js}


# Header added to Javascript Files
window.fashion.$actualizer.createJS = (runtimeData, minifiedData, scripts) ->
	"""
	/*\\
	|*| GENERATED BY FASHION #{$wf.version}
	|*| #{$wf.url} - #{$wf.author}
	\\*/
	window.#{$wf.minifiedObject} = #{$wf.$stringify minifiedData};
	window.#{$wf.runtimeObject} = #{$wf.$stringify {
		config: runtimeData.config,
		modules: runtimeData.modules,
		runtime: runtimeData.runtime,
		selectors: {}, individual: {}, variables: {}
	}};
	FSEXPAND = #{$wf.$stringify $wf.$actualizer.minifier.expandRuntimeData};
	FSEXPAND(window.#{$wf.minifiedObject},window.#{$wf.runtimeObject});
	FSREADY = function(r){d=document;c="complete";
		if(d.readyState==c)r()
		else d.addEventListener('readystatechange',function(){if(d.readyState==c)r()})
	}
	#{scripts.join('\n')}
	"""


# Other pieces of the actualizer
# @prepros-append ./regrouper.coffee
# @prepros-append ./selectors.coffee
# @prepros-append ./runtime-data.coffee
# @prepros-append ./create-css.coffee
# @prepros-append ./capabilities.coffee
# @prepros-append ./bindings.coffee
# @prepros-append ./minifier/runtime-data.coffee

