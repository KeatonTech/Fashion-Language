$wf.$extend window.fashion.$properties,

	# Set an HTML attribute of the element
	"set-attribute": new PropertyModule
		replace: true
		mode: window.fashion.$runtimeMode.individual
		apply: (element, value, evaluate) ->
			[attribute, value] = evaluate().split(" ")
			attribute = attribute.replace(/[\'\"]/g,"")
			element.setAttribute(attribute, value)


	# Really simple property to render canvas tags
	"canvas-render": new PropertyModule
		replace: true
		mode: window.fashion.$runtimeMode.individual
		apply: (element, value, evaluate) -> 

			`
			//shim layer with setTimeout fallback
			window.requestAnimFrame = (function(){
			  return  window.requestAnimationFrame       ||
			          window.webkitRequestAnimationFrame ||
			          window.mozRequestAnimationFrame    ||
			          function( callback ){
			            window.setTimeout(callback, 1000 / 60);
			          };
			})();
			`

			# Rate limiter, in this case restricts frame rate to 60fps
			rateLimitedEvaluate = () ->
				if !element.getAttribute("last-render-time")
					element.setAttribute("last-render-time", new Date().getTime())
					evaluate()
				else
					lrt = parseInt element.getAttribute("last-render-time")
					if (new Date().getTime()) - lrt > 1000/60 then evaluate()
				
				window.requestAnimFrame rateLimitedEvaluate.bind(this)

			# Run the render function
			rateLimitedEvaluate()


	# Set the text of an element
	"text-content": new PropertyModule
		replace: true
		mode: window.fashion.$runtimeMode.individual
		apply: (element, value, evaluate) ->
			element.innerText = evaluate()
			element.textContent = evaluate()


	# Set the text of an input element
	"value": new PropertyModule
		replace: true
		mode: window.fashion.$runtimeMode.individual
		apply: (element, value, evaluate) ->
			element.value = evaluate()