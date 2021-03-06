describe "Actualizer", ()->

	# Test the conversion of Fashion transitions to CSS3 transitions
	describe "CSS Transitions", window.fashiontests.actualizer.transitions

	# Test the CSS generator
	describe "CSS Generator", window.fashiontests.actualizer.css

	# Test the Javascript generator
	describe "Components", window.fashiontests.actualizer.components

	# Test the Javascript generator
	describe "JS Minifier", window.fashiontests.actualizer.minifier

	# Test the Javascript generator
	describe "JS Generator", window.fashiontests.actualizer.js


#@prepros-prepend ./actualizer-header.coffee
#@prepros-prepend ./transitions.coffee
#@prepros-prepend ./components.coffee
#@prepros-prepend ./css.coffee
#@prepros-prepend ./minifier.coffee
#@prepros-prepend ./js.coffee
