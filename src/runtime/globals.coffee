$wf.addRuntimeModule "globals", ["selectors"],

	# For each global, run its watcher function to wait on changes
	# Also set each global's preliminary value
	$startWatchers: () ->

		# Run when globals change
		onChangeFunction = (global) => @updateGlobal.bind(this, global)

		for name, global of FASHION.modules.globals when global.watch?
			global.watch onChangeFunction global
			@updateGlobal global


	# Update the value of the global
	updateGlobal: (global)->

		# Update all of the dependents
		for selectorId in global.dependents
			if typeof selectorId is 'string' and selectorId[0] is "$"
				@updateDependencies selectorId.substr(1)
			else
				@regenerateSelector selectorId