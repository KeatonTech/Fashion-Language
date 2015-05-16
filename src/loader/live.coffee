# Loads in Fashion code from <style> tags, <link> tags or direct command
window.fashion.$loader = 

	# Loads every fashion tag on the page and puts them in a single string for parsing
	loadStyles: (scriptsCallback) ->
		count = $wf.$loader.countScripts()
		loaded = 0
		acc = ""
		$wf.$loader.loadIndividualStyles (individualScript) ->
			acc += individualScript
			if ++loaded is count then scriptsCallback acc


	# Loads all styles
	loadIndividualStyles: (scriptCallback) ->

		# <style> tags, included on the page
		window.fashion.$loader.loadStyleTags(scriptCallback)


	# Loads fashion code from <style> tags, return a count of files
	loadStyleTags: (scriptCallback) ->
		styleTags = document.getElementsByTagName "style"
		for i in [0...styleTags.length]

			# Make sure the script is the write type
			tagType = styleTags[i].getAttribute("type")
			if tagType isnt window.fashion.mimeType then continue

			# Script is included on the page, no loading necessary
			if styleTags[i].textContent isnt ""
				scriptCallback styleTags[i].textContent

			# Script is hosted externally
			else if styleTags[i].getAttribute("src") isnt ""
				url = styleTags[i].getAttribute("src")
				$wf.$loader.loadExternalScript url, scriptCallback


	# Count the number of scripts to be loaded
	countScripts: ()->
		fileCount = 0

		# Count style tags
		styleTags = document.getElementsByTagName "style"
		for i in [0...styleTags.length]
			tagType = styleTags[i].getAttribute("type")
			if tagType isnt window.fashion.mimeType then continue
			fileCount++

		# Count link tags
		linkTags = document.getElementsByTagName "link"
		for i in [0...linkTags.length]
			tagType = linkTags[i].getAttribute("type")
			if tagType isnt window.fashion.mimeType then continue
			fileCount++

		return fileCount


	# Load the text of a script from an external source using AJAX
	loadExternalScript: (url, callback) ->
		req = new XMLHttpRequest()
		req.onreadystatechange = ()->
			if req.readyState is 4 
				if req.status is 200
					callback req.responseText
				else if req.status > 400
					console.log "[FASHION] Could not load script: #{url} (#{req.status})"

		req.open("GET", url, true);
		req.send();
