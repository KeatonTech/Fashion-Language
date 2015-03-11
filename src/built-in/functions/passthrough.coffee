# These are designed to allow CSS functions to 'pass through' the Fashion compiler,
# even when some of the arguments are variables that will need to be parsed out.

$wf.$extend window.fashion.$functions, new class then constructor: ->

	# Transform functions and their argument counts
	transformFunction = [
		"matrix", "matrix3d",
		"translate", "translate3d", "translateX", "translateY", "translateZ",
		"scale", "scale3d", "scaleX", "scaleY", "scaleZ",
		"rotate", "rotate3d", "rotateX", "rotateY", "rotateZ",
		"skew", "skewX", "skewY",
		"perspective"
	]

	genericPassthrough = (name)-> 
		body = 	"""
				var a = arguments;
				var s = "#{name}(";
				for(var i = 0; i < a.length; i++){
					s += a[i].value + "px";
					if(i<a.length-1)s += ",";
				}
				return s + ")";
				"""
		return new Function body

	for name in transformFunction
		@[name] = new FunctionModule
			mode: $wf.$runtimeMode.static
			output: $wf.$type.String
			"evaluate": genericPassthrough(name)


$wf.$extend window.fashion.$functions, new class then constructor: ->

	# Transform functions and their argument counts
	gradientFunctions = [
		"-webkit-linear-gradient", "-moz-linear-gradient", "-ms-linear-gradient",
		"-o-linear-gradient", "linear-gradient",
		"-webkit-radial-gradient", "-moz-radial-gradient", "-ms-radial-gradient",
		"-o-radial-gradient", "radial-gradient"
	]

	genericPassthrough = (name)-> 
		body = 	"""
				var a = arguments;
				var s = "#{name}(";
				for(var i = 0; i < a.length; i++){
					s += a[i].value;
					if(i<a.length-1)s += ",";
				}
				return s + ")";
				"""
		return new Function body

	for name in gradientFunctions
		@[name] = new FunctionModule
			mode: $wf.$runtimeMode.static
			output: $wf.$type.String
			"evaluate": genericPassthrough(name)
