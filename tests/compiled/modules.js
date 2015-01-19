(function() {
  if (!window.fashiontests) {
    window.fashiontests = {};
  }

  window.fashiontests.modules = {};

}).call(this);
(function() {
  window.fashiontests.modules.transition = function() {
    var parse, process;
    parse = window.fashion.$parser.parse;
    process = window.fashion.$processor.process;
    it("should parse simple transitions into transition objects", function() {
      var endSelectors, midSelector, parseTree, startSelector, transitions;
      parseTree = process(parse("@transition my-transition {\n	start {\n		#item {opacity: 0.0;}\n	}\n	50% {\n		#item {opacity: 1.0;}\n	}\n	100% {\n		#item {opacity: 0.5;}\n		#item2 {display: block;}\n	}\n}"));
      transitions = parseTree.dependencies.blocks.transition.runtimeObject.transitions;
      expect(transitions['my-transition']).toBeDefined();
      expect(transitions['my-transition']['start']).toBeDefined();
      expect(transitions['my-transition']['50%']).toBeDefined();
      expect(transitions['my-transition']['100%']).toBeDefined();
      startSelector = transitions['my-transition']['start'].selectors[0];
      expect(startSelector.name).toBe("#item");
      expect(startSelector.properties[0].name).toBe("opacity");
      expect(startSelector.properties[0].value).toBe("0.0");
      midSelector = transitions['my-transition']['50%'].selectors[0];
      expect(midSelector.properties[0].name).toBe("opacity");
      expect(midSelector.properties[0].value).toBe("1.0");
      endSelectors = transitions['my-transition']['100%'].selectors;
      expect(endSelectors[0].properties[0].name).toBe("opacity");
      expect(endSelectors[0].properties[0].value).toBe("0.5");
      expect(endSelectors[1].properties[0].name).toBe("display");
      return expect(endSelectors[1].properties[0].value).toBe("block");
    });
    it("should add CSS transitions where appropriate", function() {
      var parseTree, startProperty, transitions;
      parseTree = process(parse("@transition my-transition {\n	start {\n		#item {opacity: [ease-out 100%] 0.0;}\n	}\n	100% {\n		#item {opacity: 1.0;}\n	}\n}"));
      transitions = parseTree.dependencies.blocks.transition.runtimeObject.transitions;
      startProperty = transitions['my-transition']['start'].selectors[0].properties[0];
      expect(startProperty.value.transition).toBeDefined();
      expect(startProperty.value.transition.easing).toBe("ease-out");
      return expect(startProperty.value.transition.duration).toBe("100%");
    });
    it("should support keyframe ranges", function() {
      var parseTree, transitions;
      parseTree = process(parse("@transition my-transition {\n	start {\n		.class {opacity: 0.0;}\n	}\n	0%-50% {\n		.class {opacity: [ease-out 50%] 1.0;}\n	}\n	50% - 100% {\n		.class2 {color: red;}\n	}\n}"));
      transitions = parseTree.dependencies.blocks.transition.runtimeObject.transitions;
      expect(transitions['my-transition']['start']).toBeDefined();
      expect(transitions['my-transition']['0%-50%']).toBeDefined();
      expect(transitions['my-transition']['50% - 100%']).toBeDefined();
      expect(transitions['my-transition']['0%-50%'].selectors[0].name).toBe(".class");
      return expect(transitions['my-transition']['50% - 100%'].selectors[0].name).toBe(".class2");
    });
    it("should be able to read variables defined outside", function() {
      var endProperty, parseTree, startProperty, transitions;
      parseTree = process(parse("$offColor: #336;\n$onColor: #da0;\n\n@transition highlight {\n	0% {\n		#item {background-color: $offColor;}\n	}\n	100% {\n		#item {background-color: $onColor;}\n	}\n}"));
      transitions = parseTree.dependencies.blocks.transition.runtimeObject.transitions;
      startProperty = transitions['highlight']['0%'].selectors[0].properties[0];
      endProperty = transitions['highlight']['100%'].selectors[0].properties[0];
      expect(startProperty.value.script).toBeDefined();
      expect(endProperty.value.script).toBeDefined();
      expect(startProperty.value.bindings.variables[0]).toEqual(["offColor", 0]);
      return expect(endProperty.value.bindings.variables[0]).toEqual(["onColor", 0]);
    });
    return it("should be able to read variables defined inside", function() {
      var parseTree, transitions;
      parseTree = process(parse("@transition highlight {\n	$itemId: #item;\n	0% {\n		$itemId {background-color: black;}\n	}\n	100% {\n		$itemId {background-color: red;}\n	}\n}"));
      transitions = parseTree.dependencies.blocks.transition.runtimeObject.transitions;
      expect(transitions['highlight']['0%'].selectors[0].name.script).toBeDefined();
      expect(transitions['highlight']['100%'].selectors[0].name.script).toBeDefined();
      expect(transitions['highlight']['0%'].selectors[0].properties[0].value).toBe("black");
      expect(transitions['highlight']['100%'].selectors[0].properties[0].value).toBe("red");
      return expect(transitions['highlight']["$vars"]).toEqual(["itemId"]);
    });
  };

}).call(this);
(function() {
  window.fashiontests.modules.colors = function() {
    var $wf, actualize, parse, process;
    $wf = window.fashion;
    parse = window.fashion.$parser.parse;
    process = window.fashion.$processor.process;
    actualize = function(parseTree) {
      return window.fashion.$actualizer.actualize(parseTree, 0);
    };
    it('should convert HSB into RGB', function() {
      var css;
      css = actualize(process(parse("div {\n	color: hsb(0,100,100);\n}"))).css;
      return expect(css).toContain("rgb(255,0,0)");
    });
    it('should convert HSBA into RGBA', function() {
      var css;
      css = actualize(process(parse("div {\n	color: hsba(120,100,100,0.5);\n}"))).css;
      return expect(css).toContain("rgba(0,255,0,0.5)");
    });
    return it('should generate RGB values from CSS colors', function() {
      var cssToRgb;
      cssToRgb = $wf.color.cssTOjs;
      expect(cssToRgb("#fff")).toEqual({
        r: 255,
        g: 255,
        b: 255
      });
      expect(cssToRgb("#ff5c5c")).toEqual({
        r: 255,
        g: 92,
        b: 92
      });
      expect(cssToRgb("rgb(255,0,128)")).toEqual({
        r: 255,
        g: 0,
        b: 128,
        a: 1
      });
      return expect(cssToRgb("rgba(255,0,128,0.5)")).toEqual({
        r: 255,
        g: 0,
        b: 128,
        a: 0.5
      });
    });
  };

}).call(this);
(function() {
  describe("Modules", function() {
    describe("@transition", window.fashiontests.modules.transition);
    return describe("Colors", window.fashiontests.modules.colors);
  });

}).call(this);
