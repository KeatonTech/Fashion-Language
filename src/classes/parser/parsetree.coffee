# <rant>
# A compiler is not a persistant system of interconnected components, it's a flow.
# Therefore, traditional object oriented practices are not appropriate here.
# Instead, each stage of the Fashion pipeline implements its own functionality.
# These classes are just here to provide some syntactic sugar to the process.
# </rant>

# Represents the complete parse tree for a Fashion document
class ParseTree

	# Create an empty parse tree
	constructor: (extendsTree)->

		# The components that make up a Fashion document
		@variables = {}
		@selectors = []
		@blocks = []
		@scripts = []
		@requires = []

		# The components that need to be included in runtime
		@dependencies = 
			blocks: {}
			globals: {}
			functions: {}
			properties: {}

		# Extending
		if extendsTree then @variables[k] = v for k,v of extendsTree.variables
			

	# CREATE

	# Add a variable, includes the name of its selector for non-global ones
	addVariable: (variableObject) ->
		vName = variableObject.name; delete variableObject.name
		selectorScope = variableObject.scope || 0; delete variableObject.scope
		if !vName then throw new Error "Variables must be named"
		if !@variables[vName] then @variables[vName] = {}
		@variables[vName][selectorScope] = variableObject

	# As Fashion becomes more extensible, type checking should be added here.
	# However, for now, that would just slow everything down
	addSelector: (newSelector) -> 
		newSelector.index = @selectors.length
		@selectors.push newSelector

	# Add runtime modules requirements
	addRequirements: (newRequirements) -> 
		if !newRequirements then return
		for req in newRequirements when req? and req not in @requires
			@requires.push req

	# Similar sugar methods for blocks and scripts
	addScript: (newScript) -> @scripts.push newScript
	addBlock: (newBlock) -> @blocks.push newBlock

	# Methods to add a dependency to the tree
	addBlockDependency: (name, moduleObject) -> 
		if !moduleObject then return
		@dependencies.blocks[name] = moduleObject
		@addRequirements moduleObject.requires

	addGlobalDependency: (name, moduleObject) -> 
		if !moduleObject then return
		@dependencies.globals[name] = moduleObject
		@addRequirements moduleObject.requires

	addFunctionDependency: (name, moduleObject) -> 
		if !moduleObject then return
		@dependencies.functions[name] = moduleObject
		@addRequirements moduleObject.requires

	addPropertyDependency: (name, moduleObject) -> 
		if !moduleObject then return
		@dependencies.properties[name] = moduleObject
		@addRequirements moduleObject.requires


	# ITERATE

	forEachVariable: (run) ->
		for name, scopes of @variables
			for scope, variable of scopes
				if run.call(variable, variable, scope) is false then return

	forEachMatchingSelector: (selectorString, run) ->
		for selector in @selectors
			if selector.name is selectorString
				if run.call(this, selector) is false then return


# Make sure all of this is neatly accessible from the outside too
if !window.fashion.$class then window.fashion.$class = {}
window.fashion.$class.ParseTree = ParseTree

#@prepros-append ./variable.coffee
#@prepros-append ./selector.coffee
#@prepros-append ./property.coffee
#@prepros-append ./expression.coffee