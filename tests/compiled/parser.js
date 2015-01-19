(function() {
  if (!window.fashiontests) {
    window.fashiontests = {};
  }

  window.fashiontests.parser = {};

}).call(this);
(function() {
  window.fashiontests.parser.variables = function() {
    var $wf, parse, type, unit;
    $wf = window.fashion;
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
      expect(result.variables["noUnit"][0]["unit"]).toEqual('');
      expect(result.variables["pxUnit"][0]["unit"]).toEqual(unit.Number.px);
      expect(result.variables["decimalEmUnit"][0]["unit"]).toEqual(unit.Number.em);
      expect(result.variables["negativeMsUnit"][0]["unit"]).toEqual(unit.Number.ms);
      expect(result.variables["noUnit"][0]["value"]).toEqual(10);
      expect(result.variables["pxUnit"][0]["value"]).toEqual(20);
      expect(result.variables["decimalEmUnit"][0]["value"]).toEqual(0.1);
      return expect(result.variables["negativeMsUnit"][0]["value"]).toEqual(-20);
    });
    it("should parse out color variables", function() {
      var result, rgbExpression, rgbaExpression;
      result = parse("$colorConst: red;\n$colorHex: #da0;\n$colorRGB: rgb(200,100,50.4);\n$colorRGBA: rgba(200,100.01,50,0.5);");
      expect(result.variables["colorConst"][0]["type"]).toEqual(type.Color);
      expect(result.variables["colorHex"][0]["type"]).toEqual(type.Color);
      expect(result.variables["colorRGB"][0]["type"]).toEqual(type.Color);
      expect(result.variables["colorRGBA"][0]["type"]).toEqual(type.Color);
      expect(result.variables["colorConst"][0]["value"]).toEqual("red");
      expect(result.variables["colorHex"][0]["value"]).toEqual("#da0");
      rgbExpression = result.variables["colorRGB"][0].value.evaluate;
      expect(rgbExpression(0, 0, $wf.$functions)).toEqual("rgb(200,100,50)");
      rgbaExpression = result.variables["colorRGBA"][0].value.evaluate;
      return expect(rgbaExpression(0, 0, $wf.$functions)).toEqual("rgba(200,100,50,0.5)");
    });
    it("should allow variables to rely on other variables", function() {
      var result, v;
      result = parse("$main: 10px;\n$copy: $main;");
      expect(result.variables["main"][0]["value"]).toEqual(10);
      expect(result.variables["copy"][0]["value"].script).toBeDefined();
      v = function(name) {
        if (name === "main") {
          return {
            value: 10
          };
        }
      };
      expect(result.variables["copy"][0]["value"].evaluate(v)).toBe(10);
      v = function(name) {
        if (name === "main") {
          return {
            value: 20
          };
        }
      };
      expect(result.variables["copy"][0]["value"].evaluate(v)).toBe(20);
      expect(result.variables["main"][0]["type"]).toEqual(type.Number);
      expect(result.variables["copy"][0]["type"]).toEqual(type.Number);
      expect(result.variables["main"][0]["unit"]).toEqual(unit.Number.px);
      expect(result.variables["copy"][0]["unit"]).toEqual(unit.Number.px);
      return expect(result.variables["copy"][0]["value"].bindings.variables[0]).toBe("main");
    });
    it("should allow variables to be expressions", function() {
      var result, v;
      result = parse("$main: 10px;\n$offset: 3px;\n$height: $main / 2 + $offset;");
      expect(result.variables["main"][0]["value"]).toEqual(10);
      expect(result.variables["offset"][0]["value"]).toEqual(3);
      v = function(name) {
        if (name === "main") {
          return {
            value: 10
          };
        } else if ("offset") {
          return {
            value: 3
          };
        }
      };
      expect(result.variables["height"][0]["value"].evaluate(v)).toBe(8);
      v = function(name) {
        if (name === "main") {
          return {
            value: 20
          };
        } else if ("offset") {
          return {
            value: 5
          };
        }
      };
      expect(result.variables["height"][0]["value"].evaluate(v)).toBe(15);
      expect(result.variables["height"][0]["value"].bindings.variables[0]).toBe("main");
      return expect(result.variables["height"][0]["value"].bindings.variables[1]).toBe("offset");
    });
    it("should allow variables within selectors", function() {
      var result;
      result = parse(".menu {\n	$selected: 'main';\n}");
      expect(result.variables["selected"][".menu"]["value"]).toEqual("main");
      return expect(result.variables["selected"][".menu"]["type"]).toEqual(type.String);
    });
    it("should allow variables within nested selectors", function() {
      var result;
      result = parse(".menu {\n	.main {\n		$isSelected: true;\n	}\n}");
      expect(result.variables["isSelected"][".menu .main"]["value"]).toEqual("true");
      return expect(result.variables["isSelected"][".menu .main"]["type"]).toEqual(type.Unknown);
    });
    return it("should accept variable definitions without semicolons", function() {
      var result;
      result = parse("$var1: 1px\n.menu {\n	$var2: 10px\n}");
      expect(result.variables["var1"][0]["value"]).toEqual(1);
      expect(result.variables["var1"][0]["type"]).toEqual(type.Number);
      expect(result.variables["var2"][".menu"]["value"]).toEqual(10);
      return expect(result.variables["var2"][".menu"]["type"]).toEqual(type.Number);
    });
  };

}).call(this);
(function() {
  window.fashiontests.parser.selectors = function() {
    var $wf, parse;
    $wf = window.fashion;
    parse = window.fashion.$parser.parse;
    it("should parse complex selectors", function() {
      var result;
      result = parse("* {height: 30px;}\nul.test td:last-child {\n	background: black;\n}");
      expect(result.selectors[0].name).toBe("*");
      expect(result.selectors[0].properties[0].value).toBe("30px");
      expect(result.selectors[1].name).toBe("ul.test td:last-child");
      return expect(result.selectors[1].properties[0].value).toBe("black");
    });
    it("should filter out comments", function() {
      var result;
      result = parse("// This is a one-line comment\n* {height: 30px;}\n\n/*  \nThis is a multiline-style comment\nof the sort you might find in JS\n*/\nul.test td:last-child {\n\n	/*|*| Mozilla-style comment\n	\*/\n	background: black;\n}\n\n/*\nselector {\n	inside: comment;\n}\n*/");
      expect(result.selectors.length).toBe(2);
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
      expect(result.selectors[0].properties[0].mode).toBe($wf.$runtimeMode["static"]);
      expect(result.selectors[0].properties[1].value).toBe("100px");
      return expect(result.selectors[1].properties[1].value).toBe("50px");
    });
    it("should allow selectors to be variables", function() {
      var nameExpression, result, v;
      result = parse("$contentDiv: '.content';\n$contentDiv {\n	background: black;\n}");
      expect(result.selectors[0].properties[0].value).toBe("black");
      expect(result.selectors[0].properties[0].mode).toBe($wf.$runtimeMode.dynamic);
      expect(result.selectors[0].mode).toBe($wf.$runtimeMode.dynamic);
      nameExpression = result.selectors[0].name;
      v = function(name) {
        if (name === "contentDiv") {
          return {
            value: ".content"
          };
        }
      };
      expect(nameExpression.evaluate(v)).toBe(".content");
      return expect(nameExpression.bindings.variables[0]).toBe("contentDiv");
    });
    it("should allow variables to be part of selectors", function() {
      var nameExpression, result, v;
      result = parse("$contentDiv: .content;\n$contentSub: p;\n$contentDiv h3 $contentSub {\n	color: black;\n}");
      expect(result.selectors[0].properties[0].mode).toBe($wf.$runtimeMode.dynamic);
      nameExpression = result.selectors[0].name;
      v = function(name) {
        switch (name) {
          case "contentDiv":
            return {
              value: ".content"
            };
          case "contentSub":
            return {
              value: "p"
            };
        }
      };
      expect(nameExpression.evaluate(v)).toBe(".content h3 p");
      expect(nameExpression.bindings.variables[0]).toBe("contentDiv");
      return expect(nameExpression.bindings.variables[1]).toBe("contentSub");
    });
    it("should allow nested selectors inside of variable selectors", function() {
      var result, v;
      result = parse("$contentDiv: .content;\n$contentDiv {\n	width: 100px\n	h3 {\n		color: black;\n	}\n}");
      expect(result.selectors[0].properties[0].mode).toBe($wf.$runtimeMode.dynamic);
      v = function(name) {
        return {
          value: ".content"
        };
      };
      expect(result.selectors[0].name.evaluate(v)).toBe(".content");
      expect(result.selectors[1].name.evaluate(v)).toBe(".content h3");
      expect(result.selectors[0].name.bindings.variables[0]).toBe("contentDiv");
      return expect(result.selectors[1].name.bindings.variables[0]).toBe("contentDiv");
    });
    it("should allow nested variable selectors", function() {
      var result, v;
      result = parse("$contentDiv: .content;\ndiv {\n	width: 100px;\n	$contentDiv {\n		color: black;\n	}\n}");
      expect(result.selectors[1].properties[0].mode).toBe($wf.$runtimeMode.dynamic);
      v = function(name) {
        return {
          value: ".content"
        };
      };
      expect(result.selectors[1].name.evaluate(v)).toBe("div .content");
      return expect(result.selectors[1].name.bindings.variables[0]).toBe("contentDiv");
    });
    it("should properly nest comma separated selectors", function() {
      var result;
      result = parse("div,article {\n	a, p {\n		color: red;\n	}\n}");
      expect(result.selectors[0].name).toBe("div,article");
      return expect(result.selectors[1].name).toBe("div a,div p,article a,article p");
    });
    it("should properly nest comma separated selectors with variables", function() {
      var result, v;
      result = parse("$contentDiv1: .content;\n$contentDiv2: .stuff;\ndiv {\n	width: 100px;\n	$contentDiv1, $contentDiv2 {\n		color: black;\n	}\n}");
      expect(result.selectors[1].properties[0].mode).toBe($wf.$runtimeMode.dynamic);
      v = function(name) {
        switch (name) {
          case 'contentDiv1':
            return {
              value: ".content"
            };
          default:
            return {
              value: ".stuff"
            };
        }
      };
      return expect(result.selectors[1].name.evaluate(v)).toBe("div .content,div .stuff");
    });
    return it("should properly nest comma separated selectors with an &", function() {
      var result;
      result = parse("div,article {\n	a, &:hover {\n		color: red;\n	}\n}");
      expect(result.selectors[0].name).toBe("div,article");
      return expect(result.selectors[1].name).toBe("div a,div:hover,article a,article:hover");
    });
  };

}).call(this);
(function() {
  window.fashiontests.parser.properties = function() {
    var $wf, parse;
    $wf = window.fashion;
    parse = window.fashion.$parser.parse;
    it("should allow properties with no semi-colon", function() {
      var props, result;
      result = parse("p {\n	height: 100px\n	width: 200px\n}");
      props = result.selectors[0].properties;
      expect(props[0].name).toBe("height");
      expect(props[0].value).toBe("100px");
      expect(props[0].mode).toBe($wf.$runtimeMode["static"]);
      expect(props[1].name).toBe("width");
      expect(props[1].value).toBe("200px");
      return expect(props[1].mode).toBe($wf.$runtimeMode["static"]);
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
    it("should allow variables in multipart properties", function() {
      var props, result, v;
      result = parse("$borderWidth: 2px;\np {\n	border: $borderWidth solid black;\n}");
      props = result.selectors[0].properties;
      expect(props[0].mode).toBe($wf.$runtimeMode.dynamic);
      v = function(name) {
        return {
          value: 2
        };
      };
      return expect(props[0].value[0].evaluate(v)).toBe("2px");
    });
    it("should allow expressions in multipart properties", function() {
      var props, result, v;
      result = parse("$borderWidth: 2px;\np {\n	box-shadow: $borderWidth / 2 -$borderWidth $borderWidth*2 black;\n}");
      props = result.selectors[0].properties;
      expect(props[0].mode).toBe($wf.$runtimeMode.dynamic);
      v = function(name) {
        return {
          value: 2
        };
      };
      expect(props[0].value[0].evaluate(v)).toBe("1px");
      expect(props[0].value[1].evaluate(v)).toBe("-2px");
      expect(props[0].value[2].evaluate(v)).toBe("4px");
      return expect(props[0].value[3]).toBe("black");
    });
    it("should allow relative values in multipart properties", function() {
      var props, result;
      result = parse("p {\n	box-shadow: 0px @self.depth @self.depth black;\n}");
      props = result.selectors[0].properties;
      expect(props[0].mode).toBe($wf.$runtimeMode.individual);
      expect(props[0].value[0]).toBe("0px");
      return expect(props[0].value[3]).toBe("black");
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
      expect(props[0].value).toBe("100px");
      return expect(props[0].important).toBe(true);
    });
    it("should acknowledge !important on linked properties", function() {
      var props, result;
      result = parse("$height: 100px;\np {\n	height: $height !important\n}");
      props = result.selectors[0].properties;
      expect(props[0].important).toBe(true);
      return expect(props[0].mode).toBe($wf.$runtimeMode.dynamic);
    });
    return it("should parse transitions", function() {
      var height, props, result, width;
      result = parse("$height: 100px;\n$width: 100px;\n$duration: 200ms;\n$delay: 100ms;\np {\n	height: [ease-out 1s] $height;\n	width: [ease-in-out $duration $delay] $width;\n}");
      props = result.selectors[0].properties;
      height = props[0].value;
      width = props[1].value;
      expect(height.transition.easing).toBe("ease-out");
      expect(height.transition.duration).toBe("1s");
      return expect(width.transition.easing).toBe("ease-in-out");
    });
  };

}).call(this);
(function() {
  window.fashiontests.parser.expressions = function() {
    var $wf, FunctionModule, parse;
    $wf = window.fashion;
    parse = window.fashion.$parser.parse;
    FunctionModule = window.fashion.$class.FunctionModule;
    it("should allow variables in expressions", function() {
      var expression, pExpression, result, v;
      result = parse("$fullHeight: 30px;\ndiv {\n	height: $fullHeight / 3;\n\n	p {\n		height: $fullHeight / 3 - 4;\n	}\n}");
      expression = result.selectors[0].properties[0].value;
      pExpression = result.selectors[1].properties[0].value;
      v = function(name) {
        return {
          value: 30
        };
      };
      expect(expression.mode).toBe($wf.$runtimeMode.dynamic);
      expect(expression.unit).toBe("px");
      expect(expression.evaluate(v)).toBe("10px");
      expect(pExpression.evaluate(v)).toBe("6px");
      v = function(name) {
        return {
          value: 60
        };
      };
      expect(expression.evaluate(v)).toBe("20px");
      expect(pExpression.evaluate(v)).toBe("16px");
      expect(expression.bindings.variables[0]).toBe("fullHeight");
      return expect(pExpression.bindings.variables[0]).toBe("fullHeight");
    });
    it("should allow untyped variables in expressions", function() {
      var expression, result, v;
      result = parse("$heightDivisor: 3;\ndiv {\n	height: 30px / $heightDivisor;\n}");
      expression = result.selectors[0].properties[0].value;
      expect(expression.mode).toBe($wf.$runtimeMode.dynamic);
      expect(expression.unit).toBe("px");
      v = function(name) {
        return {
          value: 3
        };
      };
      expect(expression.evaluate(v)).toBe("10px");
      v = function(name) {
        return {
          value: 10
        };
      };
      expect(expression.evaluate(v)).toBe("3px");
      return expect(expression.bindings.variables[0]).toBe("heightDivisor");
    });
    it("should parse functions with no arguments", function() {
      var expression, expressionResult, result;
      result = parse("div {\n	height: random();\n}");
      expression = result.selectors[0].properties[0].value;
      expect(expression.mode).toBe($wf.$functions.random.mode || 0);
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
      locals = function(name) {
        if (name === "maxHeight") {
          return {
            value: 300
          };
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
      locals = function() {
        return {
          value: 100
        };
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
      locals = function(name) {
        switch (name) {
          case "maxHeight":
            return {
              value: 300
            };
          case "minHeight":
            return {
              value: 100
            };
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
    	
    
    	it "should allow alternate-property bindings in expressions", ()->
    		result = parse( """
    						div {
    							height: @('#sidebar', 'width')px;
    						}
    						""")
    		console.log result
    
    		bindSpy = jasmine.createSpy('spy').and.returnValue({})
    		thisObj = {
    			querySelector: bindSpy
    			getComputedStyle: ()-> {width: 20}
    		}
    
    		expression = result.selectors[0].properties[0].value
    		expect(expression.mode).toBe($wf.$runtimeMode.dynamic)
    		expect(expression.unit).toBe("px")
    		expect(expression.evaluate({},{},$wf.$functions)).toBe("20px")
    
    		expect(bindSpy).toHaveBeenCalledWith("#sidebar", 'width')
     */
    it("should allow !important on expressions", function() {
      var expression, result;
      result = parse("$fullHeight: 30px;\ndiv {\n	height: $fullHeight / 3 !important;\n}");
      expression = result.selectors[0].properties[0].value;
      expect(expression.evaluate(function() {
        return {
          value: 30
        };
      })).toBe("10px");
      expect(result.selectors[0].properties[0].important).toBe(true);
      expect(expression.mode).toBe($wf.$runtimeMode.dynamic);
      return expect(expression.unit).toBe("px");
    });
    it("should recognize expressions that need to be individualized", function() {
      var expression, result;
      result = parse("div {\n	height: @('', 'width', @self)px / 1.5;\n}");
      expression = result.selectors[0].properties[0].value;
      expect(expression.mode).toBe($wf.$runtimeMode.individual);
      expect(expression.unit).toBe("px");
      return expect(expression.setter).toBe(false);
    });
    it("should recognize setter expressions", function() {
      var expression, result;
      result = parse("$selected: \"divName\";\ndiv {\n	on-click: $selected = @self.id;\n}");
      expression = result.selectors[0].properties[0].value;
      expect(expression.mode).toBe($wf.$runtimeMode.individual);
      expect(expression.type).toBe($wf.$type.String);
      expect(expression.unit).toBe(void 0);
      return expect(expression.setter).toBe(true);
    });
    it("should apply units to relative variables", function() {
      var expression, result;
      result = parse("div {\n	width: @self.width;\n}");
      expression = result.selectors[0].properties[0].value;
      expect(expression.mode).toBe($wf.$runtimeMode.individual);
      expect(expression.type).toBe($wf.$type.Number);
      return expect(expression.unit).toBe("px");
    });
    it("should deal with parenthesis in expressions", function() {
      var expression, expressionResult, globals, locals, result;
      result = parse("$padding: 10px;\n$contentWidth: 100px;\ndiv {\n	width: @width / 2 - ($contentWidth - $padding) / 2\n}");
      locals = function(name) {
        switch (name) {
          case "contentWidth":
            return {
              value: 100
            };
          case "padding":
            return {
              value: 10
            };
        }
      };
      globals = {
        width: {
          get: function() {
            return 400;
          }
        }
      };
      expression = result.selectors[0].properties[0].value;
      expressionResult = expression.evaluate(locals, globals, $wf.$functions);
      return expect(expressionResult).toBe("155px");
    });
    it("should deal with multiple parenthesis in expressions", function() {
      var expression, expressionResult, globals, result;
      result = parse("div {\n	width: max(100px, min(0px, @width))\n}");
      globals = {
        width: {
          get: function() {
            return 400;
          }
        }
      };
      expression = result.selectors[0].properties[0].value;
      expressionResult = expression.evaluate((function() {}), globals, $wf.$functions);
      return expect(expressionResult).toBe("100px");
    });
    it("should pass through CSS hex colors", function() {
      var expression, expressionResult, result;
      $wf.addFunction("test", new FunctionModule(function(colorVal) {
        return expect(colorVal.type).toBe($wf.$type.Color);
      }));
      result = parse("div {\n	color: test(#f00)\n}");
      expression = result.selectors[0].properties[0].value;
      expressionResult = expression.evaluate((function() {}), (function() {}), $wf.$functions);
      return delete $wf.$functions['test'];
    });
    it("should parse ternary operations", function() {
      var expression, expressionResult, result;
      result = parse("$selected: true;\ndiv {\n	color: if $selected then red else blue;\n}");
      expression = result.selectors[0].properties[0].value;
      expressionResult = expression.evaluate((function() {
        return {
          value: true
        };
      }));
      return expect(expressionResult).toBe("red");
    });
    it("should parse ternary operations with equality expressions", function() {
      var expression, expressionResult, result;
      result = parse("$selected: true;\ndiv {\n	color: if $selected == false then #f00 else #00f;\n}");
      expression = result.selectors[0].properties[0].value;
      expressionResult = expression.evaluate((function() {
        return {
          value: true
        };
      }));
      return expect(expressionResult).toBe("#00f");
    });
    return it("should parse ternary as function arguments", function() {
      var expression, expressionResult, result;
      result = parse("$selected: true;\ndiv {\n	width: max(if $selected then 200px else 100px, 150px);\n}");
      expression = result.selectors[0].properties[0].value;
      expressionResult = expression.evaluate((function() {
        return {
          value: true
        };
      }), 0, $wf.$functions);
      expect(expressionResult).toBe("200px");
      expressionResult = expression.evaluate((function() {
        return {
          value: false
        };
      }), 0, $wf.$functions);
      return expect(expressionResult).toBe("150px");
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
    it("should parse blocks without bodies, ending in semicolon", function() {
      var block, result;
      result = parse("@import 'test.fss';");
      block = result.blocks[0];
      expect(block["arguments"].length).toBe(1);
      expect(block["arguments"][0]).toBe("'test.fss'");
      expect(block.body).toBe("");
      return expect(block.type).toBe("import");
    });
    it("should parse blocks without bodies, ending in a new line", function() {
      var block, result;
      result = parse("@trigger 'fade-out' 100ms\n");
      block = result.blocks[0];
      expect(block["arguments"].length).toBe(2);
      expect(block["arguments"][0]).toBe("'fade-out'");
      expect(block["arguments"][1]).toBe("100ms");
      expect(block.body).toBe("");
      return expect(block.type).toBe("trigger");
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
  window.fashiontests.parser.combiner = function() {
    var $wf, combine, parse;
    $wf = window.fashion;
    parse = window.fashion.$parser.parse;
    combine = window.fashion.$shared.combineSelectors;
    it("should combine selectors with IDs", function() {
      var c, r;
      r = combine("#test", "div article .class");
      c = r.split(",");
      expect(c.length).toBe(6);
      expect(c).toContain("div article #test .class");
      expect(c).toContain("div #test article .class");
      expect(c).toContain("#test div article .class");
      expect(c).toContain("div article #test.class");
      expect(c).toContain("div article#test .class");
      return expect(c).toContain("div#test article .class");
    });
    it("should cull anything before the ID", function() {
      var c, r;
      r = combine("span #test", "div article .class");
      c = r.split(",");
      return expect(c.length).toBe(6);
    });
    it("should combine selectors with other multi-component selectors", function() {
      var c, r;
      r = combine(".outerClass .innerClass", "div article");
      c = r.split(",");
      expect(c.length).toBe(8);
      expect(c).toContain("div .outerClass article.innerClass");
      expect(c).toContain("div.outerClass article.innerClass");
      expect(c).toContain("div .outerClass .innerClass article");
      expect(c).toContain("div.outerClass .innerClass article");
      expect(c).toContain(".outerClass div article.innerClass");
      expect(c).toContain(".outerClass div .innerClass article");
      expect(c).toContain(".outerClass div.innerClass article");
      return expect(c).toContain(".outerClass .innerClass div article");
    });
    it("should combine comma-separated ID selectors", function() {
      var c, r;
      r = combine("#l1, #l2", "#r1, #r2");
      c = r.split(",");
      expect(c.length).toBe(4);
      expect(c).toContain("#l1 #r1");
      expect(c).toContain("#l1 #r2");
      expect(c).toContain("#l2 #r1");
      return expect(c).toContain("#l2 #r2");
    });
    it("should combine comma-separated selectors", function() {
      var c, r;
      r = combine("#l1, #l2", "div, p");
      c = r.split(",");
      expect(c.length).toBe(8);
      expect(c).toContain("#l1 div");
      expect(c).toContain("#l1 p");
      expect(c).toContain("#l2 div");
      expect(c).toContain("#l2 p");
      expect(c).toContain("div#l1");
      expect(c).toContain("p#l1");
      expect(c).toContain("div#l2");
      return expect(c).toContain("p#l2");
    });
    it("should pull out common prefixes", function() {
      var c, r;
      r = combine("body #container div", "body #container .class");
      c = r.split(",");
      expect(c.length).toBe(2);
      expect(c).toContain("body #container div .class");
      return expect(c).toContain("body #container div.class");
    });
    it("should correctly handle parent/child relationships", function() {
      var c, r;
      r = combine("body #container div", "body #container div p .class");
      c = r.split(",");
      expect(c.length).toBe(1);
      return expect(c).toContain("body #container div p .class");
    });
    it("should correctly handle partial parent/child relationships", function() {
      var c, r;
      r = combine("body #container div, body #container p", "body #container div .class");
      c = r.split(",");
      expect(c.length).toBe(4);
      expect(c).toContain("body #container div .class");
      expect(c).toContain("body #container p div .class");
      expect(c).toContain("body #container div p .class");
      return expect(c).toContain("body #container div p.class");
    });
    it("should deal with identical selector components", function() {
      var c, i, o, r, _i, _ref, _results;
      r = combine("body .class div", "#container .class p");
      c = r.split(",");
      expect(c.indexOf(".class.class")).toBe(-1);
      _results = [];
      for (o = _i = 0, _ref = c.length; 0 <= _ref ? _i <= _ref : _i >= _ref; o = 0 <= _ref ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (i = _j = o, _ref1 = c.length; o <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = o <= _ref1 ? ++_j : --_j) {
            if (i === o) {
              continue;
            }
            _results1.push(expect(c[o] === c[i]).toBe(false));
          }
          return _results1;
        })());
      }
      return _results;
    });
    it("should correctly handle CSS3 attribute selectors", function() {
      var c, r;
      r = combine("div article", "[type='text/x-fashion']");
      c = r.split(",");
      expect(c.length).toBe(2);
      expect(c).toContain("div article [type='text/x-fashion']");
      return expect(c).toContain("div article[type='text/x-fashion']");
    });
    it("should intentionally fail on overly large selectors", function() {
      var r;
      r = combine("a b c d e f g", "h i j k, l m, n");
      return expect(r).toBe(false);
    });
    return it("should use the algorithm on selectors prefixed with '^'", function() {
      var result, selComponents;
      result = parse(".navigation {\n	^#header .navItem:hover {\n		background-color: red;\n	}\n	^#sidebar .navItem:hover {\n		background-color: blue;\n	}\n}");
      selComponents = result.selectors[1].name.split(",");
      expect(selComponents).toContain("#header .navigation .navItem:hover");
      selComponents = result.selectors[2].name.split(",");
      return expect(selComponents).toContain("#sidebar .navigation .navItem:hover");
    });
  };

}).call(this);
(function() {
  describe("Parser", function() {
    describe("Variables", window.fashiontests.parser.variables);
    describe("Selectors", window.fashiontests.parser.selectors);
    describe("CSS Selector Combiner", window.fashiontests.parser.combiner);
    describe("Blocks", window.fashiontests.parser.blocks);
    describe("Properties", window.fashiontests.parser.properties);
    return describe("Expressions", window.fashiontests.parser.expressions);
  });

}).call(this);
