# Represents a module that extends Fashion functionality
# There are 4 types of modules but they all inherit from this.
class Module
	constructor: (args) -> 
		@mode = args.mode || args.runtimeMode || $wf.$runtimeMode.static

		# Any runtime modules needed for this module
		# These are things like "watchSelector" and "liveProperties",
		# functionality built into Fashion that is often disabled for efficiency
		@requires = args.requires || args.capabilities

		# Add a watcher function, if possible
		if args.watcherFunction 
			if !(@mode | $wf.$runtimeMode.dynamic) || (@mode | $wf.$runtimeMode.live)
				console.log "[FASHION] Static/live modules cannot have watcher functions."

			else @watch = args.watcherFunction # (onchange) -> wait(100, onchange)


# Adds a new module that returns a value (globals and functions)
class ReturnValueModule extends Module
	constructor: (args) ->

		# A promise that this module will return the specified data type
		@type = args.type || args.output || args.outputType || $wf.$type.String

		# A promise that this module will return the specified unit, if data type is Number
		@unit = args.unit || ''

		# A function that retrieves the value of the object.
		# Any arguments passed to the module will be passed to this.
		@get = args.get || args.evaluate # ()-> return window.innerWidth

		# These can be dynamically recomputed based on a runtime mode
		super args

# Adds a new global variable to Fashion.
class GlobalModule extends ReturnValueModule
	constructor: (args) -> 

		# Function that runs a callback when the value changes
		@watch = args.watch

		# Default to global dynamic mode
		if !args.mode then args.mode = $wf.$runtimeMode.globalDynamic

		super args

# Adds a new function that can be called from Fashion expressions
class FunctionModule extends ReturnValueModule
	constructor: (args) ->

		# Specify that the function returns a value in whatever unit a passed argument is in
		# For example, round(3px) would return a px value if unitFrom was set to 0.
		# This property overrides the @unit property
		if args.unitFrom isnt undefined
			@unitFrom = args.unitFrom
			delete args.unit

		# Functions can be dynamically recomputed based on a runtime mode
		super args


# Adds a new block (things like @client and @keyframes) to Fashion
class BlockModule extends Module
	constructor: (args) ->

		# Occurs during the compile process
		# This function is run on a this scope with the following properties
		# These properties are also passed in a third argument, for the 'this'-averse
		# {
		# 		addSheet(): Creates a new CSS stylesheet and returns a reference to it
		#		addRule(sheet, selector, rule): Adds a CSS rule to the stylesheet
		#		getProperty(selector, name): Gets the value of a property in any sheet
		#		addScript(javascript): Injects javascript into the compiled results
		# }
		# Returns an error if the block could not be added
		if typeof args is 'function' then @compile = args
		else 
			@compile = args.compileFunction || args.compile # (args, body, self) ->

			# Adds an object to the compiled Javascript
			# This object will be made available as w.FASHION.blocks.[name of block]
			@runtimeObject = args.runtimeObject || args.runtime

			# For adding things to the runtime
			@requires = args.requires || args.capabilities


# Adds a new CSS property to Fashion
class PropertyModule extends Module
	constructor: (args) ->

		# Occurs during the compile process
		# This function is run on a 'this' scope with the following properties
		# These properties are also passed in a second argument, for the 'this'-averse
		# {
		# 		setProperty(name, value): Sets a property while respecting inheritance
		#		getProperty(name): Gets the value of another property in the selector
		#		getType(value): Returns the data type of a value, in terms of FASHION.type
		#		getUnit(value): Returns the unit of a numerical value
		#		addScript(javascript): Injects javascript into the compiled results
		#		getSelector(): Returns the name of the current selector
		# }
		# Returns an error if the property could not be added
		if typeof args is 'function' then @compile = args
		else
			@compile = args.compileFunction || args.compile # (value, self) ->

			# Occurs during runtime for each matched element
			# evaluateExpression() is passed if value is an expression
			# It is pre-bound so it takes no arguments
			# Adding this property implies that the property needs to run in individual mode
			@apply = args.applyFunction || args.apply # (element, value, evaluateExpr) ->
			if @apply then args.mode |= $wf.$runtimeMode.individual

			# True if the property should be entirely removed from the original CSS
			@replace = args.replace || false

			# Optionally add functions to the compiled fashion runtime
			# Put whatever you want in here
			@runtimeObject = args.runtimeObject || args.runtime

			# Property mode
			@mode = args.mode || 0

			# For adding things to the runtime
			@requires = args.requires || args.capabilities

# Make these accessible from the outside
if !window.fashion.$class then window.fashion.$class = {}
window.fashion.$class.GlobalModule = GlobalModule
window.fashion.$class.FunctionModule = FunctionModule
window.fashion.$class.BlockModule = BlockModule
window.fashion.$class.PropertyModule = PropertyModule
