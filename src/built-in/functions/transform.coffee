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
					s += a[i].value;
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
