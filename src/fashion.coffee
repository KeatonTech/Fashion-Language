###

FASHION: Style + Smarts ------------------------------------------------------

Copyright (c) 2014 Keaton Brandt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

------------------------------------------------------------------------------
###

# Get a place to put everything
$wf = window.fashion = {

	# Library metadata
	version: "0.3.1"
	url: "http://writefashion.org"
	author: "Keaton Brandt"

	# Language properties
	mimeType: "text/x-fashion"

	# Generated CSS properties
	cssId: "FASHION-stylesheet"

	# Generated JS properties
	minifiedObject: "FSMIN",
	runtimeObject: "FASHION",

	# Generated JS runtime
	runtimeModules: []
}

# Add settings that will be sent to the runtime
window.fashion.runtimeConfig = 
	variableObject: "style"
	idPrefix: "FS-"
	individualCSSID: "FASHION-individual"
	cssId: window.fashion.cssId

# Coffeescript helpers
wait = (d,f)-> setTimeout(f,d)


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
	