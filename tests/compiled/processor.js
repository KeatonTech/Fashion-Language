if (!window.fashiontests) {
  window.fashiontests = {};
}

window.fashiontests.processor = {};
window.fashiontests.processor.blocks = function() {
  var $wf, BlockModule, parse, process;
  $wf = window.fashion;
  parse = window.fashion.$parser.parse;
  process = window.fashion.$processor.process;
  BlockModule = window.fashion.$class.BlockModule;
  it("should call the block compiler with the arguments and body", function() {
    var args, body, compileSpy;
    compileSpy = jasmine.createSpy("Compile Block");
    $wf.addBlock("testBlock", compileSpy);
    process(parse("@testBlock arg1 arg2 {\n	here {\n		is: the argument;\n	}\n	body\n}"));
    args = ["arg1", "arg2"];
    body = "here {\n\t\tis: the argument;\n\t}\n\tbody";
    return expect(compileSpy).toHaveBeenCalledWith(args, body);
  });
  it("should allow blocks to modify their runtime object", function() {
    var block, compileSpy, parseTree;
    compileSpy = jasmine.createSpy("Compile Block").and.callFake(function(args, body) {
      return this.runtimeObject.instances.push(body);
    });
    $wf.addBlock("runtimeObjectTest", new BlockModule({
      compile: compileSpy,
      runtimeObject: {
        instances: []
      }
    }));
    parseTree = process(parse("@runtimeObjectTest arg1 arg2 {body}"));
    block = parseTree.dependencies.blocks["runtimeObjectTest"];
    return expect(block.runtimeObject.instances[0]).toBe("body");
  });
  it("should be able to add scripts to the parse tree", function() {
    var compileSpy, parseTree;
    compileSpy = jasmine.createSpy("Compile Block").and.callFake(function(args, body) {
      return this.addScript("alert('Hello World');");
    });
    $wf.addBlock("addScriptTest", compileSpy);
    parseTree = process(parse("@addScriptTest {}"));
    return expect(parseTree.scripts[0]).toBe("alert('Hello World');");
  });
  it("should be able to add rules as strings", function() {
    var compileSpy, parseTree, val;
    compileSpy = jasmine.createSpy("Compile Block").and.callFake(function(args, body) {
      return this.addRule("table", "border: $" + args[0] + " solid black");
    });
    $wf.addBlock("addRulesTest", compileSpy);
    parseTree = process(parse("$borderWidth: 1px;\n@addRulesTest borderWidth {body}"));
    expect(parseTree.selectors[0].name).toBe("table");
    expect(parseTree.selectors[0].properties[0].name).toBe("border");
    expect(parseTree.selectors[0].properties[0].value[0].script).toBeDefined();
    val = parseTree.selectors[0].properties[0].value[0];
    return expect(val.bindings.variables[0]).toEqual(["borderWidth", 0]);
  });
  it("should be able to parse its body as a full fashion document", function() {
    var compileSpy, parseTree;
    compileSpy = jasmine.createSpy("Compile Block").and.callFake(function(args, body) {
      var parseTree;
      parseTree = this.parse(body);
      expect(parseTree.variables["innerBlockVariable"][0].value).toBe(10);
      expect(parseTree.selectors[0].name).toBe(".innerBlockSelector");
      expect(parseTree.selectors[0].properties[0].name).toBe("innerBlockProperty");
      return expect(parseTree.selectors[0].properties[0].value.script).toBeDefined();
    });
    $wf.addBlock("parserTest", compileSpy);
    parseTree = process(parse("@parserTest {\n	$innerBlockVariable: 10px;\n	.innerBlockSelector {\n		innerBlockProperty: $innerBlockVariable;\n	}\n}"));
    return expect(compileSpy).toHaveBeenCalled();
  });
  return it("should be able to use variables defined outside its body", function() {
    var compileSpy, parseTree;
    compileSpy = jasmine.createSpy("Compile Block").and.callFake(function(args, body) {
      var parseTree;
      parseTree = this.parse(body);
      expect(parseTree.variables["borderWidth"][0].value).toBe(1);
      expect(parseTree.selectors[0].name).toBe(".innerBlockSelector");
      return expect(parseTree.selectors[0].properties[0].name).toBe("border");
    });
    $wf.addBlock("parserVariableTest", compileSpy);
    parseTree = process(parse("$borderWidth: 1px;\n@parserVariableTest {\n	.innerBlockSelector {\n		border: $borderWidth solid black;\n	}\n}"));
    return expect(compileSpy).toHaveBeenCalled();
  });
};
window.fashiontests.processor.properties = function() {
  var $wf, PropertyModule, parse, process;
  $wf = window.fashion;
  parse = window.fashion.$parser.parse;
  process = window.fashion.$processor.process;
  PropertyModule = window.fashion.$class.PropertyModule;
  it("should call the property compiler with the raw value", function() {
    var compileSpy;
    compileSpy = jasmine.createSpy("Compile Property");
    $wf.addProperty("testProperty", compileSpy);
    process(parse("body {\n	testProperty: 10px;\n}"));
    return expect(compileSpy).toHaveBeenCalledWith("10px");
  });
  it("should call the property compiler with the value expression", function() {
    var compileSpy, value;
    compileSpy = jasmine.createSpy("Compile Property");
    $wf.addProperty("testExpressionProperty", compileSpy);
    process(parse("$propertyVal: 10px;\nbody {\n	testExpressionProperty: $propertyVal;\n}"));
    expect(compileSpy).toHaveBeenCalled();
    value = compileSpy.calls.mostRecent().args[0];
    expect(value.evaluate(function() {
      return {
        value: 10
      };
    })).toBe("10px");
    return expect(value.evaluate(function() {
      return {
        value: 20
      };
    })).toBe("20px");
  });
  it("should be able to determine the type and unit of arguments", function() {
    var compileSpy;
    compileSpy = jasmine.createSpy("Compile Property").and.callFake(function(value) {
      expect(typeof value).toBe("object");
      expect(this.determineType(value[0])).toBe($wf.$type.Number);
      expect(this.determineUnit(value[0])).toBe($wf.$unit.Number.px);
      expect(this.determineType(value[1])).toBe($wf.$type.Color);
      expect(this.determineType(value[2])).toBe($wf.$type.String);
      expect(this.determineType(value[3])).toBe($wf.$type.Number);
      return expect(this.determineUnit(value[3])).toBe($wf.$unit.Number.ms);
    });
    $wf.addProperty("testTypes", compileSpy);
    process(parse("$duration: 100ms;\nbody {\n	testTypes: 10px red 'string value' $duration;\n}"));
    return expect(compileSpy).toHaveBeenCalled();
  });
  it("should be able to add new properties", function() {
    var compileSpy, parseTree;
    compileSpy = jasmine.createSpy("Compile Property").and.callFake(function(value) {
      return this.setProperty("text-align", value);
    });
    $wf.addProperty("testAddAlign", new PropertyModule({
      compile: compileSpy,
      replace: false
    }));
    parseTree = process(parse("body {\n	testAddAlign: center;\n}"));
    expect(parseTree.selectors[0].properties.length).toBe(2);
    expect(parseTree.selectors[0].properties[0].name).toBe("testAddAlign");
    expect(parseTree.selectors[0].properties[0].value).toBe("center");
    expect(parseTree.selectors[0].properties[1].name).toBe("text-align");
    return expect(parseTree.selectors[0].properties[1].value).toBe("center");
  });
  it("should be able to replace itself with a different property", function() {
    var compileSpy, parseTree;
    compileSpy = jasmine.createSpy("Compile Property").and.callFake(function(value) {
      return this.setProperty("text-align", value);
    });
    $wf.addProperty("testReplaceWithAlign", new PropertyModule({
      compile: compileSpy,
      replace: true
    }));
    parseTree = process(parse("body {\n	testReplaceWithAlign: center;\n}"));
    expect(parseTree.selectors[0].properties.length).toBe(1);
    expect(parseTree.selectors[0].properties[0].name).toBe("text-align");
    return expect(parseTree.selectors[0].properties[0].value).toBe("center");
  });
  it("should be able to read other properties in the same selector", function() {
    var compileSpy, parseTree;
    compileSpy = jasmine.createSpy("Compile Property").and.callFake(function(value) {
      return expect(this.getProperty("position")).toBe("absolute");
    });
    $wf.addProperty("testGetPositionInSelector", compileSpy);
    parseTree = process(parse("body {\n	position: absolute;\n	testGetPositionInSelector: center;\n}"));
    return expect(compileSpy).toHaveBeenCalled();
  });
  return it("should be able to read other properties in the different identical selectors", function() {
    var compileSpy, parseTree;
    compileSpy = jasmine.createSpy("Compile Property").and.callFake(function(value) {
      return expect(this.getProperty("position")).toBe("relative");
    });
    $wf.addProperty("testGetPosition", compileSpy);
    parseTree = process(parse("body {\n	testGetPosition: center;\n}\nbody {\n	position: relative;\n}"));
    return expect(compileSpy).toHaveBeenCalled();
  });
};
describe("Processor", function() {
  describe("Properties", window.fashiontests.processor.properties);
  return describe("Blocks", window.fashiontests.processor.blocks);
});
