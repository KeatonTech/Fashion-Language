# Loads in Fashion code from <style> tags, <link> tags or direct command
window.fashion.$loader = 

	# Loads fashion code from <style> tags
	loadStyleTags: (scriptCallback) ->
		scriptTags = document.getElementsByTagName "style"
		for i in [0...scriptTags.length]

			# Make sure the script is the write type
			tagType = scriptTags[i].getAttribute("type")
			if tagType isnt window.fashion.mimeType then continue

			# Script is included on the page, no loading necessary
			if scriptTags[i].textContent isnt ""
				scriptCallback scriptTags[i].textContent


	# Loads in Fashion code from <style> tags and <link> tags
	loadScriptsFromTags: (scriptCallback) ->

		# Run everything we need
		window.fashion.$loader.loadStyleTags(scriptCallback)