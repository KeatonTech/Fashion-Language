window.fashion.$actualizer.hideIndividualizedSelectors = 
(cssSelectors, scripts, indSels) ->

	# Get all of the selectors that need to be hidden
	hideSelectors = (selector.name for id,selector of indSels)
	if !hideSelectors or hideSelectors.length < 1 then return

	# Combine them into one super massive joined selector
	joinedSelector = hideSelectors.join ","

	# Build a new selector object that hides them
	hideSel = new Selector joinedSelector, $wf.$runtimeMode.static
	hideSel.addProperty new Property "visibility", "hidden"
	cssSelectors["hs"] = hideSel

	# Figure out how many selectors there are so one can be added to the end
	len = 0
	len++ for key, value in cssSelectors

	# Add a script to remove this super selector at runtime
	scripts.push	"""
					FSREADY(function(){
						ss = document.getElementById(FASHION.config.cssId);
						if(ss&&ss.sheet)ss.sheet.deleteRule(#{len - 1});
					});
					"""