# Combine two selectors
window.fashion.$shared.combineSelectors = (outer, inner, cap = 10) ->


	# Removes any selector component that comes before an ID
	trimBeforeId = (selectorComponents) ->
		if selectorComponents.length is 0 then return selectorComponents
		
		for i in [selectorComponents.length-1 .. 0]

			# This won't catch components like .class#id
			# But of course that's a really dumb selector to write, so whatever
			if selectorComponents[i][0][0] is "#"
				return selectorComponents.slice i

		return selectorComponents


	# Recursive function to generate all interleaves of the components
	recursiveInterleave = (oc, ic) ->

		# Base conditions
		if !oc? or oc.length is 0 then return [ic]
		if !ic? or ic.length is 0 then return [oc]

		results = []
		for i in [0..oc.length]
			left = oc.slice 0, i
			right = oc.slice i

			# Recurse
			for selFoot in recursiveInterleave(right, ic.slice(1))

				# Different levels
				results.push $wf.$buildArray(left, [ic[0]], selFoot)

				# Same level
				if selFoot[0] and ic[0] 

					# Prevent combining two selectors from the same original
					if selFoot[0][1] is ic[0][1] then continue

					# Prevent combining an already combined selector
					if selFoot[0][1] is 2 or ic[0][1] is 2 then continue

					# First string components of each
					fi = ic[0][0]
					fs = selFoot[0][0]

					# Combine 2 components to be on the same level
					if (fi[0] is "#" and fs[0] isnt "#") or fi[0] is "." 
						selFoot[0] = [fs + fi, 2]
						results.push $wf.$buildArray(left, selFoot)

					else if (fs[0] is "#" and fi[0] isnt "#") or fs[0] is "."
						selFoot[0] = [fi + fs, 2]
						results.push $wf.$buildArray(left, selFoot)

		return results


	# Split the selectors into 2D arrays
	ocomp = ([x,0] for x in c.trim().split(" ") for c in outer.split(","))
	icomp = ([x,1] for x in c.trim().split(" ") for c in inner.split(","))
	selectors = []

	# Comma-separated components must be treated entirely independently
	for oc in ocomp 
		for ic in icomp

			# Anything before an ID doesn't matter
			# (or, shouldn't matter, we won't let bad programmers prevent optimization)
			oc = trimBeforeId oc
			ic = trimBeforeId ic

			# Add the last component back in
			interSels = recursiveInterleave(oc, ic)

			# Go through each one
			for s in interSels

				# Filter out any where the last inner component does not show up last
				if s[s.length - 1][1] is 0 then continue

				# Convert the selector object into a string
				acc = ""
				for i, o of s
					if i > 0 then acc += " "
					acc += o[0]

				# Add this selector to the list
				selectors.push acc

	return selectors.join ","

