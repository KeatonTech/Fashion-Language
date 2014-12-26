describe "Actualizer", ()->

	# Test the system that intelligently groups CSS properties by mode
	describe "Regrouper", window.fashiontests.actualizer.regrouper

	# Test the conversion of Fashion transitions to CSS3 transitions
	describe "CSS Transitions", window.fashiontests.actualizer.transitions

	# Test the CSS generator
	describe "CSS Generator", window.fashiontests.actualizer.css

	# Test the Javascript generator
	describe "JS Minifier", window.fashiontests.actualizer.minifier

	# Test the Javascript generator
	describe "JS Generator", window.fashiontests.actualizer.js


#@prepros-prepend ./actualizer-header.coffee
#@prepros-prepend ./regrouper.coffee
#@prepros-prepend ./transitions.coffee
#@prepros-prepend ./css.coffee
#@prepros-prepend ./minifier.coffee
#@prepros-prepend ./js.coffee
