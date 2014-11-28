window.fashion.$functions =

	round:
		output: $wf.$type.Number
		unitFrom: 0
		evaluate: (n) -> Math.round n.value

	min:
		output: $wf.$type.Number
		unitFrom: 0
		evaluate: () ->
			minSoFar = 9007199254740992
			for arg in arguments
				if arg.value < minSoFar then minSoFar = arg.value
			return minSoFar

	max:
		output: $wf.$type.Number
		unitFrom: 0
		evaluate: () ->
			maxSoFar = -9007199254740992
			for arg in arguments
				if arg.value > maxSoFar then maxSoFar = arg.value
			return maxSoFar

#@prepros-append ./triggers.coffee