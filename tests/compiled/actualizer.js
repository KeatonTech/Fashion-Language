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
    return it("should turn dynamic transitions into dynamic properties", function() {
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
    it('should maintain the !important tag', function() {
      var css, cssString, parseTree;
      parseTree = process(parse("$width: 100px;\nbody {\n	background-color: blue !important;\n	width: $width / 2 !important\n}"));
      css = actualize(parseTree).css;
      cssString = 'body {background-color: blue !important;}\nbody {width: 50px !important;}\n';
      return expect(css).toBe(cssString);
    });
    it('should be able to lookup variable values', function() {
      var css, cssString;
      css = actualize(process(parse("$minHeight: 100px;\nbody {\n	width:100%;\n	min-height: $minHeight;\n}"))).css;
      cssString = "body {width: 100%;}\nbody {min-height: 100px;}\n";
      return expect(css).toBe(cssString);
    });
    it('should ignore empty selectors', function() {
      var css, cssString;
      css = actualize(process(parse("body {\n	background-color: blue;\n	width: 100%;\n	content: \"body string\";\n}\np {}"))).css;
      cssString = 'body {background-color: blue;width: 100%;content: "body string";}\n';
      return expect(css).toBe(cssString);
    });
    it('should allow nesting-only selectors', function() {
      var css, cssString;
      css = actualize(process(parse("body {\n	p {\n		background-color: blue;\n		width: 100%;\n		content: \"body string\";\n	}\n}"))).css;
      cssString = 'body p {background-color: blue;width: 100%;content: "body string";}\n';
      return expect(css).toBe(cssString);
    });
    it('should be able to evaluate expressions', function() {
      var css, cssString;
      css = actualize(process(parse("$height: 100px;\nbody {\n	width: $height * 2;\n	height: $height;\n}"))).css;
      cssString = "body {width: 200px;height: 100px;}\n";
      return expect(css).toBe(cssString);
    });
    it('should ignore individual properties but include a hider', function() {
      var css, cssString;
      css = actualize(process(parse("$height: 100px;\nbody {\n	width: $height * 2;\n	height: $height;\n	color: @self.color;\n}"))).css;
      cssString = "body {width: 200px;height: 100px;}\nbody {visibility: hidden;}\n";
      return expect(css).toBe(cssString);
    });
    it('should generate multi-part properties with embedded expressions', function() {
      var css, cssString;
      css = actualize(process(parse("$borderWidth: 1px;\nbody {\n	border: $borderWidth solid black;\n}"))).css;
      cssString = 'body {border: 1px solid black;}\n';
      return expect(css).toBe(cssString);
    });
    it('should generate multiple multi-part properties with embedded expressions', function() {
      var css, cssString;
      css = actualize(process(parse("$borderWidth: 1px;\nbody {\n	border: $borderWidth solid black, $borderWidth * 2 solid red;\n}"))).css;
      cssString = 'body {border: 1px solid black, 2px solid red;}\n';
      return expect(css).toBe(cssString);
    });
    it('should generate the CSS for transitions', function() {
      var css, cssString, prefix, _i, _len;
      css = actualize(process(parse("body {\n	border: 1px solid black;\n	background-color: [linear 100ms] blue;\n}"))).css;
      cssString = 'body {border: 1px solid black;background-color: blue;';
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
  window.fashiontests.actualizer.minifier = function() {
    var $wf, actualize, parse, process;
    $wf = window.fashion;
    parse = window.fashion.$parser.parse;
    process = window.fashion.$processor.process;
    actualize = function(parseTree) {
      return window.fashion.$actualizer.actualize(parseTree, 0);
    };
    it('should minify selectors and variables', function() {
      var js;
      js = actualize(process(parse("$size: 10px;\nbody {\n	padding: $size;\n	width: $size;\n}"))).js;
      window.FASHION = {};
      eval(js);
      expect(window.FSMIN.length).toBe(3);
      expect(window.FSMIN[0].length).toBe(1);
      expect(window.FSMIN[0][0]).toContain('body');
      expect(window.FSMIN[0][0]).toContain($wf.$runtimeMode.dynamic);
      expect(window.FSMIN[0][0][4][0]).toContain("padding");
      expect(window.FSMIN[0][0][4][0][3][0]).toBe("e");
      expect(window.FSMIN[0][0][4][1]).toContain("width");
      expect(window.FSMIN[0][0][4][1][3][0]).toBe("e");
      expect(window.FSMIN[1].length).toBe(1);
      expect(window.FSMIN[1][0]).toContain('size');
      expect(window.FSMIN[1][0]).toContain(10);
      expect(window.FSMIN[1][0]).toContain('px');
      return expect(window.FSMIN[2].length).toBe(0);
    });
    it('should expand minified selectors and variables', function() {
      var minData, props, rd;
      minData = [
        [["s", 0, "body", 1, [["p", "padding", 1, ["e", 1, 1, "px", "return (v('size').value) + 'px'"]], ["p", "width", 1, ["e", 1, 1, "px", "return (v('size').value) + 'px'"]]]]], [
          [
            "v", "size", 1, "px", 1, 10, [], {
              "0": 10
            }
          ]
        ]
      ];
      rd = {
        selectors: {},
        variables: {}
      };
      window.fashion.$actualizer.minifier.expandRuntimeData(minData, rd);
      expect(rd.selectors[0].name).toBe("body");
      expect(rd.selectors[0].mode).toBe(1);
      expect(rd.selectors[0].properties.length).toBe(2);
      props = rd.selectors[0].properties;
      expect(props[0].name).toBe("padding");
      expect(props[0].mode).toBe(1);
      expect(props[0].value.evaluate).toBeDefined();
      expect(props[1].name).toBe("width");
      expect(rd.variables["size"].name).toBe("size");
      expect(rd.variables["size"]["default"]).toBe(10);
      expect(rd.variables["size"].unit).toBe("px");
      expect(rd.variables["size"].mode).toBe(1);
      return expect(rd.variables["size"].type).toBe($wf.$type.Number);
    });
    it('should minify individual properties', function() {
      var js;
      js = actualize(process(parse("body {\n	color: @self.color;\n}"))).js;
      window.FASHION = {};
      eval(js);
      expect(window.FSMIN[2].length).toBe(1);
      expect(window.FSMIN[2].length).toBe(1);
      expect(window.FSMIN[2][0]).toContain('body');
      expect(window.FSMIN[2][0]).toContain($wf.$runtimeMode.individual);
      expect(window.FSMIN[2][0][4][0]).toContain("color");
      expect(window.FSMIN[2][0][4][0]).toContain($wf.$runtimeMode.individual);
      return expect(window.FSMIN[2][0][4][0][3][0]).toBe("e");
    });
    it('should expand individual properties', function() {
      var data, props, rd;
      data = [[], [], [["s", 0, "body", 7, [["p", "color", 7, ["e", 7, 2, null, "return e.color"]]]]]];
      rd = {
        selectors: {},
        variables: {},
        individual: {}
      };
      window.fashion.$actualizer.minifier.expandRuntimeData(data, rd);
      expect(rd.individual[0].name).toBe("body");
      expect(rd.individual[0].mode).toBe(7);
      expect(rd.individual[0].properties.length).toBe(1);
      props = rd.individual[0].properties;
      expect(props[0].name).toBe("color");
      expect(props[0].mode).toBe(7);
      return expect(props[0].value.evaluate).toBeDefined();
    });
    return it('should minify multipart properties', function() {
      var js;
      js = actualize(process(parse("$size: 10px;\nbody {\n	border: $size solid black;\n}"))).js;
      window.FASHION = {};
      eval(js);
      expect(window.FSMIN[0][0][4][0]).toContain("border");
      expect(window.FSMIN[0][0][4][0][3][0][0]).toBe("e");
      expect(window.FSMIN[0][0][4][0][3][1]).toBe("solid");
      return expect(window.FSMIN[0][0][4][0][3][2]).toBe("black");
    });
  };

}).call(this);
(function() {
  window.fashiontests.actualizer.js = function() {
    var $wf, actualize, parse, process;
    $wf = window.fashion;
    parse = window.fashion.$parser.parse;
    process = window.fashion.$processor.process;
    actualize = function(parseTree) {
      return window.fashion.$actualizer.actualize(parseTree, 0);
    };
    it('should include all necessary runtime data', function() {
      var js;
      js = actualize(process(parse("$colorVar: blue;\nbody {\n	background-color: $colorVar;\n	width: 100%;\n}"))).js;
      window.FASHION = {};
      eval(js);
      expect(window.FASHION.variables.colorVar["default"]).toBe('blue');
      expect(window.FASHION.selectors[0]).toBeUndefined();
      expect(window.FASHION.selectors[1].name).toBe('body');
      expect(window.FASHION.selectors[1].properties.length).toBe(1);
      return expect(window.FASHION.selectors[1].properties[0].name).toBe('background-color');
    });
    it('should include all necessary basic runtime functions', function() {
      var js;
      js = actualize(process(parse("$colorVar: blue;\nbody {\n	background-color: $colorVar;\n	width: 100%;\n}"))).js;
      window.FASHION = {};
      eval(js);
      expect(window.FASHION.runtime.evaluate).toBeDefined();
      expect(window.FASHION.runtime.setVariable).toBeDefined();
      expect(window.FASHION.runtime.$initWatchers).toBeDefined();
      expect(window.FASHION.runtime.regenerateSelector).toBeDefined();
      expect(window.FASHION.runtime.throwError).toBeDefined();
      expect(window.FASHION.runtime.determineType).toBeDefined();
      expect(window.FASHION.runtime.regenerateIndividualSelector).not.toBeDefined();
      expect(window.FASHION.runtime.createElementObject).not.toBeDefined();
      expect(window.FASHION.runtime.updateGlobal).not.toBeDefined();
      return expect(window.FASHION.runtime.$initializeIndividualProperties).not.toBeDefined();
    });
    it('should include all necessary runtime functions for individual properties', function() {
      var js;
      js = actualize(process(parse("body {\n	background-color: @self.color;\n	width: 100%;\n}"))).js;
      window.FASHION = {};
      eval(js);
      expect(window.FASHION.runtime.evaluate).toBeDefined();
      expect(window.FASHION.runtime.regenerateSelector).toBeDefined();
      expect(window.FASHION.runtime.throwError).toBeDefined();
      expect(window.FASHION.runtime.regenerateIndividualSelector).toBeDefined();
      expect(window.FASHION.runtime.elementFunction).toBeDefined();
      expect(window.FASHION.runtime.$initializeIndividualProperties).toBeDefined();
      expect(window.FASHION.runtime.determineType).not.toBeDefined();
      expect(window.FASHION.runtime.setVariable).not.toBeDefined();
      expect(window.FASHION.runtime.$initWatchers).not.toBeDefined();
      return expect(window.FASHION.runtime.updateGlobal).not.toBeDefined();
    });
    it('should include all necessary runtime functions for globals', function() {
      var js;
      js = actualize(process(parse("$bg: red;\nbody {\n	background-color: $bg;\n	width: @width;\n}"))).js;
      window.FASHION = {};
      window.FSREADYTEST = function(func) {};
      eval(js.replace(/FSREADY\(/g, "FSREADYTEST("));
      expect(window.FASHION.runtime.evaluate).toBeDefined();
      expect(window.FASHION.runtime.regenerateSelector).toBeDefined();
      expect(window.FASHION.runtime.throwError).toBeDefined();
      expect(window.FASHION.runtime.updateGlobal).toBeDefined();
      expect(window.FASHION.runtime.determineType).toBeDefined();
      expect(window.FASHION.runtime.setVariable).toBeDefined();
      expect(window.FASHION.runtime.$initWatchers).toBeDefined();
      expect(window.FASHION.runtime.regenerateIndividualSelector).not.toBeDefined();
      expect(window.FASHION.runtime.createElementObject).not.toBeDefined();
      return expect(window.FASHION.runtime.$initializeIndividualProperties).not.toBeDefined();
    });
    it('should include a list of individual selectors', function() {
      var divIndividual, js, pIndividual;
      js = actualize(process(parse("div {\n	background-color: @self.color;\n	on-click: max(0,1)px;\n}\np {\n	pin: center;\n}"))).js;
      window.FASHION = {};
      eval(js);
      divIndividual = window.FASHION.individual[0];
      expect(divIndividual.properties[0].name).toBe("background-color");
      expect(divIndividual.properties[1].name).toBe("on-click");
      pIndividual = window.FASHION.individual[1];
      expect(pIndividual.properties[0].name).toBe("top");
      return expect(pIndividual.properties[1].name).toBe("left");
    });
    it('should properly map variable bindings to the separated CSS selectors', function() {
      var js;
      js = actualize(process(parse("$padding: 10px;\ndiv {\n	padding: $padding;\n	color: white;\n}\np {\n	pin: center;\n	padding: $padding;\n}"))).js;
      window.FASHION = {};
      eval(js);
      return expect(FASHION.variables["padding"].dependents).toEqual([1, 3]);
    });
    it('should leave out static variables', function() {
      var js;
      js = actualize(process(parse("$padding: 10px !static;\ndiv {\n	padding: $padding;\n	color: white;\n}\np {\n	pin: center;\n	padding: $padding;\n}"))).js;
      window.FASHION = {};
      eval(js);
      return expect(JSON.stringify(FASHION.selectors)).toBe("{}");
    });
    it('should properly map variable bindings to the individual CSS selectors', function() {
      var js;
      js = actualize(process(parse("$padding: 10px;\ndiv {\n	padding: $padding;\n	color: white;\n}\np {\n	pin: center;\n	padding-left: @self.leftOffset + $padding;\n}"))).js;
      window.FASHION = {};
      eval(js);
      return expect(FASHION.variables["padding"].dependents).toEqual([1, 'i0']);
    });
    return it('should properly map global bindings to the separated CSS selectors', function() {
      var js;
      js = actualize(process(parse("div {\n	width: @height;\n	height: @height;\n	color: white;\n}"))).js;
      window.FASHION = {};
      eval(js.replace(/FSREADY\(/g, "FSREADYTEST("));
      return expect(FASHION.modules.globals["height"].dependents).toEqual([1]);
    });
  };

}).call(this);
(function() {
  describe("Actualizer", function() {
    describe("Regrouper", window.fashiontests.actualizer.regrouper);
    describe("CSS Transitions", window.fashiontests.actualizer.transitions);
    describe("CSS Generator", window.fashiontests.actualizer.css);
    describe("JS Minifier", window.fashiontests.actualizer.minifier);
    return describe("JS Generator", window.fashiontests.actualizer.js);
  });

}).call(this);
