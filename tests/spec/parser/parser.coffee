describe "Parser", ()->

	# Test the variable parser
	describe "Variables", window.fashiontests.parser.variables


	# Test the nested selector parser
	describe "Selectors", window.fashiontests.parser.selectors


	# Test combined nested selectors
	describe "CSS Selector Combiner", window.fashiontests.parser.combiner


	# Test the blocks parser
	describe "Blocks", window.fashiontests.parser.blocks


	# Test the nested selector parser
	describe "Properties", window.fashiontests.parser.properties


	# Test the expression parser
	describe "Expressions", window.fashiontests.parser.expressions

#@prepros-prepend ./parser-header.coffee
#@prepros-prepend ./variables.coffee			
#@prepros-prepend ./selectors.coffee
#@prepros-prepend ./properties.coffee
#@prepros-prepend ./expressions.coffee
#@prepros-prepend ./blocks.coffee
#@prepros-prepend ./combiner.coffee