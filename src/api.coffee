# Functions exposed by the Fashion compiler to allow for extension
# Theoretically extensions could also just modify window.fashion
# But please don't, these are nicer and safer and won't change.


# Properties ===============================================================================

window.fashion.addProperty = (name, propertyModule, force = false) ->
	if !(propertyModule instanceof PropertyModule)
		propertyModule = new PropertyModule propertyModule

	if !force and window.fashion.$properties[name]
		return new Error "There is already a property named #{name}"

	window.fashion.$properties[name] = propertyModule

window.fashion.addProperties = (obj, force = false) ->
	window.fashion.addProperty(k,v,force) for k,v in obj


# Functions ================================================================================

window.fashion.addFunction = (name, functionModule, force = false) ->
	if !(functionModule instanceof FunctionModule)
		functionModule = new FunctionModule functionModule

	if !force and window.fashion.$functions[name]
		return new Error "There is already a function named #{name}"

	window.fashion.$functions[name] = functionModule

window.fashion.addFunctions = (obj, force = false) ->
	window.fashion.addFunction(k,v,force) for k,v in obj


# Globals ==================================================================================

window.fashion.addGlobal = (name, globalModule, force = false) ->
	if !(globalModule instanceof GlobalModule)
	 	globalModule = new GlobalModule globalModule

	if !force and window.fashion.$globals[name]
		return new Error "There is already a global named #{name}"

	window.fashion.$globals[name] = globalModule

window.fashion.addGlobals = (obj, force = false) ->
	window.fashion.addGlobal(k,v,force) for k,v in obj

# Blocks ===================================================================================

window.fashion.addBlock = (name, blockModule, force = false) ->
	if !(blockModule instanceof BlockModule)
		blockModule = new BlockModule blockModule

	if !force and window.fashion.$blocks[name]
		return new Error "There is already a block named #{name}"

	window.fashion.$blocks[name] = blockModule

window.fashion.addBlocks = (obj, force = false) ->
	window.fashion.addBlock(k,v,force) for k,v in obj
	