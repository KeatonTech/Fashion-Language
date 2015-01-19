# For scoped properties, we need to know if an element has a parent that matches a selector
# We could go through each element and check, but that takes JS and JS is evil.
# Instead, we generate a CSS selector that finds elements matching inner that have a parent
# matching outer, or that themselves match outer.
# This function may sometimes generate too much CSS to be actually practical, in which case
# the system will revert to using the previously mentioned Javascript method.

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

				# If one of the levels doesn't exist, we can't do any more
				if !selFoot[0] or !ic[0] then continue

				# Prevent combining two components from the same original
				if selFoot[0][1] is ic[0][1] then continue

				# If the components are the same, we have an easier job
				if selFoot[0][0] is ic[0][0]
					selFoot[0][1] = 2
					results.push $wf.$buildArray(left, selFoot)

				# Prevent combining an already combined component
				if selFoot[0][1] is 2 or ic[0][1] is 2 then continue

				fi = ic[0][0]
				fs = selFoot[0][0]

				# Combine 2 components to be on the same level
				if (fi[0] is "#" and fs[0] isnt "#") or fi[0] is "." or fi[0] is "["
					selFoot[0] = [fs + fi, 2]
					results.push $wf.$buildArray(left, selFoot)

				else if (fs[0] is "#" and fi[0] isnt "#") or fs[0] is "." or fs[0] is "["
					selFoot[0] = [fi + fs, 2]
					results.push $wf.$buildArray(left, selFoot)

		return results


	# Similar to join but works on the component array
	componentArrayJoin = (arr) ->
		acc = ""
		for i, o of arr
			if i > 0 then acc += " "
			acc += o[0]
		return acc

	# Split the selectors into 2D arrays
	ocomp = ([x,0] for x in c.trim().split(" ") for c in outer.split(","))
	icomp = ([x,1] for x in c.trim().split(" ") for c in inner.split(","))
	selectors = []

	# Comma-separated components must be treated entirely independently
	for oc in ocomp 
		for ic in icomp

			# Remove any prefix that occurs in both strings
			didSlice = false
			for i in [0...Math.min(oc.length, ic.length)]
				if oc[i][0] isnt ic[i][0]
					prefix = oc.slice 0, i
					oc = oc.slice i
					ic = ic.slice i
					didSlice = true
					break

			# If the prefix finder didn't find any different, we have a simple parent/child
			if !didSlice
				selectors.push componentArrayJoin ic
				continue

			# Anything before an ID doesn't matter
			# (or, shouldn't matter, we won't let bad programmers prevent optimization)
			oc = trimBeforeId oc
			ic = trimBeforeId ic

			# Protect against overly complex situations that may result in a crash
			if oc.length * ic.length > cap then return false

			# Add the last component back in
			interSels = recursiveInterleave(oc, ic)

			# Go through each one
			for s in interSels

				# Filter out any where the last inner component does not show up last
				if s[s.length - 1][1] is 0 then continue

				# Convert the selector object into a string
				acc = componentArrayJoin $wf.$buildArray prefix, s

				# Make sure there are no duplicates
				hasDuplicate = false
				for existingSel in selectors
					if acc is existingSel
						hasDuplicate = true
						break
				if hasDuplicate then continue

				# Add this selector to the list
				selectors.push acc

	return selectors.join ","

