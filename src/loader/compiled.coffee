path = require 'path'

window.fashion.$loader = 

	# Any scripts that are found to be the fashion compiler are thrown out
	# Wow, this is a horrifying hack. The ramifications...
	# Well I really can't think of a better way so it is what it is.
	fashionIdentifier: "/*\nFASHION: Style + Smarts -"

	# Get all FSS code from the HTML and return it as a single string
	extractFromHTML: (html, htmlPath, fssCallback)->
		fss = js = undefined

		# Style tags can only happen in the header
		head = html.match(/<head>([\s\S]*?)<\/head>/i)[1]

		# HTML with all of the tags stripped, for later use
		stripped = html.replace $wf.$loader.styleRegex(), ""
		stripped = stripped.replace $wf.$loader.scriptRegex(), ""

		# Load all the fss files
		$wf.$loader.extractStyles head, htmlPath, (allFashion) ->
			fss = allFashion
			if js? then fssCallback {fss, js, strippedHTML: stripped}

		# Load all the javascript files
		$wf.$loader.extractScripts html, htmlPath, (allJS) ->
			js = allJS
			if fss? then fssCallback {fss, js, strippedHTML: stripped}


	# Regex to extract style tags
	# They said you would have to be a fool to parse HTML with Regex
	# Here I go, proving them right
	styleRegex: ()->
		///
		<style.*?type\s?=\s?"text/x-fashion"[^>]*>([\s\S]*?)<\/style>|
		<link.*?type\s?=\s?"text/x-fashion"[^>]*\/?>(<\/link>)?
		///g


	# Get all of the style tags that match what we're looking for
	extractStyles: (head, htmlPath, fssCallback) ->

		# Keep track of what we're loading
		unresolved = 0
		styles = []

		# Runs whenever a file finishes loading
		resolvePromise = (path, styleIndex, err, fileString) ->
			if err then return console.log "Could not load style at path: #{path}"
			styles[styleIndex] = fileString.toString()
			if --unresolved is 0
				fssCallback styles.join "\n"

		# Regex to extract style tags
		regex = $wf.$loader.styleRegex()

		while tag = regex.exec head

			# Check for a src or href attribute
			if srcAttr = tag[0].match /(src|href)\s?=\s?['"](.*?)['"]/

				# Start loading the file
				unresolved++
				fssPath = path.resolve htmlPath, "../", srcAttr[2]
				fs.readFile fssPath, resolvePromise.bind 0, fssPath, styles.length
				styles.push 0

			# Otherwise the style is already included
			else styles.push tag[1]


	# Regex to extract script tags
	scriptRegex: ()->
		///
		<script(.*?src\s?=\s?["']([^"']*)["'])?[^>]*\>([\s\S]*?)<\/script>|
		<script(.*?src\s?=\s?["']([^"']*)["'])?[^>]*\/>
		///g


	# Get all of the style tags that match what we're looking for
	extractScripts: (head, htmlPath, jsCallback) ->

		# Keep track of what we're loading
		unresolved = 0
		scripts = []

		# Runs whenever a file finishes loading
		resolvePromise = (path, scriptIndex, err, fileData) ->
			if err then return console.log "Could not load script file at path: #{path}"
			fileString = fileData.toString()
			if fileString.indexOf($wf.$loader.fashionIdentifier) is -1
				scripts[scriptIndex] = fileString
			if --unresolved is 0
				jsCallback scripts.join "\n"

		# Regex to extract script tags
		regex = $wf.$loader.scriptRegex();

		while tag = regex.exec head

			# Check for a src attribute
			if tag[2]?

				# Start loading the file
				unresolved++
				fssPath = path.resolve htmlPath, "../", tag[2]
				fs.readFile fssPath, resolvePromise.bind 0, fssPath, scripts.length
				scripts.push ''

			# Otherwise the style is already included
			else 
				console.log tag[3].indexOf($wf.$loader.fashionIdentifier)
				if tag[3].indexOf($wf.$loader.fashionIdentifier) is -1
					scripts.push tag[3]
