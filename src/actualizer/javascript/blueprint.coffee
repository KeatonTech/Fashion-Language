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
			selectors:  #{JSON.stringify parseTree.selectors},
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
		w.FASHION.runtime = {
			throwError: #{window.fashion.$run.throwError.toString()},
			initializeSelector: #{window.fashion.$run.initializeSelector.toString()},
			updateVariable: #{window.fashion.$run.updateVariable.toString()},
			getVariable: #{window.fashion.$run.getVariable.toString()},
			evaluate: #{window.fashion.$run.evaluate.toString()},
			determineType: #{window.fashion.$run.determineType.toString()},
			getUnit: #{window.fashion.$run.getUnit.toString()},
			defineProperties: #{window.fashion.$run.defineProperties.toString()},
			updateSelector: #{window.fashion.$run.updateSelector.toString()},
			regenerateSelector: #{window.fashion.$run.regenerateSelector.toString()}
		}
		"""

	# Start any necessary functions
	startRuntime: () ->
		"""
		w.FASHION.runtime.initializeSelector()
		w.FASHION.runtime.defineProperties.call(w.FASHION.runtime)
		"""