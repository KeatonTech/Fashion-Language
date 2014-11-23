(function() {
  describe("Parser", function() {
    var parse, type, unit;
    parse = window.fashion.$parser.parse;
    type = window.fashion.$type;
    unit = window.fashion.$unit;
    describe("Variables", function() {
      it("should parse out string variables", function() {
        var result;
        result = parse("$singleQuote: 'string';\n$doubleQuote: \"quote\";");
        expect(result.variables["singleQuote"]["type"]).toEqual(type.String);
        expect(result.variables["doubleQuote"]["type"]).toEqual(type.String);
        expect(result.variables["singleQuote"]["value"]).toEqual("string");
        return expect(result.variables["doubleQuote"]["value"]).toEqual("quote");
      });
      it("should parse out numerical variables", function() {
        var result;
        result = parse("$noUnit: 10;\n$pxUnit: 20px;\n$decimalEmUnit: .1em;\n$negativeMsUnit: -20ms;");
        expect(result.variables["noUnit"]["type"]).toEqual(type.Number);
        expect(result.variables["pxUnit"]["type"]).toEqual(type.Number);
        expect(result.variables["decimalEmUnit"]["type"]).toEqual(type.Number);
        expect(result.variables["negativeMsUnit"]["type"]).toEqual(type.Number);
        expect(result.variables["noUnit"]["unit"]).toEqual(false);
        expect(result.variables["pxUnit"]["unit"]).toEqual(unit.Number.px);
        expect(result.variables["decimalEmUnit"]["unit"]).toEqual(unit.Number.em);
        expect(result.variables["negativeMsUnit"]["unit"]).toEqual(unit.Number.ms);
        expect(result.variables["noUnit"]["value"]).toEqual(10);
        expect(result.variables["pxUnit"]["value"]).toEqual(20);
        expect(result.variables["decimalEmUnit"]["value"]).toEqual(0.1);
        return expect(result.variables["negativeMsUnit"]["value"]).toEqual(-20);
      });
      it("should parse out color variables", function() {
        var result;
        result = parse("$colorConst: red;\n$colorHex: #da0;\n$colorRGB: rgb(200,100,50);\n$colorRGBA: rgba(200,100,50,0.5);");
        expect(result.variables["colorConst"]["type"]).toEqual(type.Color);
        expect(result.variables["colorHex"]["type"]).toEqual(type.Color);
        expect(result.variables["colorRGB"]["type"]).toEqual(type.Color);
        expect(result.variables["colorRGBA"]["type"]).toEqual(type.Color);
        expect(result.variables["colorConst"]["unit"]).toEqual(unit.Color.Const);
        expect(result.variables["colorHex"]["unit"]).toEqual(unit.Color.Hex);
        expect(result.variables["colorRGB"]["unit"]).toEqual(unit.Color.RGB);
        return expect(result.variables["colorRGBA"]["unit"]).toEqual(unit.Color.RGBA);
      });
      return it("should allow multiple variables per line", function() {
        var result;
        result = parse("$singleQuote: 's1';$doubleQuote: \"s2\";");
        expect(result.variables["singleQuote"]["value"]).toEqual("s1");
        return expect(result.variables["doubleQuote"]["value"]).toEqual("s2");
      });
    });
    describe("Selectors", function() {
      it("should parse complex selectors", function() {
        var result;
        result = parse("* {height: 30px;}\nul.test td:last-child {\n	background: black;\n}");
        expect(result.selectors['*']['height']).toBe("30px");
        return expect(result.selectors['ul.test td:last-child']['background']).toBe("black");
      });
      return it("should parse nested selectors", function() {
        var result;
        result = parse(".outer {\n	opacity: 1.0;\n	.middle {\n		opacity: 0.5;\n		.inner {opacity: 0.0;}\n		&.super {opacity: 0.75;}\n		height: 50px\n	}\n	height: 100px\n}");
        expect(result.selectors['.outer']['opacity']).toBe("1.0");
        expect(result.selectors['.outer .middle']['opacity']).toBe("0.5");
        expect(result.selectors['.outer .middle .inner']['opacity']).toBe("0.0");
        expect(result.selectors['.outer .middle.super']['opacity']).toBe("0.75");
        expect(result.selectors['.outer']['height']).toBe("100px");
        return expect(result.selectors['.outer .middle']['height']).toBe("50px");
      });
    });
    describe("Properties", function() {
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
      it("should link variables", function() {
        var result, sels;
        result = parse("$height: 100px;\np {\n	height: $height;\n}");
        sels = result.selectors.p;
        expect(sels.height.link).toBe("$height");
        expect(sels.height.dynamic).toBe(true);
        return expect(result.variables.height.dependants.p).toEqual(["height"]);
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
    });
    return describe("Expressions", function() {
      it("should allow variables in expressions", function() {
        var expression, result;
        result = parse("$fullHeight: 30px;\ndiv {\n	height: $fullHeight / 3;\n}");
        expression = result.selectors.div.height;
        expect(expression.dynamic).toBe(true);
        expect(expression.evaluate({
          fullHeight: {
            value: 30
          }
        })).toBe("10px");
        return expect(expression.evaluate({
          fullHeight: {
            value: 60
          }
        })).toBe("20px");
      });
      return it("should allow untyped variables in expressions", function() {
        var expression, result;
        result = parse("$heightDivisor: 3;\ndiv {\n	height: 30px/$heightDivisor;\n}");
        expression = result.selectors.div.height;
        expect(expression.dynamic).toBe(true);
        expect(expression.evaluate({
          heightDivisor: {
            value: 3
          }
        })).toBe("10px");
        return expect(expression.evaluate({
          heightDivisor: {
            value: 10
          }
        })).toBe("3px");
      });
    });
  });

}).call(this);
