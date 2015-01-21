# This class is responsible for printing errors in a useful way. Base class for other errors
class FashionParseError extends Error
	constructor: (source, string, index) ->
		errName = @name || @constructor.name

		# The compiler must have some sense of where this is
		if string?

			# Use the string to get the line number and column
			line = 0
			lastLineChar = 0
			for i,char of string
				if i >= index then break
				if char is "\n"
					line++
					lastLineChar = i
			col = index - lastLineChar

			# Get that line of the string
			lineStr = string.split('\n')[line] || ''

			# Log this thing in our special format
			console.log "FASHION ERROR | #{errName} at #{line}:#{col} of #{source}"
			console.log "       AROUND | '#{lineStr}'"

		# Otherwise, shot in the dark
		else
			console.log "FASHION ERROR | #{errName} in #{source}"

		# Pretty print the message
		msgLines = @message.split("\n") 
		console.log "      MESSAGE | #{msgLines[0]}"
		for id,line of msgLines when id > 0
			console.log "              | #{line}"

		# Blank line at the end
		console.log ""


# STYLESHEET PARSING ERRORS ----------------------------------------------------------------

# Errors coming from the sheet itself. Source maps can be added here later for imports.
class FashionSheetParseError extends FashionParseError
	constructor: (string, index) ->
		super "stylesheet", string, index


# Error caused by a bracket mismatch when parsing a selector body
class FSBracketMismatchError extends FashionSheetParseError
	constructor: (selectorName) ->
		@name = "BracketMismatchError"
		@message = """
			The top-level selector #{selectorName} is never closed.
			Make sure your brackets match.
		"""
		super()


# Error caused by a bracket mismatch when parsing a block body
class FSBlockMismatchError extends FashionSheetParseError
	constructor: (blockName) ->
		@name = "BlockBracketMismatchError"
		@message = """
			A block of type @#{blockName} is never closed.
			Make sure your brackets match.
		"""
		super()


# Error caused by a top-level variable being set to an individualized expression
class FSIndividualVarError extends FashionSheetParseError
	constructor: (varName, expString) ->
		@name = "IndividualVarError"
		@message = """
			Variable $#{varName} cannot rely on individual properties like @self
			Expression: '#{expString}'
		"""
		super()


# Error caused by a variable being set to a comma separated value
class FSMultipartVariableError extends FashionSheetParseError
	constructor: (varName, valString) ->
		@name = "MultipartVariableError"
		@message = """
			Variable $#{varName} cannot be set to multiple values
			Value: '#{valString}'
			Malformed expressions may sometimes be read as 2 separate expressions
			For example '300px -100px' would be 2 expressions, not 1 evaluating to 200px
		"""
		super()


# Error caused by a variable being flagged as important
class FSImportantVarError extends FashionSheetParseError
	constructor: (varName) ->
		@name = "ImportantVarError"
		@message = "Variable $#{varName} cannot be flagged as important"
		super()


# Error caused by an overly complicated breakout prefix ('^')
class FSSelectorCombinationError extends FashionSheetParseError
	constructor: (outer, inner) ->
		@name = "SelectorCombinationError"
		@message = """
			Could not combine '#{outer}' with '#{inner}'.
			Please simplify the selectors to include fewer components (shallower nesting)
		"""
		super()


# Error caused by the top-level section regex failing to find a match
class FSUnknownParseError extends FashionSheetParseError
	constructor: (string, index) ->
		@name = "UnknownParseError"
		@message = """
			Regex failed to execute on the stylesheet.
		"""
		super(string, index)


# EXPRESSION PARSING ERRORS ----------------------------------------------------------------

# Errors coming from an expression
class FashionExpressionParseError extends FashionParseError
	constructor: (string, index) ->
		super "expression", string, index


# Error caused by parenthesis having mismatched parenthesis
class FSEParenthesisMismatchError extends FashionExpressionParseError
	constructor: (string, index) ->
		@name = "ParenthesisMismatchError"
		@message = """
			Could not match parenthesis in expression.
		"""
		super(string, index)


# Error caused when a user tries to reference a variable that doesn't exist
class FSENonexistentVariableError extends FashionExpressionParseError
	constructor: (varName, scope) ->
		@name = "NonexistentVariableError"
		@message = """
			Variable $#{varName} does not exist in this scope
			Scope: '#{scope}'
		"""
		super()


# Error caused a user references a variable that exists in other scopes but not this one
class FSEVariableScopeError extends FashionExpressionParseError
	constructor: (varName) ->
		@name = "VariableScopeError"
		@message = """
			Variable $#{varName} isn't in this scope and doesn't have a top-level value.
		"""
		super()


# Error caused when a user tries to reference a global that doesn't exist
class FSENonexistentGlobalError extends FashionExpressionParseError
	constructor: (globalName) ->
		@name = "NonexistentGlobalError"
		@message = "Global @#{globalName} could not be found"
		super()


# Error caused when a user tries to reference a function that doesn't exist
class FSENonexistentFunctionError extends FashionExpressionParseError
	constructor: (funcName) ->
		@name = "NonexistentFunctionError"
		@message = "Function module #{funcName}() could not be found"
		super()


# Error caused when a ternary operation can return multiple different types
class FSETernaryTypeError extends FashionExpressionParseError
	constructor: (onExp, offExp) ->
		@name = "TernaryTypeError"
		@message = """
			Ternary expressions must return the same type in all instances
			Must match: '#{onExp}' & '#{offExp}'
		"""
		super()


# Error caused when a ternary operation can return multiple different units
class FSETernaryUnitError extends FashionExpressionParseError
	constructor: (onExp, offExp) ->
		@name = "TernaryUnitError"
		@message = """
			Ternary expressions must return the same unit in all instances
			Must match: '#{onExp}' & '#{offExp}'
		"""
		super()


# Error caused when Fashion can't determine the return type of an expression
class FSEMixedTypeError extends FashionExpressionParseError
	constructor: (string, index) ->
		@name = "MixedTypeError"
		@message = """
			Mixed types found in expression.
		"""
		super(string, index)