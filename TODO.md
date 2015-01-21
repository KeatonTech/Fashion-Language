# Fashion 0.4

### Features

* Binding function, with DOM observers to update its value
* @include block for loading additional .fss files at compile time
* Compiler flag to generate multiple files instead of inlining
* Simplified module API, or at least shortcuts into the existing one

### Modules
* Revamped 'pin' property based on data binding, respects relative-to
* Parallax property and background-parallax property
* Fit property (replicating background-size)
* @isMobile and @hasTouch globals

### Misc
* Transitions should be smarter about cascading, overriding CSS when necessary
* Make variables declared in @transition blocks take an isolated scope
* Bracket mismatches should be intelligently identified
* 150+ unit tests

# Fashion 0.5

### Features
* Custom easing functions using @keyframes
* Add custom selectors like :dragging and :moving, as well as some of the jQuery stuff like :has()
* Support for scoped variables crossing into the shadow DOM, for easy component styling
* Unit conversion, including a polyfill for viewport size units
* New Syntax: Tabbed mode and multi-property assignment (width: height: 100%;)
* Transitions on variables

### Modules
* @client block, with a way to add a new stylesheet to the DOM
* Pass-through @media and @keyframe blocks
* @browser.name, @browser.version, and @browser.os globals
* AJAX-related modules like ajax-content: and ajax-send()
* Media playback modules like media-url, play()

### Fixes and optimizations
* Caching on DOM properties, invalidated on DOM modification
* Reading HTML attributes must require the selector to match only elements with that attribute.
* Optimization to treat some scoped variables as normal CSS inheritance
* Polyfills where necessary; guaranteed support back to IE 9, 'hinted' support to IE 8
* Trigger properties should not require the whole 'individualized' module to be included

### Misc
* Launch with Fashion website
* Launch with Fashion Language and Fashion API documentation
* 200 unit tests

# Future Releases

* Fashion-specific inspector with Node.js backend for updaing the .fss file
* !server flag on variables and a two-piece compiler that generates Node backend code
* Fashion server supporting !server flags and also user-agent dependent stylesheets
* 'Avante-garde', a variant of Fashion that also generates HTML
* Full support for SVGs, including setting & animating properties within <object> tags
* @spriteSheet block, creating useful variables to access different images

## Fixes
* Binding functions should find a way to inherit the transition of their parent
* Selectors with qualifiers like :hover don't support individualized properties

## Tests

* Runtime
* Built-in properties
* Front-to-back integration testing