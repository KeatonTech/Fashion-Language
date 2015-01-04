# Fashion 0.3.0

The first build that could actually theoretically be used for production sites. Still quite buggy and not feature complete, but getting there!

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