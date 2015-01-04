# Fashion: Style + Smarts

**Fashion is more than just an extension to CSS.** It is a fundamentally new language for the web that takes care of the *style, animation, and interactivity* of your website or web app. Fashion allows your Javascript to focus on functionality without getting tied down by DOM manipulation or style tags. By ***finally*** separating logic from presentation, you'll be able to use the same script files on Desktop and Mobile, or easily move components from one site to another. Fashion is built to structure the web of 2014 and beyond, while still supporting browsers of the past.

## Syntax

### Variables

In many ways, Fashion is similar to other languages like SASS or LESS. It has variables and expressions, selectors can be nested, and you can do math inline. The most immidiate difference is that Fashion code is dynamic; the compiler produces both CSS and Javascript for your site. So while this may look familiar:
	
```scss
$background: #DC493C;

body, html {
	background-color: $background;
}
```

This part may look a little new:

```Javascript
window.onload = function(){
	style.background = "#27B9AB";
}
```

Obviously changing page styles from Javascript is nothing new, so this may not seem particularly exciting. Notice, though, that there are no CSS selectors involved here. So if you needed to move the page background to a div, or apply the background color to a new element, your Javascript wouldn't have to change at all! You also might be interested to know that Fashion doesn't rely on HTML attributes so your normal CSS inheritance will stay in tact.

Variables aren't just useful for changing things like colors and sizes, they can be used to select elements too. So, if you wanted to build a simple sidebar menu and control which item was selected, you could do it without any DOM hassle.

```scss
$item: awesome;
#select #$item {
	background-color: red;
}
```

Paired with HTML like this

```HTML
<ul id="select">
	<li id="awesome">Awesome Item!</li>
	<li id="cool">Cool Item!</li>
	<li id="sweet">Sweet Item!</li>
</ul>
```

Then selecting the 'cool' item would be as simple as running style.item = 'cool'

### Globals

You don't have to set every variable, Fashion actually has a bunch that it will set for you. For example, the window height. This snippet here makes a div square div and centers it in the page, with an appropriate amount of padding on the top and bottom.  

```scss
$padding: 50px;
div#centeredSquare {
	width: @height - $padding * 2;
	height: @height - $padding * 2;
	background-color: black;
	color: white;
	margin: 0 auto;
	margin-top: $padding;
}
```

Here, the @height variable is the total height of the window. Fashion intelligently watches this value, so whenever you resize the window your centeredSquare div will get resized, automatically. Here is a list of available globals, with more coming soon.

* *Width:* Current width of the user's browser window, in pixels
* *Height:* Current height of the user's browser window, in pixels
* *ScrollX:* The user's current scroll position, in pixels from the left of the page
* *ScrollY:* The user's current scroll position, in pixels from the top of the page
* *MouseX:* The user's current mouse position, in pixels from the left of the page
* *MouseY:* The user's current mouse position, in pixels from the top of the page
* *pixelRatio:* The device pixel ratio (usually 1 or 2 for retina)

### Functions & Expressions

As you can see from the previous example, it is possible to write math expressions directly inside of fashion properties. In fact, anything you can do in Javascript you can do in Fashion (we cheat a little and just convert whatever you write into Javascript, with some special logic to make sure your CSS gets the right units).

Fashion also supports custom functions for more advanced data manipulation, and comes with a pretty big set of useful stuff. For example, if you wanted to make your text size responsive, within reason, you could write something like this.

```scss
$minTextSize: 12px;
p {
	font-size: max(@width/50, $minTextSize);
}
```

Functions are also really useful for manipulating colors. They can even be used to add brand new color spaces to CSS, in this case HSB, which it seems the CSS committee has some sort of vendetta on.

```scss
$color: hsb(150, 50, 100); // A nice soft blue
div {
	color: brighten($color, 0.25);
	background-color: darken($color, 0.25);
}
```

Functions are bound to variables dynamically, not just evaluated once and thrown out. That means if you change the style.color variable at any time in your javascript, they'll all be re-evaluated for your new color. Fashion automatically includes any code needed to run these functions on your site, without including any unnecessary bloat. This means perfectly dynamic sites with super fast load times!

### Transitions & Animations

The web is an increasingly animated place. Far beyond the geocities gifs of yesteryear, animations on the modern web can visually guide users around a website and provide context for interactions. CSS3 introduced syntax for GPU-accelerated transitions, which tend to work pretty well. The only downside is that the syntax is cumbersome and needs to be browser-prefixed, which might lead some developers to forego transitions in places where they would be helpful. Fashion provides some new syntactic sugar to combat this.

```scss
$noticeBottom: 0px;
#notice {
	position: absolute;
	bottom: [ease-out 300ms] $noticeBottom;
}
```

This will generate fully prefixed CSS3 transitions, so all you as the developer have to do is set style.noticeBottom in your Javascript and watch it move into place.

You can also use this to set up more complex, multipart transitions, like so.

```scss
$boxHeight: 0px;
$boxAnimateDuration: 500ms;
$contentAnimateDuration: 300ms;

.box {
	height: [linear $boxAnimateDuration] $boxHeight;

	.content {
		height: [linear $contentAnimateDuration $boxAnimateDuration] $boxHeight;
	}
}
```

The third property for transitions is the delay, so in this case the box's content will wait until the box has animated in to animate in itself. Also notice that every property of the transition can be bound to a variable, so adding something like an animation speed setting for your users would be trivial.

But wait, there's more! CSS3 provides the @keyframes block to define more complex animations. Unfortunately, this block can only apply to individual elements, so it is not very useful when orchestrating a whole big animated event on your site (a transition between pages, for example). Creating this kind of beautiful symphony of animations right now requires some really ugly Javascript code with things like setTimeout scattered around. Fashion solves this with the new @transition block.

```scss
@transition fade-in {
	start {
		div {
			opacity: 0.0;
			position: relative;
			right: 100px;

			p {opacity: 0;}
		}
	}

	0% {
		div {
			opacity: [linear 50%] 1.0;
			right: [ease-out 75%] 0px;
		}
	}
	50% {
		div p {opacity: [linear 50%] 1.0;}
	}
}

button {
	on-click: trigger("fade-in", 500ms);
}

```

Notice that all of the durations are specified in terms of percentages, transitions are meant to easily scale faster or slower for easy tweaking later on. In this transition, the div would be fading from 0ms to 250ms and moving from 0ms to 375ms. The p's inside the div would start fading in at 250ms and finish at 500ms.


### Event Handling

Here's the part where we start to break some totally new ground. Fashion is more than just a fancy stylesheet, it's also a layer between your HTML and your Javascript. Gone are the days of tying your event handling code to specific CSS selectors, now you can use Fashion to link specific selectors to specific functions.

```scss
.button.submit {
	on-click: submit(@self.parent)
}
```

@self is a variable that refers to the current HTML object, in this case the one that was clicked. Now if you put a button inside a form and give it a class of "submit button", clicking it would automatically call the submit function on that form. You can tell Fashion about new functions of your own design by calling window.fashion.addFunction.

This same technique can be used to create things like navigation menus with absolutely no Javascript.

```scss
$item: option-one;
$selectionColor: red;

li {
	on-click: $item = @self.id;
}

li#$item {
	background-color: $selectionColor;
}
```

NOTE: This functionality will soon be improved by adding scoped variables, so you could add multiple of these per page. Things like iFrame src properties will also allow you to actually implement the navigation part.

##### More coming soon, see MANIFESTO.md for future features

## Using Fashion

Fashion is designed to run either in-browser or as a compiler. To start, we recommend running it in your browser. This will allow you to make changes more quickly, without having to set up a whole build system.

```HTML
<head>
	<script src="build/fashion.0.1.min.js"></script>
	<style type="text/x-fashion">

		$color: red;
		html, body {
			background-color: $color;
		}

	</style>
</head>
```

*NOTE: When using Fashion in the browser, it may not be suitable to assume that the style object exists as soon as the page loads, since some stylesheets may be loaded asynchronously and parsing takes time. To ensure your app logic waits for the sheets to load, listen for the "fashion-loaded" event.*

Once your site is done, you can compile fashion using our node.js based compile system. This will ensure that your users don't have to download the whole fashion library every time they load your site. Right now, you can call it like this:

	node ./lib/fashion.compiler.js index.html built.html

This will take the site you have running at index.html and make a fully compiled copy at built.html. Currently the compiler inlines all of your Javascript and CSS into the HTML file, which is efficient for static pages but prevents caching from working well on dynamic pages. There will be an option in the future to have the compiler generate a number of different files.

Now, you're probably wondering why the compiler inputs and outputs html files, instead of fashion (*.fss) files. It is, after all, the fashion compiler. There are 2 reasons for this. The first is for efficiency, if you were to embed 2 fashion files on the same page, a dumber compiler may include the common fashion runtime twice. Having the full html means this compiler can consider every fashion document on the page and generate one nice simple runtime from them.

The second, arguably more important, reason is that fashion can be extended by you, the developer. Any javascript that you include on the page (inline or linked) can contain Fashion extensions. The compiler picks up on these and automatically installs them. No messy JSON dependencies, no command line arguments, just the kind of Javascript that you're already used to.

## Extending Fashion

Say you wanted to invert a color used in your stylesheet. You could add a Fashion function to accomplish this task by including this script.

```scss
$color: #ff5c5c;
div {
	color: $color
	background-color: invert($color);
}
```

```javascript
window.fashion.addFunction("invert", {
	
	// Tell fashion what type this function returns
	output: window.fashion.$type.Color,

	// Tell fashion that this relies on a runtime modules called 'colors'
	// TODO: Document these modules better
	// You only need this if you're calling any functions under 'this', here cssTOjs
	capabilities: ["colors"],

	// Evaluate the function
	evaluate: function(foregroundColor) {
		var color = this.cssTOjs(foregroundColor.value, this);
		if (color.r === void 0) {return "black";}
		color.r = 255 - color.r;
		color.g = 255 - color.g;
		color.b = 255 - color.b;
		return this.rgbTOhex(color);
	}
});
```

Notice that the code uses foregroundColor.value instead of just foregroundColor. This is because Fashion has a whole type system built in, to make up for Javascript's complete lack of one. You could use foregroundColor.type to ensure that it is, in fact, a color. For numerical values, a .unit property is also given, allowing you to do conversion if necessary.

You can also create custom properties to use in your stylesheet (things like 'width' and 'text-align'). Say you wanted to create a property that lets you handle CSS's convoluted text styles more easily.

```scss
.bolditalic {
	text-style: bold italic;
}
```

This can be accomplished by a simple fashion extension that runs at compile time and expands this property out

```javascript
window.fashion.addProperty("text-style", {
	// Tell fashion to remove this property from the compiled CSS
	// Only the properties it creates are valid, 'text-style' is not otherwise valid
	replace: true,

	// Runs at compile time, adds new properties based on the input
    compile: function(values) {

		// For each property the user passes in
		compileSingleValue = function(value){
			switch (value) {
				case "italic":
					this.setProperty("font-style", "italic"); break;
				case "bold":
					this.setProperty("font-weight", "bolder");break;
				case "light":
					this.setProperty("font-weight", "lighter");break;
				case "underline":
					this.setProperty("text-decoration", "underline");break;
			};
		}.bind(this);
	
		// Go through each value passed in by the user
		// If only one is passed in, it will be a string instead of an array
		if (values instanceof Array) {
			for (i = 0, len = values.length; i < len; i++) {
				compileSingleValue(values[_i]);
			}
		} else {
			compileSingleValue(values);
		}
	};
});
```

You can also extend fashion to add your own globals and blocks (things like @transition). The APIs for these are still in flux, and they're not very well documented right now, but hey, it's possible! Once things stabilize I'll write more comprehensive docs, for now you might have to dig through the source code a little bit.


## Status

Fashion is still in the early stages of development. It is not feature complete and has a limited testing suite (Just over 100 unit tests). However, all of the features described here do work fairly reliably. I wouldn't reccomend building a whole site with it, but it's certainly not too early to start playing around with it. If you are interested in contributing, email me at keaton.brandt@gmail.com.

#### Current Browser Compatibility

Safari 5.1+, IE 9+, Evergreen Browsers(Firefox 4+, Chrome 5+, Opera 11.6+)

#### Current Size

The Fashion compiler currently runs upwards of 100kb, which is very large for a Javascript library. Luckily, it was never meant to be included on production sites. The code it generates, which includes both library functions and all of the interactivity you've defined for the page, generally runs about 20 - 30kb, or more depending on the complexity of the site. The compiler goes to great lengths to ensure that no unnecessary code is added to the production page, so simple sites that don't use many of Fashion's more advanced features could be as small as a few kilobytes.
