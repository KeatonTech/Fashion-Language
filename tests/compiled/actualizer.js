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
  window.fashiontests.actualizer.transitions = function() {
    var $wf, parse, prefixes, process, separateTransitions;
    $wf = window.fashion;
    parse = window.fashion.$parser.parse;
    process = window.fashion.$processor.process;
    separateTransitions = window.fashion.$actualizer.separateTransitions;
    prefixes = window.fashion.$actualizer.cssPrefixes;
    it("should pull transitions out into their own objects", function() {
      var id, parseTree, prefix, properties, _results;
      parseTree = process(parse("body {\n	background-color: [linear 100ms] blue;\n}"));
      separateTransitions(parseTree);
      properties = parseTree.selectors[0].properties;
      expect(properties[0].name).toBe("background-color");
      _results = [];
      for (id in prefixes) {
        prefix = prefixes[id];
        expect(properties[parseInt(id) + 1].name).toBe("" + prefix + "transition");
        expect(properties[parseInt(id) + 1].value).toBe("background-color 100ms linear");
        _results.push(expect(properties[parseInt(id) + 1].mode).toBe($wf.$runtimeMode["static"]));
      }
      return _results;
    });
    it("should combine multiple transitions into one property", function() {
      var id, parseTree, prefix, properties, str, _results;
      parseTree = process(parse("body {\n	background-color: [linear 100ms] blue;\n	color: [ease-out 200ms] red;\n}"));
      separateTransitions(parseTree);
      properties = parseTree.selectors[0].properties;
      expect(properties[0].name).toBe("background-color");
      expect(properties[1].name).toBe("color");
      str = "background-color 100ms linear,color 200ms ease-out";
      _results = [];
      for (id in prefixes) {
        prefix = prefixes[id];
        expect(properties[parseInt(id) + 2].name).toBe("" + prefix + "transition");
        expect(properties[parseInt(id) + 2].value).toBe(str);
        _results.push(expect(properties[parseInt(id) + 2].mode).toBe($wf.$runtimeMode["static"]));
      }
      return _results;
    });
    it("should turn dynamic transitions into dynamic properties", function() {
      var id, parseTree, prefix, properties, _results;
      parseTree = process(parse("$duration: 100ms;\nbody {\n	background-color: [linear $duration] blue;\n}"));
      separateTransitions(parseTree);
      properties = parseTree.selectors[0].properties;
      _results = [];
      for (id in prefixes) {
        prefix = prefixes[id];
        expect(properties[parseInt(id) + 1].name).toBe("" + prefix + "transition");
        expect(properties[parseInt(id) + 1].value).toBe("background-color 100ms linear");
        _results.push(expect(properties[parseInt(id) + 1].mode).toBe($wf.$runtimeMode.dynamic));
      }
      return _results;
    });
    return it("should combine differently typed transitions into different properties", function() {
      var id, l, parseTree, prefix, properties, str, _results;
      parseTree = process(parse("$duration: 100ms;\nbody {\n	background-color: [linear 100ms] blue;\n	color: [ease-out 200ms] red;\n	width: [linear $duration] 100px;\n}"));
      separateTransitions(parseTree);
      properties = parseTree.selectors[0].properties;
      expect(properties[0].name).toBe("background-color");
      expect(properties[1].name).toBe("color");
      expect(properties[2].name).toBe("width");
      l = 3;
      str = "background-color 100ms linear,color 200ms ease-out";
      for (id in prefixes) {
        prefix = prefixes[id];
        expect(properties[parseInt(id) + l].name).toBe("" + prefix + "transition");
        expect(properties[parseInt(id) + l].value).toBe(str);
        expect(properties[parseInt(id) + l].mode).toBe($wf.$runtimeMode["static"]);
      }
      l += prefixes.length;
      str = "width 100ms linear";
      _results = [];
      for (id in prefixes) {
        prefix = prefixes[id];
        expect(properties[parseInt(id) + l].name).toBe("" + prefix + "transition");
        expect(properties[parseInt(id) + l].value).toBe(str);
        _results.push(expect(properties[parseInt(id) + l].mode).toBe($wf.$runtimeMode.dynamic));
      }
      return _results;
    });
  };

}).call(this);
(function() {
  window.fashiontests.actualizer.css = function() {
    var $wf, actualize, parse, prefixes, process;
    $wf = window.fashion;
    parse = window.fashion.$parser.parse;
    process = window.fashion.$processor.process;
    actualize = function(parseTree) {
      return window.fashion.$actualizer.actualize(parseTree, 0);
    };
    prefixes = window.fashion.$actualizer.cssPrefixes;
    it('should generate CSS identical to the input for static files', function() {
      var css, cssString;
      css = actualize(process(parse("body {\n	background-color: blue;\n	width: 100%;\n	content: \"body string\";\n}"))).css;
      cssString = 'body {background-color: blue;width: 100%;content: "body string";}\n';
      return expect(css).toBe(cssString);
    });
    it('should be able to lookup variable values', function() {
      var css, cssString;
      css = actualize(process(parse("$minHeight: 100px;\nbody {\n	width:100%;\n	min-height: $minHeight;\n}"))).css;
      cssString = "body {width: 100%;}\nbody {min-height: 100px;}\n";
      return expect(css).toBe(cssString);
    });
    it('should be able to evaluate expressions', function() {
      var css, cssString;
      css = actualize(process(parse("$height: 100px;\nbody {\n	width: $height * 2;\n	height: $height;\n}"))).css;
      cssString = "body {width: 200px;height: 100px;}\n";
      return expect(css).toBe(cssString);
    });
    it('should ignore individual properties', function() {
      var css, cssString;
      css = actualize(process(parse("$height: 100px;\nbody {\n	width: $height * 2;\n	height: $height;\n	color: @self.color;\n}"))).css;
      cssString = "body {width: 200px;height: 100px;}\n";
      return expect(css).toBe(cssString);
    });
    it('should generate the CSS for transitions', function() {
      var css, cssString, prefix, _i, _len;
      css = actualize(process(parse("body {\n	background-color: [linear 100ms] blue;\n}"))).css;
      cssString = 'body {background-color: blue;';
      for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
        prefix = prefixes[_i];
        cssString += "" + prefix + "transition: background-color 100ms linear;";
      }
      cssString += "}\n";
      return expect(css).toBe(cssString);
    });
    return it('should generate the CSS for dynamic transitions', function() {
      var css, cssString, prefix, _i, _len;
      css = actualize(process(parse("$duration: 314ms;\nbody {\n	background-color: [linear $duration] blue;\n}"))).css;
      cssString = 'body {background-color: blue;}\nbody {';
      for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
        prefix = prefixes[_i];
        cssString += "" + prefix + "transition: background-color 314ms linear;";
      }
      cssString += "}\n";
      return expect(css).toBe(cssString);
    });
  };

}).call(this);
(function() {
  describe("Actualizer", function() {
    describe("Regrouper", window.fashiontests.actualizer.regrouper);
    describe("CSS Transitions", window.fashiontests.actualizer.transitions);
    return describe("CSS Generator", window.fashiontests.actualizer.css);
  });

}).call(this);
