# Wait for a change in the style object
window.fashion.$run.defineProperties = 
   (variables = FASHION.variables, objectName = FASHION.config.variableObject)->

   	# Where to put all of these variables
   	container = undefined
   	if objectName
   		container = window[objectName] = {}
   	else 
   		container = window

   	# Add each variable as a property
   	for varName, varObj of variables

   		# Make the property object
   		propObject = 
   			get: ((varObj)-> ()-> varObj.value)(varObj)
   			set: ((varName, varObj)=> (newValue)=> 
   				@updateVariable varName, newValue
   			)(varName, varObj)

   		# Add it as a property to the container
   		Object.defineProperty container, varName, propObject
   		Object.defineProperty container, "$" + varName, propObject