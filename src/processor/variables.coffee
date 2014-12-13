# Convert a raw variable object into one with a little more info
window.fashion.$processor.addTypeInformation = (variableObject) ->

	# Make sure the variable has a value
	val = variableObject.raw || variableObject.value
	if !val then return {}

	# Add a type
	type = window.fashion.$run.determineType(val, $wf.$type, $wf.$typeConstants)

	# Add units, if necessary
	unittedValue = window.fashion.$run.getUnit(val, type, $wf.$type, $wf.$unit)
	typedValue = unittedValue['value']
	unit = unittedValue['unit']

	# Update the variable object
	variableObject.annotateWithType type, unit, typedValue