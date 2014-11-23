# Fashion
## Code Structure
***

This code is designed to be compiled with Prepros (https://prepros.io/). It should work with the free version.

Fashion is written in Coffeescript. Lines are limited to 93 characters long.

***

* **fashion.coffee:** Shared code between the Precompiler and In-browser (live) implementations
* **live.coffee:** Compiles Fashion code in the browser, allowing for easier development and some more flexibility.

### ./parser
##### Code to turn a text/x-fashion document into a useful parse tree

* **parser.coffee:** Orchestrates the full parsing process and includes all of the other parsing files.
* **sections.coffee:** Splits the full Fashion document into individual selectors, blocks and variable definitions
* **properties.coffee:** Parses the inside of a selector into individual properties and values.
* **variables.coffee:** Parses variable values and determines their type and units. Creates a dependants list of selectors that use each variable.
* **expressions.coffee:** Validates inline fashion expressions and converts them to Javascript functions.

### ./actualizer
##### Code to turn the parse tree into standard CSS and Javascript

* **actualizer.coffee:** Imports everything else, orchestrate the process on a high level.
* **css.coffee:** Generates two stylesheets from the parse tree, one for static properties and one for dynamic properties. Returns a map describing where different selectors are located on the dynamic sheet.
* **javascript/javascript.coffee:** Generates javascript text, adds it to the page inside a script tag.
* **javascript/blueprint.coffee:** Text generating functions used for different parts of the actualized JS. Converts runtime functions into text and adds them to the output.

### ./runtime
##### Code used to deal with variables and expressions that is used by both the compiler and the outputted code

* **runtime.coffee:** Has basic functions dealing with variables. Also includes all the other runtime files.
* **evaluation.coffee:** Evaluates expressions and returns their result as a CSS value.
* **observer.coffee:** Object.observe and polyfills that watch for changes to a variables object. *Only used in output code*
* **types.coffee:** Functions dealing with data types, including determining the type of a value.
* **units.coffee:** Functions to deal with units, including determining numerical & color units and conversion infrastructure.

### ./built-in
##### Fashion is designed in a modular manner to allow developers to extend its functionality. This folder contains all of the built in modules.

* **functions/functions.coffee:** Basic functions available to expressions, also includes all of the other functions

### ./loader
##### Code to load in Fashion files

* **live.coffee:** Loads Fashion files from <style> and <link> tags

### ./types
##### Equivalent to C++ typedefs, useful standardizations

* **types.coffee:** List of singular, constant and composite data types in a numbered enum format.
* **units.coffee:** List of numerical and color units
* **constants.coffee:** List of allowed values for constant types like display, align, and built-in colors.

### ./helpers
##### Some extra stuff that might be useful

* **dom.coffee:** Functions to create, find and populate different DOM elements
