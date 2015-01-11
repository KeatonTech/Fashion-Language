# Fashion 0.4

* Updated @transition block with support for keyframe ranges
* Binding function, with DOM observers to update its value
* Full support for scoped variables - treated as individualized properties.
* Allow ternaries (CS and JS formats) in expressions
* Revamped 'pin' and a new fit property, based on binding.
* Update event properties to remove variable dependencies and HTML attribute
* New Syntax: Tabbed mode and multi-property assignment (width: height: 100%;)

# Future Releases

## Features

* Optimization to convert some scoped variables into CSS selectors
* Add custom selectors like :dragging and :moving, as well as some of the jQuery stuff like :has()
* Custom easing functions using @keyframes

## Built-in Modules

#### Properties
* Parallax property and background-parallax property
* Fit property (replicating background-size)
* Gradient properties (possibly prefixed with background-)

#### Blocks
* Pass-through @media and @keyframe blocks
* @client block, with a way to add a new stylesheet to the DOM
* @spriteSheet block, creating useful variables to access different images

#### Globals
* isMobile, hasTouch
* browser.name, browser.version, browser.os

#### Functions
* Color-handling functions (darken, brighten, mix, hueshift, etc)
* @ (bind), min, max & avg DOM binding functions


## Fixes

* Make variables declared in @transition blocks take an isolated scope
* Pin property should make its parent at least position relative
* Pin property should respect relative-to
* Binding functions should find a way to inherit the transition of their parent
* Selectors with qualifiers like :hover don't support individualized properties


## Tests

* Runtime
* Built-in properties
* Front-to-back integration testing