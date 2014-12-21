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
  version: "0.2",
  url: "http://writefashion.org",
  author: "Keaton Brandt",
  mimeType: "text/x-fashion",
  cssId: "FASHION-stylesheet",
  runtimeObject: "FASHION",
  runtimeModules: ["watchVariables"]
};

window.fashion.runtimeConfig = {
  variableObject: "style",
  idPrefix: "FS-",
  individualCSSID: "FASHION-individual",
  cssId: window.fashion.cssId
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

document.addEventListener('readystatechange', function() {
  if (document.readyState === "complete") {
    return window.fashion.$loader.loadStyles(function(scriptText) {
      var css, event, js, parseTree, start, _ref;
      start = new Date().getTime();
      parseTree = window.fashion.$parser.parse(scriptText);
      parseTree = window.fashion.$processor.process(parseTree);
      _ref = window.fashion.$actualizer.actualize(parseTree), css = _ref.css, js = _ref.js;
      $wf.$dom.addStylesheet(css);
      $wf.$dom.addScript(js);
      console.log("[FASHION] Compile finished in " + (new Date().getTime() - start) + "ms");
      event = new Event(window.fashion.live.loadedEvent);
      event.variableObject = window[window.fashion.variableObject];
      return document.dispatchEvent(event);
    });
  }
});
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
  addStylesheet: function(styleText, id) {
    var rule, sheet, styleRules, _results;
    if (id == null) {
      id = window.fashion.cssId;
    }
    sheet = document.createElement("style");
    sheet.setAttribute("type", "text/css");
    sheet.setAttribute("id", "" + id);
    $wf.$dom.addElementToHead(sheet);
    styleRules = styleText.split("\n");
    _results = [];
    for (id in styleRules) {
      rule = styleRules[id];
      if (rule.length > 3) {
        _results.push(sheet.sheet.insertRule(rule, id));
      }
    }
    return _results;
  },
  addScript: function(scriptText) {
    var script;
    script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.text = scriptText;
    return $wf.$dom.addElementToHead(script);
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
  if (value instanceof Array) {
    return window.fashion.$stringifyArray(value);
  }
  switch (typeof value) {
    case "string":
      return JSON.stringify(value);
    case "object":
      return window.fashion.$stringifyObject(value);
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
  return "{" + (propStrings.join(',')) + "}";
};

window.fashion.$stringifyArray = function(array) {
  var propStrings, value, _i, _len;
  propStrings = [];
  for (_i = 0, _len = array.length; _i < _len; _i++) {
    value = array[_i];
    propStrings.push(window.fashion.$stringify(value));
  }
  return "[" + (propStrings.join(',')) + "]";
};
var ParseTree,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
    if (__indexOf.call(this.bindings.variables[variableName], selectorId) >= 0) {
      return;
    }
    return this.bindings.variables[variableName].push(selectorId);
  };

  ParseTree.prototype.addGlobalBinding = function(selectorId, globalName) {
    if (!this.bindings.globals[globalName]) {
      this.bindings.globals[globalName] = [];
    }
    if (__indexOf.call(this.bindings.globals[globalName], selectorId) >= 0) {
      return;
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

  Property.prototype.copyWithName = function(name) {
    return new Property(name, this.value, this.mode);
  };

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
    this.setter = this.script.indexOf("=") !== -1;
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
    this.runtimeCapabilities = args.runtimeCapabilities || args.capabilities;
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
    this.watch = args.watch;
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
      this.runtimeCapabilities = args.runtimeCapabilities || args.capabilities;
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
      this.mode = args.mode;
      this.runtimeCapabilities = args.runtimeCapabilities || args.capabilities;
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
  loadStyles: function(scriptsCallback) {
    var acc, count, loaded;
    count = $wf.$loader.countScripts();
    loaded = 0;
    acc = "";
    return $wf.$loader.loadIndividualStyles(function(individualScript) {
      acc += individualScript;
      if (++loaded === count) {
        return scriptsCallback(acc);
      }
    });
  },
  loadIndividualStyles: function(scriptCallback) {
    return window.fashion.$loader.loadStyleTags(scriptCallback);
  },
  loadStyleTags: function(scriptCallback) {
    var i, styleTags, tagType, url, _i, _ref, _results;
    styleTags = document.getElementsByTagName("style");
    _results = [];
    for (i = _i = 0, _ref = styleTags.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      tagType = styleTags[i].getAttribute("type");
      if (tagType !== window.fashion.mimeType) {
        continue;
      }
      if (styleTags[i].textContent !== "") {
        _results.push(scriptCallback(styleTags[i].textContent));
      } else if (styleTags[i].getAttribute("src") !== "") {
        url = styleTags[i].getAttribute("src");
        _results.push($wf.$loader.loadExternalScript(url, scriptCallback));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  },
  countScripts: function() {
    var fileCount, i, linkTags, styleTags, tagType, _i, _j, _ref, _ref1;
    fileCount = 0;
    styleTags = document.getElementsByTagName("style");
    for (i = _i = 0, _ref = styleTags.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      tagType = styleTags[i].getAttribute("type");
      if (tagType !== window.fashion.mimeType) {
        continue;
      }
      fileCount++;
    }
    linkTags = document.getElementsByTagName("link");
    for (i = _j = 0, _ref1 = linkTags.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      tagType = linkTags[i].getAttribute("type");
      if (tagType !== window.fashion.mimeType) {
        continue;
      }
      fileCount++;
    }
    return fileCount;
  },
  loadExternalScript: function(url, callback) {
    var req;
    req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (req.readyState === 4 && req.status === 200) {
        return callback(req.responseText);
      } else if (req.status > 400) {
        return console.log("[FASHION] Could not load script: " + url + " (" + req.status + ")");
      }
    };
    req.open("GET", url, true);
    return req.send();
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
    type = window.fashion.$shared.determineType(val, $wf.$type, $wf.$typeConstants);
    unittedValue = window.fashion.$shared.getUnit(val, type, $wf.$type, $wf.$unit);
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
  regex = /([^\(\)\"\'\`\s]*\(|\)|\"|\'|\`|([^\(\)\"\'\`\s]+(\s+[\+\-\/\*\=]\s+|[\+\-\/\*\=]))+[^\(\)\"\'\`\s]+|\s+(\&\&|\|\|)\s+|\s|[^\(\)\"\'\`\s]+)/g;
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
      } else if (segment[7][0] === "~") {
        name = topSel.name + " " + segment[7].substr(1);
      } else {
        name = topSel.name + " > " + segment[7];
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
    transition = void 0;
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
  return /(([\s][\+\-\/\*\=][\s])|\s(\&\&|\|\|)\s|[\(\)\[\]]|\@|\$)/g;
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
  var contained, eObj, end, expander, expr, isSetter, length, matchParens, mode, regex, replaceInScript, script, scriptOffset, section, shouldBreak, start, tailingUnit, type, types, unit, units, _ref, _ref1;
  if (top == null) {
    top = true;
  }
  expander = $wf.$parser.expressionExpander;
  matchParens = window.fashion.$parser.matchParenthesis;
  script = expString;
  mode = $wf.$runtimeMode["static"];
  types = [];
  units = [];
  isSetter = false;
  scriptOffset = 0;
  replaceInScript = function(start, length, string) {
    script = $wf.$parser.spliceString(script, start + scriptOffset, length, string);
    return scriptOffset += string.length - length;
  };
  regex = /(\$([\w\-]+)\s*?\=|\@(self|this|parent)\.?([^\s\)]*)|\$([\w\-]+)|\@([\w\-]+)|([\-]{0,1}([\.]\d+|\d+(\.\d+)*)[a-zA-Z]{1,4})|([\w\-\@\$]*)\(|\(|\)([\S]*))/g;
  shouldBreak = false;
  while (!shouldBreak && (section = regex.exec(expString))) {
    start = section.index;
    length = section[0].length;
    end = start + length;
    if (section[2]) {
      eObj = expander.localVariable(section[2], linkId, parseTree, true);
      isSetter = true;
    } else if (section[3]) {
      eObj = expander.relativeObject(section[3], section[4]);
    } else if (section[5]) {
      eObj = expander.localVariable(section[5], linkId, parseTree);
    } else if (section[6]) {
      eObj = expander.globalVariable(section[6], linkId, globals, parseTree);
    } else if (section[7]) {
      eObj = expander.numberWithUnit(section[7]);
    } else if (section[10]) {
      _ref = matchParens(regex, expString, end), contained = _ref.body, tailingUnit = _ref.unit;
      if (!contained) {
        contained = expString.substring(end, expString.length - 1);
        shouldBreak = true;
      }
      length += contained.length + 1;
      if (tailingUnit) {
        length += tailingUnit.length;
      }
      eObj = expander["function"](section[10], contained, tailingUnit, linkId, parseTree, funcs, globals);
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
  if (isSetter) {
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
        unit: section[11]
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
  localVariable: function(name, selectorId, parseTree, isSetter) {
    var isIndividual, isIndividualized, mode, script, selector, selectors, type, unit, vObj, vars;
    if (isSetter == null) {
      isSetter = false;
    }
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
    if (isSetter) {
      script = "v('" + name + "'" + (isIndividual ? ',e' : '') + ").value =";
    } else {
      parseTree.addVariableBinding(selectorId, name);
      script = "v('" + name + "'" + (isIndividual ? ',e' : '') + ").value";
    }
    mode = $wf.$runtimeMode.generate(true, isIndividual);
    return new Expression(script, type, unit, mode);
  },
  globalVariable: function(name, selectorId, globals, parseTree) {
    var dynamicMode, script, vObj;
    name = name.toLowerCase();
    vObj = globals[name];
    if (!vObj) {
      return console.log("[FASHION] Variable $" + name + " does not exist.");
    }
    parseTree.addGlobalDependency(name, vObj);
    parseTree.addGlobalBinding(selectorId, name);
    dynamicMode = $wf.$runtimeMode.dynamic;
    script = "g." + name + ".get()";
    return new Expression(script, vObj.type, vObj.unit, dynamicMode);
  },
  numberWithUnit: function(value) {
    var numberType, staticMode, unitValue;
    numberType = window.fashion.$type.Number;
    staticMode = $wf.$runtimeMode["static"];
    unitValue = window.fashion.$shared.getUnit(value, numberType, $wf.$type, $wf.$unit);
    if (unitValue.value === NaN) {
      unitValue.value = 0;
    }
    return new Expression(unitValue.value, numberType, unitValue.unit, staticMode);
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
  setProperty: function(selector, insertIndex, name, value) {
    var property;
    property = new Property(name, value, value.mode || $wf.$runtimeMode["static"]);
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
      return window.fashion.$shared.determineType(value, $wf.$type, $wf.$typeConstants);
    } else {
      return $wf.$type.Unknown;
    }
  },
  determineUnit: function(value) {
    if (value.unit) {
      return value.unit;
    } else if (typeof value === 'string') {
      return window.fashion.$shared.getUnit(value, $wf.$type.Number, $wf.$type, $wf.$unit).unit;
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
  var API, funcs, index, property, propertyModule, selector, _i, _j, _len, _len1, _ref, _ref1;
  funcs = window.fashion.$processor.api;
  _ref = parseTree.selectors;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    selector = _ref[_i];
    index = -1;
    _ref1 = selector.properties;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      property = _ref1[_j];
      index++;
      propertyModule = propertyModules[property.name];
      if (propertyModule) {
        API = {
          throwError: funcs.throwError.bind(0, property),
          setProperty: funcs.setProperty.bind(0, selector, index),
          getProperty: funcs.getProperty.bind(0, parseTree, selector.name),
          parseValue: funcs.parseValue,
          determineType: funcs.determineType,
          determineUnit: funcs.determineUnit
        };
        if (propertyModule.mode === $wf.$runtimeMode.individual) {
          parseTree.addPropertyDependency(property.name, propertyModule);
          property.mode |= $wf.$runtimeMode.individual;
        } else {
          propertyModules[property.name].compile.call(API, property.value);
          if (propertyModule.replace) {
            selector.properties.splice(index--, 1);
          }
        }
      }
    }
  }
  return parseTree;
};
window.fashion.$shared = {};
window.fashion.$shared.getVariable = function(variables, globals, funcs, runtime, varName, elem) {
  var vObj;
  vObj = variables[varName];
  if (!vObj) {
    console.log("[FASHION] Could not find variable '" + varName + "'");
    return {
      value: void 0
    };
  }
  if (vObj[0]) {
    return vObj[0];
  }
  if (vObj.scope && vObj.scope.length > 0) {
    return this.throwError("Scoped variables are not yet supported");
  } else if (vObj["default"]) {
    if (vObj["default"].script) {
      return {
        value: this.evaluate(vObj["default"], variables, globals, funcs, runtime, elem)
      };
    } else {
      return {
        value: vObj["default"]
      };
    }
  } else {
    return this.throwError("Variable '" + varName + "' does not exist.");
  }
};

window.fashion.$shared.evaluate = function(valueObject, variables, globals, funcs, runtime, element) {
  var evaluateSingleValue, value, vi, vo;
  evaluateSingleValue = (function(_this) {
    return function(valueObject) {
      var v, val, varLookup, varObjects, _i, _len;
      if (typeof valueObject === "string") {
        return valueObject;
      }
      if (typeof valueObject === "number") {
        return valueObject;
      }
      varObjects = [];
      varLookup = function(varName, element) {
        var vObj;
        vObj = _this.getVariable(variables, globals, funcs, runtime, varName, element);
        varObjects.push({
          name: varName,
          object: vObj,
          value: vObj.value
        });
        return vObj;
      };
      if (valueObject.evaluate) {
        val = valueObject.evaluate(varLookup, globals, funcs, runtime, element);
        if (valueObject.setter) {
          for (_i = 0, _len = varObjects.length; _i < _len; _i++) {
            v = varObjects[_i];
            if (v.object.value !== v.value) {
              _this.setVariable(v.name, v.object.value);
            }
          }
        }
        return val;
      } else if (valueObject.value) {
        return valueObject.value;
      }
    };
  })(this);
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

window.fashion.$shared.determineType = function(value, types, constants) {
  var determineConstantType, determineSinglePartType;
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
window.fashion.$shared.getUnit = function(rawValue, varType, type, unit) {
  var getNumberUnit;
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

window.fashion.$shared.timeInMs = function(valueObject) {
  if (valueObject.unit === "ms") {
    return valueObject.value;
  } else if (valueObject.unit === "s") {
    return valueObject.value * 1000;
  } else {
    return 0;
  }
};
window.fashion.color = {
  cssTOjs: function(cssString, colorTools) {
    var rgbMatch;
    if (colorTools == null) {
      colorTools = $wf.color;
    }
    if (cssString[0] === "#") {
      return colorTools.hexTOrgb(cssString);
    }
    if (rgbMatch = cssString.match(/rgba?\((.*?),(.*?),([^,]*),?(.*?)\)/)) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3]),
        a: parseFloat(rgbMatch[4] || 1)
      };
    }
  },
  hexTOrgb: function(hex) {
    var result, shorthandRegex;
    if (hex === void 0) {
      return {
        r: 0,
        g: 0,
        b: 0
      };
    }
    shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      return {
        r: 0,
        g: 0,
        b: 0
      };
    }
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  },
  rgbTOhex: function(r, g, b) {
    var ntoHex, _ref;
    if (typeof r === 'object') {
      _ref = [r.r, r.g, r.b], r = _ref[0], g = _ref[1], b = _ref[2];
    }
    ntoHex = function(c) {
      var hex;
      if (typeof c === 'string') {
        c = parseInt(c);
      }
      hex = c.toString(16);
      if (hex.length === 1) {
        return "0" + hex;
      } else {
        return hex;
      }
    };
    return "#" + ntoHex(parseInt(r)) + ntoHex(parseInt(g)) + ntoHex(parseInt(b));
  },
  hsbTOrgb: function(h, s, b) {
    var c, m, _ref;
    if (typeof h === 'object') {
      _ref = [h.h, h.s, h.b], h = _ref[0], s = _ref[1], b = _ref[2];
    }
    m = Math;
    s = s / 255;
    b = b / 255;
    c = function(o) {
      return 255 * (s * b * m.max(m.min(m.abs(((h + o) / 60 % 6) - 3) - 1, 1), 0) + b * (1 - s));
    };
    return {
      r: c(0),
      g: c(240),
      b: c(120)
    };
  },
  rgbTOhsb: function(r, g, b) {
    var h, hof, max, min, pcd, s, scd, val, _ref, _ref1, _ref2, _ref3;
    if (typeof r === 'object') {
      _ref = [r.r, r.g, r.b], r = _ref[0], g = _ref[1], b = _ref[2];
    }
    val = Math.max(r, g, b);
    r /= 255;
    g /= 255;
    b /= 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    if (max === min) {
      return {
        h: 0,
        s: 0,
        b: val
      };
    }
    pcd = max - min;
    switch (min) {
      case r:
        _ref1 = [g - b, 3], scd = _ref1[0], hof = _ref1[1];
        break;
      case g:
        _ref2 = [b - r, 5], scd = _ref2[0], hof = _ref2[1];
        break;
      case b:
        _ref3 = [r - g, 1], scd = _ref3[0], hof = _ref3[1];
    }
    h = ((hof - scd / pcd) * 60) % 360;
    s = pcd / max * 255;
    return {
      h: h,
      s: s,
      b: val
    };
  }
};
window.fashion.$actualizer = {
  actualize: function(parseTree) {
    var capabilities, css, cssMap, cssSelectors, cullOffsets, hMap, js, jsSelectors, rMode, runtimeData, selectors, _ref, _ref1;
    rMode = $wf.$runtimeMode;
    $wf.$actualizer.separateTransitions(parseTree);
    _ref = $wf.$actualizer.regroupProperties(parseTree), selectors = _ref.selectors, hMap = _ref.map;
    _ref1 = $wf.$actualizer.cullIndividuality(selectors, hMap), cssSelectors = _ref1.sel, cssMap = _ref1.map, cullOffsets = _ref1.offsets;
    jsSelectors = $wf.$actualizer.filterSelectors(cssSelectors, rMode["static"]);
    runtimeData = $wf.$actualizer.generateRuntimeData(parseTree, jsSelectors, cssMap);
    $wf.$actualizer.addBindings(runtimeData, parseTree, jsSelectors, cssMap);
    capabilities = $wf.$actualizer.determineRuntimeCapabilities(runtimeData, selectors);
    if (capabilities.has($wf.$runtimeCapability.individualProps)) {
      $wf.$actualizer.addIndividualProperties(runtimeData, selectors, cullOffsets);
    }
    $wf.$actualizer.addRuntimeFunctions(runtimeData, parseTree, capabilities);
    css = $wf.$actualizer.createCSS(runtimeData, cssSelectors);
    js = $wf.$actualizer.createJS(runtimeData, parseTree.scripts);
    return {
      css: css,
      js: js
    };
  }
};

window.fashion.$actualizer.createJS = function(runtimeData, scripts) {
  return "/*\\\n|*| GENERATED BY FASHION " + $wf.version + "\n|*| " + $wf.url + " - " + $wf.author + "\n\\*/\nwindow." + $wf.runtimeObject + " = " + ($wf.$stringify(runtimeData)) + ";\nFSREADY = function(r){d=document;c=\"complete\";\n	if(d.readyState==c)r()\n	else d.addEventListener('readystatechange',function(){if(d.readyState==c)r()})\n}\n" + (scripts.join('\n'));
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
  var bottomCount, compareCategory, i, id, o, property, propertyCategory, _i, _ref, _results;
  bottomCount = properties[properties.length - 1].mode === mode ? 1 : 0;
  _results = [];
  for (o = _i = _ref = properties.length - 2 - bottomCount; _i >= 0; o = _i += -1) {
    property = properties[o];
    if (property.mode !== mode) {
      continue;
    }
    if (property.name[0] === "-") {
      id = 2;
    } else {
      id = 0;
    }
    propertyCategory = property.name.split('-')[id].toLowerCase();
    i = o + 1;
    while (i < properties.length - bottomCount) {
      if (properties[i].name[0] === "-") {
        id = 2;
      } else {
        id = 0;
      }
      compareCategory = properties[i].name.split('-')[id].toLowerCase();
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
window.fashion.$actualizer.cullIndividuality = function(allSelectors, map) {
  var currentOffset, exclude, id, inner, inners, mapIndividualCount, newId, newMap, offsets, outer, passingSelectors, selector, _i, _len;
  passingSelectors = {};
  offsets = {};
  exclude = {};
  currentOffset = 0;
  for (id in allSelectors) {
    selector = allSelectors[id];
    if (selector.mode === $wf.$runtimeMode.individual) {
      currentOffset++;
      exclude[id] = true;
    } else {
      newId = id - currentOffset;
      passingSelectors[newId] = selector;
    }
    offsets[id] = currentOffset;
  }
  newMap = [];
  mapIndividualCount = 0;
  for (outer in map) {
    inners = map[outer];
    newMap.push([]);
    for (_i = 0, _len = inners.length; _i < _len; _i++) {
      inner = inners[_i];
      if (exclude[inner] === true) {
        newMap[outer].push("i" + mapIndividualCount++);
      } else {
        newMap[outer].push(inner - parseInt(offsets[inner]));
      }
    }
  }
  return {
    sel: passingSelectors,
    map: newMap,
    offsets: offsets
  };
};

window.fashion.$actualizer.filterSelectors = function(allSelectors, filterMode) {
  var id, passingSelectors, selector;
  passingSelectors = {};
  for (id in allSelectors) {
    selector = allSelectors[id];
    if (selector.mode !== filterMode) {
      passingSelectors[id] = selector;
    }
  }
  return passingSelectors;
};

window.fashion.$actualizer.addIndividualProperties = function(rData, selectors, offsets) {
  var id, selector, _results;
  _results = [];
  for (id in selectors) {
    selector = selectors[id];
    if (!(selector.mode === $wf.$runtimeMode.individual)) {
      continue;
    }
    selector.index = id - offsets[id];
    _results.push(rData.addIndividualSelector(selector));
  }
  return _results;
};
var RuntimeData;

RuntimeData = (function() {
  function RuntimeData(parseTree, selectors, variables) {
    var block, name, _ref;
    this.config = $wf.runtimeConfig;
    this.selectors = selectors;
    this.variables = variables;
    this.modules = parseTree.dependencies;
    _ref = this.modules.blocks;
    for (name in _ref) {
      block = _ref[name];
      this.modules.blocks[name] = block.runtimeObject;
    }
    this.runtime = {};
  }

  RuntimeData.prototype.addIndividualSelector = function(selector) {
    if (!this.individual) {
      this.individual = [];
    }
    return this.individual.push(selector);
  };

  RuntimeData.prototype.addRuntimeModule = function(runtimeModule) {
    var func, name, _ref;
    _ref = runtimeModule.functions;
    for (name in _ref) {
      func = _ref[name];
      if (this.runtime[name]) {
        return;
      }
      this.runtime[name] = func;
    }
  };

  return RuntimeData;

})();
var RuntimeVariable;

RuntimeVariable = (function() {
  function RuntimeVariable(name, type, unit) {
    this.name = name;
    this.type = type;
    this.unit = unit;
    this.scopes = [];
    this.values = {};
    this.dependents = [];
    this["default"] = void 0;
  }

  RuntimeVariable.prototype.addScope = function(name, defaultValue) {
    this.values[name] = defaultValue;
    if (name === 0 || name === '0') {
      return this["default"] = defaultValue;
    } else {
      return this.scopes.push(name);
    }
  };

  return RuntimeVariable;

})();
window.fashion.$actualizer.generateRuntimeData = function(parseTree, jsSelectors, cssMap) {
  var rdata, variables;
  variables = $wf.$actualizer.actualizeVariables(parseTree, jsSelectors, cssMap);
  rdata = new RuntimeData(parseTree, jsSelectors, variables);
  return rdata;
};

window.fashion.$actualizer.actualizeVariables = function(parseTree, jsSelectors, cssMap) {
  var bindings, name, rvar, scopes, type, unit, varName, varObj, variables, _ref;
  variables = {};
  _ref = parseTree.variables;
  for (varName in _ref) {
    scopes = _ref[varName];
    type = unit = -1;
    for (name in scopes) {
      varObj = scopes[name];
      if (varObj.type) {
        type = varObj.type;
      }
      if (varObj.unit) {
        unit = varObj.unit;
      }
    }
    rvar = new RuntimeVariable(varName, type, unit);
    for (name in scopes) {
      varObj = scopes[name];
      rvar.addScope(name, varObj.value);
    }
    bindings = parseTree.bindings.variables[varName];
    rvar.dependents = $wf.$actualizer.mapBindings(bindings, jsSelectors, cssMap);
    variables[varName] = rvar;
  }
  return variables;
};
window.fashion.$actualizer.createCSS = function(runtimeData, cssSelectors) {
  var css, cssProperties, cssValue, evalFunction, id, property, selector, selectorName, value, _i, _len, _ref;
  evalFunction = $wf.$actualizer.evaluationFunction(runtimeData);
  css = "";
  for (id in cssSelectors) {
    selector = cssSelectors[id];
    cssProperties = [];
    _ref = selector.properties;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      property = _ref[_i];
      value = property.value;
      if (selector.mode === $wf.$runtimeMode["static"]) {
        if (typeof value === 'object' && value.value) {
          cssValue = evalFunction(value.value);
        } else {
          cssValue = evalFunction(value);
        }
      } else {
        cssValue = evalFunction(value);
      }
      cssProperties.push($wf.$actualizer.cssPropertyTemplate(property.name, cssValue));
    }
    selectorName = evalFunction(selector.name);
    css += $wf.$actualizer.cssSelectorTemplate(selectorName, cssProperties);
  }
  return css;
};

window.fashion.$actualizer.cssPrefixes = ["", "-webkit-", "-moz-", "-ms-"];

window.fashion.$actualizer.separateTransitions = function(parseTree) {
  var evalFunction, id, mode, modes, prefix, prefixes, property, pt, selector, string, strings, transitions, _i, _len, _ref, _ref1, _results;
  evalFunction = $wf.$actualizer.evaluationFunction(parseTree.variables);
  prefixes = window.fashion.$actualizer.cssPrefixes;
  _ref = parseTree.selectors;
  _results = [];
  for (id in _ref) {
    selector = _ref[id];
    transitions = [];
    _ref1 = selector.properties;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      property = _ref1[_i];
      if (property.value.transition) {
        pt = property.value.transition;
        pt.property = property.name;
        transitions.push(pt);
        pt.mode = pt.easing.mode | pt.duration.mode | pt.delay.mode;
      }
    }
    modes = $wf.$runtimeMode;
    _results.push((function() {
      var _j, _len1, _ref2, _results1;
      _ref2 = [modes["static"], modes.dynamic, modes.individual, modes.live];
      _results1 = [];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        mode = _ref2[_j];
        strings = $wf.$actualizer.transitionStrings(evalFunction, transitions, mode);
        if (strings.length === 0) {
          continue;
        }
        string = strings.join(",");
        property = new Property("transition", string, mode);
        _results1.push((function() {
          var _k, _len2, _results2;
          _results2 = [];
          for (_k = 0, _len2 = prefixes.length; _k < _len2; _k++) {
            prefix = prefixes[_k];
            _results2.push(selector.addProperty(property.copyWithName(prefix + "transition")));
          }
          return _results2;
        })());
      }
      return _results1;
    })());
  }
  return _results;
};

window.fashion.$actualizer.transitionStrings = function(evalFunction, transitions, runtimeMode) {
  var delay, duration, easing, t, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = transitions.length; _i < _len; _i++) {
    t = transitions[_i];
    if (!(t.mode === runtimeMode)) {
      continue;
    }
    duration = t.duration.script ? evalFunction(t.duration) : t.duration;
    easing = t.easing.script ? evalFunction(t.easing) : t.easing;
    delay = t.delay.script ? evalFunction(t.delay) : t.delay;
    _results.push($wf.$actualizer.cssTransitionTemplate(t.property, duration, easing, delay));
  }
  return _results;
};

window.fashion.$actualizer.evaluationFunction = function(runtimeData) {
  return function(value) {
    return window.fashion.$shared.evaluate.call(window.fashion.$shared, value, runtimeData.variables, $wf.$globals, $wf.$functions, runtimeData.runtime);
  };
};

window.fashion.$actualizer.cssPropertyTemplate = function(name, value) {
  return "" + name + ": " + value + ";";
};

window.fashion.$actualizer.cssSelectorTemplate = function(selector, properties) {
  return "" + selector + " {" + (properties.join('')) + "}\n";
};

window.fashion.$actualizer.cssTransitionTemplate = function(property, duration, easing, delay) {
  return "" + property + " " + (duration || '1s') + " " + (easing || '') + (delay ? ' ' + delay : '');
};
var RuntimeCapabilities,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

window.fashion.$runtimeCapability = {
  variables: "variables",
  scopedVariables: "scopedVariables",
  individualProps: "individualized",
  liveProps: "liveProperties",
  globals: "globals"
};

RuntimeCapabilities = (function() {
  function RuntimeCapabilities() {}

  RuntimeCapabilities.prototype.constuctor = function() {
    var module;
    return this.capabilities = (function() {
      var _i, _len, _ref, _results;
      _ref = window.fashion.runtimeModules;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        module = _ref[_i];
        _results.push(module);
      }
      return _results;
    })();
  };

  RuntimeCapabilities.prototype.add = function(runtimeRequirement) {
    var module;
    if (!this.capabilities) {
      this.capabilities = (function() {
        var _i, _len, _ref, _results;
        _ref = window.fashion.runtimeModules;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          module = _ref[_i];
          _results.push(module);
        }
        return _results;
      })();
    }
    if (__indexOf.call(this.capabilities, runtimeRequirement) >= 0) {
      return;
    }
    return this.capabilities.push(runtimeRequirement);
  };

  RuntimeCapabilities.prototype.addDependencies = function(requirements) {
    var requirement, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = requirements.length; _i < _len; _i++) {
      requirement = requirements[_i];
      _results.push(this.add(requirement));
    }
    return _results;
  };

  RuntimeCapabilities.prototype.has = function(requirement) {
    if (!this.capabilities) {
      return false;
    }
    return (__indexOf.call(this.capabilities, requirement) >= 0);
  };

  return RuntimeCapabilities;

})();
window.fashion.$actualizer.determineRuntimeCapabilities = function(runtimeData, selectors) {
  var capabilities, variable, _i, _len, _ref;
  capabilities = new RuntimeCapabilities();
  if (JSON.stringify(runtimeData.variables) !== "{}") {
    capabilities.add($wf.$runtimeCapability.variables);
    _ref = runtimeData.variables;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      variable = _ref[_i];
      if (variable.scopes.length > 0) {
        capabilities.add($wf.$runtimeCapability.scopedVariables);
      }
    }
  }
  if ($wf.$actualizer.hasPropertyMode(selectors, $wf.$runtimeMode.individual)) {
    capabilities.add($wf.$runtimeCapability.individualProps);
  }
  if ($wf.$actualizer.hasPropertyMode(selectors, $wf.$runtimeMode.live)) {
    capabilities.add($wf.$runtimeCapability.liveProps);
  }
  if (JSON.stringify(runtimeData.modules.globals) !== "{}") {
    capabilities.add($wf.$runtimeCapability.globals);
  }
  $wf.$actualizer.addModuleCapabilities(capabilities, runtimeData);
  return capabilities;
};

window.fashion.$actualizer.hasPropertyMode = function(selectors, mode) {
  var id, selectorBlock;
  for (id in selectors) {
    selectorBlock = selectors[id];
    if (selectorBlock.mode === mode) {
      return true;
    }
  }
  return false;
};

window.fashion.$actualizer.addRuntimeFunctions = function(runtimeData, parseTree, capabilities) {
  var cid, functionName, key, module, moduleName, _i, _len, _ref;
  if (!capabilities.capabilities) {
    return;
  }
  cid = 0;
  while (cid < capabilities.capabilities.length) {
    moduleName = capabilities.capabilities[cid++];
    if (moduleName === void 0) {
      continue;
    }
    module = $wf.$runtimeModules[moduleName];
    if (!module) {
      return console.log("[FASHION] Could not find module " + moduleName);
    }
    capabilities.addDependencies(module.dependencies);
    runtimeData.addRuntimeModule(module);
    if (module.initializers.length > 0) {
      _ref = module.initializers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        functionName = "window." + $wf.runtimeObject + ".runtime." + key + ".bind(FASHION.runtime)";
        parseTree.addScript("FSREADY(" + functionName + ");");
      }
    }
  }
};

window.fashion.$actualizer.addModuleCapabilities = function(capabilities, runtimeData) {
  var module, n, _ref, _ref1, _ref2, _ref3, _results;
  _ref = runtimeData.modules.blocks;
  for (n in _ref) {
    module = _ref[n];
    if (module.runtimeCapabilities) {
      capabilities.addDependencies(module.runtimeCapabilities);
    }
  }
  _ref1 = runtimeData.modules.properties;
  for (n in _ref1) {
    module = _ref1[n];
    if (module.runtimeCapabilities) {
      capabilities.addDependencies(module.runtimeCapabilities);
    }
  }
  _ref2 = runtimeData.modules.functions;
  for (n in _ref2) {
    module = _ref2[n];
    if (module.runtimeCapabilities) {
      capabilities.addDependencies(module.runtimeCapabilities);
    }
  }
  _ref3 = runtimeData.modules.globals;
  _results = [];
  for (n in _ref3) {
    module = _ref3[n];
    if (module.runtimeCapabilities) {
      _results.push(capabilities.addDependencies(module.runtimeCapabilities));
    }
  }
  return _results;
};
window.fashion.$actualizer.mapBindings = function(bindings, selectors, map) {
  var boundSelectorId, hDependents, selector, selectorId, _i, _j, _len, _len1, _ref;
  hDependents = [];
  for (_i = 0, _len = bindings.length; _i < _len; _i++) {
    boundSelectorId = bindings[_i];
    if (typeof boundSelectorId === 'string' && boundSelectorId[0] === "$") {
      hDependents.push(boundSelectorId);
    } else {
      _ref = map[boundSelectorId];
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        selectorId = _ref[_j];
        if (typeof selectorId === "number") {
          selector = selectors[selectorId];
          if (selector && selector.mode !== $wf.$runtimeMode["static"]) {
            hDependents.push(selectorId);
          }
        } else {
          hDependents.push(selectorId);
        }
      }
    }
  }
  return hDependents;
};

window.fashion.$actualizer.addBindings = function(runtimeData, parseTree, selectors, map) {
  return $wf.$actualizer.bindGlobals(runtimeData, parseTree.bindings.globals, selectors, map);
};

window.fashion.$actualizer.bindGlobals = function(runtimeData, globalBindings, selectors, map) {
  var bindings, global, name, _ref, _results;
  _ref = runtimeData.modules.globals;
  _results = [];
  for (name in _ref) {
    global = _ref[name];
    bindings = globalBindings[name];
    _results.push(global.dependents = $wf.$actualizer.mapBindings(bindings, selectors, map));
  }
  return _results;
};
var RuntimeModule;

RuntimeModule = (function() {
  function RuntimeModule(name, dependencies, functions) {
    var f, key;
    this.name = name;
    this.dependencies = dependencies;
    this.functions = functions;
    this.initializers = [];
    for (key in functions) {
      f = functions[key];
      if (key[0] === "$") {
        this.initializers.push(key);
      }
    }
  }

  return RuntimeModule;

})();
window.fashion.$runtimeModules = {};

window.fashion.addRuntimeModule = function(name, dependencies, functions) {
  return window.fashion.$runtimeModules[name] = new RuntimeModule(name, dependencies, functions);
};

$wf.addRuntimeModule("types", [], {
  determineType: window.fashion.$shared.determineType,
  getUnit: window.fashion.$shared.getUnit,
  timeInMs: window.fashion.$shared.timeInMs
});

$wf.addRuntimeModule("evaluation", ["variables"], {
  evaluate_Shared: window.fashion.$shared.evaluate,
  evaluate: function(value, element) {
    return this.evaluate_Shared(value, FASHION.variables, FASHION.modules.globals, FASHION.modules.functions, FASHION.runtime, element);
  }
});

$wf.addRuntimeModule("colors", [], window.fashion.color);

$wf.addRuntimeModule("errors", [], {
  throwError: function(message) {
    console.log("[FASHION] Runtime error: " + message);
    return console.log(new Error().stack);
  }
});
$wf.addRuntimeModule("variables", ["evaluation", "selectors", "types", "errors"], {
  getVariable: window.fashion.$shared.getVariable,
  variableValue: function(varName, element) {
    return this.getVariable(FASHION.variables, FASHION.modules.globals, FASHION.modules.functions, FASHION.runtime, varName, element).value;
  },
  setVariable: function(varName, value, element) {
    if (element === void 0) {
      return this.setTopLevelVariable(varName, value);
    }
    return console.log("Scoped variable setting coming soon");
  },
  setTopLevelVariable: function(varName, value) {
    var vObj;
    vObj = FASHION.variables[varName];
    if (!vObj) {
      return this.throwError("Variable '$" + varName + "' does not exist");
    }

    /* For now, it's your problem if you screw this up
    		 * Make sure the variable did not change type
    		if @determineType(value) isnt vObj.type
    			return @throwError "Cannot change type of '$#{varName}'"
    
    		 * Check to see if the unit changed
    		unittedValue = @getUnit value, vObj.type, types
    		if unittedValue.unit and unittedValue.unit != vObj.unit
    			return @throwError "Cannot (yet) change unit of '$#{varName}'"
    			 *vObj.unit = unittedValue.unit
    
    		if unittedValue.value then vObj.default = unittedValue.value
    		else vObj.value = value
     */
    vObj["default"] = value;
    return this.updateDependencies(varName);
  },
  updateDependencies: function(varName) {
    var selectorId, vObj, _i, _len, _ref, _results;
    vObj = FASHION.variables[varName];
    _ref = vObj.dependents;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      selectorId = _ref[_i];
      if (typeof selectorId === 'string' && selectorId[0] === "$") {
        _results.push(this.updateDependencies(selectorId.substr(1)));
      } else {
        _results.push(this.regenerateSelector(selectorId));
      }
    }
    return _results;
  }
});

$wf.addRuntimeModule("watchVariables", [], {
  $initWatchers: function() {
    var propObject, styleObject, varName, varObj, _ref, _results;
    window[FASHION.config.variableObject] = styleObject = {};
    _ref = FASHION.variables;
    _results = [];
    for (varName in _ref) {
      varObj = _ref[varName];
      propObject = ((function(_this) {
        return function(varName) {
          return {
            get: function() {
              return FASHION.runtime.variableValue(varName);
            },
            set: function(newValue) {
              return FASHION.runtime.setVariable(varName, newValue);
            }
          };
        };
      })(this))(varName);
      Object.defineProperty(styleObject, varName, propObject);
      _results.push(Object.defineProperty(styleObject, "$" + varName, propObject));
    }
    return _results;
  }
});
$wf.addRuntimeModule("selectors", ["evaluation", "errors"], {
  runtimeModes: window.fashion.$runtimeMode,
  regenerateSelector: function(selectorId) {
    var cssElem, selector, stylesheet;
    if (typeof selectorId === 'string' && selectorId[0] === "i") {
      selector = FASHION.individual[parseInt(selectorId.substr(1))];
      if (!selector) {
        this.throwError("Could not find individual property " + selectorId);
      }
      if (!this.updateSelectorElements) {
        return this.throwError("The 'individualized' module was not included.");
      }
      if (this.evaluate(selector.name) !== selector.elementsSelector) {
        this.updateSelectorElements(selector);
      }
      return this.regenerateIndividualSelector(selector);
    } else {
      selector = FASHION.selectors[selectorId];
      if (!selector) {
        return this.throwError("Selector " + selectorId + " does not exist");
      }
      cssElem = document.getElementById("" + FASHION.config.cssId);
      stylesheet = cssElem.sheet;
      stylesheet.deleteRule(selectorId);
      return stylesheet.insertRule(this.CSSRuleForSelector(selector), selectorId);
    }
  },
  CSSPropertyTemplate: window.fashion.$actualizer.cssPropertyTemplate,
  CSSSelectorTemplate: window.fashion.$actualizer.cssSelectorTemplate,
  CSSRuleForSelector: function(selector, element, name) {
    var cssProperties, evalFunction, module, propertyObject, selectorName, value;
    selectorName = name || this.evaluate(selector.name, element);
    cssProperties = (function() {
      var _i, _len, _ref, _results;
      _ref = selector.properties;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        propertyObject = _ref[_i];
        if (module = FASHION.modules.properties[propertyObject.name]) {
          evalFunction = this.evaluate.bind(this, propertyObject.value, element);
          if (!module.apply) {
            continue;
          }
          module.apply(element, propertyObject.value, evalFunction);
          if (module.replace) {
            continue;
          }
        }
        value = this.evaluate(propertyObject.value, element);
        _results.push(this.CSSPropertyTemplate(propertyObject.name, value));
      }
      return _results;
    }).call(this);
    return this.CSSSelectorTemplate(selectorName, cssProperties);
  },
  addSelector: function(name, properties) {
    var CSS, stylesheet;
    CSS = this.CSSRuleForSelector({
      name: name,
      properties: properties
    });
    stylesheet = document.getElementById("" + FASHION.config.cssId).sheet;
    return stylesheet.insertRule(CSS, stylesheet.rules.length);
  }
});
$wf.addRuntimeModule("individualized", ["selectors", "elements"], {
  $initializeIndividualProperties: function() {
    var selector, sheet, _i, _j, _len, _len1, _ref, _ref1, _results;
    sheet = document.createElement("style");
    sheet.setAttribute("type", "text/css");
    sheet.setAttribute("id", "" + FASHION.config.individualCSSID);
    document.head.appendChild(sheet);
    FASHION.individualSheet = sheet.sheet;
    _ref = FASHION.individual;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      selector = _ref[_i];
      this.updateSelectorElements(selector);
    }
    _ref1 = FASHION.individual;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      selector = _ref1[_j];
      _results.push(this.regenerateIndividualSelector(selector));
    }
    return _results;
  },
  updateSelectorElements: function(selector) {
    var element, id, individual, matchedElements, selectorName, _i, _len, _ref, _results;
    _ref = selector.elements;
    for (id in _ref) {
      individual = _ref[id];
      if (individual.cssid !== -1) {
        FASHION.individualSheet.deleteRule(individual.cssid);
      }
    }
    selectorName = this.evaluate(selector.name);
    selector.elementsSelector = selectorName;
    selector.elements = {};
    matchedElements = this.elementsForSelector(selectorName);
    _results = [];
    for (_i = 0, _len = matchedElements.length; _i < _len; _i++) {
      element = matchedElements[_i];
      if (!element.id) {
        element.setAttribute('id', this.generateRandomId());
      }
      _results.push(selector.elements[element.id] = {
        element: element,
        cssid: -1
      });
    }
    return _results;
  },
  generateRandomId: function(length) {
    var guid, i;
    if (length == null) {
      length = 20;
    }
    guid = ((function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= length ? _i <= length : _i >= length; i = 0 <= length ? ++_i : --_i) {
        _results.push(Math.round(Math.random() * 36).toString(36));
      }
      return _results;
    })()).join("");
    return FASHION.config.idPrefix + guid;
  },
  elementsForSelector: function(selectorName) {
    return Array.prototype.slice.call(document.querySelectorAll(selectorName));
  },
  regenerateIndividualSelector: function(selector) {
    var css, element, id, individual, _ref, _results;
    _ref = selector.elements;
    _results = [];
    for (id in _ref) {
      individual = _ref[id];
      if (individual.cssid !== -1) {
        FASHION.individualSheet.deleteRule(individual.cssid);
      } else {
        individual.cssid = FASHION.individualSheet.rules.length;
      }
      element = this.createElementObject(individual.element);
      css = this.CSSRuleForSelector(selector, element, "#" + id);
      _results.push(FASHION.individualSheet.insertRule(css, individual.cssid));
    }
    return _results;
  }
});
$wf.addRuntimeModule("elements", [], {
  createElementObject: function(DOMElement) {
    var attribute, cs, eObj, _i, _len, _ref;
    if (!DOMElement) {
      return {};
    }
    eObj = {
      element: DOMElement
    };
    if (DOMElement.attributes) {
      _ref = DOMElement.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attribute = _ref[_i];
        eObj[attribute.name] = attribute.value;
      }
    }
    Object.defineProperty(eObj, "parent", {
      get: (function(_this) {
        return function() {
          return _this.createElementObject(DOMElement.parentNode);
        };
      })(this)
    });
    eObj.width = DOMElement.clientWidth;
    eObj.height = DOMElement.clientHeight;
    cs = window.getComputedStyle(DOMElement);
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
    eObj.addEventListener = function(evt, func, bubble) {
      return DOMElement.addEventListener(evt, func, bubble);
    };
    return eObj;
  }
});
$wf.addRuntimeModule("globals", ["selectors"], {
  $startWatchers: function() {
    var global, name, onChangeFunction, _ref, _results;
    onChangeFunction = (function(_this) {
      return function(global) {
        return _this.updateGlobal.bind(_this, global);
      };
    })(this);
    _ref = FASHION.modules.globals;
    _results = [];
    for (name in _ref) {
      global = _ref[name];
      global.watch(onChangeFunction(global));
      _results.push(this.updateGlobal(global));
    }
    return _results;
  },
  updateGlobal: function(global) {
    var selectorId, _i, _len, _ref, _results;
    _ref = global.dependents;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      selectorId = _ref[_i];
      _results.push(this.regenerateSelector(selectorId));
    }
    return _results;
  }
});
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
  capabilities: ["selectors", "evaluation"],
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
    startDelay: 10,
    endDelay: 2,
    settleDelay: 1,
    wait: function(d, f) {
      return setTimeout(f, d);
    },
    trigger: function(name, duration, element) {
      var addSelectors, d, head, intStartTime, keyframe, runtime, selectors, sheet, sheetElement, startTime, transition;
      duration = this.timeInMs(duration);
      runtime = FASHION.modules.blocks.transition;
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
          intStartTime = parseFloat(keyframe.split('-')[0]) / 100 * duration;
          startTime = intStartTime + runtime.startDelay;
        }
        addSelectors = runtime.addSelectorsFunc(selectors, duration, sheet, runtime);
        if (startTime > 0) {
          runtime.wait(startTime, addSelectors.bind(this));
        } else {
          addSelectors.bind(this)();
        }
      }
      d = duration + runtime.startDelay + runtime.endDelay;
      return runtime.wait(d, function() {
        return sheetElement.parentElement.removeChild(sheetElement);
      });
    },
    addSelectorsFunc: function(selectors, duration, sheet, runtime) {
      return function() {
        var id, jumpProperties, properties, property, selName, selector, settleDelay, smoothCount, smoothProperties, tCSS, _i, _len;
        settleDelay = FASHION.modules.blocks.transition.settleDelay;
        for (id in selectors) {
          selector = selectors[id];
          properties = selector.properties;
          jumpProperties = [];
          smoothProperties = [];
          smoothCount = 0;
          for (_i = 0, _len = properties.length; _i < _len; _i++) {
            property = properties[_i];
            if (typeof property.value !== 'object' || !property.value.transition) {
              jumpProperties.push(property);
            } else {
              smoothProperties.push(property);
              smoothCount++;
            }
          }
          this.addSelector(selector.name, jumpProperties);
          if (smoothCount === 0) {
            continue;
          }
          tCSS = runtime.generateTransitions.call(this, smoothProperties, duration);
          selName = this.evaluate(selector.name);
          sheet.insertRule("" + selName + " {" + tCSS + "}", sheet.rules.length);
          runtime.wait(settleDelay, ((function(_this) {
            return function(selector, smoothProperties) {
              return function() {
                return _this.addSelector(selector.name, smoothProperties);
              };
            };
          })(this))(selector, smoothProperties));
        }
      };
    },
    generateTransitions: function(properties, duration) {
      var csstext, l, msLength, property, t, _i, _len;
      csstext = "transition: ";
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        property = properties[_i];
        if (!property.value.transition) {
          continue;
        }
        t = property.value.transition;
        l = parseFloat(this.evaluate(t.duration)) / 100 * duration;
        msLength = l ? "" + l + "ms" : t.duration;
        csstext += "" + property.name + " " + msLength + " " + (t.easing || '') + " " + (t.delay || '') + ",";
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
    var triggerFunction;
    triggerFunction = FASHION.modules.blocks.transition.trigger;
    return triggerFunction.call(this, name.value, duration, element);
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

