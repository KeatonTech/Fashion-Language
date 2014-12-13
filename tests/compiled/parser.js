(function() {
  if (!window.fashiontests) {
    window.fashiontests = {};
  }

  window.fashiontests.parser = {};

}).call(this);
(function() {
  window.fashiontests.parser.variables = function() {
    var parse, type, unit;
    parse = window.fashion.$parser.parse;
    type = window.fashion.$type;
    unit = window.fashion.$unit;
    it("should parse out string variables", function() {
      var result;
      result = parse("$singleQuote: 'string';\n$doubleQuote: \"quote\";");
      expect(result.variables["singleQuote"][0].value).toEqual("string");
      return expect(result.variables["doubleQuote"][0].value).toEqual("quote");
    });
    it("should parse out numerical variables", function() {
      var result;
      result = parse("$noUnit: 10;\n$pxUnit: 20px;\n$decimalEmUnit: .1em;\n$negativeMsUnit: -20ms;");
      expect(result.variables["noUnit"][0]["value"]).toEqual(10);
      expect(result.variables["pxUnit"][0]["value"]).toEqual(20);
      expect(result.variables["decimalEmUnit"][0]["value"]).toEqual(0.1);
      return expect(result.variables["negativeMsUnit"][0]["value"]).toEqual(-20);
    });
    return it("should allow multiple variables per line", function() {
      var result;
      result = parse("$singleQuote: 's1';$doubleQuote: \"s2\";");
      expect(result.variables["singleQuote"][0]["value"]).toEqual("s1");
      return expect(result.variables["doubleQuote"][0]["value"]).toEqual("s2");
    });
  };

}).call(this);
(function() {
  window.fashiontests.parser.selectors = function() {
    var parse;
    parse = window.fashion.$parser.parse;
    it("should parse complex selectors", function() {
      var result;
      result = parse("* {height: 30px;}\nul.test td:last-child {\n	background: black;\n}");
      console.log(result.selectors);
      expect(result.selectors[0].name).toBe("*");
      expect(result.selectors[0].properties['height']).toBe("30px");
      expect(result.selectors[1].name).toBe("ul.test td:last-child");
      return expect(result.selectors[1].properties['background']).toBe("black");
    });
    it("should parse nested selectors", function() {
      var result;
      result = parse(".outer {\n	opacity: 1.0;\n	.middle {\n		opacity: 0.5;\n		.inner {opacity: 0.0;}\n		&.super {opacity: 0.75;}\n		height: 50px\n	}\n	height: 100px\n}");
      expect(result.selectors['.outer']['opacity']).toBe("1.0");
      expect(result.selectors['.outer .middle']['opacity']).toBe("0.5");
      expect(result.selectors['.outer .middle .inner']['opacity']).toBe("0.0");
      expect(result.selectors['.outer .middle.super']['opacity']).toBe("0.75");
      expect(result.selectors['.outer']['height']).toBe("100px");
      return expect(result.selectors['.outer .middle']['height']).toBe("50px");
    });
    it("should allow selectors to be variables", function() {
      var result;
      result = parse("$contentDiv: content;\n.$contentDiv {\n	background: black;\n}");
      expect(result.selectors['.$contentDiv']['background']).toBe("black");
      return expect(result.variables.contentDiv.dependants).toEqual({
        ".$contentDiv": [" "]
      });
    });
    return it("should allow variables to be part of selectors", function() {
      var result;
      result = parse("$contentDiv: .content;\n$contentSub: p;\n$contentDiv h3 $contentSub {\n	color: black;\n}");
      expect(result.selectors['$contentDiv h3 $contentSub']['color']).toBe("black");
      expect(result.variables.contentDiv.dependants).toEqual({
        "$contentDiv h3 $contentSub": [" "]
      });
      return expect(result.variables.contentSub.dependants).toEqual({
        "$contentDiv h3 $contentSub": [" "]
      });
    });
  };

}).call(this);
(function() {
  window.fashiontests.parser.properties = function() {
    var parse;
    parse = window.fashion.$parser.parse;
    it("should allow properties with no semi-colon", function() {
      var result, sels;
      result = parse("p {\n	height: 100px\n	width: 200px\n}");
      sels = result.selectors.p;
      expect(sels.height).toBe("100px");
      return expect(sels.width).toBe("200px");
    });
    it("should allow one-line properties", function() {
      var result;
      result = parse("p {height: 120px;}");
      return expect(result.selectors.p.height).toBe("120px");
    });
    it("should allow multipart properties", function() {
      var expectedProperty, result, sels;
      result = parse("p {\n	border: 2px solid black;\n}");
      sels = result.selectors.p;
      expectedProperty = ['2px', 'solid', 'black'];
      return expect(sels.border).toEqual(expectedProperty);
    });
    it("should account for strings in multipart properties", function() {
      var expectedProperty, result, sels;
      result = parse("p {\n	text-style: \"Times New Roman\" italic;\n	another: 'Times New Roman' italic;\n}");
      sels = result.selectors.p;
      expectedProperty = ['"Times New Roman"', 'italic'];
      expect(sels["text-style"]).toEqual(expectedProperty);
      expectedProperty = ["'Times New Roman'", 'italic'];
      return expect(sels["another"]).toEqual(expectedProperty);
    });
    it("should allow comma-separated properties", function() {
      var expectedProperty, result, sels;
      result = parse("p {\n	property: 1px, 2px;\n}");
      sels = result.selectors.p;
      expectedProperty = [['1px'], ['2px']];
      return expect(sels.property).toEqual(expectedProperty);
    });
    it("should allow multipart comma-separated properties", function() {
      var expectedProperty, result, sels;
      result = parse("p {\n	border: 2px solid black, 1px solid white;\n}");
      sels = result.selectors.p;
      expectedProperty = [['2px', 'solid', 'black'], ['1px', 'solid', 'white']];
      return expect(sels.border).toEqual(expectedProperty);
    });
    it("should acknowledge !important on string properties", function() {
      var result, sels;
      result = parse("p {\n	height: 100px !important\n}");
      sels = result.selectors.p;
      return expect(sels.height).toBe("100px !important");
    });
    it("should link variables", function() {
      var result, sels;
      result = parse("$height: 100px;\np {\n	height: $height;\n}");
      sels = result.selectors.p;
      expect(sels.height.link).toBe("$height");
      expect(sels.height.dynamic).toBe(true);
      return expect(result.variables.height.dependants.p).toEqual(["height"]);
    });
    it("should link globals", function() {
      var result;
      result = parse("div {\n	height: @height;\n}");
      expect(result.selectors.div.height.dynamic).toBe(true);
      return expect(result.selectors.div.height.link).toBe("@height");
    });
    it("should acknowledge !important on linked properties", function() {
      var result, sels;
      result = parse("$height: 100px;\np {\n	height: $height !important\n}");
      sels = result.selectors.p;
      expect(sels.height.link).toBe("$height");
      return expect(sels.height.important).toBe(true);
    });
    return it("should parse transitions", function() {
      var result, sels;
      result = parse("$height: 100px;\n$width: 100px;\n$duration: 200ms;\n$delay: 100ms;\np {\n	height: [ease-out 1s] $height;\n	width: [ease-in-out $duration $delay] $width;\n}");
      sels = result.selectors.p;
      expect(sels.height.transition.easing).toBe("ease-out");
      expect(sels.height.transition.duration).toBe("1s");
      expect(sels.width.transition.easing).toBe("ease-in-out");
      expect(sels.width.transition.duration.link).toBe("$duration");
      expect(sels.width.transition.duration.dynamic).toBe(true);
      expect(sels.width.transition.delay.link).toBe("$delay");
      expect(sels.width.transition.delay.dynamic).toBe(true);
      expect(result.variables.duration.dependants.p).toEqual(["transition.width"]);
      return expect(result.variables.delay.dependants.p).toEqual(["transition.width"]);
    });
  };

}).call(this);
(function() {
  window.fashiontests.parser.expressions = function() {
    var parse;
    parse = window.fashion.$parser.parse;
    it("should allow variables in expressions", function() {
      var expression, result;
      result = parse("$fullHeight: 30px;\ndiv {\n	height: $fullHeight / 3;\n}");
      expression = result.selectors.div.height;
      expect(expression.dynamic).toBe(true);
      expect(expression.individualized).toBe(false);
      expect(expression.unit).toBe("px");
      expect(expression.evaluate({
        fullHeight: {
          value: 30
        }
      })).toBe("10px");
      expect(expression.evaluate({
        fullHeight: {
          value: 60
        }
      })).toBe("20px");
      return expect(result.variables.fullHeight.dependants.div).toEqual(["height"]);
    });
    it("should allow untyped variables in expressions", function() {
      var expression, result;
      result = parse("$heightDivisor: 3;\ndiv {\n	height: 30px / $heightDivisor;\n}");
      expression = result.selectors.div.height;
      expect(expression.dynamic).toBe(true);
      expect(expression.individualized).toBe(false);
      expect(expression.unit).toBe("px");
      expect(expression.evaluate({
        heightDivisor: {
          value: 3
        }
      })).toBe("10px");
      expect(expression.evaluate({
        heightDivisor: {
          value: 10
        }
      })).toBe("3px");
      return expect(result.variables.heightDivisor.dependants.div).toEqual(["height"]);
    });
    it("should parse functions with no arguments", function() {
      var expression, expressionResult, result;
      result = parse("div {\n	height: random();\n}");
      expression = result.selectors.div.height;
      expect(expression.functions).toEqual(['random']);
      expressionResult = expression.evaluate({}, {}, $wf.$functions);
      expect(parseFloat(expressionResult)).toBeGreaterThan(0);
      return expect(parseFloat(expressionResult)).toBeLessThan(1);
    });
    it("should parse functions with 1 argument", function() {
      var expression, expressionResult, result;
      result = parse("div {\n	height: round(11.4);\n}");
      expression = result.selectors.div.height;
      expect(expression.functions).toEqual(['round']);
      expressionResult = expression.evaluate({}, {}, $wf.$functions);
      return expect(parseFloat(expressionResult)).toBe(11);
    });
    it("should allow functions in expressions", function() {
      var expression, expressionResult, globals, locals, result;
      result = parse("$maxHeight: 300px;\ndiv {\n	height: min($maxHeight, @height);\n}");
      expression = result.selectors.div.height;
      expect(expression.functions).toEqual(['min']);
      locals = {
        maxHeight: {
          value: 300
        }
      };
      globals = {
        height: {
          get: function() {
            return 400;
          }
        }
      };
      expressionResult = expression.evaluate(locals, globals, $wf.$functions);
      return expect(expressionResult).toBe("300px");
    });
    it("should allow math inside function arguments", function() {
      var expression, expressionResult, globals, locals, result;
      result = parse("$maxHeight: 300px;\ndiv {\n	height: min($maxHeight * 2, @height);\n}");
      expression = result.selectors.div.height;
      expect(expression.functions).toEqual(['min']);
      locals = {
        maxHeight: {
          value: 300
        }
      };
      globals = {
        height: {
          get: function() {
            return 400;
          }
        }
      };
      expressionResult = expression.evaluate(locals, globals, $wf.$functions);
      return expect(expressionResult).toBe("400px");
    });
    it("should allow nested functions", function() {
      var expression, expressionResult, globals, locals, result;
      result = parse("$maxHeight: 300px;\n$minHeight: 100px;\ndiv {\n	height: max(min($maxHeight, @height), $minHeight);\n}");
      expression = result.selectors.div.height;
      expect(expression.functions).toEqual(['max', 'min']);
      locals = {
        maxHeight: {
          value: 300
        },
        minHeight: {
          value: 100
        }
      };
      globals = {
        height: {
          get: function() {
            return 50;
          }
        }
      };
      expressionResult = expression.evaluate(locals, globals, $wf.$functions);
      expect(expressionResult).toBe("100px");
      globals = {
        height: {
          get: function() {
            return 150;
          }
        }
      };
      expressionResult = expression.evaluate(locals, globals, $wf.$functions);
      expect(expressionResult).toBe("150px");
      globals = {
        height: {
          get: function() {
            return 500;
          }
        }
      };
      expressionResult = expression.evaluate(locals, globals, $wf.$functions);
      return expect(expressionResult).toBe("300px");
    });

    /* MAYBE THIS WILL COME BACK LATER
    	it "should allow bindings in expressions", ()->
    		result = parse("""
    						div {
    							height: @('#sidebar')px;
    						}
    						""")
    
    		bindSpy = jasmine.createSpy('spy').and.returnValue(10)
    		thisObj = {querySelector: bindSpy}
    
    		expression = result.selectors.div.height
    		expect(expression.dynamic).toBe(true)
    		expect(expression.individualized).toBe(false)
    		expect(expression.unit).toBe("px")
    		expect(expression.evaluate({},{},$wf.$functions,thisObj)).toBe("10px")
    
    		expect(bindSpy).toHaveBeenCalledWith("#sidebar")
     */
    it("should allow alternate-property bindings in expressions", function() {
      var bindSpy, expression, result, thisObj;
      result = parse("div {\n	height: @('#sidebar', 'width')px;\n}");
      bindSpy = jasmine.createSpy('spy').and.returnValue({});
      thisObj = {
        querySelector: bindSpy,
        getComputedStyle: function() {
          return {
            width: 20
          };
        }
      };
      expression = result.selectors.div.height;
      expect(expression.dynamic).toBe(true);
      expect(expression.individualized).toBe(false);
      expect(expression.unit).toBe("px");
      expect(expression.evaluate({}, {}, $wf.$functions, thisObj)).toBe("20px");
      return expect(bindSpy).toHaveBeenCalledWith("#sidebar");
    });
    it("should allow !important on expressions", function() {
      var expression, result;
      result = parse("$fullHeight: 30px;\ndiv {\n	height: $fullHeight / 3 !important;\n}");
      expression = result.selectors.div.height;
      expect(expression.evaluate({
        fullHeight: {
          value: 30
        }
      })).toBe("10px");
      expect(expression.important).toBe(true);
      expect(expression.individualized).toBe(false);
      return expect(expression.unit).toBe("px");
    });
    it("should recognize expressions that need to be individualized", function() {
      var expression, result;
      result = parse("div {\n	height: @('', 'width', @self)px / 1.5;\n}");
      expression = result.selectors.div.height;
      expect(expression.individualized).toBe(true);
      return expect(expression.unit).toBe("px");
    });
    it("should recognize setter expressions", function() {
      var expression, result;
      result = parse("$selected: \"divName\";\ndiv {\n	on-click: $selected = @self.id;\n}");
      expression = result.selectors.div['on-click'];
      expect(expression.individualized).toBe(true);
      expect(expression.type).toBe($wf.$type.String);
      return expect(expression.unit).toBe(void 0);
    });
    return it("should apply units to relative variables", function() {
      var expression, result;
      result = parse("div {\n	width: @self.width;\n}");
      expression = result.selectors.div.width;
      expect(expression.individualized).toBe(true);
      expect(expression.type).toBe($wf.$type.Number);
      return expect(expression.unit).toBe("px");
    });
  };

}).call(this);
(function() {
  window.fashiontests.parser.blocks = function() {
    var parse;
    parse = window.fashion.$parser.parse;
    it("should parse the block body and properties", function() {
      var block, result;
      result = parse("@block property1 property2 {\n	block body\n}");
      block = result.blocks[0];
      expect(block["arguments"].length).toBe(2);
      expect(block["arguments"][0]).toBe("property1");
      expect(block["arguments"][1]).toBe("property2");
      expect(block.body).toBe("block body");
      return expect(block.type).toBe("block");
    });
    it("should parse blocks with no properties", function() {
      var block, result;
      result = parse("@block-type {\n	block body 2\n}");
      block = result.blocks[0];
      expect(block["arguments"].length).toBe(0);
      expect(block.body).toBe("block body 2");
      return expect(block.type).toBe("block-type");
    });
    it("should parse one-line blocks", function() {
      var block, result;
      result = parse("@block_type a1 { block body 3 }");
      block = result.blocks[0];
      expect(block["arguments"].length).toBe(1);
      expect(block["arguments"][0]).toBe("a1");
      expect(block.body).toBe("block body 3");
      return expect(block.type).toBe("block_type");
    });
    it("should parse blocks with nested brackets", function() {
      var block, result;
      result = parse("@outer-block {\n	selector: {\n		property: 1;\n	}\n}");
      block = result.blocks[0];
      expect(block["arguments"].length).toBe(0);
      expect(block.body).toBe("selector: {\n		property: 1;\n	}");
      return expect(block.type).toBe("outer-block");
    });
    return it("should parse blocks with complex expression properties", function() {
      var block, result;
      result = parse("@client (@width < 10) 'this is a message' {\n	selector: {property: 1}\n}");
      block = result.blocks[0];
      expect(block["arguments"].length).toBe(2);
      expect(block["arguments"][0]).toBe("(@width < 10)");
      expect(block["arguments"][1]).toBe("'this is a message'");
      expect(block.body).toBe("selector: {property: 1}");
      return expect(block.type).toBe("client");
    });
  };

}).call(this);
(function() {
  describe("Parser", function() {
    describe("Variables", window.fashiontests.parser.variables);
    describe("Selectors", window.fashiontests.parser.selectors);
    describe("Blocks", window.fashiontests.parser.blocks);
    describe("Properties", window.fashiontests.parser.properties);
    return describe("Expressions", window.fashiontests.parser.expressions);
  });

}).call(this);
