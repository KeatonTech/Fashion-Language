# Fashion 0.3.1

### Features Since 0.3

* Variables and globals are now bound to specific properties, not selectors, giving a substantial performance boost
* Simplified the code structure by removing the regrouper
* Bindings are attached to expressions now, allowing some more features down the road
* Rearranged runtime code a bit to slightly cut down on size
* A few new unit tests

### Features Since 0.2.2

* New Node.js based compiler to generate production quality sites
* Runtime data minifier, dramatically shrinks generated JS
* Rewritten @transition block supports variables passed in
* Selectors with runtime-calculated properties are hidden until calculations are complete
* HSL/HSB colors
* Text-style property supports font sizes
* Functions can accept named arguments (using JS objects internally)
* Over 100 Unit Tests!

### Bug Fixes Since 0.2.2
* Nested selectors with commas (multi-selectors) are handled correctly now
* The compiler no longer attempts to pre-calculate values depending on globals
* Sped up runtime by removing element wrappers
* AND and OR (&& and ||) work inside expressions now