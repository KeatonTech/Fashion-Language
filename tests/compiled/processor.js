if (!window.fashiontests) {
  window.fashiontests = {};
}

window.fashiontests.processor = {};
window.fashiontests.processor.variables = function() {
  var parse, process, type, unit;
  parse = window.fashion.$parser.parse;
  process = window.fashion.$processor.process;
  type = window.fashion.$type;
  unit = window.fashion.$unit;
  it("should parse out string variables", function() {
    var result;
    result = parse("$singleQuote: 'string';\n$doubleQuote: \"quote\";");
    result = process(result);
    expect(result.variables["singleQuote"][0].type).toEqual(type.String);
    return expect(result.variables["doubleQuote"][0].type).toEqual(type.String);
  });
  it("should parse out numerical variables", function() {
    var result;
    result = parse("$noUnit: 10;\n$pxUnit: 20px;\n$decimalEmUnit: .1em;\n$negativeMsUnit: -20ms;");
    result = process(result);
    expect(result.variables["noUnit"][0]["type"]).toEqual(type.Number);
    expect(result.variables["pxUnit"][0]["type"]).toEqual(type.Number);
    expect(result.variables["decimalEmUnit"][0]["type"]).toEqual(type.Number);
    expect(result.variables["negativeMsUnit"][0]["type"]).toEqual(type.Number);
    expect(result.variables["noUnit"][0]["unit"]).toEqual(false);
    expect(result.variables["pxUnit"][0]["unit"]).toEqual(unit.Number.px);
    expect(result.variables["decimalEmUnit"][0]["unit"]).toEqual(unit.Number.em);
    return expect(result.variables["negativeMsUnit"][0]["unit"]).toEqual(unit.Number.ms);
  });
  return it("should parse out color variables", function() {
    var result;
    result = parse("$colorConst: red;\n$colorHex: #da0;\n$colorRGB: rgb(200,100,50);\n$colorRGBA: rgba(200,100,50,0.5);");
    result = process(result);
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
describe("Processor", function() {
  return describe("Variables", window.fashiontests.processor.variables);
});
