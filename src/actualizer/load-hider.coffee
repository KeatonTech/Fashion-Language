window.fashion.$actualizer.hideIndividualizedSelectors = 
(cssSelectors, scripts, indSels) ->

	removeSelectors = []
	for selector in indSels
		hideSel = new Selector selector.name, $wf.$runtimeMode.static
		hideSel.addProperty new Property "visibility", "hidden"
		removeSelectors.push cssSelectors.length
		cssSelectors.push hideSel

	onLoadScript = 	"""FSREADY(function(){
					ss = document.getElementById(FASHION.config.cssId);
					rm = function(id){if(ss&&ss.sheet)ss.sheet.deleteRule(id);};
					"""
	for id in removeSelectors.reverse()
		onLoadScript += "rm(#{id});"

	scripts.push onLoadScript + "})"