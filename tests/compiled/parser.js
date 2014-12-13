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
      expect(result.variables["singleQuote"][0].type).toEqual(type.String);
      expect(result.variables["doubleQuote"][0].type).toEqual(type.String);
      expect(result.variables["singleQuote"][0].value).toEqual("string");
      return expect(result.variables["doubleQuote"][0].value).toEqual("quote");
    });
    it("should parse out numerical variables", function() {
      var result;
      result = parse("$noUnit: 10;\n$pxUnit: 20px;\n$decimalEmUnit: .1em;\n$negativeMsUnit: -20ms;");
      expect(result.variables["noUnit"][0]["type"]).toEqual(type.Number);
      expect(result.variables["pxUnit"][0]["type"]).toEqual(type.Number);
      expect(result.variables["decimalEmUnit"][0]["type"]).toEqual(type.Number);
      expect(result.variables["negativeMsUnit"][0]["type"]).toEqual(type.Number);
      expect(result.variables["noUnit"][0]["unit"]).toEqual(false);
      expect(result.variables["pxUnit"][0]["unit"]).toEqual(unit.Number.px);
      expect(result.variables["decimalEmUnit"][0]["unit"]).toEqual(unit.Number.em);
      expect(result.variables["negativeMsUnit"][0]["unit"]).toEqual(unit.Number.ms);
      expect(result.variables["noUnit"][0]["value"]).toEqual(10);
      expect(result.variables["pxUnit"][0]["value"]).toEqual(20);
      expect(result.variables["decimalEmUnit"][0]["value"]).toEqual(0.1);
      return expect(result.variables["negativeMsUnit"][0]["value"]).toEqual(-20);
    });
    return it("should parse out color variables", function() {
      var result;
      result = parse("$colorConst: red;\n$colorHex: #da0;\n$colorRGB: rgb(200,100,50);\n$colorRGBA: rgba(200,100,50,0.5);");
      expect(result.variables["colorConst"][0]["type"]).toEqual(type.Color);
      expect(result.variables["colorHex"][0]["type"]).toEqual(type.Color);
      expect(result.variables["colorRGB"][0]["type"]).toEqual(type.Color);
      expect(result.variables["colorRGBA"][0]["type"]).toEqual(type.Color);
      expect(result.variables["colorConst"][0]["unit"]).toEqual(unit.Color.Const);
      expect(result.variables["colorHex"][0]["unit"]).toEqual(unit.Color.Hex);
      expect(result.variables["colorRGB"][0]["unit"]).toEqual(unit.Color.RGB);
      return expect(result.variables["colorRGBA"][0]["unit"]).toEqual(unit.Color.RGBA);
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
      expect(result.selectors[0].name).toBe("*");
      expect(result.selectors[0].properties[0].value).toBe("30px");
      expect(result.selectors[1].name).toBe("ul.test td:last-child");
      return expect(result.selectors[1].properties[0].value).toBe("black");
    });
    it("should parse nested selectors", function() {
      var result;
      result = parse(".outer {\n	opacity: 1.0;\n	.middle {\n		opacity: 0.5;\n		.inner {opacity: 0.0;}\n		&.super {opacity: 0.75;}\n		height: 50px\n	}\n	height: 100px\n}");
      expect(result.selectors[0].name).toBe(".outer");
      expect(result.selectors[1].name).toBe(".outer .middle");
      expect(result.selectors[2].name).toBe(".outer .middle .inner");
      expect(result.selectors[3].name).toBe(".outer .middle.super");
      expect(result.selectors[0].properties[0].value).toBe("1.0");
      expect(result.selectors[1].properties[0].value).toBe("0.5");
      expect(result.selectors[2].properties[0].value).toBe("0.0");
      expect(result.selectors[3].properties[0].value).toBe("0.75");
      expect(result.selectors[0].properties[1].value).toBe("100px");
      return expect(result.selectors[1].properties[1].value).toBe("50px");
    });
    it("should allow selectors to be variables", function() {
      var nameExpression, result, v;
      result = parse("$contentDiv: content;\n.$contentDiv {\n	background: black;\n}");
      expect(result.selectors[0].properties[0].value).toBe("black");
      nameExpression = result.selectors[0].name;
      v = {
        t: {
          contentDiv: {
            value: "content"
          }
        }
      };
      expect(nameExpression.evaluate(v)).toBe(".content");
      expect(result.bindings.variables["contentDiv"].length).toBe(1);
      return expect(result.bindings.variables["contentDiv"][0]).toBe(0);
    });
    return it("should allow variables to be part of selectors", function() {
      var nameExpression, result, v;
      result = parse("$contentDiv: .content;\n$contentSub: p;\n$contentDiv h3 $contentSub {\n	color: black;\n}");
      nameExpression = result.selectors[0].name;
      v = {
        t: {
          contentDiv: {
            value: ".content"
          },
          contentSub: {
            value: "p"
          }
        }
      };
      expect(nameExpression.evaluate(v)).toBe(".content h3 p");
      expect(result.bindings.variables["contentDiv"].length).toBe(1);
      expect(result.bindings.variables["contentDiv"][0]).toBe(0);
      expect(result.bindings.variables["contentSub"].length).toBe(1);
      return expect(result.bindings.variables["contentSub"][0]).toBe(0);
    });
  };

}).call(this);
(function() {
  window.fashiontests.parser.properties = function() {
    var parse;
    parse = window.fashion.$parser.parse;
    it("should allow properties with no semi-colon", function() {
      var props, result;
      result = parse("p {\n	height: 100px\n	width: 200px\n}");
      props = result.selectors[0].properties;
      expect(props[0].name).toBe("height");
      expect(props[0].value).toBe("100px");
      expect(props[1].name).toBe("width");
      return expect(props[1].value).toBe("200px");
    });
    it("should allow one-line properties", function() {
      var result;
      result = parse("p {height: 120px;}");
      expect(result.selectors[0].properties[0].name).toBe("height");
      return expect(result.selectors[0].properties[0].value).toBe("120px");
    });
    it("should allow multipart properties", function() {
      var expectedProperty, props, result;
      result = parse("p {\n	border: 2px solid black;\n}");
      props = result.selectors[0].properties;
      expectedProperty = ['2px', 'solid', 'black'];
      return expect(props[0].value).toEqual(expectedProperty);
    });
    it("should account for strings in multipart properties", function() {
      var expectedProperty, props, result;
      result = parse("p {\n	text-style: \"Times New Roman\" italic;\n	another: 'Times New Roman' italic;\n}");
      props = result.selectors[0].properties;
      expectedProperty = ['"Times New Roman"', 'italic'];
      expect(props[0].value).toEqual(expectedProperty);
      expectedProperty = ["'Times New Roman'", 'italic'];
      return expect(props[1].value).toEqual(expectedProperty);
    });
    it("should allow comma-separated properties", function() {
      var expectedProperty, props, result;
      result = parse("p {\n	property: 1px, 2px;\n}");
      props = result.selectors[0].properties;
      expectedProperty = [['1px'], ['2px']];
      return expect(props[0].value).toEqual(expectedProperty);
    });
    it("should allow multipart comma-separated properties", function() {
      var expectedProperty, props, result;
      result = parse("p {\n	border: 2px solid black, 1px solid white;\n}");
      props = result.selectors[0].properties;
      expectedProperty = [['2px', 'solid', 'black'], ['1px', 'solid', 'white']];
      return expect(props[0].value).toEqual(expectedProperty);
    });
    it("should acknowledge !important on string properties", function() {
      var props, result;
      result = parse("p {\n	height: 100px !important\n}");
      props = result.selectors[0].properties;
      return expect(props[0].value).toBe("100px !important");
    });
    it("should acknowledge !important on linked properties", function() {
      var props, result;
      result = parse("$height: 100px;\np {\n	height: $height !important\n}");
      props = result.selectors[0].properties;
      return expect(props[0].value.important).toBe(true);
    });
    return it("should parse transitions", function() {
      var height, props, result, width;
      result = parse("$height: 100px;\n$width: 100px;\n$duration: 200ms;\n$delay: 100ms;\np {\n	height: [ease-out 1s] $height;\n	width: [ease-in-out $duration $delay] $width;\n}");
      props = result.selectors[0].properties;
      height = props[0].value;
      width = props[1].value;
      console.log(width.transition);
      expect(height.transition.easing).toBe("ease-out");
      expect(height.transition.duration).toBe("1s");
      return expect(width.transition.easing).toBe("ease-in-out");
    });
  };

}).call(this);
(function() {
  window.fashiontests.parser.expressions = function() {
    var $wf, parse;
    $wf = window.fashion;
    parse = window.fashion.$parser.parse;
    it("should allow variables in expressions", function() {
      var expression, pExpression, result, v;
      result = parse("$fullHeight: 30px;\ndiv {\n	height: $fullHeight / 3;\n\n	p {\n		height: $fullHeight / 3 - 4;\n	}\n}");
      expression = result.selectors[0].properties[0].value;
      pExpression = result.selectors[1].properties[0].value;
      v = {
        t: {
          fullHeight: {
            value: 30
          }
        }
      };
      expect(expression.dynamic).toBe(true);
      expect(expression.individualized).toBe(false);
      expect(expression.unit).toBe("px");
      expect(expression.evaluate(v)).toBe("10px");
      expect(pExpression.evaluate(v)).toBe("6px");
      v.t.fullHeight.value = 60;
      expect(expression.evaluate(v)).toBe("20px");
      expect(pExpression.evaluate(v)).toBe("16px");
      expect(result.bindings.variables["fullHeight"].length).toBe(2);
      expect(result.bindings.variables["fullHeight"][0]).toBe(0);
      return expect(result.bindings.variables["fullHeight"][1]).toBe(1);
    });
    it("should allow untyped variables in expressions", function() {
      var expression, result, v;
      result = parse("$heightDivisor: 3;\ndiv {\n	height: 30px / $heightDivisor;\n}");
      expression = result.selectors[0].properties[0].value;
      expect(expression.dynamic).toBe(true);
      expect(expression.individualized).toBe(false);
      expect(expression.unit).toBe("px");
      v = {
        t: {
          heightDivisor: {
            value: 3
          }
        }
      };
      expect(expression.evaluate(v)).toBe("10px");
      v = {
        t: {
          heightDivisor: {
            value: 10
          }
        }
      };
      expect(expression.evaluate(v)).toBe("3px");
      return expect(result.bindings.variables["heightDivisor"][0]).toBe(0);
    });
    it("should parse functions with no arguments", function() {
      var expression, expressionResult, result;
      result = parse("div {\n	height: random();\n}");
      expression = result.selectors[0].properties[0].value;
      expressionResult = expression.evaluate({}, {}, $wf.$functions);
      expect(parseFloat(expressionResult)).toBeGreaterThan(0);
      expect(parseFloat(expressionResult)).toBeLessThan(1);
      return expect(result.dependencies.functions["range"]).toBe($wf.$functions.range);
    });
    it("should parse functions with 1 argument", function() {
      var expression, expressionResult, result;
      result = parse("div {\n	height: round(11.4);\n}");
      expression = result.selectors[0].properties[0].value;
      expressionResult = expression.evaluate({}, {}, $wf.$functions);
      expect(parseFloat(expressionResult)).toBe(11);
      return expect(result.dependencies.functions["round"]).toBe($wf.$functions.round);
    });
    it("should allow functions with variable and global arguments", function() {
      var expression, expressionResult, globals, locals, result;
      result = parse("$maxHeight: 300px;\ndiv {\n	height: min($maxHeight, @height);\n}");
      expression = result.selectors[0].properties[0].value;
      locals = {
        t: {
          maxHeight: {
            value: 300
          }
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
      expect(expressionResult).toBe("300px");
      expect(result.dependencies.functions["min"]).toBe($wf.$functions.min);
      return expect(result.dependencies.globals["height"]).toBe($wf.$globals.height);
    });
    it("should allow math inside function arguments", function() {
      var expression, expressionResult, globals, locals, result;
      result = parse("$maxHeight: 300px;\ndiv {\n	height: min($maxHeight * 2, @height);\n}");
      expression = result.selectors[0].properties[0].value;
      locals = {
        t: {
          maxHeight: {
            value: 100
          }
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
      expect(expressionResult).toBe("200px");
      expect(result.dependencies.functions["min"]).toBe($wf.$functions.min);
      return expect(result.dependencies.globals["height"]).toBe($wf.$globals.height);
    });
    it("should allow nested functions", function() {
      var expression, expressionResult, globals, locals, result;
      result = parse("$maxHeight: 300px;\n$minHeight: 100px;\ndiv {\n	height: max(min($maxHeight, @height), $minHeight);\n}");
      expression = result.selectors[0].properties[0].value;
      locals = {
        t: {
          maxHeight: {
            value: 300
          },
          minHeight: {
            value: 100
          }
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
      expect(expressionResult).toBe("300px");
      expect(result.dependencies.functions["min"]).toBe($wf.$functions.min);
      expect(result.dependencies.functions["max"]).toBe($wf.$functions.max);
      return expect(result.dependencies.globals["height"]).toBe($wf.$globals.height);
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
      expression = result.selectors[0].properties[0].value;
      expect(expression.dynamic).toBe(true);
      expect(expression.individualized).toBe(false);
      expect(expression.unit).toBe("px");
      expect(expression.evaluate({}, {}, $wf.$functions, thisObj)).toBe("20px");
      return expect(bindSpy).toHaveBeenCalledWith("#sidebar");
    });
    it("should allow !important on expressions", function() {
      var expression, result;
      result = parse("$fullHeight: 30px;\ndiv {\n	height: $fullHeight / 3 !important;\n}");
      expression = result.selectors[0].properties[0].value;
      expect(expression.evaluate({
        t: {
          fullHeight: {
            value: 30
          }
        }
      })).toBe("10px");
      expect(expression.important).toBe(true);
      expect(expression.individualized).toBe(false);
      return expect(expression.unit).toBe("px");
    });
    it("should recognize expressions that need to be individualized", function() {
      var expression, result;
      result = parse("div {\n	height: @('', 'width', @self)px / 1.5;\n}");
      expression = result.selectors[0].properties[0].value;
      expect(expression.individualized).toBe(true);
      return expect(expression.unit).toBe("px");
    });
    it("should recognize setter expressions", function() {
      var expression, result;
      result = parse("$selected: \"divName\";\ndiv {\n	on-click: $selected = @self.id;\n}");
      expression = result.selectors[0].properties[0].value;
      expect(expression.individualized).toBe(true);
      expect(expression.type).toBe($wf.$type.String);
      return expect(expression.unit).toBe(void 0);
    });
    return it("should apply units to relative variables", function() {
      var expression, result;
      result = parse("div {\n	width: @self.width;\n}");
      expression = result.selectors[0].properties[0].value;
      expect(expression.individualized).toBe(true);
      expect(expression.type).toBe($wf.$type.Number);
      return expect(expression.unit).toBe("px");
    });
  };

}).call(this);
(function() {
  window.fashiontests.parser.blocks = function() {
    var $wf, parse;
    $wf = window.fashion;
    parse = window.fashion.$parser.parse;
    it("should parse the block body and properties", function() {
      var block, result;
      result = parse("@transition property1 property2 {\n	block body\n}");
      block = result.blocks[0];
      expect(block["arguments"].length).toBe(2);
      expect(block["arguments"][0]).toBe("property1");
      expect(block["arguments"][1]).toBe("property2");
      expect(block.body).toBe("block body");
      expect(block.type).toBe("transition");
      return expect(result.dependencies.blocks["transition"]).toBe($wf.$blocks.transition);
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
