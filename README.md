# Fashion
## Style + Smarts
***

**Fashion is not an extension to CSS**. It is a *fundamentally* new language for the web that describes the *form* ***and*** *function* of a website or web app in an elegant new syntax. It is built for the web of 2014 and beyond, while still supporting browsers of the past.

***

Fashion is a new language that extends the basic principals and syntax of CSS to create a more complete description of content presentation on the web. CSS was created to describe the style and layout of static web pages, meaning it’s usefulness has declined as the web becomes more and more dynamic and interactive. Javascript has taken over not just page logic but also the brunt of page presentation, necessitating the creation of DOM libraries like jQuery. The W3C has attempted to shift some of this load back to CSS with the addition of transitions and animations, but they didn’t go far enough. The goal of Fashion is to help create clean, semantic, portable and skin-able websites by separating application logic from presentation and providing developers with a native syntax for the new web.

Fashion looks similar to CSS, but with some powerful new features and fixes for some of CSS’s more bothersome quirks. It differs from LESS and SASS in that it runs client-side, so it can do things that normal compiled CSS can’t. For example, LESS variables let designers easily make complex changes to the structure of a site, but since LESS needs to be precompiled, developers can’t make those same changes at runtime. Fashion’s dynamic attributes and variables turn previously complicated Javascript hacks like parallax scrolling, vertical centering and responsive design into simple stylesheet markup. Now if a developer wants the page to intelligently switch between desktop and mobile layouts, they only have to change a single Fashion variable from Javascript and let the stylesheet figure out the rest.

This mentality extends beyond just dynamic attributes, Fashion stylesheets are able to be a complete interface between your Javascript model and your HTML. The language supports event binding, animation triggering, complex multi-object transitions, conditionals, and even more complex expressions. In other words, you will never need to use a single selector, id or class name inside your Javascript, making your code automatically portable between different interfaces. This essentially creates a natural model-view-controller structure for web apps, where Fashion is the controller.

On top of all of this, Fashion has plenty of syntactic sugar to make writing CSS less of a hassle. Vertical centering, parallax, and simple layout constraints are included as simple attributes that can be used on any object. A ‘mixin’ system allows for functionality to be easily re-used, and an extensive built-in library of mixins takes care of browser prefixing. Commonly used page attributes like window width, height and scroll position are automatically provided as variables. A new animation syntax similar to @keyframes allows complicated multi-object transitions to be created and modified easily, and a number of pre-made transitions are provided by the language. Colors and strings can be modified with a set of built-in operations like darken, invert & substring, and additional operations can be easily added on with simple Javascript functions.

Fashion also integrates nicely with web components, which are widely viewed to be the future of web development. Instead of re-inventing the wheel every time they start a new site, developers will be able to create and download libraries of reusable components. The underlying technology of this idea is called the Shadow DOM and basically allows individual HTML elements to have their own scripts, styles and templates. One of the main problems with this technology right now is that it’s hard to re-skin the components to match your site’s style. Fashion variables allow Shadow DOM elements to specify certain style and layout properties that can be easily linked to properties in the master document. In other words, Shadow DOM elements can now extend CSS to expose their own style-able attributes to designers, allowing them to function as independent components rather than HTML snippets.

Stylesheets describe what a page should look like when it’s first loaded. Fashion describes how a page should look over time, including animations and interactivity. It is a fundamentally different tool that allows developers to write cleaner web code and ultimately develop websites faster. At first it will be implemented using a Javascript library to convert its syntax to CSS at runtime, but it is my hope that it will eventually be directly incorporated into web browsers. It’s about time too, given how much the World Wide Web has changed in the last two decades it is almost shocking how fixed its underlying technologies have been. With upcoming technologies like Fashion, Web Components and ASM.js it is safe to say that the current landscape of web development will soon look as primitive as flip phones and laser disks, and we’ll all be better off because of it.