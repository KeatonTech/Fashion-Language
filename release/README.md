# Fashion 0.3.1

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
