# Fashion: Style + Smarts

**Fashion is more than just an extension to CSS.** It is a fundamentally new language for the web that takes care of the *style, animation, and interactivity* of your website or web app. Fashion allows your Javascript to focus on functionality without getting tied down by DOM manipulation or style tags. By ***finally*** separating logic from presentation, you'll be able to use the same script files on Desktop and Mobile, or easily move components from one site to another. Fashion is built to structure the web of 2014 and beyond, while still supporting browsers of the past.

## Syntax

In many ways, Fashion is similar to other languages like LESS or SASS. It has variables and expressions, selectors can be nested, and you can do math inline. The most immidiate difference is that Fashion code is dynamic, the compiler produces both CSS and Javascript for your site. So while this may look familiar:
	
	$backgroundColor: #DC493C;
	$pageColor: white;

	body, html {
		background-color: $backgroundColor;
	}

	article {background-color: $pageColor;}

This part may look a little new:

	setTimeout(function(){
		style.backgroundColor = "#27B9AB";
	}, 1000);

Obviously changing page styles from Javascript is nothing new, so this may not seem particularly exciting. Notice, though, that there are no CSS selectors involved here. So if you needed to move the page background to a div, or apply the background color to a new element, your Javascript wouldn't have to change at all! You also might be interested to know that Fashion doesn't use any 'style' attributes, so your normal CSS inheritance will stay in tact.

### Transitions & Animations

The web is an increasingly animated place. Far beyond the geocities gifs of yesteryear, animations on the modern web can visually guide users around a website and provide context for interactions. CSS3 introduced syntax for GPU-accelerated transitions, which tend to work pretty well. The only downside is that the syntax is cumbersome and needs to be browser-prefixed, which might lead some developers to forego transitions in places where they would be helpful. Fashion provides some new syntactic sugar to combat this.

	$noticeBottom: 0px;
	#notice {
		position: absolute;
		bottom: [ease-out 300ms] $noticeBottom;
	}

This will generate fully prefixed CSS3 transitions, so all you as the developer have to do is set style.noticeBottom in your Javascript and watch it move into place.

You can also use this to set up more complex, multipart transitions, like so.

	$boxHeight: 0px;
	$boxAnimateDuration: 500ms;
	$contentAnimateDuration: 300ms;

	.box {
		height: [linear $boxAnimateDuration] $boxHeight;

		.content {
			height: [linear $contentAnimateDuration $boxAnimateDuration] $boxHeight;
		}
	}

The third property for transitions is the delay, so in this case the box's content will wait until the box has animated in to animate in itself. Also notice that every property of the transition can be bound to a variable, so adding something like an animation speed setting for your users would be trivial.

***

##### More coming soon, see MANIFESTO.md for future features

## Using Fashion

Fashion is designed to run either in-browser or as a compiler. Currently only the in-browser implementation is in a working state, although it is architected to act essentially as a compiler, generating CSS and Javascript for the page and then handing off to that. Fashion code can be inserted into your page like this.

	<head>
		<script src="../lib/fashion.0.1.min.js"></script>
		<style type="text/x-fashion">

			$color: red;
			html, body {
				background-color: $color;
			}

		</style>
	</head>

Loading external Fashion scripts using link tags will be supported soon too. After the page has loaded, the window.style object will become available with all of the variables defined in the Fashion code.

## Status

Currently, the Javascript generated by Fashion is around 5 - 10kb, depending on the complexity of the Fashion document. This will likely grow over time, but it will likely remain significantly smaller than using a full DOM manipulation library.

#### Current Browser Compatibility

Safari 5.1+, IE 9+, Evergreen Browsers(Firefox 4+, Chrome 5+, Opera 11.6+)
