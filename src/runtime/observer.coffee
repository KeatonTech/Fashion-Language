window.fashion.$run.watchVariables = (variableObject = window[FASHION.config.variableObject])->

	# Some changes will need to be specifically ignored to prevent loops
	ignore = []

	# TODO(keatontech): Cross-browser support
	Object.observe variableObject, (changes) =>
		for change in changes

			# Check to see if this should be ignored
			if change.name in ignore
				ignore.splice ignore.indexOf(change.name), 1
				continue

			# Existing variable value changed
			if change.type is "update"
				variable = change.name
				newValue = change.object[variable]

				# syncTo makes sure that if the user changes '$var', 
				# 'var' will also change, and vice versa
				syncTo = "$" + variable
				if variable[0] is "$"
					variable = variable.substr(1)
					syncTo = variable

				# Sync back, taking care not to cause an infinite loop	
				ignore.push syncTo		
				variableObject[syncTo] = newValue

				# Update the value of this variable inside FASHION
				@updateVariable variable, newValue
				continue