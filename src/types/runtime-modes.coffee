###
4-bit Mode -----------------------------------------------------------------------
	0001 (Bit 0): Can change, needs to be included in the JS
	0010 (Bit 1): Can rely on non-top-level variables
	0100 (Bit 2): Can rely on relative styles & attributes
	1000 (Bit 3): Needs to be continuously recomputed
----------------------------------------------------------------------------------
###

# Javascript enum of runtime modes
window.fashion.$runtimeMode =

	# Static properties cannot change at runtime, and are not included in the JS.
	# Expressions can generate static properties if they do not involve variables.
	# Modules used in static expressions will not be included in the JS.
	static: 0 		# 0000

	# Dynamic properties rely on top-level variables, globals, or DOM bindings.
	# They can change at runtime, but only when a value it depends on changes.
	# Dynamic properties are completely blind to the HTML of the page.
	dynamic: 1 		# 0001

	# Scoped properties rely on non-top-level variables.
	# These are effectively individual properties, but with some optimizations
	# because scoped properties cannot access relative attributes like @self.
	scoped: 3		# 0011

	# Individual properties rely on attributes of the element they are applied to.
	# As such, they must be recomputed for each element that matches the selector.
	# Like dynamic properties, they will only change when a dependency changes.
	individual: 7	# 0111

	# Live properties are continuously recomputed on an interval, to allow for
	# evolving data to be represented in CSS. They are essentially just dynamic
	# properties without the optimizations that keep them from being recomputed.
	live: 9			# 1001

	# These can be combined, for example a property that is continuously
	# recomputed based on a non-top-level variable may be 'live | scoped'.
	# Using boolean algebra that would result in 11, or 1011
	
	# Or, for the math-challenged, here's a function to make one for you.
	generate: (dynamic, individualized, live, scoped) ->
		(if dynamic then 1 else 0)|
		(if individualized then 7 else 0)|
		(if live then 9 else 0)|
		(if scoped then 3 else 0)