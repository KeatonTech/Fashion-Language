$wf.$extend window.fashion.$functions, 
	
	# Do these seem stupid to you?
	# Well, okay, fine, they kind of are.
	# But it simplifies the expression parser code.
	# They do also prevent floats from screwing up the format.

	"rgb": new FunctionModule
		output: $wf.$type.Color
		evaluate: (r,g,b) -> 
			"rgb(#{parseInt r.value},#{parseInt g.value},#{parseInt b.value})"

	"rgba": new FunctionModule
		output: $wf.$type.Color
		evaluate: (r,g,b,a) -> 
			"rgba(#{parseInt r.value},#{parseInt g.value},#{parseInt b.value},#{a.value})"