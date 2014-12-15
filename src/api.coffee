# Functions exposed by the Fashion compiler to allow for extension
# Theoretically extensions could also just modify window.fashion
# But please don't, these are nicer and safer and won't change.


# Properties ===============================================================================

window.fashion.addProperty = (name, propertyModule, force = false) ->

	if !(propertyModule instanceof PropertyModule)
		return new Error "#{name} must be passed as a PropertyModule instance"

	if !force and window.fashion.$properties[name]
		return new Error "There is already a property named #{name}"

	window.fashion.$properties[name] = propertyModule

window.fashion.addProperties = (obj, force = false) ->
	window.fashion.addProperty(k,v,force) for k,v in obj


# Functions ================================================================================

window.fashion.addFunction = (name, functionModule, force = false) ->

	if !(functionModule instanceof FunctionModule)
		return new Error "#{name} must be passed as a FunctionModule instance"

	if !force and window.fashion.$functions[name]
		return new Error "There is already a function named #{name}"

	window.fashion.$functions[name] = functionModule

window.fashion.addFunctions = (obj, force = false) ->
	window.fashion.addFunction(k,v,force) for k,v in obj


# Globals ==================================================================================

window.fashion.addGlobal = (name, globalModule, force = false) ->

	if !(globalModule instanceof GlobalModule)
		return new Error "#{name} must be passed as a GlobalModule instance"

	if !force and window.fashion.$globals[name]
		return new Error "There is already a global named #{name}"

	window.fashion.$globals[name] = globalModule

window.fashion.addGlobals = (obj, force = false) ->
	window.fashion.addGlobal(k,v,force) for k,v in obj

