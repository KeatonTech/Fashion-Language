# <rant>
# A compiler is not a persistant system of interconnected components, it's a flow.
# Therefore, traditional object oriented practices are not appropriate here.
# Instead, each stage of the Fashion pipeline implements its own functionality.
# These classes are just here to provide some syntactic sugar to the process.
# </rant>

# Represents the complete parse tree for a Fashion document
class ParseTree

	# Create an empty parse tree
	constructor: ()->

		# The components that make up a Fashion document
		@variables = {}
		@selectors = []
		@blocks = []
		@scripts = []

		# The components that need to be included in runtime
		@dependencies = 
			blocks: {}
			globals: {}
			functions: {}
			properties: {}

		# Track which properties that rely on different values
		@bindings =
			variables: {}
			globals: {}
			dom: []

	# CREATE

	# Add a variable, includes the name of its selector for non-global ones
	addVariable: (variableObject) ->
		vName = variableObject.name; delete variableObject.name
		selectorScope = variableObject.scope || 0; delete variableObject.scope
		if !vName then throw new Error "Variables must be named"
		if !@variables[vName] then @variables[vName] = {}
		@variables[vName][selectorScope] = variableObject
		@bindings.variables[vName] = []

	# As Fashion becomes more extensible, type checking should be added here.
	# However, for now, that would just slow everything down
	addSelector: (newSelector) -> 
		newSelector.index = @selectors.length
		@selectors.push newSelector

	# Similar sugar methods for blocks and scripts
	addScript: (newScript) -> @scripts.push newScript
	addBlock: (newBlock) -> @blocks.push newBlock

	# Methods to add a dependency to the tree
	addBlockDependency: (name, moduleObject) -> 
		@dependencies.blocks[name] = moduleObject
	addGlobalDependency: (name, moduleObject) -> 
		@dependencies.globals[name] = moduleObject
	addFunctionDependency: (name, moduleObject) -> 
		@dependencies.functions[name] = moduleObject
	addPropertyDependency: (name, moduleObject) -> 
		@dependencies.properties[name] = moduleObject

	# Variable bindings can only happen to variables that already exist
	addVariableBinding: (selectorId, variableName) ->
		if !@bindings.variables[variableName]
			throw new Error "Variable #{variableName} does not exist or cannot be bound."
		@bindings.variables[variableName].push selectorId

	# Global bindings are fairly straightforward
	addGlobalBinding: (selectorId, globalName)->
		if !@bindings.globals[globalName] then @bindings.globals[globalName] = []
		@bindings.globals[globalName].push selectorId

	# Dom bindings are hard to generalize because they can occur relative to a selector
	# Therefore, we're just storing a big list of them
	# The runtime can try and do something a little smarter with this stuff
	addDOMBinding: (selectorId, selector, boundSelector, boundProperty)->
		@bindings.dom.push 
			watch: [boundSelector, boundProperty]
			rel: selector
			bind: selectorId


	# ITERATE

	forEachVariable: (run) ->
		for name, scopes of @variables
			for scope, variable of scopes
				run.call(variable, variable, scope)


# Make sure all of this is neatly accessible from the outside too
window.fashion.$class = {}
window.fashion.$class.ParseTree = ParseTree

#@prepros-append ./variable.coffee
#@prepros-append ./selector.coffee
#@prepros-append ./property.coffee
#@prepros-append ./expression.coffee