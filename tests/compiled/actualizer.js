(function() {
  if (!window.fashiontests) {
    window.fashiontests = {};
  }

  window.fashiontests.actualizer = {};

}).call(this);
(function() {
  window.fashiontests.actualizer.regrouper = function() {
    var $wf, groupPropertiesWithMode, parse, process, regrouper;
    $wf = window.fashion;
    parse = window.fashion.$parser.parse;
    process = window.fashion.$processor.process;
    regrouper = window.fashion.$actualizer.regroupProperties;
    groupPropertiesWithMode = window.fashion.$actualizer.groupPropertiesWithMode;
    it("should group properties by mode", function() {
      var parseTree, properties;
      parseTree = process(parse("$dynamic: 'test';\nbody {\n	property1: $dynamic;\n	property2: static;\n	property3: random($dynamic);\n	property4: 10px;\n}"));
      properties = parseTree.selectors[0].properties;
      groupPropertiesWithMode(properties, $wf.$runtimeMode.dynamic);
      expect(properties[0].name).toBe("property2");
      expect(properties[1].name).toBe("property4");
      expect(properties[2].name).toBe("property1");
      return expect(properties[3].name).toBe("property3");
    });
    it("should avoid rearranging properties that would change how the CSS works", function() {
      var parseTree, properties;
      parseTree = process(parse("$dynamic: 10px;\nbody {\n	margin-top: $dynamic;\n	padding-top: $dynamic;\n	margin-bottom: $dynamic;\n	margin: 0 auto;\n	border-top: $dynamic;\n}"));
      properties = parseTree.selectors[0].properties;
      groupPropertiesWithMode(properties, $wf.$runtimeMode.dynamic);
      expect(properties[0].name).toBe("margin-top");
      expect(properties[1].name).toBe("margin-bottom");
      expect(properties[2].name).toBe("margin");
      expect(properties[3].name).toBe("padding-top");
      return expect(properties[4].name).toBe("border-top");
    });
    it("should split a selector into multiple pieces grouped by mode", function() {
      var expansionMap, newSelectors, parseTree, _ref;
      parseTree = process(parse("$dynamic: 'test';\nbody {\n	property1: $dynamic;\n	property2: static;\n	property3: random($dynamic);\n	property4: @self.id;\n	property5: 10px;\n}"));
      _ref = regrouper(parseTree), newSelectors = _ref.selectors, expansionMap = _ref.map;
      expect(expansionMap.length).toBe(1);
      expect(expansionMap[0]).toEqual([0, 1, 2]);
      expect(newSelectors.length).toBe(3);
      expect(newSelectors[0].properties.length).toBe(2);
      expect(newSelectors[1].properties.length).toBe(2);
      return expect(newSelectors[2].properties.length).toBe(1);
    });
    it("should continue to work even if properties cannot be fully grouped", function() {
      var expansionMap, newSelectors, parseTree, _ref;
      parseTree = process(parse("$dynamic: 'test';\nbody {\n	margin-top: $dynamic;\n	padding-top: $dynamic;\n	margin-bottom: $dynamic;\n	margin: 0 auto;\n	border-top: $dynamic;\n}"));
      _ref = regrouper(parseTree), newSelectors = _ref.selectors, expansionMap = _ref.map;
      expect(expansionMap.length).toBe(1);
      expect(expansionMap[0]).toEqual([0, 1, 2]);
      expect(newSelectors.length).toBe(3);
      expect(newSelectors[0].properties.length).toBe(2);
      expect(newSelectors[0].properties[0].mode).toBe($wf.$runtimeMode.dynamic);
      expect(newSelectors[1].properties.length).toBe(1);
      expect(newSelectors[1].properties[0].mode).toBe($wf.$runtimeMode["static"]);
      expect(newSelectors[2].properties.length).toBe(2);
      return expect(newSelectors[2].properties[0].mode).toBe($wf.$runtimeMode.dynamic);
    });
    return it("should work with multiple selectors", function() {
      var expansionMap, newSelectors, parseTree, _ref;
      parseTree = process(parse("$dynamic: 'test';\nbody {\n	property1: $dynamic;\n	property2: static;\n	property3: random($dynamic);\n	property4: @self.id;\n	property5: 10px;\n}"));
      _ref = regrouper(parseTree), newSelectors = _ref.selectors, expansionMap = _ref.map;
      expect(expansionMap.length).toBe(1);
      expect(expansionMap[0]).toEqual([0, 1, 2]);
      expect(newSelectors.length).toBe(3);
      expect(newSelectors[0].properties.length).toBe(2);
      expect(newSelectors[1].properties.length).toBe(2);
      return expect(newSelectors[2].properties.length).toBe(1);
    });
  };

}).call(this);
(function() {
  describe("Actualizer", function() {
    return describe("Regrouper", window.fashiontests.actualizer.regrouper);
  });

}).call(this);
