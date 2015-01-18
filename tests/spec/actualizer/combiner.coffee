# Test the selector combiner
window.fashiontests.actualizer.combiner = ()->

	combine = window.fashion.$shared.combineSelectors

	it "should combine selectors with IDs", ()->

		r = combine "#test", "div article .class"
		c = r.split ","

		# 6 Possibilities
		expect(c.length).toBe 6

		# Different Levels
		expect(c).toContain "div article #test .class"
		expect(c).toContain "div #test article .class"
		expect(c).toContain "#test div article .class"

		# Same Level
		expect(c).toContain "div article #test.class"
		expect(c).toContain "div article#test .class"
		expect(c).toContain "div#test article .class"


	it "should cull anything before the ID", ()->

		r = combine "span #test", "div article .class"
		c = r.split ","

		# Same 6 Possibilities as last time
		expect(c.length).toBe 6


	it "should combine selectors with other multi-component selectors", ()->

		r = combine ".outerClass .innerClass", "div article"
		c = r.split ","

		# 8 Valid combinations in CSS
		expect(c.length).toBe 8
		expect(c).toContain "div .outerClass article.innerClass"
		expect(c).toContain "div.outerClass article.innerClass"
		expect(c).toContain "div .outerClass .innerClass article"
		expect(c).toContain "div.outerClass .innerClass article"
		expect(c).toContain ".outerClass div article.innerClass"
		expect(c).toContain ".outerClass div .innerClass article"
		expect(c).toContain ".outerClass div.innerClass article"
		expect(c).toContain ".outerClass .innerClass div article"


	it "should combine comma-separated ID selectors", ()->

		r = combine "#l1, #l2", "#r1, #r2"
		c = r.split ","

		# Same 6 Possibilities as last time
		expect(c.length).toBe 4
		expect(c).toContain "#l1 #r1"
		expect(c).toContain "#l1 #r2"
		expect(c).toContain "#l2 #r1"
		expect(c).toContain "#l2 #r2"


	it "should combine comma-separated selectors", ()->

		r = combine "#l1, #l2", "div, p"
		c = r.split ","

		# Same 6 Possibilities as last time
		expect(c.length).toBe 8

		# Different levels
		expect(c).toContain "#l1 div"
		expect(c).toContain "#l1 p"
		expect(c).toContain "#l2 div"
		expect(c).toContain "#l2 p"

		# Same level
		expect(c).toContain "div#l1"
		expect(c).toContain "p#l1"
		expect(c).toContain "div#l2"
		expect(c).toContain "p#l2"


	it "should pull out common prefixes", ()->

		r = combine "body #container div", "body #container .class"
		c = r.split ","

		# Same 6 Possibilities as last time
		expect(c.length).toBe 2
		expect(c).toContain "body #container div .class"
		expect(c).toContain "body #container div.class"


	it "should correctly handle parent/child relationships", ()->

		r = combine "body #container div", "body #container div p .class"
		c = r.split ","

		# Same 6 Possibilities as last time
		expect(c.length).toBe 1
		expect(c).toContain "body #container div p .class"


	it "should correctly handle partial parent/child relationships", ()->

		r = combine "body #container div, body #container p", "body #container div .class"
		c = r.split ","

		# Same 6 Possibilities as last time
		expect(c.length).toBe 4
		expect(c).toContain "body #container div .class"
		expect(c).toContain "body #container p div .class"
		expect(c).toContain "body #container div p .class"
		expect(c).toContain "body #container div p.class"


	it "should deal with identical selector components", ()->

		r = combine "body .class div", "#container .class p"
		c = r.split ","

		# Same class to never be combined with itself
		expect(c.indexOf(".class.class")).toBe -1

		# Make sure there are no duplicates
		for o in [0 .. c.length]
			for i in [o .. c.length]
				if i is o then continue
				expect(c[o] is c[i]).toBe false


	it "should correctly handle CSS3 attribute selectors", ()->

		r = combine "div article", "[type='text/x-fashion']"
		c = r.split ","

		# Same 6 Possibilities as last time
		expect(c.length).toBe 2
		expect(c).toContain "div article [type='text/x-fashion']"
		expect(c).toContain "div article[type='text/x-fashion']"
