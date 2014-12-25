window.fashion.$functions =

	random: new FunctionModule
		output: $wf.$type.Number
		evaluate: () -> Math.random()

	round: new FunctionModule
		output: $wf.$type.Number
		unitFrom: 0
		evaluate: (n) -> Math.round n.value

	min: new FunctionModule
		output: $wf.$type.Number
		unitFrom: 0
		evaluate: () ->
			minSoFar = 9007199254740992
			for arg in arguments
				if arg.value < minSoFar then minSoFar = arg.value
			return minSoFar

	max: new FunctionModule
		output: $wf.$type.Number
		unitFrom: 0
		evaluate: () ->
			maxSoFar = -9007199254740992
			for arg in arguments
				if arg.value > maxSoFar then maxSoFar = arg.value
			return maxSoFar

	toggle: new FunctionModule
		output: $wf.$type.Number
		unitFrom: 0
		evaluate: (currentVar, offValue, onValue) ->
			if currentVar.value is offValue.value
				return onValue.value
			else return offValue.value

#@prepros-append ./binding.coffee
#@prepros-append ./color.coffee