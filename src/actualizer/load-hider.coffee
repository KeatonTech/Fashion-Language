window.fashion.$actualizer.hideIndividualizedSelectors = 
(cssSelectors, scripts, indSels) ->

	# Get all of the selectors that need to be hidden
	hideSelectors = []
	for id,selector of indSels when typeof selector.name is 'string'
		hideSelectors.push selector.rawName 
	if !hideSelectors or hideSelectors.length < 1 then return

	# Combine them into one super massive joined selector
	joinedSelector = hideSelectors.join ","

	# Build a new selector object that hides them
	hideSel = new Selector joinedSelector, $wf.$runtimeMode.static
	hideSel.addProperty new Property "visibility", "hidden"
	cssSelectors["hs"] = hideSel

	###
	# Figure out how many selectors there are so one can be added to the end
	len = $wf.styleHeaderRules
	len++ for key, value of cssSelectors
	###

	# Add a script to remove this super selector at runtime
	scripts.push	"""
					FSREADY(function(){
						ss = document.getElementById(FASHION.config.cssId);
						var len = ss.sheet.reallength || ss.sheet.rules.length;
						if(ss&&ss.sheet)ss.sheet.deleteRule(len - 1);
					});
					"""