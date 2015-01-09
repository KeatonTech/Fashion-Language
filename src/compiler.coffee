# Wrap everything to prevent global leaks
# @prepros-prepend ./helpers/prepros/wrap-header.coffee

# Allows Node.js to use the window object
# @prepros-prepend ./helpers/prepros/node-window.coffee

# Global fashion stuff
# @prepros-prepend ./fashion.coffee

###
------------------------------------------------------------------------------

This Compiler version runs on top of Node.js and converts HTML written for the
live Fashion runtime into an HTML file with all of the Fashion code processed
into standard CSS and Javascript. This is intended to prepare code for use on
production websites where the compile time & file size could be problematic.

------------------------------------------------------------------------------

COMMAND LINE FORMAT: 
	
	Create HTML with inlined JS / CSS
		node fashion.compiler.js input.html output.html

	Create HTML with included JS / CSS
		node fashion.compiler.js input.html ../built

------------------------------------------------------------------------------

STYLE NOTE: Normally all these different files would be included using Node's
require() function, however since so much of the code is shared with the live
in-browser version that approach is impractical. Therefore, require() is only
used for importing node modules, everything else is built into the same file.

------------------------------------------------------------------------------
###

# Make sure the command line arguments are good
if process.argv.length < 4
	console.log """
		-------------------------------------------------------------------
		Incorrect arguments, please call the compiler with this format:
			
		    node fashion.compiler.js [input.html] [output.html]
		    node fashion.compiler.js [input.html] [../output]

		-------------------------------------------------------------------
		"""
	return;

# Get the arguments
inputFile = process.argv[2]
outputFile = process.argv[3]

# Load the input file
fs = require 'fs'
fs.readFile inputFile, (err, data) ->
	if err
		console.log "Could not read file: #{inputFile}. It may be restricted or not exist."
		console.log err
		return;

	# Extract all of the fss code from the input file
	html = data.toString()
	window.fashion.$loader.extractFromHTML html, inputFile, (fssAndJs)->
		{fss, js, strippedHTML} = fssAndJs

		# Start timer
		start = new Date().getTime()

		# Install any fashion extensions and return everything else
		auxjs = pullOutFashionExtensions(js)
		
		# Parse the fashion into js and css
		parseTree = window.fashion.$parser.parse fss

		# Process that nice little tree to expand out things like properties
		parseTree = window.fashion.$processor.process parseTree

		# Convert the tree into JS and CSS elements
		{css, js} = window.fashion.$actualizer.actualize parseTree

		# Add all the other non-fashion JS stuff (semicolon added for safety)
		js += ";" + auxjs

		# Make the js smaller but keep the header
		js = require("uglify-js").minify(js, {fromString: true}).code
		js = window.fashion.$actualizer.jsHeader + js

		# Turn everything into one nice HTML file
		html = inlineStylesAndScripts strippedHTML, css, js

		# Write everything to a file
		fs.writeFile outputFile, html, (err) ->
			if err
				console.log "Could not write file: #{outputFile}. The folder may not exist."
				console.log err
				return; 

			# Print the compile time
			console.log "[FASHION] Compile finished in #{new Date().getTime() - start}ms"

		

# Goes through the Javascript looking for fashion extensions
# Pulls out those extensions and evaluates them, adding them to the compiler
# Returns all of the JS code that remains
pullOutFashionExtensions = (js)->
	insideExtension = false
	acc = ""
	lastIndex = 0
	depth = 0
	extensions = []

	regex = ///
			window\.fashion\.(.*?)\(| 	# It begins
			".*?"|'.*?'|				# Get rid of quotes
			\(|\)						# Depth tracking
			///g

	# Get every extension block
	while match = regex.exec js

		# Start an extension block
		if match[1]?
			acc = "window.fashion.#{match[1]}("
			lastIndex = match.index + match[0].length
			insideExtension = true
			depth = 1
			continue

		# If we're not in an extension, get out of here
		else if !insideExtension then continue

		# Accumulate the elapsed text
		acc += js.substr(lastIndex, (match.index - lastIndex) + match[0].length)
		lastIndex = match.index + match[0].length

		# Depth tracking
		if match[0] is "(" then depth++
		else if match[0] is ")"
			if --depth is 0
				extensions.push acc + ";"
				insideExtension = false

	# Return the 'redacted' javascript code
	return installFashionExtensions js, extensions


# Installs fashion extensions and removes them from the original source
installFashionExtensions = (js, extensions)->

	# Go through each extension
	for extension in extensions

		# Add the module to the runtime
		try
			eval(extension)
		catch e
			console.log "Could not add extension: #{extension}"
			console.log e

		# Remove it from the javascript code
		js = js.replace extension, ""

	# Remove any empty wrappers that may have gotten left over from .coffee compilation
	js = js.replace /\(function\(\)\s?{\s*?}\)(.call)?\((this)?\);?/g, ""

	return js


# Inline styles and scripts
inlineStylesAndScripts = (html, cssText, jsText) ->
	fullHeader = html.match /<head>([\s\S]*?)<\/head>/i
	head = fullHeader[1]
	head += "<style id='#{$wf.cssId}' type='text/css'>#{cssText}</style>"
	head += "<script type='text/javascript'>#{jsText}</script>"
	return html.replace fullHeader[0], ()-> "<head>#{head}</head>"


# Include helper files, used by everything
# @prepros-append ./helpers/basic.coffee
# @prepros-append ./helpers/dom.coffee
# @prepros-append ./helpers/stringify.coffee
# @prepros-append ./classes/parser/parsetree.coffee
# @prepros-append ./classes/modules.coffee
# @prepros-append ./types/types.coffee
# @prepros-append ./types/runtime-modes.coffee

# Include the actual functional JS files
# @prepros-append ./loader/compiled.coffee
# @prepros-append ./parser/parser.coffee
# @prepros-append ./processor/processor.coffee
# @prepros-append ./shared/shared.coffee
# @prepros-append ./actualizer/actualizer.coffee
# @prepros-append ./runtime/runtime.coffee

# Include all of the built-in Fashion modules
# @prepros-append ./built-in/functions/functions.coffee
# @prepros-append ./built-in/properties/properties.coffee
# @prepros-append ./built-in/blocks/blocks.coffee
# @prepros-append ./built-in/globals.coffee

# Wrap everything to prevent globals from leaking
# @prepros-append ./helpers/prepros/wrap-footer.coffee
