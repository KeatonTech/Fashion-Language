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
output = process.argv[3]
console.log inputFile, output


# Include helper files, used by everything
# @prepros-append ./helpers/basic.coffee
# @prepros-append ./helpers/dom.coffee
# @prepros-append ./helpers/stringify.coffee
# @prepros-append ./classes/parser/parsetree.coffee
# @prepros-append ./classes/modules.coffee
# @prepros-append ./types/types.coffee
# @prepros-append ./types/runtime-modes.coffee

# Include the actual functional JS files
# @prepros-append ./loader/live.coffee
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
