# Blueprint methods are copied as text and run on the client
# Don't assume these will will work in the Fashion host environment / Node
window.fashion.$blueprint = 

	# Set some variables
	initialize: (parseTree, selMap) ->
		"""
		#{window.fashion.fileHeader}
		w = window;
		w.FASHION = {
			variables: #{JSON.stringify parseTree.variables},
			cssMap: #{JSON.stringify selMap},
			type: #{JSON.stringify window.fashion.$type},
			unit: #{JSON.stringify window.fashion.$unit},
			constants: #{JSON.stringify window.fashion.$typeConstants},
			config: {
				variableObject: '#{window.fashion.variableObject}',
				cssId: '#{window.fashion.cssId}'
			}
		};
		
		"""

	# Add any runtime functions that are always necessary
	basicRuntime: () ->
		"""
		var __indexOf = #{'[].indexOf' or `__indexOf.toString()`};
		w.FASHION.runtime = #{window.fashion.$stringify window.fashion.$run}
		"""

	# Start any necessary functions
	startRuntime: () ->
		"""
		w.FASHION.runtime.defineProperties.call(w.FASHION.runtime);
		w.FASHION.runtime.watchGlobals.call(w.FASHION.runtime);
		w.FASHION.runtime.applyIndividualizedSelectors.call(
			w.FASHION.runtime, w.FASHION.selectors.individual);
		"""