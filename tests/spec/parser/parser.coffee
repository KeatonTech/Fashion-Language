describe "Parser", ()->

	# Test the variable parser
	describe "Variables", window.fashiontests.parser.variables


	# Test the nested selector parser
	describe "Selectors", window.fashiontests.parser.selectors


	# Test the nested selector parser
	describe "Properties", window.fashiontests.parser.properties


	# Test the expression parser
	describe "Expressions", window.fashiontests.parser.expressions

#@prepros-prepend ./parser-header.coffee
#@prepros-prepend ./variables.coffee			
#@prepros-prepend ./selectors.coffee
#@prepros-prepend ./properties.coffee
#@prepros-prepend ./expressions.coffee