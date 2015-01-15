(function() {
  if (!window.fashiontests) {
    window.fashiontests = {};
  }

  window.fashiontests.actualizer = {};

}).call(this);
(function() {
  window.fashiontests.actualizer.transitions = function() {
    var $wf, evaluate, parse, prefixes, process, separateTransitions;
    $wf = window.fashion;
    parse = window.fashion.$parser.parse;
    process = window.fashion.$processor.process;
    separateTransitions = window.fashion.$actualizer.separateTransitions;
    prefixes = window.fashion.$actualizer.cssPrefixes;
    evaluate = window.fashion.$shared.evaluate;
    it("should pull transitions out into their own objects", function() {
      var id, parseTree, prefix, properties, property, _results;
      parseTree = process(parse("body {\n	background-color: [linear 100ms] blue;\n}"));
      separateTransitions(parseTree);
      properties = parseTree.selectors[0].properties;
      expect(properties[0].name).toBe("background-color");
      _results = [];
      for (id in prefixes) {
        prefix = prefixes[id];
        property = properties[parseInt(id) + 1];
        expect(property.name).toBe("" + prefix + "transition");
        expect(evaluate(property.value)).toBe("background-color 100ms linear ");
        _results.push(expect(property.mode).toBe($wf.$runtimeMode["static"]));
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
      str = "background-color 100ms linear , color 200ms ease-out ";
      _results = [];
      for (id in prefixes) {
        prefix = prefixes[id];
        expect(properties[parseInt(id) + 2].name).toBe("" + prefix + "transition");
        expect(evaluate(properties[parseInt(id) + 2].value)).toBe(str);
        _results.push(expect(properties[parseInt(id) + 2].mode).toBe($wf.$runtimeMode["static"]));
      }
      return _results;
    });
    return it("should turn dynamic transitions into dynamic properties", function() {
      var id, parseTree, prefix, properties, property, _results;
      parseTree = process(parse("$duration: 100ms;\nbody {\n	background-color: [linear $duration] blue;\n}"));
      separateTransitions(parseTree);
      properties = parseTree.selectors[0].properties;
      _results = [];
      for (id in prefixes) {
        prefix = prefixes[id];
        property = properties[parseInt(id) + 1];
        expect(property.name).toBe("" + prefix + "transition");
        expect(property.value[0][0]).toBe("background-color");
        expect(property.value[0][1].bindings.variables[0]).toBe("duration");
        expect(property.value[0][2]).toBe("linear");
        _results.push(expect(property.mode).toBe($wf.$runtimeMode.dynamic));
      }
      return _results;
    });
  };

}).call(this);
(function() {
  window.fashiontests.actualizer.components = function() {
    var $wf, actualizer, rm;
    $wf = window.fashion;
    actualizer = $wf.$actualizer;
    rm = window.fashion.$runtimeMode;
    it("should accurately split properties", function() {
      var combinedMode, css, individual, selectors, _ref;
      combinedMode = rm.individual | rm.triggered;
      selectors = [
        {
          name: "t1",
          mode: 0,
          properties: [
            {
              name: "t1p1",
              mode: rm["static"]
            }, {
              name: "t1p2",
              mode: rm.individual
            }
          ]
        }, {
          name: "t2",
          mode: 1,
          properties: [
            {
              name: "t2p1",
              mode: rm.dynamic
            }
          ]
        }, {
          name: "t3",
          mode: 0,
          properties: [
            {
              name: "t3p1",
              mode: combinedMode
            }
          ]
        }
      ];
      _ref = actualizer.splitIndividual(selectors), css = _ref.cssSels, individual = _ref.individualSels;
      expect(css[0]).toBeDefined();
      expect(css[1]).toBeDefined();
      expect(css[2]).not.toBeDefined();
      expect(individual[0]).toBeDefined();
      expect(individual[1]).not.toBeDefined();
      expect(individual[2]).toBeDefined();
      expect(css[0].properties.length).toBe(1);
      expect(css[1].properties.length).toBe(1);
      expect(individual[0].properties.length).toBe(1);
      expect(individual[2].properties.length).toBe(1);
      expect(css[0].properties[0].name).toBe("t1p1");
      expect(css[1].properties[0].name).toBe("t2p1");
      expect(individual[0].properties[0].name).toBe("t1p2");
      return expect(individual[2].properties[0].name).toBe("t3p1");
    });
    return it("should convert CSS property names to JS", function() {
      var convert;
      convert = actualizer.makeCamelCase;
      expect(convert()).toBe("");
      expect(convert("margin")).toBe("margin");
      expect(convert("margin-left")).toBe("marginLeft");
      expect(convert("text-align")).toBe("textAlign");
      expect(convert("border-width-right")).toBe("borderWidthRight");
      expect(convert("-webkit-transform")).toBe("WebkitTransform");
      return expect(convert("-webkit-border-radius")).toBe("WebkitBorderRadius");
    });

    /*
    	These two functions no longer exist but I'm leaving their tests because they might be
    	helpful for writing tests for the new system
    
    	it "should map bindings based on whether they are dynamic or individual", ()->
    
    		jsSels = {
    			0: {properties: {
    				0: {name: "width"}
    				3: {name: "border-radius"}
    			}},
    			1: {properties: {
    				0: {name: "border-color-top"}
    			}},
    		}
    
    		indSels = {
    			0: {properties: {
    				1: {name: "height"}
    				2: {name: "background-color"}
    			}},
    			2: {properties: {
    				0: {name: "-webkit-transform"}
    			}},
    		}
    
    		bindings = [[0,0],[0,2],"$var",[0,3],[1,0],[2,0]]
    
    		 * Run the dependency mapper
    		deps = window.fashion.$actualizer.addBindings bindings, jsSels, indSels
    		
    		expect(deps.length).toBe(6)
    		expect(deps[0]).toEqual(["s",0,"width"])
    		expect(deps[1]).toEqual(["i",0,"backgroundColor"])
    		expect(deps[2]).toEqual(["v","var"])
    		expect(deps[3]).toEqual(["s",0,"borderRadius"])
    		expect(deps[4]).toEqual(["s",1,"borderColorTop"])
    		expect(deps[5]).toEqual(["i",2,"WebkitTransform"])
    
    
    	it "should remove bindings to triggered properties", ()->
    		jsSels = {
    			0: {properties: {
    				0: {name: "width", mode: 0}
    			}},
    			1: {properties: {
    				0: {name: "height", mode: $wf.$runtimeMode.triggered}
    			}},
    		}
    
    		indSels = {
    			0: {properties: {
    				1: {name: "top", mode: $wf.$runtimeMode.triggered}
    			}},
    			2: {properties: {
    				0: {name: "bottom", mode: 0}
    			}},
    		}
    
    		bindings = [[0,0],[0,1],[1,0],[2,0]]
    		
    		culled = window.fashion.$actualizer.removeTriggerBindings bindings, jsSels, indSels
    
    		expect(culled.length).toBe(2);
    		expect(culled[0]).toEqual([0,0])
    		expect(culled[1]).toEqual([2,0])
     */
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
    beforeEach(function() {
      window.fsStyleHeader = $wf.styleHeader;
      return $wf.styleHeader = "";
    });
    afterEach(function() {
      return $wf.styleHeader = window.fsStyleHeader;
    });
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
      cssString = 'body {background-color: blue !important;width: 50px !important;}\n';
      return expect(css).toBe(cssString);
    });
    it('should be able to lookup variable values', function() {
      var css, cssString;
      css = actualize(process(parse("$minHeight: 100px;\nbody {\n	width:100%;\n	min-height: $minHeight;\n}"))).css;
      cssString = "body {width: 100%;min-height: 100px;}\n";
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
        cssString += "" + prefix + "transition: background-color 100ms linear ;";
      }
      cssString += "}\n";
      return expect(css).toBe(cssString);
    });
    it('should generate the CSS for dynamic transitions', function() {
      var css, cssString, prefix, _i, _len;
      css = actualize(process(parse("$duration: 314ms;\nbody {\n	background-color: [linear $duration] blue;\n}"))).css;
      cssString = 'body {background-color: blue;';
      for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
        prefix = prefixes[_i];
        cssString += "" + prefix + "transition: background-color 314ms linear ;";
      }
      cssString += "}\n";
      return expect(css).toBe(cssString);
    });
    return it('should apply a constant header to the CSS', function() {
      var css;
      $wf.styleHeader = window.fsStyleHeader;
      css = actualize(process(parse("$not: empty;"))).css;
      return expect(css).toBe($wf.styleHeader);
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
      expect(window.FSMIN[0][0]).toContain($wf.$runtimeMode["static"]);
      expect(window.FSMIN[0][0][5][0]).toContain("padding");
      expect(window.FSMIN[0][0][5][0][4][0]).toBe("e");
      expect(window.FSMIN[0][0][5][1]).toContain("width");
      expect(window.FSMIN[0][0][5][1][4][0]).toBe("e");
      expect(window.FSMIN[1].length).toBe(1);
      expect(window.FSMIN[1][0]).toContain('size');
      expect(window.FSMIN[1][0]).toContain(10);
      expect(window.FSMIN[1][0]).toContain('px');
      return expect(window.FSMIN[2].length).toBe(0);
    });
    it('should expand minified selectors and variables', function() {
      var minData, props, rd;
      minData = [
        [["s", 0, 1, "body", 1, [["p", "padding", 1, 0, ["e", 1, 1, "px", "return (v('size').value) + 'px'"]], ["p", "width", 1, 0, ["e", 1, 1, "px", "return (v('size').value) + 'px'"]]]]], [
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
      expect(window.FSMIN[2][0]).toContain($wf.$runtimeMode["static"]);
      expect(window.FSMIN[2][0][5][0]).toContain("color");
      expect(window.FSMIN[2][0][5][0]).toContain($wf.$runtimeMode.individual);
      return expect(window.FSMIN[2][0][5][0][4][0]).toBe("e");
    });
    it('should expand individual properties', function() {
      var data, props, rd;
      data = [[], [], [["s", 0, 0, "body", 1, [["p", "color", 7, 0, ["e", 7, 2, null, "return e.color"]]]]]];
      rd = {
        selectors: {},
        variables: {},
        individual: {}
      };
      window.fashion.$actualizer.minifier.expandRuntimeData(data, rd);
      expect(rd.individual[0].name).toBe("body");
      expect(rd.individual[0].mode).toBe(1);
      expect(rd.individual[0].properties.length).toBe(1);
      props = rd.individual[0].properties;
      expect(props[0].name).toBe("color");
      expect(props[0].mode).toBe(7);
      return expect(props[0].value.evaluate).toBeDefined();
    });
    it('should minify multipart properties', function() {
      var js;
      js = actualize(process(parse("$size: 10px;\nbody {\n	border: $size solid black;\n}"))).js;
      window.FASHION = {};
      eval(js);
      expect(window.FSMIN[0][0][5][0]).toContain("border");
      expect(window.FSMIN[0][0][5][0][4][0][0]).toBe("e");
      expect(window.FSMIN[0][0][5][0][4][1]).toBe("solid");
      return expect(window.FSMIN[0][0][5][0][4][2]).toBe("black");
    });
    return it('should minify dynamic properties', function() {
      var js;
      js = actualize(process(parse("$id: test;\n#$id {\n	border: blue;\n}"))).js;
      window.FASHION = {};
      eval(js);
      expect(window.FSMIN[0].length).toBe(1);
      expect(window.FSMIN[0][0][3][0]).toBe('e');
      return expect(window.FSMIN[0][0]).toContain($wf.$runtimeMode.dynamic);
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
      expect(window.FASHION.selectors[0].name).toBe('body');
      expect(window.FASHION.selectors[0].properties.length).toBe(1);
      return expect(window.FASHION.selectors[0].properties[0].name).toBe('background-color');
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
      expect(FASHION.variables["padding"].dependents[0]).toEqual(['s', 0, 'padding']);
      return expect(FASHION.variables["padding"].dependents[1]).toEqual(['s', 1, 'padding']);
    });
    it('should properly map selector variable bindings to the separated CSS selectors', function() {
      var js;
      js = actualize(process(parse("$id: test;\nbody {\n	color: blue;\n}\n#$id {\n	color: white;\n}"))).js;
      window.FASHION = {};
      eval(js);
      return expect(FASHION.variables["id"].dependents[0]).toEqual(['s', 1]);
    });
    it('should leave out static variables', function() {
      var js;
      js = actualize(process(parse("$padding: 10px !static;\ndiv {\n	padding: $padding;\n	color: white;\n}\np {\n	pin: center;\n	padding: $padding;\n}"))).js;
      window.FASHION = {};
      eval(js);
      return expect(JSON.stringify(FASHION.selectors)).toBe("{}");
    });
    it('should not bind variables to trigger properties', function() {
      var js;
      js = actualize(process(parse("$clickProperty: 10px;\n$clickSet: 10px;\ndiv {\n	on-click: set(\"clickProperty\", $clickSet, 0);\n}"))).js;
      window.FASHION = {};
      eval(js);
      return expect(FASHION.variables["clickSet"].dependents.length).toBe(0);
    });
    it('should properly map variable bindings to the individual CSS selectors', function() {
      var js;
      js = actualize(process(parse("$padding: 10px;\ndiv {\n	padding: $padding;\n	color: white;\n}\np {\n	pin: center;\n	padding-left: @self.left + $padding;\n}"))).js;
      window.FASHION = {};
      eval(js);
      expect(FASHION.variables["padding"].dependents[0]).toEqual(['s', 0, 'padding']);
      return expect(FASHION.variables["padding"].dependents[1]).toEqual(['i', 1, 'paddingLeft']);
    });
    it('should not bind variables to other variables', function() {
      var js;
      js = actualize(process(parse("$padding: 10px;\n$width: 1000px - 2 * $padding;\ndiv {\n	width: $width;\n}"))).js;
      window.FASHION = {};
      eval(js);
      expect(FASHION.variables["padding"].dependents.length).toBe(1);
      return expect(FASHION.variables["padding"].dependents[0]).toEqual(['v', 'width', '0']);
    });
    it('should properly map global bindings to the separated CSS selectors', function() {
      var js;
      js = actualize(process(parse("div {\n	width: @height;\n	height: @height;\n	color: white;\n}"))).js;
      window.FASHION = {};
      eval(js.replace(/FSREADY\(/g, "FSREADYTEST("));
      expect(FASHION.modules.globals["height"].dependents[0]).toEqual(['s', 0, 'width']);
      return expect(FASHION.modules.globals["height"].dependents[1]).toEqual(['s', 0, 'height']);
    });
    return it('should mark !important properties as !important', function() {
      var js;
      js = actualize(process(parse("$color: blue;\ndiv {\n	color: $color !important;\n	background-color: $color;\n}"))).js;
      window.FASHION = {};
      eval(js.replace(/FSREADY\(/g, "FSREADYTEST("));
      expect(FASHION.selectors[0].properties[0].important).toEqual(1);
      return expect(FASHION.selectors[0].properties[1].important).toEqual(0);
    });
  };

}).call(this);
(function() {
  describe("Actualizer", function() {
    describe("CSS Transitions", window.fashiontests.actualizer.transitions);
    describe("CSS Generator", window.fashiontests.actualizer.css);
    describe("Components", window.fashiontests.actualizer.components);
    describe("JS Minifier", window.fashiontests.actualizer.minifier);
    return describe("JS Generator", window.fashiontests.actualizer.js);
  });

}).call(this);
