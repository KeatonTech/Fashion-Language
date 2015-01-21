# Fashion 0.3.5

### Changes Since 0.3.2

* Variables can now be scoped to particular selectors, nested children will get the scoped value
* Scoped variables can be modified on individual objects from JS and from Fashion expressions
* Coffeescript-style ternary operators in expressions
* Scoped variables can be set to individualized expressions
* Syntactic sugar for CSS3 gradients using property modules
* Nested selector breakout prefix ('^') using a rather complicated selector combination algorithm
* Added a CSS header including box-sizing: border-box for added niceness
* DOM watcher also analyzes children of added nodes now
* Fixed bug that would cause unminified variables to be included repeatedly in transition runtime objects
* Constants that end in 'if' (eg. sans-serif) will no longer confuse the parser
* Constants like 'red' are now automatically converted into strings
* Compiler includes an ID placeholder (##) in selectors sent to JS allowing them to be easily scoped
* Parser keeps track of nesting hierarchy, useful for variable scoping
* New scoped variable example with 3 pickers. Tests scope, ind/scope, scope/sel and ind/scope/sel
* Around a dozen new unit tests (146 total)

### Changes Since 0.3.1

* @Transitions can have ranged keyframes, where matching objects come in sequentially
* Fashion will watch for DOM changes in order to style all dynamically created objects
* @Transitions can trigger other @transitions within keyframes
* Properties marked as !important are now properly made dynamic in webkit
* CSS3 Transition properties like duration and delay can now be linked to variables & expressions
* Renamed 'capabilities' to 'requires' and moved them into the ParseTree, from the actualizer
* Blocks without bodies are now supported
* Unit tests for dynamic and individual selectors, at runtime

### Changes Since 0.3

* Variables and globals are now bound to specific properties, not selectors, giving a substantial performance boost
* Variables can be given a !static flag to cut down on runtime code needed to modify them
* Transformation functions like scale() and translate3d() are now properly supported
* Trigger properties (on-event) are now intelligently guess if it should propogate the event
* Variables and globals are no longer bound to triggered properties
* Keyboard events (on-keydown and on-keyup) are now supported
* Simplified the code structure by removing the regrouper
* Bindings are attached to expressions now, allowing some more features down the road
* HSB() now consistently uses a 100-based scale instead of 255
* Rearranged runtime code a bit to slightly cut down on size
* Units default to an empty string instead of undefined, cutting down on code size
* Compiler adds a header to the output specifying Fashion version
* A few new unit tests

### Changes Since 0.2.2

* New Node.js based compiler to generate production quality sites
* Runtime data minifier, dramatically shrinks generated JS
* Rewritten @transition block supports variables passed in
* Selectors with runtime-calculated properties are hidden until calculations are complete
* HSL/HSB colors
* Text-style property supports font sizes
* Functions can accept named arguments (using JS objects internally)
* Nested selectors with commas (multi-selectors) are handled correctly now
* The compiler no longer attempts to pre-calculate values depending on globals
* Sped up runtime by removing element wrappers
* AND and OR (&& and ||) work inside expressions now
* Over 100 Unit Tests!
