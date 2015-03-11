$wf.addRuntimeModule "functionWatchers", ["selectors"],

	# Function watchers are a little more complicated than global watchers because they
	# are called with the same arguments as the function itself.
	$startFunctionWatchers: () ->

		# Each binding is currently treated entirely independantly
		for name, fObj of FASHION.modules.functions when fObj.watcher?
			@watchFunctionBinding(fObj, bindIndex) for bindIndex of fObj.dependents


	# Generate callback for a function watcher
	createFunctionWatcherObject: (bindLink) -> 
		runtime = this
		watcher = {invalidated: false}

		watcher.callback = ()-> 
			if !watcher.invalidated then runtime.regenerateBoundSelector bindLink

		watcher.invalidate = ()->
			watcher.invalidated = true
			if watcher.destroy? then watcher.destroy()

		return watcher


	# Handle watcher objects for a specific function binding
	# If there is already a watcher, invalidate it
	watchFunctionBinding: (fObj, bindIndex) ->
		bindObj = fObj.dependents[bindIndex]
		[watcherExpression, bindLink, watcher] = bindObj

		# Invalidate the existing watcher, if necessary
		if watcher? then watcher.invalidate()

		# Create a callback function
		watcher = @createFunctionWatcherObject(bindLink)

		# Evaluate the expression with the callback function
		watcher.destroy = @evaluate watcherExpression, 0, undefined, watcher.callback

		# Save the watcher back to the binding object
		if bindObj.length is 2 then bindObj.push watcher
		else bindObj[2] = watcher