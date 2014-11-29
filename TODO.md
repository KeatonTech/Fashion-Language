## Features

* Full support for blocks throughout the whole system. Parser -> Processor -> Actualizer
* Binding function, with DOM observers to update its value
* Variable scoping to allow per-element values. (Big changes to parser, actualizer & runtime)
* Switch to generating a single stylesheet, instead of 2, to keep inheritance fully in tact
* Allow ternaries (CS and JS formats) in expressions
* Optionally move individualized properties out of the style tag and into the CSS.
* Create a preprocessor in Node so that the compiler doesn't have to be run on the client


## Built-in Modules

#### Properties
* Parallax property and background-parallax property
* Fit property (replicating background-size)
* Gradient properties (possibly prefixed with background-)

#### Blocks
* @transition block w/ Run function
* Pass-through @media block
* @client block, with a way to add a new stylesheet to the DOM
* @spriteSheet block, creating useful variables to access different images

#### Globals
* pixelRatio, isMobile, hasTouch
* browser.name, browser.version, browser.os

#### Functions
* Color-handling functions (darken, brighten, mix, hueshift, etc)
* HSB(A) & HSL(A) functions (polyfills on some browsers)
* @ (bind), min, max & avg DOM binding functions


## Fixes

* Pin property should make its parent at least position relative
* Pin property should respect relative-to
* Binding functions should find a way to inherit the transition of their parent


## Tests

* Processor
* JS Actualizer (and more on the CSS actualizer)
* Runtime
* Built-in properties
* Front-to-back integration testing