$wf.addRuntimeModule "globals", ["selectors"],

	# For each global, run its watcher function to wait on changes
	# Also set each global's preliminary value
	$startGlobalWatchers: () ->

		# Run when globals change
		onChangeFunction = (global) => @updateGlobal.bind(this, global)

		for name, global of FASHION.modules.globals when global.watch?
			global.watch onChangeFunction global


	# Refresh a global's value by regenerating selectors that rely on it
	updateGlobal: (global) ->
		if !global? or !global.dependents? then return
		@regenerateBoundSelectors global.dependents