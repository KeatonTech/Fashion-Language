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
      var parseTree, transitions;
      parseTree = process(parse("@transition my-transition {\n	start {\n		#item {opacity: 0.0;}\n	}\n	50% {\n		#item {opacity: 1.0;}\n	}\n	100% {\n		#item {opacity: 0.5;}\n		#item2 {display: block;}\n	}\n}"));
      transitions = parseTree.dependencies.blocks.transition.runtimeObject.transitions;
      expect(transitions['my-transition']).toBeDefined();
      expect(transitions['my-transition']['start']).toBeDefined();
      expect(transitions['my-transition']['50%']).toBeDefined();
      expect(transitions['my-transition']['100%']).toBeDefined();
      expect(transitions['my-transition']['start'][0].name).toBe("#item");
      expect(transitions['my-transition']['start'][0].properties[0].name).toBe("opacity");
      expect(transitions['my-transition']['start'][0].properties[0].value).toBe("0.0");
      expect(transitions['my-transition']['50%'][0].properties[0].name).toBe("opacity");
      expect(transitions['my-transition']['50%'][0].properties[0].value).toBe("1.0");
      expect(transitions['my-transition']['100%'][0].properties[0].name).toBe("opacity");
      expect(transitions['my-transition']['100%'][0].properties[0].value).toBe("0.5");
      expect(transitions['my-transition']['100%'][1].properties[0].name).toBe("display");
      return expect(transitions['my-transition']['100%'][1].properties[0].value).toBe("block");
    });
    it("should add CSS transitions where appropriate", function() {
      var parseTree, startProperty, transitions;
      parseTree = process(parse("@transition my-transition {\n	start {\n		#item {opacity: [ease-out 100%] 0.0;}\n	}\n	100% {\n		#item {opacity: 1.0;}\n	}\n}"));
      transitions = parseTree.dependencies.blocks.transition.runtimeObject.transitions;
      startProperty = transitions['my-transition']['start'][0].properties[0];
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
      expect(transitions['my-transition']['0%-50%'][0].name).toBe(".class");
      return expect(transitions['my-transition']['50% - 100%'][0].name).toBe(".class2");
    });
    it("should be able to read variables defined outside", function() {
      var parseTree, transitions;
      parseTree = process(parse("$offColor: #336;\n$onColor: #da0;\n\n@transition highlight {\n	0% {\n		#item {background-color: $offColor;}\n	}\n	100% {\n		#item {background-color: $onColor;}\n	}\n}"));
      transitions = parseTree.dependencies.blocks.transition.runtimeObject.transitions;
      expect(transitions['highlight']['0%'][0].properties[0].value.script).toBeDefined();
      expect(transitions['highlight']['100%'][0].properties[0].value.script).toBeDefined();
      expect(parseTree.bindings.variables["offColor"]).toEqual([]);
      return expect(parseTree.bindings.variables["onColor"]).toEqual([]);
    });
    return it("should be able to read variables defined inside", function() {
      var parseTree, transitions;
      parseTree = process(parse("@transition highlight {\n	$itemId: #item;\n	0% {\n		$itemId {background-color: black;}\n	}\n	100% {\n		$itemId {background-color: red;}\n	}\n}"));
      transitions = parseTree.dependencies.blocks.transition.runtimeObject.transitions;
      expect(transitions['highlight']['0%'][0].name.script).toBeDefined();
      expect(transitions['highlight']['100%'][0].name.script).toBeDefined();
      expect(transitions['highlight']['0%'][0].properties[0].value).toBe("black");
      expect(transitions['highlight']['100%'][0].properties[0].value).toBe("red");
      return expect(transitions['highlight']["$vars"]).toEqual(["itemId"]);
    });
  };

}).call(this);
(function() {
  describe("Modules", function() {
    return describe("@transition", window.fashiontests.modules.transition);
  });

}).call(this);