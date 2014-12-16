(function() {;


/*

FASHION: Style + Smarts ------------------------------------------------------

Copyright (c) 2014 Keaton Brandt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

------------------------------------------------------------------------------
 */
var $wf, wait;

$wf = window.fashion = {
  mimeType: "text/x-fashion",
  fileHeader: "// Generated with Fashion - http://keaton.ws/fashion\n",
  variableObject: "style",
  cssId: "FASHION-dynblock-"
};

wait = function(d, f) {
  return setTimeout(f, d);
};
window.fashion.addProperty = function(name, propertyModule, force) {
  if (force == null) {
    force = false;
  }
  if (!(propertyModule instanceof PropertyModule)) {
    propertyModule = new PropertyModule(propertyModule);
  }
  if (!force && window.fashion.$properties[name]) {
    return new Error("There is already a property named " + name);
  }
  return window.fashion.$properties[name] = propertyModule;
};

window.fashion.addProperties = function(obj, force) {
  var k, v, _i, _len, _results;
  if (force == null) {
    force = false;
  }
  _results = [];
  for (v = _i = 0, _len = obj.length; _i < _len; v = ++_i) {
    k = obj[v];
    _results.push(window.fashion.addProperty(k, v, force));
  }
  return _results;
};

window.fashion.addFunction = function(name, functionModule, force) {
  if (force == null) {
    force = false;
  }
  if (!(functionModule instanceof FunctionModule)) {
    functionModule = new FunctionModule(functionModule);
  }
  if (!force && window.fashion.$functions[name]) {
    return new Error("There is already a function named " + name);
  }
  return window.fashion.$functions[name] = functionModule;
};

window.fashion.addFunctions = function(obj, force) {
  var k, v, _i, _len, _results;
  if (force == null) {
    force = false;
  }
  _results = [];
  for (v = _i = 0, _len = obj.length; _i < _len; v = ++_i) {
    k = obj[v];
    _results.push(window.fashion.addFunction(k, v, force));
  }
  return _results;
};

window.fashion.addGlobal = function(name, globalModule, force) {
  if (force == null) {
    force = false;
  }
  if (!(globalModule instanceof GlobalModule)) {
    globalModule = new GlobalModule(globalModule);
  }
  if (!force && window.fashion.$globals[name]) {
    return new Error("There is already a global named " + name);
  }
  return window.fashion.$globals[name] = globalModule;
};

window.fashion.addGlobals = function(obj, force) {
  var k, v, _i, _len, _results;
  if (force == null) {
    force = false;
  }
  _results = [];
  for (v = _i = 0, _len = obj.length; _i < _len; v = ++_i) {
    k = obj[v];
    _results.push(window.fashion.addGlobal(k, v, force));
  }
  return _results;
};

window.fashion.addBlock = function(name, blockModule, force) {
  if (force == null) {
    force = false;
  }
  if (!(blockModule instanceof BlockModule)) {
    blockModule = new BlockModule(blockModule);
  }
  if (!force && window.fashion.$blocks[name]) {
    return new Error("There is already a block named " + name);
  }
  return window.fashion.$blocks[name] = blockModule;
};

window.fashion.addBlocks = function(obj, force) {
  var k, v, _i, _len, _results;
  if (force == null) {
    force = false;
  }
  _results = [];
  for (v = _i = 0, _len = obj.length; _i < _len; v = ++_i) {
    k = obj[v];
    _results.push(window.fashion.addBlock(k, v, force));
  }
  return _results;
};

/*
------------------------------------------------------------------------------

This Live version runs in the browser to dynamically compile Fashion files
into CSS and Javascript. It is not reccommended for production apps.

------------------------------------------------------------------------------
 */
window.fashion.live = {
  loadedEvent: "fashion-loaded"
};

document.onreadystatechange = function() {
  var allLoaded, fileCount, scriptIndex;
  if (document.readyState === "complete") {
    scriptIndex = 0;
    fileCount = 0;
    allLoaded = function() {
      var event;
      event = new Event(window.fashion.live.loadedEvent);
      event.variableObject = window[window.fashion.variableObject];
      return document.dispatchEvent(event);
    };
    fileCount = window.fashion.$loader.countScripts();
    return window.fashion.$loader.loadScriptsFromTags(function(scriptText) {
      var parseTree, start;
      start = new Date().getTime();
      parseTree = window.fashion.$parser.parse(scriptText);
      parseTree = window.fashion.$processor.process(parseTree);
      window.fashion.$actualizer.actualizeFullSheet(parseTree, scriptIndex++);
      console.log("[FASHION] Compile finished in " + (new Date().getTime() - start) + "ms");
      if (--fileCount <= 0) {
        return allLoaded();
      }
    });
  }
};
var __slice = [].slice;

window.fashion.$extend = function(object, anotherObject) {
  var key, value, _results;
  _results = [];
  for (key in anotherObject) {
    value = anotherObject[key];
    if (!object[key]) {
      _results.push(object[key] = value);
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

window.fashion.$combine = function() {
  var obj, objects, ret, _i, _len;
  objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  ret = {};
  for (_i = 0, _len = objects.length; _i < _len; _i++) {
    obj = objects[_i];
    window.fashion.$extend(ret, obj);
  }
  return ret;
};
window.fashion.$dom = {
  addElementToHead: function(element) {
    var head;
    head = document.head || document.getElementsByTagName('head')[0];
    return head.appendChild(element);
  },
  makeStylesheet: function(className, index, isDynamic) {
    var sheet;
    sheet = document.createElement("style");
    sheet.setAttribute("type", "text/css");
    sheet.setAttribute("class", className);
    sheet.setAttribute("data-count", "0");
    sheet.setAttribute("data-index", index);
    if (isDynamic) {
      sheet.setAttribute("id", "" + window.fashion.cssId + index);
    }
    return sheet;
  },
  makeScriptTag: function(scriptText) {
    var script;
    script = document.createElement("script");
    script.text = scriptText;
    return script;
  },
  incrementSheetIndex: function(sheet) {
    var val;
    val = parseInt(sheet.getAttribute("data-count"));
    sheet.setAttribute("data-count", val + 1);
    return val;
  },
  getSheetIndex: function(sheet) {
    return parseInt(sheet.getAttribute("data-index"));
  }
};
window.fashion.$stringify = function(value) {
  switch (typeof value) {
    case "string":
      return JSON.stringify(value);
    case "object":
      return window.fashion.$stringifyObject(value);
    case "array":
      return window.fashion.$stringifyArray(value);
    case "number":
      return value;
    case "undefined":
      return "undefined";
    default:
      return value.toString();
  }
};

window.fashion.$stringifyObject = function(object) {
  var propStrings, property, value;
  propStrings = [];
  for (property in object) {
    value = object[property];
    if (!(object.hasOwnProperty(property))) {
      continue;
    }
    property = property.replace("'", "\'");
    propStrings.push("'" + property + "': " + (window.fashion.$stringify(value)));
  }
  return "{" + (propStrings.join(',\n')) + "}";
};

window.fashion.$stringifyArray = function(array) {
  var propStrings, value, _i, _len;
  propStrings = [];
  for (_i = 0, _len = object.length; _i < _len; _i++) {
    value = object[_i];
    propStrings.push(window.fashion.$stringify(value));
  }
  return "{" + (propStrings.join(',')) + "}";
};
var ParseTree;

ParseTree = (function() {
  function ParseTree() {
    this.variables = {};
    this.selectors = [];
    this.blocks = [];
    this.scripts = [];
    this.dependencies = {
      blocks: {},
      globals: {},
      functions: {},
      properties: {}
    };
    this.bindings = {
      variables: {},
      globals: {},
      dom: []
    };
  }

  ParseTree.prototype.addVariable = function(variableObject) {
    var selectorScope, vName;
    vName = variableObject.name;
    delete variableObject.name;
    selectorScope = variableObject.scope || 0;
    delete variableObject.scope;
    if (!vName) {
      throw new Error("Variables must be named");
    }
    if (!this.variables[vName]) {
      this.variables[vName] = {};
    }
    this.variables[vName][selectorScope] = variableObject;
    return this.bindings.variables[vName] = [];
  };

  ParseTree.prototype.addSelector = function(newSelector) {
    newSelector.index = this.selectors.length;
    return this.selectors.push(newSelector);
  };

  ParseTree.prototype.addScript = function(newScript) {
    return this.scripts.push(newScript);
  };

  ParseTree.prototype.addBlock = function(newBlock) {
    return this.blocks.push(newBlock);
  };

  ParseTree.prototype.addBlockDependency = function(name, moduleObject) {
    return this.dependencies.blocks[name] = moduleObject;
  };

  ParseTree.prototype.addGlobalDependency = function(name, moduleObject) {
    return this.dependencies.globals[name] = moduleObject;
  };

  ParseTree.prototype.addFunctionDependency = function(name, moduleObject) {
    return this.dependencies.functions[name] = moduleObject;
  };

  ParseTree.prototype.addPropertyDependency = function(name, moduleObject) {
    return this.dependencies.properties[name] = moduleObject;
  };

  ParseTree.prototype.addVariableBinding = function(selectorId, variableName) {
    if (!this.bindings.variables[variableName]) {
      throw new Error("Variable " + variableName + " does not exist or cannot be bound.");
    }
    return this.bindings.variables[variableName].push(selectorId);
  };

  ParseTree.prototype.addGlobalBinding = function(selectorId, globalName) {
    if (!this.bindings.globals[globalName]) {
      this.bindings.globals[globalName] = [];
    }
    return this.bindings.globals[globalName].push(selectorId);
  };

  ParseTree.prototype.addDOMBinding = function(selectorId, selector, boundSelector, boundProperty) {
    return this.bindings.dom.push({
      watch: [boundSelector, boundProperty],
      rel: selector,
      bind: selectorId
    });
  };

  ParseTree.prototype.forEachVariable = function(run) {
    var name, scope, scopes, variable, _ref;
    _ref = this.variables;
    for (name in _ref) {
      scopes = _ref[name];
      for (scope in scopes) {
        variable = scopes[scope];
        if (run.call(variable, variable, scope) === false) {
          return;
        }
      }
    }
  };

  ParseTree.prototype.forEachMatchingSelector = function(selectorString, run) {
    var selector, _i, _len, _ref;
    _ref = this.selectors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      selector = _ref[_i];
      if (selector.name === selectorString) {
        if (run.call(this, selector) === false) {
          return;
        }
      }
    }
  };

  return ParseTree;

})();

if (!window.fashion.$class) {
  window.fashion.$class = {};
}

window.fashion.$class.ParseTree = ParseTree;
var Variable;

Variable = (function() {
  function Variable(name, defaultValue, scope) {
    if (scope == null) {
      scope = 0;
    }
    if (name[0] === "$") {
      name = name.substr(1);
    }
    this.name = name;
    this.raw = this.value = defaultValue;
    this.scope = scope;
    this.topLevel = scope === 0;
  }

  Variable.prototype.annotateWithType = function(type, unit, typedValue) {
    this.type = type;
    this.unit = unit;
    if (typedValue) {
      return this.value = typedValue;
    }
  };

  return Variable;

})();

window.fashion.$class.Variable = Variable;
var Selector;

Selector = (function() {
  function Selector(name, mode) {
    this.name = name;
    this.properties = [];
    this.index = -1;
    if (mode) {
      this.mode = mode;
    } else if (name instanceof Expression) {
      this.mode = $wf.$runtimeMode.dynamic;
    } else {
      this.mode = $wf.$runtimeMode["static"];
    }
  }

  Selector.prototype.addToBody = function(bodyString) {
    if (!this.body) {
      this.body = "";
    }
    return this.body += bodyString;
  };

  Selector.prototype.addProperty = function(property) {
    this.body = void 0;
    return this.properties.push(property);
  };

  Selector.prototype.insertProperty = function(property, index) {
    this.body = void 0;
    return this.properties.splice(index, 0, property);
  };

  Selector.prototype.forEachPropertyNamed = function(name, run) {
    var property, _i, _len, _ref;
    _ref = this.properties;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      property = _ref[_i];
      if (property.name === name) {
        if (run.call(this, property) === false) {
          return;
        }
      }
    }
  };

  return Selector;

})();

window.fashion.$class.Selector = Selector;
var Property, PropertyTransition;

Property = (function() {
  function Property(name, value, runtimeMode, transition) {
    if (runtimeMode == null) {
      runtimeMode = $wf.$runtimeMode["static"];
    }
    this.name = name;
    this.mode = runtimeMode;
    if (transition) {
      if (typeof value !== 'object') {
        this.value = {
          value: value,
          transition: transition
        };
      } else {
        this.value = value;
        this.value.transition = transition;
      }
    } else {
      this.value = value;
    }
  }

  return Property;

})();

PropertyTransition = (function() {
  function PropertyTransition(easing, duration, delay) {
    this.easing = easing;
    this.duration = duration;
    this.delay = delay;
  }

  return PropertyTransition;

})();

window.fashion.$class.Property = Property;

window.fashion.$class.PropertyTransition = PropertyTransition;
var Expression;

Expression = (function() {
  function Expression(script, type, unit, runtimeMode) {
    this.script = script.toString();
    this.mode = runtimeMode;
    this.type = type;
    this.unit = unit;
  }

  Expression.prototype.generate = function() {
    var e;
    try {
      return this.evaluate = Function("v", "g", "f", "t", "e", this.script);
    } catch (_error) {
      e = _error;
      console.log("[FASHION] Could not compile script '" + this.script + "'");
      return console.log(e);
    }
  };

  return Expression;

})();

window.fashion.$class.Expression = Expression;
var BlockModule, FunctionModule, GlobalModule, Module, PropertyModule, ReturnValueModule,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Module = (function() {
  function Module(args) {
    this.mode = args.mode || args.runtimeMode || $wf.$runtimeMode["static"];
    if (args.watcherFunction) {
      if (!(this.mode | $wf.$runtimeMode.dynamic) || (this.mode | $wf.$runtimeMode.live)) {
        console.log("[FASHION] Static/live modules cannot have watcher functions.");
      } else {
        this.watch = args.watcherFunction;
      }
    }
  }

  return Module;

})();

ReturnValueModule = (function(_super) {
  __extends(ReturnValueModule, _super);

  function ReturnValueModule(args) {
    this.type = args.type || args.output || args.outputType || $wf.$type.String;
    this.unit = args.unit || '';
    this.get = args.get || args.evaluate;
    ReturnValueModule.__super__.constructor.call(this, args);
  }

  return ReturnValueModule;

})(Module);

GlobalModule = (function(_super) {
  __extends(GlobalModule, _super);

  function GlobalModule(args) {
    GlobalModule.__super__.constructor.call(this, args);
  }

  return GlobalModule;

})(ReturnValueModule);

FunctionModule = (function(_super) {
  __extends(FunctionModule, _super);

  function FunctionModule(args) {
    if (args.unitFrom !== void 0) {
      this.unitFrom = args.unitFrom;
      delete args.unit;
    }
    FunctionModule.__super__.constructor.call(this, args);
  }

  return FunctionModule;

})(ReturnValueModule);

BlockModule = (function(_super) {
  __extends(BlockModule, _super);

  function BlockModule(args) {
    if (typeof args === 'function') {
      this.compile = args;
    } else {
      this.compile = args.compileFunction || args.compile;
      this.runtimeObject = args.runtimeObject || args.runtime;
    }
  }

  return BlockModule;

})(Module);

PropertyModule = (function(_super) {
  __extends(PropertyModule, _super);

  function PropertyModule(args) {
    if (typeof args === 'function') {
      this.compile = args;
    } else {
      this.compile = args.compileFunction || args.compile;
      this.apply = args.applyFunction || args.apply;
      if (this.apply) {
        args.mode = $wf.$runtimeMode.individual;
      }
      this.replace = args.replace || false;
      this.runtimeObject = args.runtimeObject || args.runtime;
    }
  }

  return PropertyModule;

})(Module);

if (!window.fashion.$class) {
  window.fashion.$class = {};
}

window.fashion.$class.GlobalModule = GlobalModule;

window.fashion.$class.FunctionModule = FunctionModule;

window.fashion.$class.BlockModule = BlockModule;

window.fashion.$class.PropertyModule = PropertyModule;
window.fashion.$type = {
  None: 0,
  Number: 1,
  String: 2,
  Color: 3,
  KGeneric: 100,
  KDisplay: 101,
  KCenter: 102,
  KListStyle: 103,
  KLineStyle: 104,
  KInset: 105,
  Unknown: 255
};
window.fashion.$unit = {
  Number: {
    "": false,
    " ": false,
    "px": "px",
    "pt": "pt",
    "%": "%",
    "em": "em",
    "ex": "ex",
    "cm": "cm",
    "mm": "mm",
    "in": "in",
    "pt": "pt",
    "pc": "pc",
    "ch": "ch",
    "rem": "rem",
    "vh": "vh",
    "vw": "vw",
    "vmin": "vmin",
    "vmax": "vmax",
    "ms": "ms",
    "s": "s"
  }
};
window.fashion.$typeConstants = {
  colors: ["aqua", "black", "blue", "fuchsia", "gray", "green", "lime", "maroon", "navy", "olive", "purple", "red", "silver", "teal", "white", "yellow"]
};

/*
4-bit Mode -----------------------------------------------------------------------
	0001 (Bit 0): Can change, needs to be included in the JS
	0010 (Bit 1): Can rely on non-top-level variables
	0100 (Bit 2): Can rely on relative styles & attributes
	1000 (Bit 3): Needs to be continuously recomputed
----------------------------------------------------------------------------------
 */
window.fashion.$runtimeMode = {
  "static": 0,
  dynamic: 1,
  scoped: 3,
  individual: 7,
  live: 9,
  generate: function(dynamic, individualized, live, scoped) {
    return (dynamic ? 1 : 0) | (individualized ? 7 : 0) | (live ? 9 : 0) | (scoped ? 3 : 0);
  }
};
window.fashion.$loader = {
  loadStyleTags: function(scriptCallback) {
    var i, scriptTags, tagType, _i, _ref, _results;
    scriptTags = document.getElementsByTagName("style");
    _results = [];
    for (i = _i = 0, _ref = scriptTags.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      tagType = scriptTags[i].getAttribute("type");
      if (tagType !== window.fashion.mimeType) {
        continue;
      }
      if (scriptTags[i].textContent !== "") {
        _results.push(scriptCallback(scriptTags[i].textContent));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  },
  loadScriptsFromTags: function(scriptCallback) {
    return window.fashion.$loader.loadStyleTags(scriptCallback);
  },
  countScripts: function() {
    var fileCount, i, scriptTags, tagType, _i, _ref;
    fileCount = 0;
    scriptTags = document.getElementsByTagName("style");
    for (i = _i = 0, _ref = scriptTags.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      tagType = scriptTags[i].getAttribute("type");
      if (tagType !== window.fashion.mimeType) {
        continue;
      }
      fileCount++;
    }
    return fileCount;
  }
};
window.fashion.$parser = {
  parse: function(fashionText) {
    var i, parseTree, sel, _ref;
    parseTree = new ParseTree();
    parseTree = $wf.$parser.parseSections(fashionText, parseTree);
    _ref = parseTree.selectors;
    for (i in _ref) {
      sel = _ref[i];
      $wf.$parser.parseSelectorBody(sel.body, sel, parseTree);
    }
    return parseTree;
  }
};

window.fashion.$parser.addVariable = function(parseTree, name, value, scope) {
  var type, typedValue, unit, unittedValue, val, variableObject;
  value = $wf.$parser.parseSingleValue(value, "$" + name, parseTree);
  variableObject = new Variable(name, value, scope);
  parseTree.addVariable(variableObject);
  if (value instanceof Expression) {
    type = value.type;
    unit = value.unit;
  } else {
    val = variableObject.raw || variableObject.value;
    if (!val) {
      return;
    }
    type = window.fashion.$run.determineType(val, $wf.$type, $wf.$typeConstants);
    unittedValue = window.fashion.$run.getUnit(val, type, $wf.$type, $wf.$unit);
    typedValue = unittedValue['value'];
    unit = unittedValue['unit'];
  }
  return variableObject.annotateWithType(type, unit, typedValue);
};

window.fashion.$parser.splitByTopLevelCommas = function(value) {
  var acc, depth, regex, ret, token;
  depth = 0;
  acc = "";
  ret = [];
  regex = /(\(|\)|\,|[^\(\)\,]+)/g;
  while (token = regex.exec(value)) {
    if (token[0] === "," && depth === 0) {
      ret.push(acc);
      acc = "";
      continue;
    }
    if (token[0] === "(") {
      depth++;
    }
    if (token[0] === ")") {
      depth--;
    }
    acc += token[0];
  }
  ret.push(acc);
  return ret;
};

window.fashion.$parser.splitByTopLevelSpaces = function(value) {
  var acc, bt, depth, dq, regex, ret, sq, token;
  depth = 0;
  sq = dq = bt = false;
  acc = "";
  ret = [];
  regex = /([^\(\)\"\'\`\s]*\(|\)|\"|\'|\`|([^\(\)\"\'\`\s]+(\s+[\+\-\/\*\=]\s+|[\+\-\/\*\=]))+[^\(\)\"\'\`\s]+|\s|[^\(\)\"\'\`\s]+)/g;
  while (token = regex.exec(value)) {
    if (token[0] === " " && depth === 0 && !sq && !dq && !bt) {
      ret.push(acc);
      acc = "";
      continue;
    }
    if (token[0][token[0].length - 1] === "(") {
      depth++;
    }
    if (token[0] === ")") {
      depth--;
    }
    if (token[0] === "'" && !dq && !bt) {
      sq = !sq;
    }
    if (token[0] === '"' && !sq && !bt) {
      dq = !dq;
    }
    if (token[0] === "`" && !dq && !sq) {
      bt = !bt;
    }
    acc += token[0];
  }
  ret.push(acc);
  return ret;
};
window.fashion.$parser.parseSections = function(fashionText, parseTree) {
  var blockArgs, regex, segment, startIndex;
  regex = /([\s]*(\$([\w\-]+)\:[\s]*(.*?)\;|\@([\w\-]+)[\s]*(.*?)[\s]*\{|(.*?)[\s]*?\{)|\{|\})/g;
  while (segment = regex.exec(fashionText)) {
    if (segment.length < 8 || !segment[0]) {
      break;
    }
    if (segment[3] && segment[4]) {
      $wf.$parser.addVariable(parseTree, segment[3], segment[4]);
    } else if (segment[5]) {
      startIndex = segment.index + segment[0].length;
      if (segment[6]) {
        blockArgs = $wf.$parser.splitByTopLevelSpaces(segment[6]);
      } else {
        blockArgs = [];
      }
      parseTree.addBlock({
        type: segment[5],
        "arguments": blockArgs,
        body: window.fashion.$parser.parseBlock(fashionText, regex, startIndex)
      });
      parseTree.addBlockDependency(segment[5], $wf.$blocks[segment[5]]);
    } else if (segment[7]) {
      window.fashion.$parser.parseSelector(parseTree, fashionText, segment[7], regex, segment.index + segment[0].length);
    } else {
      console.log("There's a problem somewhere in your file. Sorry.");
    }
  }
  return parseTree;
};

window.fashion.$parser.parseSelector = function(parseTree, fashionText, name, regex, lastIndex) {
  var bracketDepth, segment, selectorStack, selectors, topSel;
  selectors = [$wf.$parser.createSelector(parseTree, name)];
  bracketDepth = 1;
  selectorStack = [0];
  while (bracketDepth > 0 && (segment = regex.exec(fashionText))) {
    topSel = selectors[selectorStack[selectorStack.length - 1]];
    topSel.addToBody(fashionText.substring(lastIndex, segment.index));
    lastIndex = segment.index + segment[0].length;
    if (segment[0] === "}") {
      selectorStack.pop();
      bracketDepth--;
    } else if (segment[3] && segment[4]) {
      topSel.addToBody(fashionText.substring(segment.index, lastIndex));
    } else if (segment[7]) {
      if (segment[7][0] === "&") {
        name = topSel.name + segment[7].substr(1);
      } else {
        name = topSel.name + " " + segment[7];
      }
      selectors.push($wf.$parser.createSelector(parseTree, name));
      selectorStack.push(selectors.length - 1);
      bracketDepth++;
    }
  }
  return selectors;
};

window.fashion.$parser.createSelector = function(parseTree, name) {
  var expander, foundVar, isIndividualized, lastIndex, regex, script, selector, trimmed, vExpr;
  selector = new Selector(name);
  parseTree.addSelector(selector);
  if (name.indexOf("$") === -1) {
    return selector;
  }
  isIndividualized = false;
  script = "return ";
  lastIndex = 0;
  regex = /\$([\w\-]+)/g;
  while (foundVar = regex.exec(name)) {
    if (foundVar.index > lastIndex) {
      script += "'" + (name.substring(lastIndex, foundVar.index)) + "'+";
    }
    lastIndex = foundVar.index + foundVar[0].length;
    expander = $wf.$parser.expressionExpander.localVariable;
    vExpr = expander(foundVar[1], selector.index, parseTree);
    isIndividualized |= vExpr['individualized'] || false;
    script += vExpr.script + "+";
  }
  if (name.length > lastIndex) {
    script += "'" + (name.substr(lastIndex)) + "'+";
  }
  trimmed = script.substr(0, script.length - 1);
  selector.mode = $wf.$runtimeMode.dynamic;
  selector.name = new Expression(trimmed, $wf.$type.String, 0, true, isIndividualized);
  selector.name.generate();
  return selector;
};

window.fashion.$parser.parseBlock = function(fashionText, regex, startIndex) {
  var bracketDepth, endIndex, segment;
  bracketDepth = 1;
  endIndex = startIndex;
  while (bracketDepth > 0 && (segment = regex.exec(fashionText))) {
    endIndex = segment.index + segment[0].length;
    if (segment[0] === "}") {
      bracketDepth--;
    } else if (segment[0] === "{") {
      bracketDepth++;
    } else if (segment[5]) {
      bracketDepth++;
    } else if (segment[7]) {
      bracketDepth++;
    }
  }
  return fashionText.substring(startIndex, endIndex - 1).trim();
};
window.fashion.$parser.parseSelectorBody = function(bodyString, selector, parseTree) {
  var linkId, mode, name, property, regex, transition, value, _results;
  linkId = selector.index;
  regex = /[\s]*(\$?[\w\-\s]*)\:[\s]*(\[([\w\-\$\@]*)[\s]*([\w\-\$\@\%]*)[\s]*([\w\-\$\@\%]*)\]){0,1}[\s]*([^;}\n]*?)[\s]*(!important)?[;}\n]/g;
  _results = [];
  while (property = regex.exec(bodyString)) {
    if (property.length < 7) {
      continue;
    }
    value = $wf.$parser.parsePropertyValues(property[6], linkId, parseTree);
    name = property[1];
    if (name[0] === "$") {
      $wf.$parser.parseScopedVariable(name, value, property, selector.name, parseTree);
      continue;
    }
    if (property[3]) {
      transition = new PropertyTransition($wf.$parser.parsePropertyValue(property[3], linkId, parseTree, false), $wf.$parser.parsePropertyValue(property[4], linkId, parseTree, false), $wf.$parser.parsePropertyValue(property[5], linkId, parseTree, false));
    }
    if (property[7] === "!important") {
      if (typeof value === "string") {
        value += " !important";
      }
      if (typeof value === "object") {
        value.important = true;
      }
    }
    mode = (selector.mode | value.mode) || 0;
    _results.push(selector.addProperty(new Property(name, value, mode, transition)));
  }
  return _results;
};

window.fashion.$parser.parseScopedVariable = function(name, value, property, scope, parseTree) {
  if (typeof value === 'array' && typeof value[0] === 'array') {
    throw new Error("Variable declaration '" + name + "' cannot have comma separated values");
  }
  if (property[3]) {
    throw new Error("Variable declaration '" + name + "' cannot have a transition");
  }
  if (property[7]) {
    throw new Error("Variable declaration '" + name + "' cannot be !important");
  }
  return $wf.$parser.addVariable(parseTree, name, value, scope);
};

window.fashion.$parser.parsePropertyValues = function(value, linkId, parseTree) {
  var i, item;
  if (value.indexOf(',') !== -1) {
    value = window.fashion.$parser.splitByTopLevelCommas(value);
    if (value.length === 1) {
      return window.fashion.$parser.parsePropertyValue(value[0], linkId, parseTree);
    } else {
      for (i in value) {
        item = value[i];
        value[i] = item.trim();
      }
      for (i in value) {
        item = value[i];
        value[i] = window.fashion.$parser.parsePropertyValue(item, linkId, parseTree, true, true);
      }
      return value;
    }
  } else {
    return window.fashion.$parser.parsePropertyValue(value, linkId, parseTree);
  }
};

window.fashion.$parser.parsePropertyValue = function(value, linkId, parseTree, allowExpression, forceArray) {
  var parts, val, values, _i, _len;
  if (allowExpression == null) {
    allowExpression = true;
  }
  if (forceArray == null) {
    forceArray = false;
  }
  if (forceArray || (typeof value === "string" && value.indexOf(" ") !== -1)) {
    parts = $wf.$parser.splitByTopLevelSpaces(value);
    if (!forceArray && parts.length === 1) {
      return window.fashion.$parser.parseSingleValue(value, linkId, parseTree);
    }
    values = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        val = parts[_i];
        _results.push($wf.$parser.parseSingleValue(val, linkId, parseTree));
      }
      return _results;
    })();
    values.mode = 0;
    for (_i = 0, _len = values.length; _i < _len; _i++) {
      val = values[_i];
      values.mode |= val.mode || 0;
    }
    return values;
  } else {
    return window.fashion.$parser.parseSingleValue(value, linkId, parseTree);
  }
};

window.fashion.$parser.identifyExpression = function() {
  return /(([\s][\+\-\/\*\=][\s])|[\(\)\[\]]|\@|\$)/g;
};

window.fashion.$parser.parseSingleValue = function(value, linkId, parseTree) {
  if (!value || typeof value !== 'string') {
    return value;
  }
  if (value.match($wf.$parser.identifyExpression())) {
    return window.fashion.$parser.parseExpression(value, linkId, parseTree, window.fashion.$functions, window.fashion.$globals);
  }
  return value;
};
window.fashion.$parser.parseExpression = function(expString, linkId, parseTree, funcs, globals, top) {
  var contained, eObj, end, expander, expr, length, matchParens, mode, regex, replaceInScript, script, scriptOffset, section, shouldBreak, start, tailingUnit, type, types, unit, units, _ref, _ref1;
  if (top == null) {
    top = true;
  }
  expander = $wf.$parser.expressionExpander;
  matchParens = window.fashion.$parser.matchParenthesis;
  script = expString;
  mode = $wf.$runtimeMode["static"];
  types = [];
  units = [];
  scriptOffset = 0;
  replaceInScript = function(start, length, string) {
    script = $wf.$parser.spliceString(script, start + scriptOffset, length, string);
    return scriptOffset += string.length - length;
  };
  regex = /(\@(self|this|parent)\.?([^\s\)]*)|\$([\w\-]+)|\@([\w\-]+)|([\-]{0,1}([\.]\d+|\d+(\.\d+)*)[a-zA-Z]{1,4})|([\w\-\@\$]*)\(|\(|\)([\S]*))/g;
  shouldBreak = false;
  while (!shouldBreak && (section = regex.exec(expString))) {
    start = section.index;
    length = section[0].length;
    end = start + length;
    if (section[2]) {
      eObj = expander.relativeObject(section[2], section[3]);
    } else if (section[4]) {
      eObj = expander.localVariable(section[4], linkId, parseTree);
    } else if (section[5]) {
      eObj = expander.globalVariable(section[5], globals, parseTree);
    } else if (section[6]) {
      eObj = expander.numberWithUnit(section[6]);
    } else if (section[9]) {
      _ref = matchParens(regex, expString, end), contained = _ref.body, tailingUnit = _ref.unit;
      if (!contained) {
        contained = expString.substring(end, expString.length - 1);
        shouldBreak = true;
      }
      length += contained.length + 1;
      if (tailingUnit) {
        length += tailingUnit.length;
      }
      eObj = expander["function"](section[9], contained, tailingUnit, linkId, parseTree, funcs, globals);
    }
    if (!eObj) {
      continue;
    }
    if (eObj.script) {
      replaceInScript(start, length, eObj.script);
    }
    if (eObj.mode) {
      mode |= eObj.mode;
    }
    types.push(eObj.type === void 0 ? $wf.$type.Unknown : eObj.type);
    units.push(eObj.unit || '');
  }
  _ref1 = $wf.$parser.determineExpressionType(types, units), type = _ref1.type, unit = _ref1.unit;
  if (expString.match(/\s\=\s/g)) {
    unit = void 0;
  }
  script = $wf.$parser.wrapExpressionScript(script, top, type, unit);
  expr = new Expression(script, type, unit, mode);
  if (top) {
    expr.generate();
  }
  return expr;
};

window.fashion.$parser.wrapExpressionScript = function(script, top, type, unit) {
  if (top) {
    if (unit && typeof unit === "string") {
      return "return (" + script + ") + '" + unit + "'";
    } else {
      return "return " + script;
    }
  } else {
    return "{value: " + script + ", type: " + type + ", unit: '" + unit + "'}";
  }
};

window.fashion.$parser.spliceString = function(string, start, length, replacement) {
  return string.substr(0, start) + replacement + string.substr(start + length);
};

window.fashion.$parser.matchParenthesis = function(regex, string, index) {
  var acc, depth, lastIndex, section;
  depth = 0;
  acc = "";
  lastIndex = index;
  while (section = regex.exec(string)) {
    if (section[0].indexOf("(") !== -1) {
      depth++;
    } else if (section[0].indexOf(")") !== -1 && depth-- === 0) {
      acc += string.substr(lastIndex, section.index - lastIndex);
      return {
        body: acc,
        unit: section[10]
      };
    } else {
      acc += string.substr(lastIndex, (section.index - lastIndex) + section[0].length);
      lastIndex = section.index + section[0].length;
    }
  }
};

window.fashion.$parser.determineExpressionType = function(types, units) {
  var i, topType, topUnit, type, unit;
  topType = topUnit = void 0;
  for (i in types) {
    type = types[i];
    if (type === $wf.$type.Unknown) {
      continue;
    }
    if (!topType) {
      topType = type;
    } else if (type !== topType) {
      if (type === $wf.$type.String) {
        topType = $wf.$type.String;
      } else {
        console.log("[FASHION] Found mixed types in expression");
        return {};
      }
    }
    if (type === $wf.$type.Number || type === $wf.$type.Color) {
      unit = units[i];
      if (unit === "") {
        continue;
      }
      if (!topUnit) {
        topUnit = unit;
      } else if (unit !== topUnit) {
        console.log("[FASHION] Conflicting units '" + unit + "' and '" + typeUnit[1] + "'");
        console.log("[FASHION] Unit conversion will be implemented in the future");
        return {};
      }
    }
  }
  return {
    type: topType,
    unit: topUnit
  };
};

window.fashion.$parser.expressionExpander = {
  localVariable: function(name, selectorId, parseTree) {
    var isIndividual, isIndividualized, mode, script, selector, selectors, type, unit, vObj, vars;
    vars = parseTree.variables;
    selectors = vars[name];
    if (!selectors) {
      return console.log("[FASHION] Variable $" + name + " does not exist.");
    }
    isIndividual = false;
    type = unit = -1;
    for (selector in selectors) {
      vObj = selectors[selector];
      if (selector !== 0) {
        isIndividualized = false;
      }
      type = vObj.type;
      unit = vObj.unit;
    }
    parseTree.addVariableBinding(selectorId, name);
    script = "v('" + name + "',v,g,f,t" + (isIndividual ? ',e' : '') + ")";
    mode = $wf.$runtimeMode.generate(true, isIndividual);
    return new Expression(script, type, unit, mode);
  },
  globalVariable: function(name, globals, parseTree) {
    var dynamicMode, script, vObj;
    name = name.toLowerCase();
    vObj = globals[name];
    if (!vObj) {
      return console.log("[FASHION] Variable $" + name + " does not exist.");
    }
    parseTree.addGlobalDependency(name, vObj);
    dynamicMode = $wf.$runtimeMode.dynamic;
    script = "g." + name + ".get()";
    return new Expression(script, vObj.type, vObj.unit, dynamicMode);
  },
  numberWithUnit: function(value) {
    var numberType, staticMode, unittedValue;
    numberType = window.fashion.$type.Number;
    staticMode = $wf.$runtimeMode["static"];
    unittedValue = window.fashion.$run.getUnit(value, numberType, $wf.$type, $wf.$unit);
    if (unittedValue.value === NaN) {
      unittedValue.value = 0;
    }
    return new Expression(unittedValue.value, numberType, unittedValue.unit, staticMode);
  },
  relativeObject: function(keyword, property) {
    var dotProperties, lastProperty, script, type, unit, varName;
    varName = keyword === "parent" ? "e.parent" : "e";
    dotProperties = property.split(".");
    lastProperty = dotProperties[dotProperties.length - 1];
    if (lastProperty === "top" || lastProperty === "bottom" || lastProperty === "left" || lastProperty === "right" || lastProperty === "number" || lastProperty === "width" || lastProperty === "height") {
      type = $wf.$type.Number;
      unit = "px";
    } else {
      type = $wf.$type.String;
    }
    script = varName;
    if (property) {
      script += "." + property;
    }
    return new Expression(script, type, unit, $wf.$runtimeMode.individual);
  },
  "function": function(name, argumentsString, inputUnit, linkId, parseTree, funcs, globals) {
    var arg, args, expr, expressions, fObj, mode, script, scripts, unit, vars, _i, _len;
    vars = parseTree.variables;
    fObj = funcs[name];
    if (!fObj) {
      return console.log("[FASHION] Function $" + name + " does not exist.");
    }
    if (argumentsString.length > 1) {
      args = window.fashion.$parser.splitByTopLevelCommas(argumentsString);
      expressions = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          arg = args[_i];
          _results.push(window.fashion.$parser.parseExpression(arg, linkId, parseTree, funcs, globals, false));
        }
        return _results;
      })();
    } else {
      expressions = [];
    }
    scripts = ["t"];
    mode = fObj.mode;
    for (_i = 0, _len = expressions.length; _i < _len; _i++) {
      expr = expressions[_i];
      if (!(expr instanceof Expression)) {
        continue;
      }
      mode |= expr.mode;
      scripts.push(expr.script);
    }
    if (fObj.unit !== "") {
      unit = fObj.unit;
    } else if (fObj.unitFrom !== void 0) {
      unit = expressions[fObj.unitFrom].unit;
    } else {
      unit = "";
    }
    parseTree.addFunctionDependency(name, fObj);
    script = "f['" + name + "'].get.call(" + (scripts.join(',')) + ")";
    return new Expression(script, fObj.type, inputUnit || unit, mode);
  }
};
window.fashion.$processor = {
  process: function(parseTree) {
    parseTree = window.fashion.$processor.blocks(parseTree, $wf.$blocks);
    parseTree = window.fashion.$processor.properties(parseTree, $wf.$properties);
    return parseTree;
  }
};
window.fashion.$processor.api = {
  throwError: function(property, error) {
    return console.log("[FASHION: " + property + "] " + error);
  },
  setProperty: function(selector, insertIndex, mode, name, value) {
    var property;
    property = new Property(name, value, mode);
    return selector.insertProperty(property, insertIndex + 1);
  },
  getProperty: function(parseTree, selectorName, propertyName) {
    var rval;
    rval = void 0;
    parseTree.forEachMatchingSelector(selectorName, function(selector) {
      selector.forEachPropertyNamed(propertyName, function(property) {
        if (rval) {
          return false;
        }
        return rval = property.value;
      });
      if (rval) {
        return false;
      }
    });
    return rval;
  },
  addRule: function(parseTree, selectorName, body) {
    var selector;
    selector = $wf.$parser.createSelector(parseTree, selectorName);
    return $wf.$parser.parseSelectorBody(body + "\n", selector, parseTree);
  },
  addScript: function(parseTree, script) {
    return parseTree.addScript(script);
  },
  parseValue: function(value) {
    if (!value || typeof value !== "string") {
      return "";
    }
    return $wf.$parser.parseSingleValue(value);
  },
  determineType: function(value) {
    if (value.type) {
      return value.type;
    } else if (typeof value === 'string') {
      return window.fashion.$run.determineType(value, $wf.$type, $wf.$typeConstants);
    } else {
      return $wf.$type.Unknown;
    }
  },
  determineUnit: function(value) {
    if (value.unit) {
      return value.unit;
    } else if (typeof value === 'string') {
      return window.fashion.$run.getUnit(value, $wf.$type.Number, $wf.$type, $wf.$unit).unit;
    } else {
      return '';
    }
  }
};
window.fashion.$processor.blocks = function(parseTree, blocks) {
  var API, block, blockObj, funcs, _i, _len, _ref;
  funcs = window.fashion.$processor.api;
  _ref = parseTree.blocks;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    block = _ref[_i];
    blockObj = blocks[block.type];
    if (!blockObj) {
      continue;
    }
    API = {
      throwError: funcs.throwError.bind(0, block.type),
      addRule: funcs.addRule.bind(0, parseTree),
      addScript: funcs.addScript.bind(0, parseTree),
      parseValue: funcs.parseValue,
      parse: $wf.$parser.parse,
      runtimeObject: parseTree.dependencies.blocks[block.type].runtimeObject
    };
    blockObj.compile.call(API, block["arguments"], block.body);
  }
  return parseTree;
};
window.fashion.$processor.properties = function(parseTree, propertyModules) {
  var API, funcs, index, property, selector, _i, _j, _len, _len1, _ref, _ref1;
  funcs = window.fashion.$processor.api;
  _ref = parseTree.selectors;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    selector = _ref[_i];
    index = -1;
    _ref1 = selector.properties;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      property = _ref1[_j];
      index++;
      if (propertyModules[property.name] && propertyModules[property.name]['compile']) {
        API = {
          throwError: funcs.throwError.bind(0, property),
          setProperty: funcs.setProperty.bind(0, selector, index, property.mode),
          getProperty: funcs.getProperty.bind(0, parseTree, selector.name),
          parseValue: funcs.parseValue,
          determineType: funcs.determineType,
          determineUnit: funcs.determineUnit
        };
        propertyModules[property.name].compile.call(API, property.value);
        if (propertyModules[property.name].replace) {
          selector.properties.splice(index--, 1);
        }
      }
    }
  }
  return parseTree;
};
window.fashion.$run = {
  throwError: function(message) {
    return console.log("[FASHION] " + message);
  },
  updateVariable: function(name, value, variables, types) {
    var properties, selector, unittedValue, vObj, _ref, _results;
    if (variables == null) {
      variables = FASHION.variables;
    }
    if (types == null) {
      types = FASHION.type;
    }
    vObj = variables[name];
    if (!vObj) {
      return this.throwError("Variable '$" + name + "' does not exist");
    }
    if (this.determineType(value) !== vObj.type) {
      return this.throwError("Cannot change type of '$" + name + "'");
    }
    unittedValue = this.getUnit(value, vObj.type, types);
    if (unittedValue.unit && unittedValue.unit !== vObj.unit) {
      return this.throwError("Cannot change the unit of '$" + name + "'");
    }
    vObj.raw = value;
    if (unittedValue.value) {
      vObj.value = unittedValue.value;
    } else {
      vObj.value = vObj.raw;
    }
    _ref = vObj.dependants;
    _results = [];
    for (selector in _ref) {
      properties = _ref[selector];
      _results.push(this.updateSelector(selector));
    }
    return _results;
  },
  updateSelector: function(name, variables, selectors, map, allowNonexistant) {
    var cssElem, individualProps, location, properties;
    if (allowNonexistant == null) {
      allowNonexistant = false;
    }
    if (!variables) {
      variables = FASHION.variables;
    }
    if (!selectors) {
      selectors = FASHION.selectors;
    }
    if (!map) {
      map = FASHION.cssMap;
    }
    if (selectors.dynamic[name]) {
      properties = selectors.dynamic[name];
      if (!properties) {
        return this.throwError("Could not find selector '" + name + "'");
      }
      location = map[name];
      if (!location && !allowNonexistant) {
        return this.throwError("Could not find selector '" + name + "' in CSS");
      }
      if (location) {
        cssElem = document.getElementById("" + FASHION.config.cssId + location[0]);
        cssElem.sheet.deleteRule(location[1]);
      } else {
        cssElem = document.getElementById("" + FASHION.config.cssId + "0");
        map[name] = location = [0, cssElem.sheet.rules.length];
      }
      cssElem.sheet.insertRule(this.regenerateSelector(name, properties), location[1]);
    }
    if (selectors.individual[name]) {
      individualProps = selectors.individual[name];
      if (individualProps) {
        return this.applyIndividualizedSelectors(selectors.individual);
      }
    }
  },
  addProperties: function(name, properties, overwrite, selectors) {
    var property, valueObject;
    if (overwrite == null) {
      overwrite = true;
    }
    if (!selectors) {
      selectors = FASHION.selectors;
    }
    if (!selectors.dynamic[name]) {
      selectors.dynamic[name] = {};
    }
    for (property in properties) {
      valueObject = properties[property];
      if (selectors.dynamic[name][property] && !overwrite) {
        continue;
      }
      selectors.dynamic[name][property] = valueObject;
    }
    return this.updateSelector(name, false, selectors, false, true);
  },
  regenerateSelector: function(selector, properties, variables) {
    var dynamicProps, dynamicSelector, expandedSelector, property, val, valueObject;
    if (variables == null) {
      variables = FASHION.variables;
    }
    expandedSelector = this.expandVariables(selector);
    dynamicSelector = expandedSelector !== selector;
    dynamicProps = "" + expandedSelector + " {";
    for (property in properties) {
      valueObject = properties[property];
      val = this.evaluate(valueObject, void 0, variables);
      dynamicProps += "" + property + ": " + val + ";";
    }
    return dynamicProps + "}";
  },
  expandVariables: function(dynamicString, variables) {
    if (variables == null) {
      variables = FASHION.variables;
    }
    return dynamicString.replace(/\$([\w\-]+)/g, function(match, varName) {
      if (variables[varName]) {
        return variables[varName].value;
      } else {
        return "";
      }
    });
  }
};
window.fashion.$run.getVariable = function(variables, varName, type) {
  var vobj;
  if (type == null) {
    type = FASHION.type;
  }
  if (!variables[varName]) {
    return "";
  }
  vobj = variables[varName];
  if (vobj.type === type.Number) {
    return vobj.value + (vobj.unit || "");
  } else {
    return vobj.value;
  }
};

window.fashion.$run.evaluate = function(valueObject, element, variables, types, funcs, globals) {
  var evaluateSingleValue, runtime, value, vi, vo;
  if (!variables) {
    variables = FASHION.variableProxy;
  }
  if (!types) {
    types = FASHION.type;
  }
  if (!funcs) {
    funcs = FASHION.functions;
  }
  if (!globals) {
    globals = FASHION.globals;
  }
  runtime = window.FASHION ? w.FASHION.runtime : $wf.$run;
  evaluateSingleValue = function(valueObject) {
    var globObject, varName;
    if (typeof valueObject === "string") {
      return valueObject;
    }
    if (typeof valueObject === "number") {
      return valueObject;
    }
    if (valueObject.link && valueObject.link.length > 1) {
      if (valueObject.link[0] === "$") {
        varName = valueObject.link.substr(1);
        return window.fashion.$run.getVariable(variables, varName, types);
      } else if (valueObject.link[0] === "@") {
        globObject = globals[valueObject.link.substr(1)];
        if (!globObject) {
          return "";
        }
        if (globObject.type === types.Number) {
          return globObject.get() + (globObject.unit || "");
        } else {
          return globObject.get();
        }
      }
    } else if (valueObject.evaluate) {
      return valueObject.evaluate(variables, globals, funcs, runtime);
    } else if (valueObject.value) {
      return valueObject.value;
    }
  };
  if (valueObject instanceof Array) {
    if (valueObject.length === 0) {
      return '';
    }
    if (valueObject[0] instanceof Array) {
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = valueObject.length; _i < _len; _i++) {
          vo = valueObject[_i];
          _results.push(((function() {
            var _j, _len1, _results1;
            _results1 = [];
            for (_j = 0, _len1 = vo.length; _j < _len1; _j++) {
              vi = vo[_j];
              _results1.push(evaluateSingleValue(vi));
            }
            return _results1;
          })()).join(' '));
        }
        return _results;
      })()).join(', ');
    } else {
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = valueObject.length; _i < _len; _i++) {
          value = valueObject[_i];
          _results.push(evaluateSingleValue(value));
        }
        return _results;
      })()).join(' ');
    }
  } else {
    return evaluateSingleValue(valueObject);
  }
};
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

window.fashion.$run.determineType = function(value, types, constants) {
  var determineConstantType, determineSinglePartType;
  if (types == null) {
    types = FASHION.type;
  }
  if (constants == null) {
    constants = FASHION.constants;
  }
  if (typeof value === 'number') {
    return types.Number;
  }
  determineSinglePartType = function(value) {
    if (value[0] === "\"" || value[0] === "'") {
      return types.String;
    }
    if ((value.charCodeAt(0) > 47 && value.charCodeAt(0) < 58) || value[0] === '-' || value[0] === '.') {
      return types.Number;
    }
    if (value[0] === "#" || value.toLowerCase().indexOf("rgb") === 0) {
      return types.Color;
    }
    return determineConstantType(value) || window.fashion.$type.Unknown;
  };
  determineConstantType = function(value) {
    if (!constants) {
      return types.Unknown;
    }
    if (constants.colors && __indexOf.call(constants.colors, value) >= 0) {
      return types.Color;
    }
  };
  return determineSinglePartType(value);
};
window.fashion.$run.getUnit = function(rawValue, varType, type, unit) {
  var getNumberUnit;
  if (type == null) {
    type = FASHION.type;
  }
  if (unit == null) {
    unit = FASHION.unit;
  }
  if (typeof rawValue === 'number') {
    return {
      value: parseFloat(rawValue),
      unit: false
    };
  }
  getNumberUnit = function() {
    var components, splitRegex, unitString;
    splitRegex = /([0-9\-\.]*)(.*?)/;
    components = splitRegex.exec(rawValue);
    if (components.length < 2) {
      return {
        value: parseFloat(rawValue),
        unit: false
      };
    }
    unitString = rawValue.replace(components[1], "");
    unit = unit.Number[unitString];
    if (!unit) {
      return {
        value: parseFloat(components[1]),
        unit: false
      };
    }
    return {
      value: parseFloat(components[1]),
      unit: unit
    };
  };
  if (varType === type.Number) {
    return getNumberUnit();
  } else if (varType === type.String) {
    if (rawValue[0] === "'" || rawValue[0] === "\"") {
      rawValue = rawValue.substring(1, rawValue.length - 1);
    }
  }
  return {
    value: rawValue,
    unit: void 0
  };
};

window.fashion.$run.timeInMs = function(valueObject) {
  if (valueObject.unit === "ms") {
    return valueObject.value;
  } else if (valueObject.unit === "s") {
    return valueObject.value * 1000;
  } else {
    return 0;
  }
};
window.fashion.$run.applyIndividualizedSelectors = function(selectors) {
  var acc, e, element, elements, evaluateExpression, expression, properties, property, propertyObject, selector, value, _results;
  this.removeFashionStyles();
  _results = [];
  for (selector in selectors) {
    properties = selectors[selector];
    selector = window.fashion.$run.expandVariables(selector, FASHION.variables);
    elements = document.querySelectorAll(selector);
    _results.push((function() {
      var _i, _len, _results1;
      _results1 = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        e = this.buildObjectForElement(element);
        acc = "/*FS>*/";
        for (property in properties) {
          expression = properties[property];
          propertyObject = w.FASHION.properties[property];
          if (propertyObject && propertyObject['apply']) {
            if (e["bind-" + property] === "true") {
              continue;
            }
            evaluateExpression = expression.evaluate.bind({}, w.FASHION.variableProxy, w.FASHION.globals, w.FASHION.functions, w.FASHION.runtime, e);
            propertyObject['apply'](element, expression, evaluateExpression);
            element.setAttribute("bind-" + property, "true");
          } else {
            value = expression.evaluate(w.FASHION.variableProxy, w.FASHION.globals, w.FASHION.functions, w.FASHION.runtime, e);
            acc += "" + property + ": " + value + ";";
          }
        }
        _results1.push(this.addStyleToElement(element, acc.length > 7 ? acc + "/*<FS*/" : ""));
      }
      return _results1;
    }).call(this));
  }
  return _results;
};

window.fashion.$run.removeFashionStyles = function() {
  var element, elements, style, _i, _len, _results;
  elements = document.querySelectorAll("[style]");
  _results = [];
  for (_i = 0, _len = elements.length; _i < _len; _i++) {
    element = elements[_i];
    style = element.getAttribute("style");
    if (style.match(/\/\*FS>\*\/(.*?)\/\*<FS\*\//g)) {
      style = style.replace(/\/\*FS>\*\/(.*?)\/\*<FS\*\//g, "");
      _results.push(element.setAttribute("style", style));
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

window.fashion.$run.buildObjectForElement = function(element) {
  var attribute, cs, eObj, _i, _len, _ref;
  if (!element) {
    return {};
  }
  eObj = {
    element: element
  };
  if (element.attributes) {
    _ref = element.attributes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      attribute = _ref[_i];
      eObj[attribute.name] = attribute.value;
    }
  }
  Object.defineProperty(eObj, "parent", {
    get: (function(_this) {
      return function() {
        return _this.buildObjectForElement(element.parentNode);
      };
    })(this)
  });
  eObj.width = element.clientWidth;
  eObj.height = element.clientHeight;
  cs = window.getComputedStyle(element);
  if (cs) {
    Object.defineProperty(eObj, "outerWidth", {
      get: function() {
        return parseFloat(cs.marginLeft) + parseFloat(cs.marginRight) + eObj.width;
      }
    });
    Object.defineProperty(eObj, "outerHeight", {
      get: function() {
        return parseFloat(cs.marginTop) + parseFloat(cs.marginBottom) + eObj.height;
      }
    });
  }
  return eObj;
};

window.fashion.$run.addStyleToElement = function(element, style) {
  var currentStyle;
  if (element.element) {
    element = element.element;
  }
  currentStyle = element.getAttribute("style") || "";
  return element.setAttribute("style", currentStyle + style);
};
window.fashion.$run.defineProperties = function(variables, objectName) {
  var container, propObject, proxy, varName, varObj, _results;
  if (variables == null) {
    variables = FASHION.variables;
  }
  if (objectName == null) {
    objectName = FASHION.config.variableObject;
  }
  container = void 0;
  if (objectName) {
    container = window[objectName] = {};
  } else {
    container = window;
  }
  proxy = w.FASHION.variableProxy = {};
  _results = [];
  for (varName in variables) {
    varObj = variables[varName];
    propObject = {
      get: (function(varObj) {
        return function() {
          return varObj.value;
        };
      })(varObj),
      set: ((function(_this) {
        return function(varName, varObj) {
          return function(newValue) {
            return _this.updateVariable(varName, newValue);
          };
        };
      })(this))(varName, varObj)
    };
    Object.defineProperty(container, varName, propObject);
    Object.defineProperty(container, "$" + varName, propObject);
    proxy[varName] = {};
    _results.push(Object.defineProperty(proxy[varName], "value", propObject));
  }
  return _results;
};

window.fashion.$run.watchGlobals = function(globals) {
  var gObj, name, _results;
  if (globals == null) {
    globals = FASHION.globals;
  }
  _results = [];
  for (name in globals) {
    gObj = globals[name];
    _results.push(gObj.watch(((function(_this) {
      return function(gObj) {
        return function() {
          var properties, selector, _ref, _results1;
          _ref = gObj.dependants;
          _results1 = [];
          for (selector in _ref) {
            properties = _ref[selector];
            _results1.push(_this.updateSelector(selector));
          }
          return _results1;
        };
      };
    })(this))(gObj)));
  }
  return _results;
};
window.fashion.$actualizer = {
  actualize: function(parseTree, scriptIndex) {
    var hMap, hSelectors, _ref;
    return _ref = $wf.$actualizer.regroupProperties(parseTree), hSelectors = _ref.selectors, hMap = _ref.map, _ref;
  }
};
window.fashion.$actualizer.regroupProperties = function(parseTree) {
  var expansionMap, homogenousSelectors, properties, selector, selectorIds, splitSelector, splitSelectors, _i, _j, _len, _len1, _ref;
  homogenousSelectors = [];
  expansionMap = [];
  _ref = parseTree.selectors;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    selector = _ref[_i];
    properties = selector.properties;
    $wf.$actualizer.groupPropertiesWithMode(properties, $wf.$runtimeMode.dynamic);
    $wf.$actualizer.groupPropertiesWithMode(properties, $wf.$runtimeMode.live);
    $wf.$actualizer.groupPropertiesWithMode(properties, $wf.$runtimeMode.individual);
    splitSelectors = $wf.$actualizer.splitSelectorByModes(selector);
    selectorIds = [];
    for (_j = 0, _len1 = splitSelectors.length; _j < _len1; _j++) {
      splitSelector = splitSelectors[_j];
      homogenousSelectors.push(splitSelector);
      selectorIds.push(homogenousSelectors.length - 1);
    }
    expansionMap.push(selectorIds);
  }
  return {
    selectors: homogenousSelectors,
    map: expansionMap
  };
};

window.fashion.$actualizer.groupPropertiesWithMode = function(properties, mode) {
  var bottomCount, compareCategory, i, o, property, propertyCategory, _i, _ref, _results;
  bottomCount = properties[properties.length - 1].mode === mode ? 1 : 0;
  _results = [];
  for (o = _i = _ref = properties.length - 2 - bottomCount; _i >= 0; o = _i += -1) {
    property = properties[o];
    if (property.mode !== mode) {
      continue;
    }
    propertyCategory = property.name.split('-')[0].toLowerCase();
    i = o + 1;
    while (i < properties.length - bottomCount) {
      compareCategory = properties[i].name.split('-')[0].toLowerCase();
      if (compareCategory === propertyCategory) {
        break;
      }
      i++;
    }
    properties.splice(o, 1);
    properties.splice(i - 1, 0, property);
    if (i === properties.length - bottomCount) {
      _results.push(bottomCount++);
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

window.fashion.$actualizer.splitSelectorByModes = function(selector) {
  var currentSelector, newSelectors, property, _i, _len, _ref;
  newSelectors = [];
  currentSelector = void 0;
  _ref = selector.properties;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    property = _ref[_i];
    if (!currentSelector || currentSelector.mode !== property.mode) {
      currentSelector = new Selector(selector.name, property.mode);
      newSelectors.push(currentSelector);
    }
    currentSelector.addProperty(property);
  }
  return newSelectors;
};
window.fashion.$functions = {
  random: new FunctionModule({
    output: $wf.$type.Number,
    evaluate: function() {
      return Math.random();
    }
  }),
  round: new FunctionModule({
    output: $wf.$type.Number,
    unitFrom: 0,
    evaluate: function(n) {
      return Math.round(n.value);
    }
  }),
  min: new FunctionModule({
    output: $wf.$type.Number,
    unitFrom: 0,
    evaluate: function() {
      var arg, minSoFar, _i, _len;
      minSoFar = 9007199254740992;
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        arg = arguments[_i];
        if (arg.value < minSoFar) {
          minSoFar = arg.value;
        }
      }
      return minSoFar;
    }
  }),
  max: new FunctionModule({
    output: $wf.$type.Number,
    unitFrom: 0,
    evaluate: function() {
      var arg, maxSoFar, _i, _len;
      maxSoFar = -9007199254740992;
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        arg = arguments[_i];
        if (arg.value > maxSoFar) {
          maxSoFar = arg.value;
        }
      }
      return maxSoFar;
    }
  })
};
$wf.$extend(window.fashion.$functions, {
  "@": new FunctionModule({
    output: $wf.$type.Number,
    unit: '',
    dynamic: true,
    evaluate: function(selector, property, element) {
      var matched, style;
      if (!element) {
        element = document;
      }
      matched = this.querySelector(selector.value);
      style = this.getComputedStyle(matched);
      return style[property.value];
    }
  })
});
$wf.$extend(window.fashion.$functions, {
  "rgb": new FunctionModule({
    output: $wf.$type.Color,
    evaluate: function(r, g, b) {
      return "rgb(" + (parseInt(r.value)) + "," + (parseInt(g.value)) + "," + (parseInt(b.value)) + ")";
    }
  }),
  "rgba": new FunctionModule({
    output: $wf.$type.Color,
    evaluate: function(r, g, b, a) {
      return "rgba(" + (parseInt(r.value)) + "," + (parseInt(g.value)) + "," + (parseInt(b.value)) + "," + a.value + ")";
    }
  })
});
window.fashion.$properties = {
  "text-style": new PropertyModule({
    replace: true,
    compile: function(values) {
      var compileSingleValue, families, v, _i, _len;
      families = [];
      compileSingleValue = (function(_this) {
        return function(value) {
          if (!(typeof value === 'string')) {
            return;
          }
          if (value[0] === "'" || value[0] === '"') {
            return families.push(value);
          }
          switch (value) {
            case "serif":
              return families.push("serif");
            case "sans-serif":
              return families.push("sans-serif");
            case "monospace":
              return families.push("monospace");
            case "italic":
              return _this.setProperty("font-style", "italic");
            case "oblique":
              return _this.setProperty("font-style", "oblique");
            case "bold":
              return _this.setProperty("font-weight", "bolder");
            case "light":
              return _this.setProperty("font-weight", "lighter");
            case "underline":
              return _this.setProperty("text-decoration", "underline");
            case "overline":
              return _this.setProperty("text-decoration", "overline");
            case "line-through":
              return _this.setProperty("text-decoration", "line-through");
            case "strikethrough":
              return _this.setProperty("text-decoration", "line-through");
          }
        };
      })(this);
      if (values instanceof Array) {
        for (_i = 0, _len = values.length; _i < _len; _i++) {
          v = values[_i];
          compileSingleValue(v);
        }
      } else {
        compileSingleValue(values);
      }
      return this.setProperty("font-family", families.join(", "));
    }
  })
};
$wf.$extend(window.fashion.$properties, {
  pin: new PropertyModule({
    replace: true,
    compile: function(values) {
      var bottomExpr, leftExpr, processPosition, rightExpr, topExpr;
      if (typeof values === "object") {
        if (values.length > 2 || values[0] instanceof Array) {
          this.throwError("Valid arguments: '{x}px {y}px' or '{both}px'");
        }
      }
      this.setProperty("position", "absolute");
      leftExpr = rightExpr = topExpr = bottomExpr = void 0;
      processPosition = function(val) {
        switch (val) {
          case "left":
            return leftExpr = "0px";
          case "right":
            return rightExpr = "0px";
          case "top":
            return topExpr = "0px";
          case "bottom":
            return bottomExpr = "0px";
          case "center":
            leftExpr = "@parent.width / 2 - @self.outerWidth / 2";
            return topExpr = "@parent.height / 2 - @self.outerHeight / 2";
          default:
            return this.throwError("Invalid position: " + val);
        }
      };
      if (typeof values === "object") {
        processPosition(values[0]);
        if (values.length === 2) {
          processPosition(values[1]);
        }
      } else if (typeof values === "string") {
        processPosition(values);
      }
      if (leftExpr) {
        this.setProperty("left", this.parseValue(leftExpr));
      } else {
        this.setProperty("right", this.parseValue(rightExpr));
      }
      if (topExpr) {
        return this.setProperty("top", this.parseValue(topExpr));
      } else {
        return this.setProperty("bottom", this.parseValue(bottomExpr));
      }
    }
  })
});
$wf.$extend(window.fashion.$properties, new ((function() {
  function _Class() {
    var applyForEvent, events, evt, _i, _len;
    events = ["click", "dblclick", "mousedown", "mouseup", "mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "drag", "dragdrop", "dragend", "drop", "dragenter", "dragexit", "draggesture", "dragleave", "dragover", "dragstart", "blur", "change", "focus", "focusin", "focusout", "submit", "reset"];
    applyForEvent = function(evt) {
      var body;
      body = "element.addEventListener('" + evt + "', evaluate, false);";
      return new Function("element", "value", "evaluate", body);
    };
    for (_i = 0, _len = events.length; _i < _len; _i++) {
      evt = events[_i];
      this["on-" + evt] = new PropertyModule({
        replace: true,
        mode: $wf.$runtimeMode.individual,
        "apply": applyForEvent(evt)
      });
    }
  }

  return _Class;

})()));
window.fashion.$blocks = {};
window.fashion.$blocks["transition"] = new BlockModule({
  compile: function(args, body) {
    var acc, count, currentKeyframe, depth, keyframe, keyframes, lastAcc, name, regex, segment, transition;
    name = args[0];
    regex = /(\s*([0-9\-\.\s\%]+?\%|start)\s?\{|\}|\{)/g;
    keyframes = {};
    depth = lastAcc = 0;
    currentKeyframe = acc = "";
    count = 1000;
    while (--count > 0 && (segment = regex.exec(body))) {
      acc += body.substring(lastAcc, segment.index);
      lastAcc = segment.index;
      if (segment[2] && depth === 0) {
        currentKeyframe = segment[2];
        acc = "";
        lastAcc = segment[0].length + segment.index;
        depth++;
      }
      if (segment[0] === "{") {
        depth++;
      } else if (segment[0] === "}") {
        depth--;
        if (depth === 0) {
          keyframes[currentKeyframe] = acc;
          acc = "";
          currentKeyframe = "";
        }
      }
    }
    transition = {};
    for (keyframe in keyframes) {
      body = keyframes[keyframe];
      transition[keyframe] = this.parse(body).selectors;
    }
    return this.runtimeObject.transitions[name] = transition;
  },
  runtimeObject: {
    transitions: {},
    trigger: function(name, duration, element) {
      var addSelectors, head, keyframe, runtime, selectors, sheet, sheetElement, startTime, transition;
      duration = this.timeInMs(duration);
      runtime = w.FASHION.blocks.transition;
      transition = runtime.transitions[name];
      sheetElement = document.createElement("style");
      sheetElement.setAttribute("type", "text/css");
      head = document.head || document.getElementsByTagName('head')[0];
      head.appendChild(sheetElement);
      sheet = sheetElement.sheet;
      for (keyframe in transition) {
        selectors = transition[keyframe];
        if (keyframe === "start") {
          startTime = 0;
        } else {
          startTime = (parseFloat(keyframe.split('-')[0]) / 100 * duration) + 10;
        }
        addSelectors = runtime.addSelectors(selectors, duration, sheet, runtime);
        if (startTime > 0) {
          wait(startTime, addSelectors.bind(this));
        } else {
          addSelectors.bind(this)();
        }
      }
      return wait(duration + 12, function() {
        return sheetElement.parentElement.removeChild(sheetElement);
      });
    },
    addSelectors: function(selectors, duration, sheet, runtime) {
      return function() {
        var jumpProperties, properties, property, selector, smoothCount, smoothProperties, transitionRule, valueObject;
        for (selector in selectors) {
          properties = selectors[selector];
          jumpProperties = {};
          smoothProperties = {};
          smoothCount = 0;
          for (property in properties) {
            valueObject = properties[property];
            if (typeof valueObject !== 'object' || !valueObject.transition) {
              jumpProperties[property] = valueObject;
            } else {
              smoothProperties[property] = valueObject;
              smoothCount++;
            }
          }
          this.addProperties(selector, jumpProperties);
          if (smoothCount === 0) {
            continue;
          }
          transitionRule = runtime.generateTransitions(smoothProperties, duration);
          sheet.insertRule("" + selector + " {" + transitionRule + "}", sheet.rules.length);
          wait(1, ((function(_this) {
            return function(selector, smoothProperties) {
              return function() {
                return _this.addProperties(selector, smoothProperties);
              };
            };
          })(this))(selector, smoothProperties));
        }
      };
    },
    generateTransitions: function(properties, duration) {
      var csstext, l, msLength, property, t, valueObject;
      csstext = "transition: ";
      for (property in properties) {
        valueObject = properties[property];
        if (!valueObject.transition) {
          continue;
        }
        t = valueObject.transition;
        l = parseFloat(t.duration) / 100 * duration;
        msLength = l ? "" + l + "ms" : t.duration;
        csstext += "" + property + " " + msLength + " " + (t.easing || '') + " " + (t.delay || '') + ",";
      }
      csstext = csstext.substr(0, csstext.length - 1) + ";";
      csstext = [csstext, "-webkit-" + csstext, "-moz-" + csstext, "-ms-" + csstext].join('');
      return csstext;
    }
  }
});

window.fashion.$functions["trigger"] = new FunctionModule({
  output: $wf.$type.None,
  unit: '',
  mode: $wf.$runtimeMode.individual,
  evaluate: function(name, duration, element) {
    return w.FASHION.blocks.transition.trigger.call(this, name.value, duration, element);
  }
});
window.fashion.$globals = {
  width: new GlobalModule({
    type: $wf.$type.Number,
    unit: "px",
    get: function() {
      return window.innerWidth;
    },
    watch: function(onchange) {
      return window.addEventListener("resize", onchange, false);
    }
  }),
  height: new GlobalModule({
    type: $wf.$type.Number,
    unit: "px",
    get: function() {
      return window.innerHeight;
    },
    watch: function(onchange) {
      return window.addEventListener("resize", onchange, false);
    }
  }),
  scrolly: new GlobalModule({
    type: $wf.$type.Number,
    unit: "px",
    get: function() {
      return window.scrollY;
    },
    watch: function(onchange) {
      return window.addEventListener("onscroll", onchange);
    }
  }),
  scrollx: new GlobalModule({
    type: $wf.$type.Number,
    unit: "px",
    get: function() {
      return window.scrollX;
    },
    watch: function(onchange) {
      return window.addEventListener("onscroll", onchange);
    }
  }),
  mousey: new GlobalModule({
    type: $wf.$type.Number,
    unit: "px",
    get: function() {
      return window.mouseY || 0;
    },
    watch: function(onchange) {
      return window.addEventListener("mousemove", function(e) {
        window.mouseY = e.pageY;
        return onchange();
      });
    }
  }),
  mousex: new GlobalModule({
    type: $wf.$type.Number,
    unit: "px",
    get: function() {
      return window.mouseX || 0;
    },
    watch: function(onchange) {
      return window.addEventListener("mousemove", function(e) {
        window.mouseX = e.pageX;
        return onchange();
      });
    }
  })
};
}());

