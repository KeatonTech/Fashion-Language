# Fashion

This code is designed to be compiled with Prepros (https://prepros.io/). It should work with the free version.

Fashion is written in Coffeescript. Lines are limited to 93 characters long.


## Code Structure

* ***fashion.coffee:*** Shared code between the Precompiler and In-browser (live) implementations
* ***live.coffee:*** Compiles Fashion code in the browser, allowing for easier development and some more flexibility.
* ***api.coffee:*** Defines functions that allow third party code to extend the Fashion compiler.

***

### ./loader
##### Code to load in Fashion files

* ***live.coffee:*** Loads Fashion files from style and link tags

### ./parser
##### Code to turn a text/x-fashion document into a useful parse tree

* ***parser.coffee:*** Orchestrates the full parsing process and includes all of the other parsing files.
* ***sections.coffee:*** Splits the full Fashion document into individual selectors, blocks and variable definitions.
* ***properties.coffee:*** Parses the inside of a selector into individual properties and values.
* ***expressions.coffee:*** Validates inline fashion expressions and converts them to Javascript functions.

### ./processor
##### Code to expand Fashion properties, blocks and selectors into a format closer to raw CSS and Javascript.

* ***processor.coffee:*** Sets the parse tree up for processing and runs the functions for properties, blocks and selectors.
* ***variables.coffee:*** Determines the types and units for each variable. Handles selector linking.
* ***properties.coffee:*** Goes through each selector in the parse tree to find properties associated with Fashion modules, and expand them.
* ***blocks.coffee:*** Goes through each block and calls a module to expand its contents.
* ***api.coffee:*** Defines functions that can be run by module funtions.

### ./actualizer
##### Code to turn the processed parse tree into standard CSS and Javascript text

* ***actualizer.coffee:*** Imports everything else, orchestrate the process on a high level.
* ***css/css.coffee:*** Generates two stylesheets from the parse tree, one for static properties and one for dynamic properties. Returns a map describing where different selectors are located on the dynamic sheet.
* ***css/dom.coffee:*** Adds stylesheets to the page, and is capable of swapping out their properties
* ***javascript/javascript.coffee:*** Generates javascript text, adds it to the page inside a script tag.
* ***javascript/blueprint.coffee:*** Text generating functions used for different parts of the actualized JS. Converts runtime functions into text and adds them to the output.

### ./shared
##### Code used to deal with variables and expressions that is used by both the compiler and the outputted code

* ***evaluation.coffee:*** Evaluates expressions & other value objects and returns their result as a CSS value.
* ***types.coffee:*** Determines the data type of an input CSS value, used to type variables and to validate their new values.
* ***units.coffee:*** Functions to deal with units, including determining numerical & color units and conversion infrastructure.

### ./runtime
##### Functions that are used in the generated Javascript code and run on the page.

* ***runtime.coffee:*** Has basic functions for updating Fashion variables and associated CSS selectors
* ***dom/watch-vars.coffee:*** Watches for changes to the variables object. Supports IE9+, optional polyfill may be added later.
* ***dom/individualized.coffee:*** Applies individualized properties to each element matching the selector.

***

### ./classes
##### Compilers aren't typically very object oriented, Fashion just uses these to define and enforce a standard data format

* ***classes/parsetree.coffee:*** Class that represents the parse tree of a document. Includes all the other classes.
* ***classes/variable.coffee:*** Class that represents a user-defined variable.
* ***classes/selector.coffee:*** Class that represents a selector and its properties or its string body.
* ***classes/property.coffee:*** Class that represents a CSS property, and a class that represents a CSS transition.
* ***classes/expression.coffee:*** Class that represents an expression.

### ./built-in
##### Fashion is designed in a modular manner to allow developers to extend its functionality. This folder contains all of the built in modules.

* ***functions/functions.coffee:*** Basic functions available to expressions, also includes all of the other functions
* ***properties/properties.coffee:*** Basic properties, mostly syntactic sugar. Also includes the other properties files
* ***globals.coffee:*** Definitions of built in global variables like width, scrollX and mouseX

### ./types
##### Equivalent to C++ typedefs, useful standardizations

* ***types.coffee:*** List of singular, constant and composite data types in a numbered enum format.
* ***units.coffee:*** List of numerical and color units.
* ***constants.coffee:*** List of allowed values for constant types like display, align, and built-in colors.
* ***runtime-modes.coffee:*** List of modes that can be applied to properties, variables and modules to define runtime behavior.

### ./helpers
##### Some extra stuff that might be useful

* ***dom.coffee:*** Functions to create, find and populate different DOM elements.
* ***basic.coffee:*** Simple array and object operations that come in handy.
* ***stringify.coffee:*** Alternate implementation of JSON.stringify that includes functions.
* ***prepros/wrap-header.coffee:*** Allows fashion to be placed in an isolate scope (top of function).
* ***prepros/wrap-footer.coffee:*** Allows fashion to be placed in an isolate scope (bottom of function).
