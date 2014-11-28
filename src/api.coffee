# Functions exposed by the Fashion compiler to allow for extension
# Theoretically extensions could also just modify window.fashion
# But please don't, these are nicer and safer and won't change.


# Properties ===============================================================================

window.fashion.addProperty = (name, propertyObject, force = false) ->

	if !globalObject.compile and !globalObject.apply 
		return new Error "Property objects must have either a 'compile' or 'apply' function"

	if !force and window.fashion.$properties[name]
		return new Error "There is already a property named #{name}"

	window.fashion.$properties[name] = globalObject

window.fashion.addProperties = (obj, force = false) ->
	window.fashion.addProperty(k,v,force) for k,v in obj


# Functions ================================================================================

window.fashion.addFunction = (name, functionObject, force = false) ->

	if !functionObject.output or !functionObject.evaluate
		return new Error "Function objects must have 'output' and 'evaluate' properties"

	if !force and window.fashion.$functions[name]
		return new Error "There is already a function named #{name}"

	window.fashion.$functions[name] = functionObject

window.fashion.addFunctions = (obj, force = false) ->
	window.fashion.addFunction(k,v,force) for k,v in obj


# Globals ==================================================================================

window.fashion.addGlobal = (name, globalObject, force = false) ->

	if !globalObject.type or !globalObject.unit
		return new Error "Global objects must specify type and unit properties"
	if !globalObject.get
		return new Error "Global objects must have a 'get' function"
	if !globalObject.watch
		return new Error "Global objects must have a 'watch' function"

	if !force and window.fashion.$globals[name]
		return new Error "There is already a global named #{name}"

	window.fashion.$globals[name] = globalObject

window.fashion.addGlobals = (obj, force = false) ->
	window.fashion.addGlobal(k,v,force) for k,v in obj

