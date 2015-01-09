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
		if !global? or !global.dependents? then return

		# Update all of the dependents
		for bindLink in global.dependents

			# If the dependency is a variable, go through and update all its stuff
			if bindLink[0] is "v"
				@updateDependencies bindLink[1]

			# Bound to a specific property that we can just update
			else if bindLink.length is 3
				@setPropertyOnSelector bindLink[0], bindLink[1], bindLink[2]

			# Bound to an entire selector that will need to be regenerated
			else
				@regenerateSelector bindLink[0], bindLink[1]
