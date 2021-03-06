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
  version: "0.3.5",
  url: "http://writefashion.org",
  author: "Keaton Brandt",
  mimeType: "text/x-fashion",
  cssId: "FASHION-stylesheet",
  minifiedObject: "FSMIN",
  runtimeObject: "FASHION",
  ignoreRuntimePrefixes: [],
  readyEvent: "fashion-ready"
};

window.fashion.runtimeConfig = {
  variableObject: "style",
  idPrefix: "FS-",
  individualCSSID: "FASHION-individual",
  scopedCSSID: "FASHION-scopes",
  scopedIndCSSPrefix: "FASHION-scopes-",
  cssId: window.fashion.cssId
};

window.fashion.styleHeader = "html {box-sizing: border-box;}\n*, *:before, *:after {box-sizing: inherit;border: none;}\n";

window.fashion.styleHeaderRules = 2;

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

wait = function(d, f) {
  return setTimeout(f, d);
};

/*
------------------------------------------------------------------------------

This Live version runs in the browser to dynamically compile Fashion files
into CSS and Javascript. It is not reccommended for production apps.

------------------------------------------------------------------------------
 */
var currentScript;

currentScript = document.currentScript || document.scripts[document.scripts.length - 1];

document.addEventListener('readystatechange', function() {
  if (document.readyState === "complete") {
    return window.fashion.$loader.loadStyles(function(scriptText) {
      var css, js, parseTree, start, _ref;
      start = new Date().getTime();
      parseTree = window.fashion.$parser.parse(scriptText);
      parseTree = window.fashion.$processor.process(parseTree);
      _ref = window.fashion.$actualizer.actualize(parseTree), css = _ref.css, js = _ref.js;
      console.log("[FASHION] Compile finished in " + (new Date().getTime() - start) + "ms");
      start = new Date().getTime();
      $wf.$dom.addStylesheet(css);
      $wf.$dom.addScript(js);
      return console.log("[FASHION] Page initialize finished in " + (new Date().getTime() - start) + "ms");
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

window.fashion.$buildArray = function() {
  var arr, arrays, ret, _i, _len;
  arrays = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  ret = [];
  for (_i = 0, _len = arrays.length; _i < _len; _i++) {
    arr = arrays[_i];
    if (arr instanceof Array) {
      ret.push.apply(ret, arr);
    } else if (arr) {
      ret.push(arr);
    }
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
    var e, rule, sheet, styleRules, _results;
    if (id == null) {
      id = window.fashion.cssId;
    }
    sheet = document.createElement("style");
    sheet.setAttribute("type", "text/css");
    sheet.setAttribute("id", "" + id);
    $wf.$dom.addElementToHead(sheet);
    sheet.sheet.reallength = 0;
    styleRules = styleText.split("\n");
    _results = [];
    for (id in styleRules) {
      rule = styleRules[id];
      if (!(rule.length > 3)) {
        continue;
      }
      try {
        sheet.sheet.insertRule(rule, id);
      } catch (_error) {
        e = _error;
        sheet.sheet.insertRule("#FSIGNORE {}", id);
      }
      _results.push(sheet.sheet.reallength++);
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
  function ParseTree(extendsTree) {
    var k, v, _ref;
    this.variables = {};
    this.selectors = [];
    this.blocks = [];
    this.scripts = [];
    this.requires = [];
    this.dependencies = {
      blocks: {},
      globals: {},
      functions: {},
      properties: {}
    };
    if (extendsTree) {
      _ref = extendsTree.variables;
      for (k in _ref) {
        v = _ref[k];
        this.variables[k] = v;
      }
    }
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
    return this.variables[vName][selectorScope] = variableObject;
  };

  ParseTree.prototype.addSelector = function(newSelector) {
    newSelector.index = this.selectors.length;
    return this.selectors.push(newSelector);
  };

  ParseTree.prototype.addRequirements = function(newRequirements) {
    var req, _i, _len, _results;
    if (!newRequirements) {
      return;
    }
    _results = [];
    for (_i = 0, _len = newRequirements.length; _i < _len; _i++) {
      req = newRequirements[_i];
      if ((req != null) && __indexOf.call(this.requires, req) < 0) {
        _results.push(this.requires.push(req));
      }
    }
    return _results;
  };

  ParseTree.prototype.addScript = function(newScript) {
    return this.scripts.push(newScript);
  };

  ParseTree.prototype.addBlock = function(newBlock) {
    return this.blocks.push(newBlock);
  };

  ParseTree.prototype.addBlockDependency = function(name, moduleObject) {
    if (!moduleObject) {
      return;
    }
    this.dependencies.blocks[name] = moduleObject;
    return this.addRequirements(moduleObject.requires);
  };

  ParseTree.prototype.addGlobalDependency = function(name, moduleObject) {
    if (!moduleObject) {
      return;
    }
    this.dependencies.globals[name] = moduleObject;
    return this.addRequirements(moduleObject.requires);
  };

  ParseTree.prototype.addFunctionDependency = function(name, moduleObject) {
    if (!moduleObject) {
      return;
    }
    this.dependencies.functions[name] = moduleObject;
    return this.addRequirements(moduleObject.requires);
  };

  ParseTree.prototype.addPropertyDependency = function(name, moduleObject) {
    if (!moduleObject) {
      return;
    }
    this.dependencies.properties[name] = moduleObject;
    return this.addRequirements(moduleObject.requires);
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
    this.mode = (defaultValue != null ? defaultValue.mode : void 0) || $wf.$runtimeMode.dynamic;
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
  function Selector(name, mode, nestParent) {
    this.rawName = this.name = name;
    this.properties = [];
    this.index = -1;
    this.parent = nestParent;
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
    if (!property.id) {
      property.id = this.properties.length;
    }
    return this.properties.push(property);
  };

  Selector.prototype.insertProperty = function(property, index) {
    this.body = void 0;
    if (!property.id) {
      property.id = this.properties.length;
    }
    return this.properties.splice(index, 0, property);
  };

  Selector.prototype.deleteProperty = function(index) {
    return this.properties.splice(index, 1);
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
    this.important = false;
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
  function PropertyTransition(duration, easing, delay) {
    this.easing = easing;
    this.duration = duration;
    this.delay = delay;
  }

  return PropertyTransition;

})();

window.fashion.$class.Property = Property;

window.fashion.$class.PropertyTransition = PropertyTransition;
var Expression, ExpressionBindings,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Expression = (function() {
  function Expression(script, type, unit, bindings, runtimeMode) {
    this.script = script.toString();
    this.setter = this.script.indexOf("=") !== -1;
    this.mode = runtimeMode;
    this.type = type;
    this.unit = unit;
    this.bindings = bindings || new ExpressionBindings();
  }

  Expression.prototype.generate = function() {
    var e;
    try {
      return this.evaluate = Function("v", "g", "f", "t", "e", "x", this.script);
    } catch (_error) {
      e = _error;
      console.log("[FASHION] Could not compile script '" + this.script + "'");
      return console.log(e);
    }
  };

  return Expression;

})();

ExpressionBindings = (function() {
  function ExpressionBindings(startType, startVal) {
    this.variables = [];
    this.globals = [];
    this.functions = [];
    switch (startType) {
      case "variable":
        this.addVariableBinding(startVal);
        break;
      case "global":
        this.addGlobalBinding(startVal);
        break;
      case "function":
        this.addFunctionBinding(startVal);
    }
  }

  ExpressionBindings.prototype.addVariableBinding = function(variableName) {
    if (!(__indexOf.call(this.variables, variableName) >= 0)) {
      return this.variables.push(variableName);
    }
  };

  ExpressionBindings.prototype.addGlobalBinding = function(globalName) {
    if (!(__indexOf.call(this.globals, globalName) >= 0)) {
      return this.globals.push(globalName);
    }
  };

  ExpressionBindings.prototype.addFunctionBinding = function(functionName, functionArgs, bindings, mode) {
    var e, script;
    script = "f['" + functionName + "'].watch.call(" + (functionArgs.join(',')) + ",x)";
    e = new Expression(script, $wf.$type.None, 0, bindings, mode);
    e.generate();
    return this.functions.push([functionName, e]);
  };

  ExpressionBindings.prototype.addDOMBinding = function(selectorId, selector, boundSelector, boundProperty) {
    return console.log("[FASHION] DOM Bindings not yet supported");
  };

  ExpressionBindings.prototype.extend = function(bindingObject) {
    var ext, v, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
    if ((bindingObject == null) || (bindingObject.variables == null)) {
      return;
    }
    ext = function(list, v) {
      if (!(__indexOf.call(list, v) >= 0)) {
        return list.push(v);
      }
    };
    _ref = bindingObject.variables;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      v = _ref[_i];
      ext(this.variables, v);
    }
    _ref1 = bindingObject.globals;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      v = _ref1[_j];
      ext(this.globals, v);
    }
    _ref2 = bindingObject.functions;
    _results = [];
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      v = _ref2[_k];
      _results.push(ext(this.functions, v));
    }
    return _results;
  };

  ExpressionBindings.prototype.copy = function() {
    var nb;
    nb = new ExpressionBindings;
    nb.extend(this);
    return nb;
  };

  return ExpressionBindings;

})();

window.fashion.$class.Expression = Expression;

window.fashion.$class.ExpressionBindings = ExpressionBindings;
var BlockModule, FunctionModule, GlobalModule, Module, PropertyModule, ReturnValueModule,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Module = (function() {
  function Module(args) {
    this.mode = args.mode || args.runtimeMode || $wf.$runtimeMode["static"];
    this.requires = args.requires || args.capabilities;
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
    if (typeof args === 'function') {
      this.get = args;
    } else {
      this.type = args.type || args.output || args.outputType || $wf.$type.String;
      this.unit = args.unit || '';
      this.get = args.get || args.evaluate;
      if (args.watch && args.watch.toString().indexOf('[native code]') === -1) {
        this.watcher = args.watch;
      }
      ReturnValueModule.__super__.constructor.call(this, args);
    }
  }

  return ReturnValueModule;

})(Module);

GlobalModule = (function(_super) {
  __extends(GlobalModule, _super);

  function GlobalModule(args) {
    if (!args.mode) {
      args.mode = $wf.$runtimeMode.globalDynamic;
    }
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
    if (!args.mode) {
      if ((args.watch != null) && args.watch.toString().indexOf('[native code]') === -1) {
        args.mode = $wf.$runtimeMode.dynamic;
      } else {
        args.mode = $wf.$runtimeMode["static"];
      }
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
      this.requires = args.requires || args.capabilities;
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
        args.mode |= $wf.$runtimeMode.individual;
      }
      this.replace = args.replace || false;
      this.runtimeObject = args.runtimeObject || args.runtime;
      this.mode = args.mode || 0;
      this.requires = args.requires || args.capabilities;
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
  Element: 4,
  Boolean: 5,
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
5-bit Mode -----------------------------------------------------------------------
	00001 (Bit 0): Can change, needs to be included in the JS
	00010 (Bit 1): Can rely on non-top-level variables
	00100 (Bit 2): Can rely on relative styles & attributes
	01000 (Bit 3): Can rely on globals, cannot be pre-computed
	10000 (Bit 4): Triggered property, does not need recomputing
----------------------------------------------------------------------------------
 */
window.fashion.$runtimeMode = {
  "static": 0,
  dynamic: 1,
  scoped: 3,
  individual: 7,
  globalDynamic: 9,
  triggered: 16,
  generate: function(dynamic, individualized, scoped, globals, triggered) {
    return (dynamic ? 1 : 0) | (scoped ? 3 : 0) | (individualized ? 7 : 0) | (globals ? 9 : 0) | (triggered ? 16 : 0);
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
      if (req.readyState === 4) {
        if (req.status === 200) {
          return callback(req.responseText);
        } else if (req.status > 400) {
          return console.log("[FASHION] Could not load script: " + url + " (" + req.status + ")");
        }
      }
    };
    req.open("GET", url, true);
    return req.send();
  }
};
window.fashion.$parser = {
  parse: function(fashionText, extendsTree) {
    var i, parseTree, sel, _ref;
    parseTree = new ParseTree(extendsTree);
    fashionText = $wf.$parser.removeComments(fashionText);
    parseTree = $wf.$parser.parseSections(fashionText, parseTree);
    _ref = parseTree.selectors;
    for (i in _ref) {
      sel = _ref[i];
      $wf.$parser.parseSelectorBody(sel.body, sel, parseTree);
    }
    return parseTree;
  }
};

window.fashion.$parser.removeComments = function(fashionText) {
  return fashionText.replace(/\/\*[\s\S]*?\*\/|\/\/.*?\n/g, "");
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
  regex = /([^\(\)\"\'\`\s]*\(|\)|\"|\'|\`|([^\`\s\)]+(\s+[\+\-\/\*\=]\s+|[\+\/\*\=]))+([^\`\s\(]|if)+|\s+(\&\&|\|\|)\s+|\s+(==|!==)\s+|if\s+|\s+then\s+|\s+else\s+|\s|[^\(\)\"\'\`\s]+)/g;
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
  var blockArgs, body, hasBody, regex, segment, startIndex;
  regex = /([\s]*(\$([\w\-]+)\:[\s]*(.*?)\s*(![A-z0-9\-]+?)?[;\n]|\@([\w\-]+)[\s]*(.*?)[\s]*[\{\n;]|(.*?)[\s]*?\{)|\{|\})/g;
  while (segment = regex.exec(fashionText)) {
    if (segment.length < 8 || !segment[0]) {
      break;
    }
    if (segment[3] && segment[4]) {
      $wf.$parser.addVariable(parseTree, segment[3], segment[4], segment[5]);
    } else if (segment[6]) {
      startIndex = segment.index + segment[0].length;
      if (segment[7]) {
        blockArgs = $wf.$parser.splitByTopLevelSpaces(segment[7]);
      } else {
        blockArgs = [];
      }
      hasBody = segment[0].indexOf("{") !== -1;
      if (hasBody) {
        body = window.fashion.$parser.parseBlock(fashionText, regex, startIndex);
        if (regex.lastIndex === 0) {
          throw new FSBlockMismatchError(segment[6]);
        }
      } else {
        body = "";
      }
      parseTree.addBlock({
        type: segment[6],
        "arguments": blockArgs,
        body: body
      });
      parseTree.addBlockDependency(segment[6], $wf.$blocks[segment[6]]);
    } else if (segment[8]) {
      window.fashion.$parser.parseSelector(parseTree, fashionText, segment[8], regex, segment.index + segment[0].length);
      if (regex.lastIndex === 0) {
        throw new FSBracketMismatchError(segment[8]);
      }
    } else {
      throw new FSUnknownParseError(regex);
    }
  }
  return parseTree;
};

window.fashion.$parser.parseSelector = function(parseTree, fashionText, name, regex, lastIndex) {
  var bracketDepth, flag, segment, selectorStack, selectors, topSel, value;
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
      name = segment[3];
      value = segment[4];
      flag = value.match(/![a-zA-Z\-]*?$/);
      value.replace(flag, "");
      $wf.$parser.parseScopedVariable(name, value, flag, topSel, parseTree);
    } else if (segment[6]) {
      topSel.addToBody(fashionText.substring(segment.index, lastIndex));
    } else if (segment[8]) {
      name = $wf.$parser.nestSelector(topSel.rawName, segment[8]);
      selectors.push($wf.$parser.createSelector(parseTree, name, topSel));
      selectorStack.push(selectors.length - 1);
      bracketDepth++;
    }
  }
  return selectors;
};

window.fashion.$parser.nestSelector = function(outer, inner) {
  var acc, combined, istring, ostring, _i, _j, _len, _len1, _ref, _ref1;
  acc = [];
  if (!outer) {
    return inner;
  }
  if (!inner) {
    return outer;
  }
  _ref = outer.split(",");
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    ostring = _ref[_i];
    ostring = ostring.trim() + "##";
    _ref1 = inner.split(",");
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      istring = _ref1[_j];
      istring = istring.trim();
      if (istring[0] === "&") {
        acc.push(ostring + istring.substr(1));
      } else if (istring[0] === "^") {
        combined = $wf.$shared.combineSelectors(ostring, istring.substr(1));
        if (!combined) {
          throw new FSSelectorCombinationError(ostring, istring.substr(1));
        } else {
          acc.push(combined);
        }
      } else {
        acc.push(ostring + " " + istring);
      }
    }
  }
  return acc.join(",");
};

window.fashion.$parser.createSelector = function(parseTree, name, nestParent) {
  var bindings, expander, foundVar, lastIndex, mode, regex, script, selector, trimmed, vExpr;
  selector = new Selector(name, void 0, nestParent);
  parseTree.addSelector(selector);
  if (name.indexOf("$") === -1) {
    selector.name = selector.name.replace(/\#\#/g, "");
    return selector;
  }
  script = "return ";
  lastIndex = 0;
  bindings = new ExpressionBindings();
  regex = /\$([\w\-]+)/g;
  mode = $wf.$runtimeMode.dynamic;
  while (foundVar = regex.exec(name)) {
    if (foundVar.index > lastIndex) {
      script += "'" + (name.substring(lastIndex, foundVar.index)) + "'+";
    }
    lastIndex = foundVar.index + foundVar[0].length;
    expander = $wf.$parser.expressionExpander.localVariable;
    vExpr = expander(foundVar[1], parseTree, nestParent);
    if (!vExpr) {
      continue;
    }
    bindings.extend(vExpr.bindings);
    script += vExpr.script + "+";
    if ((vExpr.mode & $wf.$runtimeMode.scoped) === $wf.$runtimeMode.scoped) {
      parseTree.addRequirements([$wf.$runtimeCapability.scopedSelector]);
      mode |= $wf.$runtimeMode.scoped;
    }
  }
  if (name.length > lastIndex) {
    script += "'" + (name.substr(lastIndex)) + "'+";
  }
  trimmed = script.substr(0, script.length - 1);
  if ((mode & $wf.$runtimeMode.scoped) !== $wf.$runtimeMode.scoped) {
    trimmed = trimmed.replace(/\#\#/g, "");
  }
  selector.mode = mode;
  selector.name = new Expression(trimmed, $wf.$type.String, 0, bindings, mode);
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
    } else if (segment[8]) {
      bracketDepth++;
    } else if (segment[6]) {
      if (segment[0].indexOf("{") !== -1) {
        bracketDepth++;
      }
    }
  }
  return fashionText.substring(startIndex, endIndex - 1).trim();
};
window.fashion.$parser.parseSelectorBody = function(bodyString, selector, parseTree) {
  var elm, elm2, mode, name, pObj, property, propertyNumber, regex, transition, value, valueMode, _i, _j, _len, _len1, _results;
  propertyNumber = 0;
  regex = /[\s]*(\$?[\w\-\s]*)\:[\s]*(\[([\w\-\$\@\%]*)[\s]*([\w\-\$\@]*)[\s]*([\w\-\$\@\%]*)\]){0,1}[\s]*([^;}\n]*?)[\s]*(\![A-z0-9\-]+?)?[;}\n]/g;
  _results = [];
  while (property = regex.exec(bodyString)) {
    transition = void 0;
    if (property.length < 7) {
      continue;
    }
    value = $wf.$parser.parsePropertyValues(property[6], parseTree, selector);
    name = property[1];
    if (name[0] === "$") {
      continue;
    }
    if (property[3]) {
      transition = new PropertyTransition($wf.$parser.parsePropertyValue(property[3], parseTree, false), $wf.$parser.parsePropertyValue(property[4], parseTree, false), $wf.$parser.parsePropertyValue(property[5], parseTree, false));
    }
    valueMode = 0;
    if ((value != null ? value.mode : void 0) != null) {
      valueMode = value.mode;
    } else if (value instanceof Array) {
      for (_i = 0, _len = value.length; _i < _len; _i++) {
        elm = value[_i];
        if (!(elm != null)) {
          continue;
        }
        if (elm instanceof Array) {
          for (_j = 0, _len1 = elm.length; _j < _len1; _j++) {
            elm2 = elm[_j];
            if ((elm2 != null ? elm2.mode : void 0) != null) {
              valueMode |= elm2.mode;
            }
          }
        }
        if (elm.mode != null) {
          valueMode |= elm.mode;
        }
      }
    }
    mode = (selector.mode | valueMode) || 0;
    pObj = new Property(name, value, mode, transition);
    if (property[7] === "!important") {
      pObj.important = true;
    }
    selector.addProperty(pObj);
    _results.push(propertyNumber++);
  }
  return _results;
};

window.fashion.$parser.parseScopedVariable = function(name, value, flag, scopeSel, parseTree) {
  return $wf.$parser.addVariable(parseTree, name, value, flag, scopeSel);
};

window.fashion.$parser.parsePropertyValues = function(value, parseTree, selector, isVar) {
  var i, item, ret, split;
  if (isVar == null) {
    isVar = false;
  }
  if (value.indexOf(',') !== -1) {
    split = window.fashion.$parser.splitByTopLevelCommas(value);
    if (split.length === 1) {
      return $wf.$parser.parsePropertyValue(split[0], parseTree, selector, 1, 0, isVar);
    } else {
      ret = [];
      for (i in split) {
        item = split[i];
        split[i] = item.trim();
      }
      for (i in split) {
        item = split[i];
        ret[i] = window.fashion.$parser.parsePropertyValue(item, parseTree, selector, true, true, isVar);
      }
      return ret;
    }
  } else {
    return $wf.$parser.parsePropertyValue(value, parseTree, selector, 1, 0, isVar);
  }
};

window.fashion.$parser.parsePropertyValue = function(value, parseTree, selector, allowExpression, forceArray, isVar) {
  var parts, v, val, vals, _i, _len;
  if (allowExpression == null) {
    allowExpression = true;
  }
  if (forceArray == null) {
    forceArray = false;
  }
  if (isVar == null) {
    isVar = false;
  }
  if (forceArray || (typeof value === "string" && value.indexOf(" ") !== -1)) {
    parts = $wf.$parser.splitByTopLevelSpaces(value);
    if (!forceArray && parts.length === 1) {
      return window.fashion.$parser.parseSingleValue(value, parseTree, selector, isVar);
    }
    vals = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        v = parts[_i];
        _results.push($wf.$parser.parseSingleValue(v, parseTree, selector, isVar));
      }
      return _results;
    })();
    vals.mode = 0;
    for (_i = 0, _len = vals.length; _i < _len; _i++) {
      val = vals[_i];
      vals.mode |= val.mode || 0;
    }
    return vals;
  } else {
    return window.fashion.$parser.parseSingleValue(value, parseTree, selector, isVar);
  }
};

window.fashion.$parser.identifyExpression = function() {
  return /(([\s][\+\-\/\*\=][\s])|\s(\&\&|\|\|)\s|if\s.*?\sthen\s|\selse\s|[\(\)\[\]]|\@|\$)/g;
};

window.fashion.$parser.parseSingleValue = function(value, parseTree, selector, isVar) {
  if (isVar == null) {
    isVar = false;
  }
  if (!value || typeof value !== 'string') {
    return value;
  }
  if (value.match($wf.$parser.identifyExpression())) {
    return window.fashion.$parser.parseExpression(value, parseTree, selector, window.fashion.$functions, window.fashion.$globals, true, isVar);
  }
  return value;
};
window.fashion.$parser.parseExpression = function(expString, parseTree, selector, funcs, globals, top, hideUnits, wrap) {
  var bindings, contained, eObj, end, expander, expr, isSetter, length, makeExpression, matchCount, matchParens, mode, regex, replaceInScript, script, scriptOffset, section, shouldBreak, start, tailingUnit, type, types, unit, units, _ref, _ref1;
  if (top == null) {
    top = true;
  }
  if (hideUnits == null) {
    hideUnits = false;
  }
  if (wrap == null) {
    wrap = true;
  }
  expander = $wf.$parser.expressionExpander;
  matchParens = window.fashion.$parser.matchParenthesis;
  makeExpression = $wf.$parser.makeExpression.bind(this, top, hideUnits, wrap);
  script = expString;
  mode = $wf.$runtimeMode["static"];
  bindings = new ExpressionBindings;
  types = [];
  units = [];
  isSetter = false;
  scriptOffset = 0;
  replaceInScript = function(start, length, string) {
    script = $wf.$parser.spliceString(script, start + scriptOffset, length, string);
    return scriptOffset += string.length - length;
  };
  regex = /(\$([\w\-]+)\s*?\=\s|\@(self|this|parent)\.?([a-zA-Z0-9\-\_\.]*)|\$([\w\-]+)|\@([\w\-]+)|(\#[0-9A-Fa-f]{3,6})|([\-]{0,1}([\.]\d+|\d+(\.\d+)*)[a-zA-Z]{1,4})|([\w\-\@\$]*)\(|\)([^\s\)]*)|if(.*?)then(.*?)else(.*)|if(.*?)then(.*)|[`'"](.*?)[`'"])/g;
  shouldBreak = false;
  matchCount = 0;
  while (!shouldBreak && (section = regex.exec(expString))) {
    matchCount++;
    eObj = void 0;
    start = section.index;
    length = section[0].length;
    end = start + length;
    if (section[2]) {
      eObj = expander.localVariable(section[2], parseTree, selector, true);
      isSetter = true;
    } else if (section[3]) {
      eObj = expander.relativeObject(section[3], section[4]);
    } else if (section[5]) {
      eObj = expander.localVariable(section[5], parseTree, selector);
    } else if (section[6]) {
      eObj = expander.globalVariable(section[6], globals, parseTree);
    } else if (section[7]) {
      eObj = expander.hexColor(section[7]);
    } else if (section[8]) {
      eObj = expander.numberWithUnit(section[8]);
    } else if (section[11]) {
      _ref = matchParens(regex, expString, end), contained = _ref.body, tailingUnit = _ref.unit;
      if (!contained) {
        contained = expString.substring(end, expString.length - 1);
        shouldBreak = true;
      }
      length += contained.length + 1;
      if (tailingUnit) {
        length += tailingUnit.length;
      }
      eObj = expander["function"](section[11], contained, tailingUnit, arguments);
    }
    if (section[13]) {
      eObj = expander.ternary(section[13], section[14], section[15], arguments, top);
    }
    if (section[16]) {
      eObj = expander.ternary(section[16], section[17], void 0, arguments, top);
    }
    if (section[18]) {
      eObj = expander.string(section[18]);
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
    if (eObj.bindings) {
      bindings.extend(eObj.bindings);
    }
    types.push(eObj.type === void 0 ? $wf.$type.Unknown : eObj.type);
    units.push(eObj.unit || '');
  }
  if (matchCount === 0) {
    if (!expString.match(/[^0-9\-\.\s]/)) {
      return makeExpression(expString, $wf.$type.Number, '', void 0, 0);
    } else if (expString.toLowerCase() === "true" || expString.toLowerCase() === "false") {
      return makeExpression(expString, $wf.$type.Boolean, '', void 0, 0);
    } else {
      expString = JSON.stringify(expString.trim());
      return makeExpression(expString, $wf.$type.String, '', void 0, 0);
    }
  }
  _ref1 = $wf.$parser.determineExpressionType(types, units, expString), type = _ref1.type, unit = _ref1.unit;
  if (isSetter) {
    unit = void 0;
  }
  expr = makeExpression(script, type, unit, bindings, mode);
  if (top) {
    expr.generate();
  }
  return expr;
};

window.fashion.$parser.makeExpression = function(top, hideUnits, wrap, script, type, unit, bind, mode) {
  script = $wf.$parser.wrapExpressionScript(top, hideUnits, wrap, script, type, unit);
  return new Expression(script, type, unit, bind, mode);
};

window.fashion.$parser.wrapExpressionScript = function(top, hideUnits, wrap, script, type, unit) {
  if (!wrap) {
    if (!hideUnits && unit && typeof unit === "string") {
      return "(" + script + ") + '" + unit + "'";
    } else {
      return "" + script;
    }
  } else if (top) {
    if (!hideUnits && unit && typeof unit === "string") {
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
        unit: section[12]
      };
    } else {
      acc += string.substr(lastIndex, (section.index - lastIndex) + section[0].length);
      lastIndex = section.index + section[0].length;
    }
  }
  throw new FSEParenthesisMismatchError(string, index);
};

window.fashion.$parser.determineExpressionType = function(types, units, expression) {
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
        throw new FSEMixedTypeError(expression);
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
  string: function(match) {
    return new Expression(JSON.stringify(match), $wf.$type.Unknown, "", void 0, 0);
  },
  hexColor: function(match) {
    return new Expression(JSON.stringify(match), $wf.$type.Color, "", void 0, 0);
  },
  localVariable: function(name, parseTree, selector, isSetter) {
    var bindings, mode, scope, scopeMatch, scopes, script, type, unit, vars, _ref, _ref1;
    if (isSetter == null) {
      isSetter = false;
    }
    vars = parseTree.variables;
    scopes = vars[name];
    if (!scopes) {
      throw new FSENonexistentVariableError(name, selector.name);
    }
    scopeMatch = false;
    while (selector != null) {
      if (scopes[selector.name] != null) {
        scope = selector.name;
        _ref = scopes[selector.name], type = _ref.type, unit = _ref.unit, mode = _ref.mode;
        mode |= $wf.$runtimeMode.individual;
        scopeMatch = true;
        break;
      }
      selector = selector.parent;
    }
    if (!scopeMatch) {
      if (!scopes[0] && !scopes['0']) {
        throw new FSEVariableScopeError(name);
      }
      scope = 0;
      _ref1 = scopes[0] || scopes['0'], type = _ref1.type, unit = _ref1.unit, mode = _ref1.mode;
    }
    if (isSetter) {
      script = "v('" + name + "'," + (JSON.stringify(scope)) + ",e).value =";
    } else {
      bindings = new ExpressionBindings("variable", [name, scope]);
      script = "v('" + name + "'," + (JSON.stringify(scope)) + ",e).value";
    }
    return new Expression(script, type, unit, bindings, mode);
  },
  globalVariable: function(name, globals, parseTree) {
    var bindings, script, vObj;
    name = name.toLowerCase();
    vObj = globals[name];
    if (!vObj) {
      throw new FSENonexistentGlobalError(name);
    }
    parseTree.addGlobalDependency(name, vObj);
    bindings = new ExpressionBindings("global", name);
    script = "g." + name + ".get()";
    return new Expression(script, vObj.type, vObj.unit, bindings, vObj.mode);
  },
  numberWithUnit: function(value) {
    var mstatic, numberType, unitValue;
    numberType = window.fashion.$type.Number;
    mstatic = $wf.$runtimeMode["static"];
    unitValue = window.fashion.$shared.getUnit(value, numberType, $wf.$type, $wf.$unit);
    if (unitValue.value === NaN) {
      unitValue.value = 0;
    }
    return new Expression(unitValue.value, numberType, unitValue.unit, false, mstatic);
  },
  relativeObject: function(keyword, property) {
    var dotProperties, lastProperty, script, type, unit;
    if (keyword === "parent") {
      property = ".parent" + property;
    }
    dotProperties = property.split(".");
    lastProperty = dotProperties[dotProperties.length - 1];
    if (property == null) {
      type = $wf.$type.Element;
    } else if (lastProperty === "top" || lastProperty === "bottom" || lastProperty === "left" || lastProperty === "right" || lastProperty === "number" || lastProperty === "width" || lastProperty === "height") {
      type = $wf.$type.Number;
      unit = "px";
    } else {
      type = $wf.$type.String;
    }
    if (property) {
      script = "e('" + property + "','" + keyword + "')";
    } else {
      script = "e(void 0, " + (JSON.stringify(keyword)) + ")";
    }
    return new Expression(script, type, unit, false, $wf.$runtimeMode.individual);
  },
  "function": function(name, argumentsString, inputUnit, parseArgs) {
    var arg, argComponents, args, bindings, expr, expressions, fObj, funcs, globals, mode, namedArgs, objectProp, ogstring, parseTree, script, scripts, selector, unit, vars, _i, _j, _len, _len1;
    ogstring = parseArgs[0], parseTree = parseArgs[1], selector = parseArgs[2], funcs = parseArgs[3], globals = parseArgs[4];
    vars = parseTree.variables;
    fObj = funcs[name];
    if (!fObj) {
      throw new FSENonexistentFunctionError(name);
    }
    if (argumentsString.length > 1) {
      args = window.fashion.$parser.splitByTopLevelCommas(argumentsString);
      expressions = [];
      namedArgs = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        if (argComponents = arg.match(/([a-zA-Z0-9\-\'\"]+)\s*\:\s*(.*)/)) {
          objectProp = "'" + argComponents[1] + "': ";
          objectProp += window.fashion.$parser.parseExpression(argComponents[2], parseTree, selector, funcs, globals, 0).script;
          namedArgs.push(objectProp);
        } else {
          expressions.push(window.fashion.$parser.parseExpression(arg, parseTree, selector, funcs, globals, false));
        }
      }
      if (namedArgs.length > 0) {
        expressions.push({
          script: "{" + (namedArgs.join(',')) + "}"
        });
      }
    } else {
      expressions = [];
    }
    scripts = ["t"];
    mode = fObj.mode;
    bindings = new ExpressionBindings;
    for (_j = 0, _len1 = expressions.length; _j < _len1; _j++) {
      expr = expressions[_j];
      if (!(expr.script != null)) {
        continue;
      }
      mode |= expr.mode;
      scripts.push(expr.script);
      bindings.extend(expr.bindings);
    }
    if (fObj.unit !== "") {
      unit = fObj.unit;
    } else if (fObj.unitFrom !== void 0) {
      unit = expressions[fObj.unitFrom].unit;
    } else {
      unit = "";
    }
    parseTree.addFunctionDependency(name, fObj);
    if (fObj.watcher != null) {
      bindings.addFunctionBinding(name, scripts, bindings.copy(), mode);
    }
    script = "f['" + name + "'].get.call(" + (scripts.join(',')) + ")";
    return new Expression(script, fObj.type, inputUnit || unit, bindings, mode);
  },
  ternary: function(ifExp, trueExp, falseExp, parseArgs, top) {
    var bindings, funcs, globals, mode, ogstring, parse, parseTree, script, selector;
    if ((ifExp == null) || (trueExp == null)) {
      throw new FSETernaryTypeError();
    }
    ogstring = parseArgs[0], parseTree = parseArgs[1], selector = parseArgs[2], funcs = parseArgs[3], globals = parseArgs[4];
    bindings = new ExpressionBindings;
    mode = 0;
    parse = function(arg) {
      var e;
      e = window.fashion.$parser.parseExpression(arg, parseTree, selector, funcs, globals, false, true, false);
      bindings.extend(e.bindings);
      mode |= e.mode;
      return e;
    };
    ifExp = parse(ifExp.trim());
    trueExp = parse(trueExp.trim());
    if (falseExp != null) {
      falseExp = parse(falseExp.trim());
      if (trueExp.type !== falseExp.type) {
        throw new FSETernaryTypeError(trueExp.script, falseExp.script);
      }
      if (trueExp.unit !== falseExp.unit) {
        throw new FSETernaryUnitError(trueExp.script, falseExp.script);
      }
    } else {
      falseExp = {
        script: 'undefined'
      };
    }
    script = "(" + ifExp.script + " ? " + trueExp.script + " : " + falseExp.script + ")";
    return new Expression(script, trueExp.type, trueExp.unit, bindings, mode);
  }
};
window.fashion.$parser.addVariable = function(parseTree, name, value, flag, scopeSelector) {
  var FSSVal, indMode, type, typedValue, unit, unittedValue, val, variableObject;
  if (flag === "!important") {
    throw new FSImportantVarError(name);
  }
  FSSVal = value;
  value = $wf.$parser.parsePropertyValues(value, parseTree, scopeSelector, true);
  if (value instanceof Array) {
    throw new FSMultipartVariableError(name, JSON.stringify(value));
  }
  indMode = $wf.$runtimeMode.individual;
  if (value.mode && (value.mode & indMode) === indMode) {
    if (!scopeSelector) {
      throw new FSIndividualVarError(name, FSSVal);
    }
    parseTree.addRequirements([$wf.$runtimeCapability.scopedIndividual]);
  }
  variableObject = new Variable(name, value, scopeSelector != null ? scopeSelector.name : void 0);
  if (flag === "!static") {
    variableObject.mode = $wf.$runtimeMode["static"];
  }
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
var FSBlockMismatchError, FSBracketMismatchError, FSEMixedTypeError, FSENonexistentFunctionError, FSENonexistentGlobalError, FSENonexistentVariableError, FSEParenthesisMismatchError, FSETernaryTypeError, FSETernaryUnitError, FSEVariableScopeError, FSImportantVarError, FSIndividualVarError, FSMultipartVariableError, FSSelectorCombinationError, FSUnknownParseError, FashionExpressionParseError, FashionParseError, FashionSheetParseError,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

FashionParseError = (function(_super) {
  __extends(FashionParseError, _super);

  function FashionParseError(source, string, index) {
    var char, col, errName, i, id, lastLineChar, line, lineStr, msgLines;
    errName = this.name || this.constructor.name;
    if (string != null) {
      line = 0;
      lastLineChar = 0;
      for (i in string) {
        char = string[i];
        if (i >= index) {
          break;
        }
        if (char === "\n") {
          line++;
          lastLineChar = i;
        }
      }
      col = index - lastLineChar;
      lineStr = string.split('\n')[line] || '';
      console.log("FASHION ERROR | " + errName + " at " + line + ":" + col + " of " + source);
      console.log("       AROUND | '" + lineStr + "'");
    } else {
      console.log("FASHION ERROR | " + errName + " in " + source);
    }
    msgLines = this.message.split("\n");
    console.log("      MESSAGE | " + msgLines[0]);
    for (id in msgLines) {
      line = msgLines[id];
      if (id > 0) {
        console.log("              | " + line);
      }
    }
    console.log("");
  }

  return FashionParseError;

})(Error);

FashionSheetParseError = (function(_super) {
  __extends(FashionSheetParseError, _super);

  function FashionSheetParseError(string, index) {
    FashionSheetParseError.__super__.constructor.call(this, "stylesheet", string, index);
  }

  return FashionSheetParseError;

})(FashionParseError);

FSBracketMismatchError = (function(_super) {
  __extends(FSBracketMismatchError, _super);

  function FSBracketMismatchError(selectorName) {
    this.name = "BracketMismatchError";
    this.message = "The top-level selector " + selectorName + " is never closed.\nMake sure your brackets match.";
    FSBracketMismatchError.__super__.constructor.call(this);
  }

  return FSBracketMismatchError;

})(FashionSheetParseError);

FSBlockMismatchError = (function(_super) {
  __extends(FSBlockMismatchError, _super);

  function FSBlockMismatchError(blockName) {
    this.name = "BlockBracketMismatchError";
    this.message = "A block of type @" + blockName + " is never closed.\nMake sure your brackets match.";
    FSBlockMismatchError.__super__.constructor.call(this);
  }

  return FSBlockMismatchError;

})(FashionSheetParseError);

FSIndividualVarError = (function(_super) {
  __extends(FSIndividualVarError, _super);

  function FSIndividualVarError(varName, expString) {
    this.name = "IndividualVarError";
    this.message = "Variable $" + varName + " cannot rely on individual properties like @self\nExpression: '" + expString + "'";
    FSIndividualVarError.__super__.constructor.call(this);
  }

  return FSIndividualVarError;

})(FashionSheetParseError);

FSMultipartVariableError = (function(_super) {
  __extends(FSMultipartVariableError, _super);

  function FSMultipartVariableError(varName, valString) {
    this.name = "MultipartVariableError";
    this.message = "Variable $" + varName + " cannot be set to multiple values\nValue: '" + valString + "'\nMalformed expressions may sometimes be read as 2 separate expressions\nFor example '300px -100px' would be 2 expressions, not 1 evaluating to 200px";
    FSMultipartVariableError.__super__.constructor.call(this);
  }

  return FSMultipartVariableError;

})(FashionSheetParseError);

FSImportantVarError = (function(_super) {
  __extends(FSImportantVarError, _super);

  function FSImportantVarError(varName) {
    this.name = "ImportantVarError";
    this.message = "Variable $" + varName + " cannot be flagged as important";
    FSImportantVarError.__super__.constructor.call(this);
  }

  return FSImportantVarError;

})(FashionSheetParseError);

FSSelectorCombinationError = (function(_super) {
  __extends(FSSelectorCombinationError, _super);

  function FSSelectorCombinationError(outer, inner) {
    this.name = "SelectorCombinationError";
    this.message = "Could not combine '" + outer + "' with '" + inner + "'.\nPlease simplify the selectors to include fewer components (shallower nesting)";
    FSSelectorCombinationError.__super__.constructor.call(this);
  }

  return FSSelectorCombinationError;

})(FashionSheetParseError);

FSUnknownParseError = (function(_super) {
  __extends(FSUnknownParseError, _super);

  function FSUnknownParseError(string, index) {
    this.name = "UnknownParseError";
    this.message = "Regex failed to execute on the stylesheet.";
    FSUnknownParseError.__super__.constructor.call(this, string, index);
  }

  return FSUnknownParseError;

})(FashionSheetParseError);

FashionExpressionParseError = (function(_super) {
  __extends(FashionExpressionParseError, _super);

  function FashionExpressionParseError(string, index) {
    FashionExpressionParseError.__super__.constructor.call(this, "expression", string, index);
  }

  return FashionExpressionParseError;

})(FashionParseError);

FSEParenthesisMismatchError = (function(_super) {
  __extends(FSEParenthesisMismatchError, _super);

  function FSEParenthesisMismatchError(string, index) {
    this.name = "ParenthesisMismatchError";
    this.message = "Could not match parenthesis in expression.";
    FSEParenthesisMismatchError.__super__.constructor.call(this, string, index);
  }

  return FSEParenthesisMismatchError;

})(FashionExpressionParseError);

FSENonexistentVariableError = (function(_super) {
  __extends(FSENonexistentVariableError, _super);

  function FSENonexistentVariableError(varName, scope) {
    this.name = "NonexistentVariableError";
    this.message = "Variable $" + varName + " does not exist in this scope\nScope: '" + scope + "'";
    FSENonexistentVariableError.__super__.constructor.call(this);
  }

  return FSENonexistentVariableError;

})(FashionExpressionParseError);

FSEVariableScopeError = (function(_super) {
  __extends(FSEVariableScopeError, _super);

  function FSEVariableScopeError(varName) {
    this.name = "VariableScopeError";
    this.message = "Variable $" + varName + " isn't in this scope and doesn't have a top-level value.";
    FSEVariableScopeError.__super__.constructor.call(this);
  }

  return FSEVariableScopeError;

})(FashionExpressionParseError);

FSENonexistentGlobalError = (function(_super) {
  __extends(FSENonexistentGlobalError, _super);

  function FSENonexistentGlobalError(globalName) {
    this.name = "NonexistentGlobalError";
    this.message = "Global @" + globalName + " could not be found";
    FSENonexistentGlobalError.__super__.constructor.call(this);
  }

  return FSENonexistentGlobalError;

})(FashionExpressionParseError);

FSENonexistentFunctionError = (function(_super) {
  __extends(FSENonexistentFunctionError, _super);

  function FSENonexistentFunctionError(funcName) {
    this.name = "NonexistentFunctionError";
    this.message = "Function module " + funcName + "() could not be found";
    FSENonexistentFunctionError.__super__.constructor.call(this);
  }

  return FSENonexistentFunctionError;

})(FashionExpressionParseError);

FSETernaryTypeError = (function(_super) {
  __extends(FSETernaryTypeError, _super);

  function FSETernaryTypeError(onExp, offExp) {
    this.name = "TernaryTypeError";
    this.message = "Ternary expressions must return the same type in all instances\nMust match: '" + onExp + "' & '" + offExp + "'";
    FSETernaryTypeError.__super__.constructor.call(this);
  }

  return FSETernaryTypeError;

})(FashionExpressionParseError);

FSETernaryUnitError = (function(_super) {
  __extends(FSETernaryUnitError, _super);

  function FSETernaryUnitError(onExp, offExp) {
    this.name = "TernaryUnitError";
    this.message = "Ternary expressions must return the same unit in all instances\nMust match: '" + onExp + "' & '" + offExp + "'";
    FSETernaryUnitError.__super__.constructor.call(this);
  }

  return FSETernaryUnitError;

})(FashionExpressionParseError);

FSEMixedTypeError = (function(_super) {
  __extends(FSEMixedTypeError, _super);

  function FSEMixedTypeError(string, index) {
    this.name = "MixedTypeError";
    this.message = "Mixed types found in expression.";
    FSEMixedTypeError.__super__.constructor.call(this, string, index);
  }

  return FSEMixedTypeError;

})(FashionExpressionParseError);
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
  requireModule: function(parseTree, name) {
    return parseTree.addRequirements([name]);
  },
  parseValue: function(parseTree, bindLink, value) {
    if (!value || typeof value !== "string") {
      return "";
    }
    return $wf.$parser.parseSingleValue(value, bindLink, parseTree);
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
  var API, bID, block, blockObj, funcs, _ref;
  funcs = window.fashion.$processor.api;
  _ref = parseTree.blocks;
  for (bID in _ref) {
    block = _ref[bID];
    blockObj = blocks[block.type];
    if (!blockObj) {
      continue;
    }
    API = {
      throwError: funcs.throwError.bind(0, block.type),
      addRule: funcs.addRule.bind(0, parseTree),
      addScript: funcs.addScript.bind(0, parseTree),
      requireModule: funcs.requireModule.bind(0, parseTree),
      parseValue: funcs.parseValue.bind(0, parseTree, "b" + bID),
      parse: funcs.parseBody.bind(0, parseTree),
      runtimeObject: parseTree.dependencies.blocks[block.type].runtimeObject,
      addVariable: funcs.addVariable.bind(0, parseTree)
    };
    blockObj.compile.call(API, block["arguments"], block.body);
  }
  return parseTree;
};

window.fashion.$processor.api.parseBody = function(parseTree, body) {
  return $wf.$parser.parse(body, parseTree);
};

window.fashion.$processor.api.addVariable = function(parseTree, name, value) {
  return $wf.$parser.addVariable(parseTree, name, value);
};
window.fashion.$processor.properties = function(parseTree, propertyModules) {
  var API, funcs, index, pid, property, propertyModule, rmode, selector, sid, _ref, _ref1;
  funcs = window.fashion.$processor.api;
  rmode = $wf.$runtimeMode;
  _ref = parseTree.selectors;
  for (sid in _ref) {
    selector = _ref[sid];
    index = -1;
    _ref1 = selector.properties;
    for (pid in _ref1) {
      property = _ref1[pid];
      index++;
      propertyModule = propertyModules[property.name];
      if (propertyModule) {
        API = {
          throwError: funcs.throwError.bind(0, property),
          setProperty: funcs.setProperty.bind(0, selector, index),
          getProperty: funcs.getProperty.bind(0, parseTree, selector.name),
          parseValue: funcs.parseValue.bind(0, parseTree, [sid, pid]),
          determineType: funcs.determineType,
          determineUnit: funcs.determineUnit
        };
        if ((propertyModule.mode & rmode.individual) === rmode.individual) {
          parseTree.addPropertyDependency(property.name, propertyModule);
          property.mode |= propertyModule.mode;
        } else {
          propertyModules[property.name].compile.call(API, property.value);
          if (propertyModule.replace) {
            selector.deleteProperty(index--);
          }
        }
      }
    }
  }
  return parseTree;
};
window.fashion.$shared = {};
window.fashion.$shared.getVariable = function(variables, globals, funcs, runtime, varName, scope, elem) {
  var indMode, ran, scopeElem, scopeVal, vObj, _ref, _ref1, _ref2, _ref3, _ref4;
  vObj = variables[varName];
  if (!vObj) {
    console.log("[FASHION] Could not find variable '" + varName + "'");
    return {
      value: void 0
    };
  }
  if (typeof vObj === 'string' || typeof vObj === 'number') {
    return {
      value: vObj
    };
  }
  if (vObj[0]) {
    return vObj[0];
  }
  if (scope && scope !== 0) {
    if (!vObj.values[scope]) {
      this.throwError("$" + varName + " does not have a value for scope '" + scope + "'");
    }
    if ((elem != null) && (this.getScopeOverride != null)) {
      _ref = this.getScopeOverride(elem, varName, scope), scopeElem = _ref[0], scopeVal = _ref[1];
      if (scopeVal == null) {
        _ref1 = [elem, vObj.values[scope]], scopeElem = _ref1[0], scopeVal = _ref1[1];
      }
    } else {
      _ref2 = [elem, vObj.values[scope]], scopeElem = _ref2[0], scopeVal = _ref2[1];
    }
    indMode = ((_ref3 = this.runtimeModes) != null ? _ref3.individual : void 0) || (typeof $wf !== "undefined" && $wf !== null ? (_ref4 = $wf.$runtimeMode) != null ? _ref4.individual : void 0 : void 0);
    if (scopeVal.evaluate) {
      ran = this.evaluate(scopeVal.evaluate, variables, globals, funcs, runtime, scopeElem);
      return {
        value: ran
      };
    } else {
      return {
        value: scopeVal
      };
    }
  } else if (vObj["default"] !== void 0) {
    if (vObj["default"].evaluate) {
      ran = this.evaluate(vObj["default"], variables, globals, funcs, runtime, elem);
      return {
        value: ran
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

window.fashion.$shared.evaluate = function(valueObject, variables, globals, funcs, runtime, element, cssMode, extraArg) {
  var addSuffix, evaluateSingleValue, iMode, isImportant, string, value, vi, vo, _ref, _ref1;
  if (cssMode == null) {
    cssMode = true;
  }
  isImportant = false;
  iMode = ((_ref = this.runtimeModes) != null ? _ref.individual : void 0) || (typeof $wf !== "undefined" && $wf !== null ? (_ref1 = $wf.$runtimeMode) != null ? _ref1.individual : void 0 : void 0);
  evaluateSingleValue = (function(_this) {
    return function(valueObject) {
      var e, getElm, getVar, v, val, varObjects, _i, _len;
      if (valueObject == null) {
        console.log("[FASHION] Could not evaluate empty value object");
        return console.log(new Error().stack);
      }
      if (typeof valueObject === "string") {
        return valueObject;
      }
      if (typeof valueObject === "number") {
        return valueObject;
      }
      varObjects = [];
      getVar = function(varName, scope, element) {
        var vObj;
        vObj = _this.getVariable(variables, globals, funcs, runtime, varName, scope, element);
        varObjects.push({
          name: varName,
          object: vObj,
          value: vObj.value,
          scope: scope
        });
        return vObj;
      };
      if (((valueObject.mode & iMode) === iMode || (element != null)) && (_this.elementFunction != null)) {
        if (element == null) {
          return _this.throwError("Expression requires element but none provided");
        }
        getElm = _this.elementFunction(element);
        if (getElm == null) {
          return _this.throwError("Could not generate element function");
        }
      } else {
        getElm = function() {
          return 0;
        };
      }
      if (valueObject.evaluate) {
        try {
          val = valueObject.evaluate(getVar, globals, funcs, runtime, getElm, extraArg);
        } catch (_error) {
          e = _error;
          console.log("[FASHION] Could not evaluate: " + valueObject.evaluate);
          console.log(e);
          return console.log(e.stack);
        }
        if (valueObject.important === true) {
          isImportant = true;
        }
        if (valueObject.setter) {
          for (_i = 0, _len = varObjects.length; _i < _len; _i++) {
            v = varObjects[_i];
            if (v.object.value !== v.value) {
              _this.setVariable(v.name, v.object.value, v.scope, element);
            }
          }
        }
        return val;
      } else if (valueObject.value) {
        return valueObject.value;
      }
    };
  })(this);
  addSuffix = function(property, isImportant) {
    if (isImportant && cssMode) {
      return property + " !important";
    } else {
      return property;
    }
  };
  if (valueObject instanceof Array) {
    if (valueObject.length === 0) {
      return '';
    }
    if (valueObject[0] instanceof Array) {
      return addSuffix(((function() {
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
      })()).join(', '), isImportant);
    } else {
      string = ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = valueObject.length; _i < _len; _i++) {
          value = valueObject[_i];
          _results.push(evaluateSingleValue(value));
        }
        return _results;
      })()).join(' ');
      return addSuffix(string, isImportant);
    }
  } else {
    return addSuffix(evaluateSingleValue(valueObject), isImportant);
  }
};
window.fashion.$shared.combineSelectors = function(outer, inner, cap) {
  var acc, c, componentArrayJoin, didSlice, existingSel, hasDuplicate, i, ic, icomp, interSels, oc, ocomp, prefix, recursiveInterleave, s, selectors, trimBeforeId, x, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _ref;
  if (cap == null) {
    cap = 10;
  }
  trimBeforeId = function(selectorComponents) {
    var i, _i, _ref;
    if (selectorComponents.length === 0) {
      return selectorComponents;
    }
    for (i = _i = _ref = selectorComponents.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
      if (selectorComponents[i][0][0] === "#") {
        return selectorComponents.slice(i);
      }
    }
    return selectorComponents;
  };
  recursiveInterleave = function(oc, ic) {
    var fi, fs, i, left, results, right, selFoot, _i, _j, _len, _ref, _ref1;
    if ((oc == null) || oc.length === 0) {
      return [ic];
    }
    if ((ic == null) || ic.length === 0) {
      return [oc];
    }
    results = [];
    for (i = _i = 0, _ref = oc.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      left = oc.slice(0, i);
      right = oc.slice(i);
      _ref1 = recursiveInterleave(right, ic.slice(1));
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        selFoot = _ref1[_j];
        results.push($wf.$buildArray(left, [ic[0]], selFoot));
        if (!selFoot[0] || !ic[0]) {
          continue;
        }
        if (selFoot[0][1] === ic[0][1]) {
          continue;
        }
        if (selFoot[0][0] === ic[0][0]) {
          selFoot[0][1] = 2;
          results.push($wf.$buildArray(left, selFoot));
        }
        if (selFoot[0][1] === 2 || ic[0][1] === 2) {
          continue;
        }
        fi = ic[0][0];
        fs = selFoot[0][0];
        if ((fi[0] === "#" && fs[0] !== "#") || fi[0] === "." || fi[0] === "[") {
          selFoot[0] = [fs + fi, 2];
          results.push($wf.$buildArray(left, selFoot));
        } else if ((fs[0] === "#" && fi[0] !== "#") || fs[0] === "." || fs[0] === "[") {
          selFoot[0] = [fi + fs, 2];
          results.push($wf.$buildArray(left, selFoot));
        }
      }
    }
    return results;
  };
  componentArrayJoin = function(arr) {
    var acc, i, o;
    acc = "";
    for (i in arr) {
      o = arr[i];
      if (i > 0) {
        acc += " ";
      }
      acc += o[0];
    }
    return acc;
  };
  ocomp = (function() {
    var _i, _len, _ref, _results;
    _ref = outer.split(",");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      _results.push((function() {
        var _j, _len1, _ref1, _results1;
        _ref1 = c.trim().split(" ");
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          x = _ref1[_j];
          _results1.push([x, 0]);
        }
        return _results1;
      })());
    }
    return _results;
  })();
  icomp = (function() {
    var _i, _len, _ref, _results;
    _ref = inner.split(",");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      _results.push((function() {
        var _j, _len1, _ref1, _results1;
        _ref1 = c.trim().split(" ");
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          x = _ref1[_j];
          _results1.push([x, 1]);
        }
        return _results1;
      })());
    }
    return _results;
  })();
  selectors = [];
  for (_i = 0, _len = ocomp.length; _i < _len; _i++) {
    oc = ocomp[_i];
    for (_j = 0, _len1 = icomp.length; _j < _len1; _j++) {
      ic = icomp[_j];
      didSlice = false;
      for (i = _k = 0, _ref = Math.min(oc.length, ic.length); 0 <= _ref ? _k < _ref : _k > _ref; i = 0 <= _ref ? ++_k : --_k) {
        if (oc[i][0] !== ic[i][0]) {
          prefix = oc.slice(0, i);
          oc = oc.slice(i);
          ic = ic.slice(i);
          didSlice = true;
          break;
        }
      }
      if (!didSlice) {
        selectors.push(componentArrayJoin(ic));
        continue;
      }
      oc = trimBeforeId(oc);
      ic = trimBeforeId(ic);
      if (oc.length * ic.length > cap) {
        return false;
      }
      interSels = recursiveInterleave(oc, ic);
      for (_l = 0, _len2 = interSels.length; _l < _len2; _l++) {
        s = interSels[_l];
        if (s[s.length - 1][1] === 0) {
          continue;
        }
        acc = componentArrayJoin($wf.$buildArray(prefix, s));
        hasDuplicate = false;
        for (_m = 0, _len3 = selectors.length; _m < _len3; _m++) {
          existingSel = selectors[_m];
          if (acc === existingSel) {
            hasDuplicate = true;
            break;
          }
        }
        if (hasDuplicate) {
          continue;
        }
        selectors.push(acc);
      }
    }
  }
  return selectors.join(",");
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
      unit: ''
    };
  }
  getNumberUnit = function() {
    var components, splitRegex, unitString;
    splitRegex = /([0-9\-\.]*)(.*?)/;
    components = splitRegex.exec(rawValue);
    if (components.length < 2) {
      return {
        value: parseFloat(rawValue),
        unit: ''
      };
    }
    unitString = rawValue.replace(components[1], "");
    unit = unit.Number[unitString];
    if (!unit) {
      return {
        value: parseFloat(components[1]),
        unit: ''
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
    unit: ''
  };
};

window.fashion.$shared.timeInMs = function(valueObject) {
  if (!valueObject) {
    return 0;
  } else if (typeof valueObject === 'number') {
    return valueObject;
  } else if (valueObject.unit === "ms") {
    return valueObject.value;
  } else if (valueObject.unit === "s") {
    return valueObject.value * 1000;
  } else {
    return parseInt(valueObject.value);
  }
};
window.fashion.color = {
  cssTOjs: function(cssString, colorTools) {
    var rgbMatch;
    if (colorTools == null) {
      colorTools = $wf.color;
    }
    if (!cssString || typeof cssString !== 'string') {
      return {
        r: 0,
        g: 0,
        b: 0,
        a: 1
      };
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
    } else {
      return {
        r: 0,
        g: 0,
        b: 0,
        a: 1
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
        return "0" + hex.toUpperCase();
      } else {
        return hex.toUpperCase();
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
    s = s / 100;
    b = b / 100;
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
        b: val / 2.55
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
    s = pcd / max * 100;
    return {
      h: h,
      s: s,
      b: val / 2.55
    };
  }
};
window.fashion.$actualizer = {
  actualize: function(parseTree) {
    var $wfa, css, cssSels, individualSels, js, jsSels, miniRuntimeData, rM, runtimeData, _ref;
    rM = $wf.$runtimeMode;
    $wfa = $wf.$actualizer;
    $wfa.separateTransitions(parseTree);
    _ref = $wfa.splitIndividual(parseTree.selectors), cssSels = _ref.cssSels, individualSels = _ref.individualSels;
    $wfa.hideIndividualizedSelectors(cssSels, parseTree.scripts, individualSels);
    jsSels = $wfa.filterStatic(cssSels);
    runtimeData = $wfa.generateRuntimeData(parseTree, jsSels, individualSels);
    $wfa.addBindings(runtimeData, jsSels, individualSels);
    $wfa.autoAddRequirements(runtimeData, parseTree, parseTree.selectors);
    $wfa.addRuntimeFunctions(runtimeData, parseTree);
    $wfa.removeUnnecessaryModuleData(runtimeData);
    parseTree.scripts.push("setTimeout(function(){\n	var e = document.createEvent(\"Event\");\n	e.initEvent('" + $wf.readyEvent + "',0, 0);\n	document.dispatchEvent(e);\n},17);");
    css = $wf.styleHeader + $wfa.createCSS(runtimeData, cssSels);
    miniRuntimeData = $wfa.minifier.runtimeData(runtimeData);
    js = $wfa.createJS(runtimeData, miniRuntimeData, parseTree.scripts);
    return {
      css: css,
      js: js
    };
  }
};

window.fashion.$actualizer.jsHeader = "/*\\\n|*| GENERATED BY FASHION " + $wf.version + "\n|*| " + $wf.url + " - " + $wf.author + "\n\\*/";

window.fashion.$actualizer.createJS = function(runtimeData, minifiedData, scripts) {
  return "" + window.fashion.$actualizer.jsHeader + "\nwindow." + $wf.minifiedObject + " = " + ($wf.$stringify(minifiedData)) + ";\nwindow." + $wf.runtimeObject + " = " + ($wf.$stringify({
    config: runtimeData.config,
    modules: runtimeData.modules,
    runtime: runtimeData.runtime,
    elements: {},
    selectors: {},
    individual: {},
    variables: {}
  })) + ";\nFSEXPAND = " + ($wf.$stringify($wf.$actualizer.minifier.expandRuntimeData)) + ";\nFSEXPAND(window." + $wf.minifiedObject + ",window." + $wf.runtimeObject + ");\nFSREADY = function(r){d=document;c=\"complete\";\n	if(d.readyState==c)r()\n	else d.addEventListener('DOMContentLoaded',r)\n}\n" + (scripts.join('\n'));
};
window.fashion.$actualizer.splitIndividual = function(selectors) {
  var cssRule, cssSelector, cssSelectors, id, indMode, indRule, indSelector, indSelectors, pid, property, selector, _ref;
  cssSelectors = {};
  indSelectors = {};
  cssRule = indRule = $wf.styleHeaderRules;
  indMode = $wf.$runtimeMode.individual;
  for (id in selectors) {
    selector = selectors[id];
    cssSelector = new Selector(selector.name, selector.mode);
    indSelector = new Selector(selector.name, selector.mode);
    _ref = selector.properties;
    for (pid in _ref) {
      property = _ref[pid];
      if ((property.mode & indMode) === indMode) {
        indSelector.addProperty(property);
      } else {
        cssSelector.addProperty(property);
      }
    }
    if (cssSelector.properties.length > 0) {
      cssSelector.rule = cssRule++;
      cssSelectors[id] = cssSelector;
    }
    if (indSelector.properties.length > 0) {
      indSelector.rule = indRule++;
      indSelectors[id] = indSelector;
    }
  }
  return {
    cssSels: cssSelectors,
    individualSels: indSelectors
  };
};

window.fashion.$actualizer.filterStatic = function(allSelectors, filterMode) {
  var dynamicSelector, hasDynamic, id, passingSelectors, pid, property, selector, _ref;
  passingSelectors = {};
  for (id in allSelectors) {
    selector = allSelectors[id];
    dynamicSelector = new Selector(selector.name, selector.mode);
    dynamicSelector.rule = selector.rule;
    dynamicSelector.properties = {};
    hasDynamic = false;
    _ref = selector.properties;
    for (pid in _ref) {
      property = _ref[pid];
      if (property.mode > 0) {
        hasDynamic = true;
        dynamicSelector.properties[pid] = property;
      }
    }
    if (hasDynamic) {
      passingSelectors[id] = dynamicSelector;
    }
  }
  return passingSelectors;
};
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

window.fashion.$actualizer.addBindings = function(runtimeData, jsSels, indSels) {
  $wf.$actualizer.bindSelectors(runtimeData, jsSels, "s");
  $wf.$actualizer.bindSelectors(runtimeData, indSels, "i");
  $wf.$actualizer.bindVariables(runtimeData);
  return $wf.$actualizer.bindFunctionWatchers(runtimeData);
};

window.fashion.$actualizer.bindSelectors = function(runtimeData, selectors, sheet) {
  var bindLink, ccmp, csval, pid, property, selector, sid, tmode, _results;
  tmode = $wf.$runtimeMode.triggered;
  _results = [];
  for (sid in selectors) {
    selector = selectors[sid];
    sid = parseInt(sid);
    if (selector.name instanceof Expression) {
      bindLink = [sheet, sid];
      $wf.$actualizer.bindExpression(runtimeData, selector.name, bindLink);
    }
    _results.push((function() {
      var _ref, _results1;
      _ref = selector.properties;
      _results1 = [];
      for (pid in _ref) {
        property = _ref[pid];
        if ((property.mode & tmode) === tmode) {
          continue;
        }
        bindLink = [sheet, sid, $wf.$actualizer.makeCamelCase(property.name)];
        if (property.value instanceof Array) {
          _results1.push((function() {
            var _i, _len, _ref1, _results2;
            _ref1 = property.value;
            _results2 = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              csval = _ref1[_i];
              if (csval instanceof Array) {
                _results2.push((function() {
                  var _j, _len1, _results3;
                  _results3 = [];
                  for (_j = 0, _len1 = csval.length; _j < _len1; _j++) {
                    ccmp = csval[_j];
                    if (ccmp instanceof Expression) {
                      _results3.push($wf.$actualizer.bindExpression(runtimeData, ccmp, bindLink));
                    } else {
                      _results3.push(void 0);
                    }
                  }
                  return _results3;
                })());
              } else if (csval instanceof Expression) {
                _results2.push($wf.$actualizer.bindExpression(runtimeData, csval, bindLink));
              } else {
                _results2.push(void 0);
              }
            }
            return _results2;
          })());
        } else if (property.value instanceof Expression) {
          _results1.push($wf.$actualizer.bindExpression(runtimeData, property.value, bindLink));
        } else {
          _results1.push(void 0);
        }
      }
      return _results1;
    })());
  }
  return _results;
};

window.fashion.$actualizer.bindVariables = function(runtimeData) {
  var bindLink, scope, scopeValue, vObj, varName, _ref, _results;
  _ref = runtimeData.variables;
  _results = [];
  for (varName in _ref) {
    vObj = _ref[varName];
    _results.push((function() {
      var _ref1, _results1;
      _ref1 = vObj.values;
      _results1 = [];
      for (scope in _ref1) {
        scopeValue = _ref1[scope];
        if (scopeValue instanceof Expression) {
          bindLink = ["v", varName, scope];
          _results1.push($wf.$actualizer.bindExpression(runtimeData, scopeValue, bindLink));
        } else {
          _results1.push(void 0);
        }
      }
      return _results1;
    })());
  }
  return _results;
};

window.fashion.$actualizer.bindFunctionWatchers = function(runtimeData) {
  var bindLink, fName, fObj, i, watcherObject, _ref, _ref1, _results;
  _ref = runtimeData.modules.functions;
  _results = [];
  for (fName in _ref) {
    fObj = _ref[fName];
    if (((_ref1 = fObj.dependents) != null ? _ref1.length : void 0) > 0) {
      _results.push((function() {
        var _ref2, _results1;
        _ref2 = fObj.dependents;
        _results1 = [];
        for (i in _ref2) {
          watcherObject = _ref2[i];
          if (watcherObject[0] instanceof Expression) {
            bindLink = ["w", fName, i];
            _results1.push($wf.$actualizer.bindExpression(runtimeData, watcherObject[0], bindLink));
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      })());
    }
  }
  return _results;
};

window.fashion.$actualizer.bindExpression = function(runtimeData, expression, bindLink) {
  var fObj, funcName, funcWatcher, gObj, globalName, vObj, varBind, varName, varScope, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
  _ref = expression.bindings.variables;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    varBind = _ref[_i];
    varName = varBind[0], varScope = varBind[1];
    vObj = runtimeData.variables[varName];
    if (!vObj) {
      console.log("[FASHION] Could not bind to nonexistent variable: '" + varName + "'");
    } else {
      vObj.addDependent(bindLink, varScope);
    }
  }
  _ref1 = expression.bindings.globals;
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    globalName = _ref1[_j];
    gObj = runtimeData.modules.globals[globalName];
    if (!gObj) {
      console.log("[FASHION] Could not bind to nonexistent global: '" + varName + "'");
    } else {
      if (gObj.dependents == null) {
        gObj.dependents = [];
      }
      if (__indexOf.call(gObj.dependents, bindLink) >= 0) {
        continue;
      }
      gObj.dependents.push(bindLink);
    }
  }
  _ref2 = expression.bindings.functions;
  _results = [];
  for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
    funcWatcher = _ref2[_k];
    funcName = funcWatcher[0];
    fObj = runtimeData.modules.functions[funcName];
    if (!fObj) {
      _results.push(console.log("[FASHION] Could not bind to nonexistent function: '" + funcName + "'"));
    } else {
      if (fObj.dependents == null) {
        fObj.dependents = [];
      }
      _results.push(fObj.dependents.push([funcWatcher[1], bindLink]));
    }
  }
  return _results;
};

window.fashion.$actualizer.makeCamelCase = function(cssName) {
  if (cssName == null) {
    return "";
  }
  return cssName.replace(/-([a-z])/gi, function(full, letter) {
    return letter.toUpperCase();
  });
};
var RuntimeData;

RuntimeData = (function() {
  function RuntimeData(parseTree, selectors, variables) {
    this.config = $wf.runtimeConfig;
    this.selectors = selectors;
    this.variables = variables;
    this.modules = parseTree.dependencies;
    this.runtime = {};
  }

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
var RuntimeVariable,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

RuntimeVariable = (function() {
  function RuntimeVariable(name, type, unit, mode) {
    this.name = name;
    this.type = type;
    this.unit = unit;
    this.mode = mode || $wf.$runtimeMode["static"];
    this.scopes = [];
    this.values = {};
    this.dependents = {};
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

  RuntimeVariable.prototype.addDependent = function(bindLink, scope) {
    if (this.dependents[scope] == null) {
      this.dependents[scope] = [];
    }
    if (__indexOf.call(this.dependents[scope], bindLink) >= 0) {
      return;
    }
    return this.dependents[scope].push(bindLink);
  };

  return RuntimeVariable;

})();
window.fashion.$actualizer.generateRuntimeData = function(parseTree, jsSelectors, individual) {
  var rdata, vars;
  vars = $wf.$actualizer.actualizeVariables(parseTree, jsSelectors, individual);
  rdata = new RuntimeData(parseTree, jsSelectors, vars);
  if (individual) {
    rdata.individual = individual;
  }
  return rdata;
};

window.fashion.$actualizer.actualizeVariables = function(parseTree, jsSelectors, individual) {
  var mode, name, rvar, scopes, type, unit, varName, varObj, variables, _ref;
  variables = {};
  _ref = parseTree.variables;
  for (varName in _ref) {
    scopes = _ref[varName];
    type = unit = -1;
    mode = 0;
    for (name in scopes) {
      varObj = scopes[name];
      if (varObj.type != null) {
        type = varObj.type;
      }
      if (varObj.unit != null) {
        unit = varObj.unit;
      }
      if (varObj.mode != null) {
        mode |= varObj.mode;
      }
    }
    rvar = new RuntimeVariable(varName, type, unit, mode);
    for (name in scopes) {
      varObj = scopes[name];
      rvar.addScope(name, varObj.value);
    }
    variables[varName] = rvar;
  }
  return variables;
};

window.fashion.$actualizer.removeUnnecessaryModuleData = function(runtimeData) {
  var module, n, _ref, _results;
  _ref = runtimeData.modules.blocks;
  _results = [];
  for (n in _ref) {
    module = _ref[n];
    if (module.runtimeObject) {
      _results.push(runtimeData.modules.blocks[n] = module.runtimeObject);
    }
  }
  return _results;
};
window.fashion.$actualizer.createCSS = function(runtimeData, cssSelectors) {
  var css, cssProperties, cssValue, evalFunction, id, pid, property, selector, selectorName, value, _ref;
  evalFunction = $wf.$actualizer.evaluationFunction(runtimeData);
  css = "";
  for (id in cssSelectors) {
    selector = cssSelectors[id];
    cssProperties = [];
    _ref = selector.properties;
    for (pid in _ref) {
      property = _ref[pid];
      if ((property.mode & $wf.$runtimeMode.globalDynamic) > 2) {
        continue;
      }
      value = property.value;
      if (property.mode === $wf.$runtimeMode["static"]) {
        if (typeof value === 'object' && value.value) {
          cssValue = evalFunction(value.value);
        } else {
          cssValue = evalFunction(value);
        }
      } else {
        cssValue = evalFunction(value);
      }
      cssProperties.push($wf.$actualizer.cssPropertyTemplate(property, cssValue));
    }
    selectorName = evalFunction(selector.name);
    css += $wf.$actualizer.cssSelectorTemplate(selectorName, cssProperties);
  }
  return css;
};

window.fashion.$actualizer.cssPrefixes = ["", "-webkit-", "-moz-", "-ms-"];

window.fashion.$actualizer.separateTransitions = function(parseTree) {
  var evalFunction, id, pid, prefix, prefixes, property, pt, selector, t, transitionMode, transitions, value, _ref, _ref1, _results;
  evalFunction = $wf.$actualizer.evaluationFunction(null, parseTree);
  prefixes = window.fashion.$actualizer.cssPrefixes;
  transitionMode = 0;
  _ref = parseTree.selectors;
  _results = [];
  for (id in _ref) {
    selector = _ref[id];
    transitions = [];
    _ref1 = selector.properties;
    for (pid in _ref1) {
      property = _ref1[pid];
      if (pid === "length") {
        continue;
      }
      if (property.value.transition) {
        pt = property.value.transition;
        pt.property = property.name;
        transitions.push(pt);
        transitionMode |= pt.easing.mode | pt.duration.mode | pt.delay.mode;
      }
    }
    value = (function() {
      var _i, _len, _results1;
      _results1 = [];
      for (_i = 0, _len = transitions.length; _i < _len; _i++) {
        t = transitions[_i];
        _results1.push([t.property, t.duration, t.easing, t.delay]);
      }
      return _results1;
    })();
    if (!value || value.length === 0) {
      continue;
    }
    property = new Property("transition", value, transitionMode);
    _results.push((function() {
      var _i, _len, _results1;
      _results1 = [];
      for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
        prefix = prefixes[_i];
        _results1.push(selector.addProperty(property.copyWithName(prefix + "transition")));
      }
      return _results1;
    })());
  }
  return _results;
};

window.fashion.$actualizer.evaluationFunction = function(runtimeData, parseTree) {
  return function(value) {
    return window.fashion.$shared.evaluate.call(window.fashion.$shared, value, runtimeData ? runtimeData.variables : parseTree.variables, $wf.$globals, $wf.$functions, runtimeData ? runtimeData.runtime : {});
  };
};

window.fashion.$actualizer.cssPropertyTemplate = function(property, value) {
  return "" + property.name + ": " + value + (property.important ? " !important" : "") + ";";
};

window.fashion.$actualizer.cssSelectorTemplate = function(selector, properties) {
  return "" + (selector.replace(/\#\#/g, '')) + " {" + (properties.join('')) + "}\n";
};

window.fashion.$actualizer.cssTransitionTemplate = function(property, duration, easing, delay) {
  return "" + property + " " + (duration || '1s') + " " + (easing || '') + (delay ? ' ' + delay : '');
};
window.fashion.$runtimeCapability = {
  variables: "variables",
  scopedVariables: "scopedVariables",
  scopedSelector: "scopedVariableSelector",
  scopedIndividual: "scopedVariableIndividual",
  individualProps: "individualized",
  liveProps: "liveProperties",
  globals: "globals",
  watchedFunctions: "functionWatchers"
};

window.fashion.$actualizer.autoAddRequirements = function(runtimeData, parseTree) {
  var add, fName, fObj, name, variable, _ref, _ref1, _results;
  add = parseTree.addRequirements.bind(parseTree);
  if (JSON.stringify(runtimeData.variables) !== "{}") {
    add([$wf.$runtimeCapability.variables]);
    _ref = runtimeData.variables;
    for (name in _ref) {
      variable = _ref[name];
      if (variable.scopes.length > 0) {
        add([$wf.$runtimeCapability.scopedVariables]);
      }
    }
  }
  if ($wf.$actualizer.hasPropertyMode(parseTree.selectors, $wf.$runtimeMode.individual)) {
    add([$wf.$runtimeCapability.individualProps]);
  }
  if ($wf.$actualizer.hasPropertyMode(parseTree.selectors, $wf.$runtimeMode.live)) {
    add([$wf.$runtimeCapability.liveProps]);
  }
  if (JSON.stringify(runtimeData.modules.globals) !== "{}") {
    add([$wf.$runtimeCapability.globals]);
  }
  _ref1 = runtimeData.modules.functions;
  _results = [];
  for (fName in _ref1) {
    fObj = _ref1[fName];
    if (!(fObj.watch != null)) {
      continue;
    }
    add([$wf.$runtimeCapability.watchedFunctions]);
    break;
  }
  return _results;
};

window.fashion.$actualizer.hasPropertyMode = function(selectors, mode) {
  var id, pid, property, selectorBlock, _ref;
  for (id in selectors) {
    selectorBlock = selectors[id];
    _ref = selectorBlock.properties;
    for (pid in _ref) {
      property = _ref[pid];
      if ((property.mode & mode) === mode) {
        return true;
      }
    }
  }
  return false;
};

window.fashion.$actualizer.addRuntimeFunctions = function(runtimeData, parseTree) {
  var cid, f, functionName, ignoredPrefix, key, module, moduleName, name, _i, _len, _ref, _ref1, _results;
  if (!parseTree.requires) {
    return;
  }
  cid = 0;
  while (cid < parseTree.requires.length) {
    moduleName = parseTree.requires[cid++];
    if (moduleName === void 0) {
      continue;
    }
    module = $wf.$runtimeModules[moduleName];
    if (!module) {
      return console.log("[FASHION] Could not find module " + moduleName);
    }
    parseTree.addRequirements(module.requires);
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
  _ref1 = runtimeData.runtime;
  _results = [];
  for (name in _ref1) {
    f = _ref1[name];
    _results.push((function() {
      var _j, _len1, _ref2, _results1;
      _ref2 = $wf.ignoreRuntimePrefixes;
      _results1 = [];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        ignoredPrefix = _ref2[_j];
        if (name.indexOf(ignoredPrefix === 0)) {
          _results1.push(delete runtimeData.runtime[name]);
        } else {
          _results1.push(void 0);
        }
      }
      return _results1;
    })());
  }
  return _results;
};
window.fashion.$actualizer.hideIndividualizedSelectors = function(cssSelectors, scripts, indSels) {
  var hideSel, hideSelectors, id, joinedSelector, selector;
  hideSelectors = [];
  for (id in indSels) {
    selector = indSels[id];
    if (typeof selector.name === 'string') {
      hideSelectors.push(selector.rawName);
    }
  }
  if (!hideSelectors || hideSelectors.length < 1) {
    return;
  }
  joinedSelector = hideSelectors.join(",");
  hideSel = new Selector(joinedSelector, $wf.$runtimeMode["static"]);
  hideSel.addProperty(new Property("visibility", "hidden"));
  cssSelectors["hs"] = hideSel;

  /*
  	 * Figure out how many selectors there are so one can be added to the end
  	len = $wf.styleHeaderRules
  	len++ for key, value of cssSelectors
   */
  return scripts.push("FSREADY(function(){\n	ss = document.getElementById(FASHION.config.cssId);\n	var len = ss.sheet.reallength || ss.sheet.rules.length;\n	if(ss&&ss.sheet)ss.sheet.deleteRule(len - 1);\n});");
};
window.fashion.$actualizer.minifier = {
  runtimeData: function(runtimeData) {
    var $wfam, id, iid, s, sid, v;
    $wfam = window.fashion.$actualizer.minifier;
    sid = iid = 0;
    return [
      (function() {
        var _ref, _results;
        _ref = runtimeData.selectors;
        _results = [];
        for (id in _ref) {
          s = _ref[id];
          _results.push($wfam.selector(id, s));
        }
        return _results;
      })(), (function() {
        var _ref, _results;
        _ref = runtimeData.variables;
        _results = [];
        for (id in _ref) {
          v = _ref[id];
          _results.push($wfam.variable(v));
        }
        return _results;
      })(), (function() {
        var _ref, _results;
        _ref = runtimeData.individual;
        _results = [];
        for (id in _ref) {
          s = _ref[id];
          _results.push($wfam.selector(id, s));
        }
        return _results;
      })()
    ];
  },
  selector: function(id, selObj) {
    var $wfam, name, pid, properties, rawProperty, _ref;
    $wfam = window.fashion.$actualizer.minifier;
    if (!selObj || !(selObj instanceof Selector)) {
      return;
    }
    if (selObj.name instanceof Expression) {
      name = $wfam.expression(selObj.name);
    } else {
      name = selObj.name;
    }
    properties = [];
    _ref = selObj.properties;
    for (pid in _ref) {
      rawProperty = _ref[pid];
      properties.push($wfam.property(rawProperty));
    }
    return ["s", parseInt(id), selObj.rule, name, selObj.mode, properties];
  },
  property: function(propObj) {
    var $wfam, important, subVal, value, _i, _len, _ref;
    $wfam = window.fashion.$actualizer.minifier;
    if (!propObj || !(propObj instanceof Property)) {
      return;
    }
    if (propObj.value instanceof Array) {
      value = [];
      _ref = propObj.value;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subVal = _ref[_i];
        if (subVal instanceof Expression) {
          value.push($wfam.expression(subVal));
        } else {
          value.push(subVal);
        }
      }
    } else if (propObj.value instanceof Expression) {
      value = $wfam.expression(propObj.value);
    } else {
      value = propObj.value;
    }
    important = propObj.important ? 1 : 0;
    return ["p", propObj.name, propObj.mode, important, value];
  },
  expression: function(exprObj) {
    if (!exprObj || !(exprObj instanceof Expression)) {
      return;
    }
    return ["e", exprObj.mode, exprObj.type, exprObj.unit, exprObj.setter, exprObj.script];
  },
  variable: function(varObj) {
    var $wfam, defaultVal, hasValues, r, sel, vObj, values, _ref;
    $wfam = window.fashion.$actualizer.minifier;
    if (!varObj || !(varObj instanceof RuntimeVariable)) {
      return;
    }
    if (varObj["default"] instanceof Expression) {
      defaultVal = $wfam.expression(varObj["default"]);
    } else {
      defaultVal = varObj["default"];
    }
    values = {};
    hasValues = false;
    _ref = varObj.values;
    for (sel in _ref) {
      vObj = _ref[sel];
      hasValues = true;
      if (vObj instanceof Expression) {
        values[sel] = $wfam.expression(vObj);
      } else {
        values[sel] = vObj;
      }
    }
    r = ["v", varObj.name, varObj.type, varObj.unit, varObj.mode, defaultVal, varObj.dependents];
    if (hasValues) {
      r.push(values);
    }
    return r;
  }
};
window.fashion.$actualizer.minifier.expandRuntimeData = function(minData, expandTo) {
  var expand, expandObj, expanderFunctions, selector, selobj, variable, vobj, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
  expanderFunctions = {
    s: function(s) {
      return {
        rule: s[2],
        name: expand(s[3]),
        mode: s[4],
        properties: expand(s[5])
      };
    },
    p: function(p) {
      return {
        name: p[1],
        mode: p[2],
        important: p[3],
        value: expand(p[4])
      };
    },
    e: function(e) {
      return {
        mode: e[1],
        type: e[2],
        unit: e[3],
        setter: e[4],
        evaluate: Function("v", "g", "f", "t", "e", e[5])
      };
    },
    v: function(v) {
      return {
        name: v[1],
        type: v[2],
        unit: v[3],
        mode: v[4],
        "default": expand(v[5]),
        dependents: v[6],
        values: expandObj(v[7])
      };
    }
  };
  expand = function(vals) {
    var a, r, _i, _len;
    if (!(vals instanceof Array)) {
      return vals;
    }
    if (vals.length === 0) {
      return 0;
    }
    if (typeof vals[0] === 'string' && expanderFunctions[vals[0]]) {
      return expanderFunctions[vals[0]](vals);
    } else {
      r = [];
      for (_i = 0, _len = vals.length; _i < _len; _i++) {
        a = vals[_i];
        if (expanderFunctions[a[0]]) {
          r.push(expanderFunctions[a[0]](a));
        } else {
          r.push(a);
        }
      }
      return r;
    }
  };
  expandObj = function(valObj) {
    var a, k, r;
    if (!(typeof valObj === 'object')) {
      return valObj;
    }
    r = {};
    for (k in valObj) {
      a = valObj[k];
      if (expanderFunctions[a[0]]) {
        r[k] = expanderFunctions[a[0]](a);
      } else {
        r[k] = a;
      }
    }
    return r;
  };
  _ref = minData[0];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    selector = _ref[_i];
    selobj = expand(selector);
    selobj.sheet = "s";
    expandTo.selectors[selector[1]] = selobj;
  }
  _ref1 = minData[1];
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    variable = _ref1[_j];
    vobj = expand(variable);
    expandTo.variables[vobj.name] = vobj;
  }
  if (minData[2]) {
    _ref2 = minData[2];
    _results = [];
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      selector = _ref2[_k];
      selobj = expand(selector);
      selobj.sheet = "i";
      _results.push(expandTo.individual[selector[1]] = selobj);
    }
    return _results;
  }
};
var RuntimeModule;

RuntimeModule = (function() {
  function RuntimeModule(name, requires, functions) {
    var f, key;
    this.name = name;
    this.requires = requires;
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

window.fashion.addRuntimeModule = function(name, requires, functions) {
  return window.fashion.$runtimeModules[name] = new RuntimeModule(name, requires, functions);
};

$wf.addRuntimeModule("types", [], {
  determineType: window.fashion.$shared.determineType,
  getUnit: window.fashion.$shared.getUnit,
  timeInMs: window.fashion.$shared.timeInMs
});

$wf.addRuntimeModule("evaluation", [], {
  evaluate_Shared: window.fashion.$shared.evaluate,
  evaluate: function(value, element, extraVariables, extraArg) {
    var n, v, vars, _ref;
    if (extraVariables != null) {
      vars = extraVariables;
      _ref = FASHION.variables;
      for (n in _ref) {
        v = _ref[n];
        if (vars[n] == null) {
          vars[n] = v;
        }
      }
    } else {
      vars = FASHION.variables;
    }
    return this.evaluate_Shared(value, vars, FASHION.modules.globals, FASHION.modules.functions, FASHION.runtime, element, void 0, extraArg);
  }
});

$wf.addRuntimeModule("colors", [], window.fashion.color);

$wf.addRuntimeModule("errors", [], {
  throwError: function(message) {
    console.log("[FASHION] Runtime error: " + message);
    return console.log(new Error().stack);
  }
});

$wf.addRuntimeModule("wait", [], {
  wait: function(d, f) {
    return setTimeout(f, d);
  }
});
$wf.addRuntimeModule("variables", ["evaluation", "selectors", "types", "errors"], {
  getVariable: window.fashion.$shared.getVariable,
  variableValue: function(varName, element, scope) {
    return this.getVariable(FASHION.variables, FASHION.modules.globals, FASHION.modules.functions, FASHION.runtime, varName, scope, element).value;
  },
  setVariable: function(varName, value, scope, element) {
    var scopeElement, vObj;
    if (scope == null) {
      scope = 0;
    }
    vObj = FASHION.variables[varName];
    if (!vObj) {
      return this.throwError("Variable '$" + varName + "' does not exist");
    }
    if (vObj.mode === 0) {
      return this.throwError("Cannot change static variables");
    }
    if (scope !== 0 && (element != null)) {
      scopeElement = this.getParentForScope(element, scope);
      if (scopeElement) {
        return this.setScopedVariableOnElement(scopeElement, varName, value);
      }
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
    vObj.values[scope] = value;
    if (!scope || scope === 0) {
      vObj["default"] = value;
    }
    return this.regenerateVariableDependencies(varName, scope);
  },
  regenerateVariableDependencies: function(varName, scope) {
    var vObj;
    if (scope == null) {
      scope = 0;
    }
    vObj = FASHION.variables[varName];
    if (vObj.dependents[scope] == null) {
      return;
    }
    return this.regenerateBoundSelectors(vObj.dependents[scope]);
  },
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
  regenerateBoundSelectors: function(bindings) {
    var bindLink, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = bindings.length; _i < _len; _i++) {
      bindLink = bindings[_i];
      _results.push(this.regenerateBoundSelector(bindLink));
    }
    return _results;
  },
  regenerateBoundSelector: function(bindLink) {
    if (bindLink[0] === "v" && (this.regenerateVariableDependencies != null)) {
      return this.regenerateVariableDependencies(bindLink[1]);
    } else if (bindLink[0] === "w" && (this.watchFunctionBinding != null)) {
      return this.watchFunctionBinding(FASHION.modules.functions[bindLink[1]], bindLink[2]);
    } else if (bindLink.length === 3) {
      return this.setPropertyOnSelector(bindLink[0], bindLink[1], bindLink[2]);
    } else {
      return this.regenerateSelector(bindLink[0], bindLink[1]);
    }
  },
  setPropertyOnSelector: function(sheet, selectorId, propertyName) {
    var pObj, regex, replacement, rule, rules, selector, _i, _len, _ref, _results;
    if (sheet === "i") {
      return this.setPropertyOnIndividual(selectorId, propertyName);
    }
    selector = FASHION.selectors[selectorId];
    sheet = document.getElementById(FASHION.config.cssId).sheet;
    rules = sheet.rules || sheet.cssRules;
    rule = rules[this.countForIE(rules, selector.rule)];
    if (rule == null) {
      console.log("[FASHION] Could not find rule");
      console.log(selector);
    }
    _ref = selector.properties;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pObj = _ref[_i];
      if (this.makeCamelCase(pObj) === propertyName) {
        if (pObj.important) {
          regex = new RegExp(pObj.name + ":.*?\;", 'g');
          replacement = "" + pObj.name + ": " + (this.CSSRuleForProperty(pObj, void 0, true)) + ";";
          _results.push(rule.style.cssText = rule.style.cssText.replace(regex, replacement));
        } else {
          _results.push(rule.style[propertyName] = this.CSSRuleForProperty(pObj, void 0, true));
        }
      }
    }
    return _results;
  },
  regenerateSelector: function(sheet, selectorId) {
    var cssElem, ieIndex, selector, stylesheet;
    if (sheet === "i") {
      return this.regenerateIndividualSelector(selectorId);
    }
    selector = FASHION.selectors[selectorId];
    if (!selector) {
      return this.throwError("Selector " + selectorId + " does not exist");
    }
    cssElem = document.getElementById("" + FASHION.config.cssId);
    stylesheet = cssElem.sheet;
    stylesheet.deleteRule(selector.rule);
    ieIndex = this.countForIE(stylesheet.rules, selector.rule);
    return stylesheet.insertRule(this.CSSRuleForSelector(selector), ieIndex);
  },
  countForIE: function(rules, ruleNumber) {
    return ruleNumber;
  },

  /*
  		 * This is an easy task for most browsers
  		if !document.documentMode? then return ruleNumber
  
  		 * But IE gets confused by commas, much like a third grader
  		offs = 0
  		for i in [0...ruleNumber]
  			offs += rules[i].selectorText.split(",").length - 1
  		return offs + ruleNumber
   */
  CSSPropertyTemplate: window.fashion.$actualizer.cssPropertyTemplate,
  CSSSelectorTemplate: window.fashion.$actualizer.cssSelectorTemplate,
  CSSRuleForProperty: function(propertyObject, element, unwrapped) {
    var evalFunction, module, value;
    if (unwrapped == null) {
      unwrapped = false;
    }
    if (module = FASHION.modules.properties[propertyObject.name]) {
      evalFunction = this.evaluate.bind(this, propertyObject.value, element);
      if (!module.apply) {
        return;
      }
      module.apply.call(FASHION.runtime, element, propertyObject.value, evalFunction);
      if (module.replace) {
        return;
      }
    }
    value = this.evaluate(propertyObject.value, element);
    if (unwrapped) {
      return value + (propertyObject.important === 1 ? " !important" : "");
    } else {
      return this.CSSPropertyTemplate(propertyObject, value);
    }
  },
  CSSRuleForSelector: function(selector, element, name) {
    var cssProperties, pO, selectorName;
    selectorName = name || this.evaluate(selector.name, element);
    cssProperties = (function() {
      var _i, _len, _ref, _results;
      _ref = selector.properties;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pO = _ref[_i];
        _results.push(this.CSSRuleForProperty(pO, element));
      }
      return _results;
    }).call(this);
    return this.CSSSelectorTemplate(selectorName, cssProperties);
  },
  runtimeModes: window.fashion.$runtimeMode,
  makeCamelCase: function(propertyObject) {
    var cc, n;
    if ((propertyObject == null) || (propertyObject.name == null)) {
      return "";
    }
    if (propertyObject.jsName == null) {
      n = propertyObject.name;
      cc = n.replace(/-([a-z])/gi, function(full, letter) {
        return letter.toUpperCase();
      });
      propertyObject.jsName = cc;
    }
    return propertyObject.jsName;
  }
});
$wf.addRuntimeModule("individualized", ["selectors", "elements", "stylesheet-dom", "individualizedHelpers", "DOMWatcher"], {
  $initializeIndividualProperties: function() {
    var id, selector, _ref, _ref1;
    this.registerDomWatcher("addNodes", this.addedIndividualElements);
    FASHION.individualSheet = this.addStylesheet(FASHION.config.individualCSSID).sheet;
    _ref = FASHION.individual;
    for (id in _ref) {
      selector = _ref[id];
      this.updateSelectorElements(selector);
    }
    _ref1 = FASHION.individual;
    for (id in _ref1) {
      selector = _ref1[id];
      this.regenerateIndividualSelector(id);
    }
    window.FASHION.pageChanged = window.FASHION.domChanged = this.pageChanged.bind(this);
    window.FASHION.elementsRemoved = this.removedIndividualElements.bind(this);
    return window.FASHION.elementRemoved = (function(_this) {
      return function(element) {
        return _this.removedIndividualElements(_this.expandNodeList([element]));
      };
    })(this);
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
  setPropertyOnIndividual: function(selectorId, propertyName) {
    var id, individual, pObj, rule, selector, _i, _len, _ref, _ref1;
    selector = FASHION.individual[selectorId];
    _ref = selector.elements;
    for (id in _ref) {
      individual = _ref[id];
      if ((individual.cssid == null) || individual.cssid === -1) {
        this.regenerateElementSelector(selector, id, individual);
        continue;
      }
      rule = FASHION.individualSheet.rules[individual.cssid];
      _ref1 = selector.properties;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        pObj = _ref1[_i];
        if (this.makeCamelCase(pObj) === propertyName) {
          rule.style[propertyName] = this.CSSRuleForProperty(pObj, individual.element, true);
        }
      }
    }
  },
  regenerateIndividualSelector: function(selectorId) {
    var element, id, selector, _ref, _results;
    selector = FASHION.individual[selectorId];
    if (!selector) {
      this.throwError("Could not find individual selector " + selectorId);
    }
    if (this.evaluate(selector.name) !== selector.elementsSelector) {
      this.updateSelectorElements(selector);
    }
    _ref = selector.elements;
    _results = [];
    for (id in _ref) {
      element = _ref[id];
      _results.push(this.regenerateElementSelector(selector, id, element));
    }
    return _results;
  },
  regenerateElementSelector: function(selector, id, element) {
    var css, modifier, selectorName;
    if (id.match(/[\$\#\.]/)) {
      return;
    }
    if (element.cssid !== -1) {
      FASHION.individualSheet.deleteRule(element.cssid);
    } else {
      element.cssid = FASHION.individualSheet.rules.length;
    }
    selectorName = this.evaluate(selector.name, element);
    modifier = selectorName.match(/\:.*?$/);
    css = this.CSSRuleForSelector(selector, element.element, "#" + id + (modifier || ''));
    return FASHION.individualSheet.insertRule(css, element.cssid);
  },
  pageChanged: function(addedElements) {
    var element, id, matchedElements, selector, _i, _len, _ref;
    if (addedElements != null) {
      return this.addedIndividualElements(addedElements);
    }
    addedElements = [];
    _ref = FASHION.individual;
    for (id in _ref) {
      selector = _ref[id];
      matchedElements = this.elementsForSelector(selector.elementsSelector);
      for (_i = 0, _len = matchedElements.length; _i < _len; _i++) {
        element = matchedElements[_i];
        if (!selector.elements[element.id]) {
          addedElements.push(element);
        }
      }
    }
    return this.addedIndividualElements(addedElements);
  },
  addedIndividualElements: function(elements) {
    var element, id, indElement, indObj, _i, _len, _results;
    if (typeof FASHION === "undefined" || FASHION === null) {
      return;
    }
    _results = [];
    for (_i = 0, _len = elements.length; _i < _len; _i++) {
      element = elements[_i];
      if (element != null) {
        _results.push((function() {
          var _ref, _results1;
          _ref = FASHION.individual;
          _results1 = [];
          for (id in _ref) {
            indObj = _ref[id];
            if (!(!indObj.elements[element.id])) {
              continue;
            }
            if (!this.matches(element, indObj.name)) {
              continue;
            }
            if (!element.id) {
              element.setAttribute('id', this.generateRandomId());
            }
            indElement = {
              element: element,
              cssid: -1
            };
            indObj.elements[element.id] = indElement;
            _results1.push(this.regenerateElementSelector(indObj, element.id, indElement));
          }
          return _results1;
        }).call(this));
      }
    }
    return _results;
  },
  removedIndividualElements: function(elements) {
    var element, id, indObj, rules, _i, _len, _results;
    if (typeof FASHION === "undefined" || FASHION === null) {
      return;
    }
    _results = [];
    for (_i = 0, _len = elements.length; _i < _len; _i++) {
      element = elements[_i];
      if ((element != null) && (element.id != null)) {
        _results.push((function() {
          var _ref, _results1;
          _ref = FASHION.individual;
          _results1 = [];
          for (id in _ref) {
            indObj = _ref[id];
            if (!indObj.elements[element.id]) {
              continue;
            }
            rules = FASHION.individualSheet.rules || FASHION.individualSheet.cssRules;
            delete FASHION.elements[element.id];
            _results1.push(delete indObj.elements[element.id]);
          }
          return _results1;
        })());
      }
    }
    return _results;
  }
});

$wf.addRuntimeModule("individualizedHelpers", [], {
  matches: function(element, selector) {
    var prefixedFunction;
    if (typeof element === 'function') {
      element = element();
    }
    prefixedFunction = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector;
    if (!prefixedFunction) {
      return false;
    }
    return prefixedFunction.call(element, selector);
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
    selectorName = selectorName.replace(/:.*?$/, "");
    selectorName = selectorName.replace(/\#\#/g, "");
    return Array.prototype.slice.call(document.querySelectorAll(selectorName));
  }
});
$wf.addRuntimeModule("functionWatchers", ["selectors"], {
  $startFunctionWatchers: function() {
    var bindIndex, fObj, name, _ref, _results;
    _ref = FASHION.modules.functions;
    _results = [];
    for (name in _ref) {
      fObj = _ref[name];
      if (fObj.watcher != null) {
        _results.push((function() {
          var _results1;
          _results1 = [];
          for (bindIndex in fObj.dependents) {
            _results1.push(this.watchFunctionBinding(fObj, bindIndex));
          }
          return _results1;
        }).call(this));
      }
    }
    return _results;
  },
  createFunctionWatcherObject: function(bindLink) {
    var runtime, watcher;
    runtime = this;
    watcher = {
      invalidated: false
    };
    watcher.callback = function() {
      if (!watcher.invalidated) {
        return runtime.regenerateBoundSelector(bindLink);
      }
    };
    watcher.invalidate = function() {
      watcher.invalidated = true;
      if (watcher.destroy != null) {
        return watcher.destroy();
      }
    };
    return watcher;
  },
  watchFunctionBinding: function(fObj, bindIndex) {
    var bindLink, bindObj, watcher, watcherExpression;
    bindObj = fObj.dependents[bindIndex];
    watcherExpression = bindObj[0], bindLink = bindObj[1], watcher = bindObj[2];
    if (watcher != null) {
      watcher.invalidate();
    }
    watcher = this.createFunctionWatcherObject(bindLink);
    watcher.destroy = this.evaluate(watcherExpression, 0, void 0, watcher.callback);
    if (bindObj.length === 2) {
      return bindObj.push(watcher);
    } else {
      return bindObj[2] = watcher;
    }
  }
});
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

$wf.addRuntimeModule("DOMWatcher", [], {
  "$watchDom": function() {
    var observeFunction;
    if (window.FASHION_NO_OBSERVE === true) {
      return;
    }
    if ((window.MutationObserver == null) && (typeof WebKitMutationObserver !== "undefined" && WebKitMutationObserver !== null)) {
      window.MutationObserver = WebKitMutationObserver;
    }
    if (window.MutationObserver == null) {
      if (this.LEGACY_watchDomPolyfill) {
        return this.LEGACY_watchDomPolyfill();
      } else {
        return this.throwError("Failed to setup DOM watchers, cannot detect changes.");
      }
    }
    observeFunction = function(mutations) {
      var mutation, _i, _len;
      if ((window.FSOBSERVER == null) || (window.FASHION == null) || window.FASHION_NO_OBSERVE === true) {
        return;
      }
      for (_i = 0, _len = mutations.length; _i < _len; _i++) {
        mutation = mutations[_i];
        if (mutation.addedNodes.length > 0) {
          this.callDomGlobalWatchers("addNodes", this.expandNodeList(mutation.addedNodes));
        } else if (mutation.target != null) {
          this.callDomElementWatchers("changedNode", mutation.target);
        }
      }
      return true;
    };
    window.FSOBSERVER = new window.MutationObserver(function(mutations) {
      if ((window.FASHION == null) || (FASHION.runtime == null)) {
        return;
      }
      return observeFunction.call(FASHION.runtime, mutations);
    });
    return window.FSOBSERVER.observe(document.body, {
      childList: true,
      subtree: true
    });
  },
  "registerDomWatcher": function(type, handler, elementId) {
    if (!window.FSDOMWATCHERS) {
      window.FSDOMWATCHERS = {};
    }
    if (!window.FSDOMWATCHERS[type]) {
      window.FSDOMWATCHERS[type] = [];
    }
    return window.FSDOMWATCHERS[type].push([handler, elementId]);
  },
  "callDomGlobalWatchers": function(tag, nodes) {
    var f, _i, _len, _ref, _results;
    _ref = window.FSDOMWATCHERS[tag];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      f = _ref[_i];
      _results.push(f[0].call(FASHION.runtime, nodes));
    }
    return _results;
  },
  "callDomElementWatchers": function(tag, element) {
    var f, matchingIds, _i, _len, _ref, _ref1, _results;
    matchingIds = [element.id];
    while (element = element.parentNode) {
      matchingIds.push(element.id);
    }
    if (window.FSDOMWATCHERS[tag] == null) {
      return;
    }
    _ref = window.FSDOMWATCHERS[tag];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      f = _ref[_i];
      if (_ref1 = f[1], __indexOf.call(matchingIds, _ref1) >= 0) {
        _results.push(f[0].call(FASHION.runtime, element));
      }
    }
    return _results;
  },
  "expandNodeList": function(nodeList) {
    var addChildren, i, _i, _ref;
    nodeList = Array.prototype.slice.call(nodeList);
    addChildren = function(elm) {
      var child, _i, _len, _ref, _results;
      if ((elm == null) || (elm.children == null) || elm.children.length === 0) {
        return;
      }
      _ref = elm.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        nodeList.push(child);
        _results.push(addChildren(child));
      }
      return _results;
    };
    for (i = _i = _ref = nodeList.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
      addChildren(nodeList[i]);
    }
    return nodeList;
  },
  "LEGACY_watchDomPolyfill": function() {
    var changeEvents, evtName, _i, _len, _results;
    console.log("[FASHION] Installing DOM Observer Polyfill. Will impact performance!");
    document.body.addEventListener("DOMNodeInserted", ((function(_this) {
      return function(ev) {
        return _this.callDomGlobalWatchers("addNodes", _this.expandNodeList([ev.target]));
      };
    })(this)), false);
    changeEvents = ["DOMAttrModified", "DOMCharacterDataModified", "DOMElementNameChanged", "DOMAttributeNameChanged"];
    _results = [];
    for (_i = 0, _len = changeEvents.length; _i < _len; _i++) {
      evtName = changeEvents[_i];
      _results.push(document.body.addEventListener(evtName, ((function(_this) {
        return function(ev) {
          return _this.callDomElementWatchers("changedNode", ev.target);
        };
      })(this)), false));
    }
    return _results;
  }
});
$wf.addRuntimeModule("globals", ["selectors"], {
  $startGlobalWatchers: function() {
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
      if (!(global.watcher != null)) {
        continue;
      }
      global.watcher(onChangeFunction(global));
      _results.push(this.updateGlobal(global));
    }
    return _results;
  },
  updateGlobal: function(global) {
    if ((global == null) || (global.dependents == null)) {
      return;
    }
    return this.regenerateBoundSelectors(global.dependents);
  }
});
$wf.addRuntimeModule("elements", [], {
  elementFunction: function(element) {
    return (function(_this) {
      return function(property, keyword) {
        var parentProperty;
        if (element == null) {
          return;
        }
        if (property == null) {
          return element;
        }
        if (property.indexOf("parent") === 0) {
          if (property === "parent") {
            return element.parentNode;
          }
          parentProperty = property.replace("parent.", "");
          return _this.elementFunction(element.parentNode)(parentProperty);
        }
        if (property === "width") {
          return element.clientWidth;
        }
        if (property === "height") {
          return element.clientHeight;
        }
        if (property === "offsetTop") {
          return element.offsetTop;
        }
        if (property === "offsetBottom") {
          return element.offsetBottom;
        }
        if (property === "offsetLeft") {
          return element.offsetLeft;
        }
        if (property === "offsetRight") {
          return element.offsetRight;
        }
        return _this.getFashionAttribute(element, property) || element.getAttribute(property);
      };
    })(this);
  },
  setFashionAttribute: function(element, key, value) {
    if (typeof element !== 'string') {
      element = element.id;
    }
    if (!window.FASHION.elements[element]) {
      window.FASHION.elements[element] = {};
    }
    return window.FASHION.elements[element][key] = value;
  },
  getFashionAttribute: function(element, key) {
    var _ref;
    if (typeof element !== 'string') {
      element = element.id;
    }
    if (!window.FASHION.elements[element]) {
      void 0;
    }
    return (_ref = window.FASHION.elements[element]) != null ? _ref[key] : void 0;
  }
});
$wf.addRuntimeModule("stylesheet-dom", [], {
  addStylesheet: function(id, className) {
    var head, sheetElement;
    sheetElement = document.createElement("style");
    sheetElement.setAttribute("type", "text/css");
    if (id) {
      sheetElement.setAttribute("id", id);
    }
    if (className) {
      sheetElement.setAttribute("class", className);
    }
    head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(sheetElement);
    sheetElement.sheet.rules = sheetElement.sheet.rules || sheetElement.sheet.cssRules;
    return sheetElement;
  },
  removeStylesheet: function(element) {
    if (!element || !element.parentNode) {
      return;
    }
    return element.parentNode.removeChild(element);
  },
  getStylesheet: function(id) {
    var ss;
    if (ss = document.getElementById(id)) {
      return ss;
    } else {
      return this.addStylesheet(id);
    }
  }
});

$wf.addRuntimeModule("sheets", ["stylesheet-dom"], {
  moveSheetToTop: function(sheet) {
    var head;
    head = document.head || document.getElementsByTagName('head')[0];
    if (head.lastChild === sheet) {
      return;
    }
    this.removeStylesheet(sheet);
    return head.appendChild(sheet);
  },
  setRuleOnSheet: function(sheet, selector, property, value, prioritize) {
    var id, rule, ruleText, _ref;
    if (prioritize == null) {
      prioritize = true;
    }
    if (sheet instanceof HTMLStyleElement) {
      sheet = sheet.sheet;
    }
    if (!sheet.rules) {
      sheet.rules = sheet.cssRules;
    }
    _ref = sheet.rules;
    for (id in _ref) {
      rule = _ref[id];
      if (!(rule.selectorText === selector)) {
        continue;
      }
      rule.style.setProperty(property, value);
      if (prioritize) {
        ruleText = rule.cssText;
        sheet.deleteRule(id);
        sheet.insertRule(ruleText, 0);
      }
      return;
    }
    return sheet.insertRule("" + selector + " {" + property + ": " + value + ";}", sheet.rules.length);
  }
});


/*
	 * Fix for IE9 and IE10 that makes them actually edit the right CSS values
	$IEFix: ()->

		if !document.documentMode? then return
		if document.documentMode < 9 then return
		console.log "[FASHION] Overriding CSSStyleSheet Functions to fix IE silliness"
		console.log "[FASHION] This will impact performance!"

		 * Switcheroo
		realInsertRule = CSSStyleSheet.prototype.insertRule
		CSSStyleSheet.prototype.insertRule = (rule, index)->
			console.log this.rules.length
			element = document.getElementById(this.id)
			rules = element.innerHTML.split("}")
			if rules.length is 0 then return element.innerHTML = rule
			rules.splice(Math.max(index, this.rules.length - 1), 0, rule.replace("}",""))
			element.innerHTML = rules.join("}")
 */
;$wf.addRuntimeModule("scopedVariables", ["evaluation", "elements", "stylesheet-dom", "variables", "individualizedHelpers"], {
  "getParentForScope": function(element, scope) {
    if (typeof element === 'function') {
      element = element();
    }
    while (element != null) {
      if (this.matches(element, scope)) {
        return element;
      }
      element = element.parentNode;
    }
    return void 0;
  },
  "getScopeOverride": function(element, varName, scope) {
    var scopeElement, val;
    scopeElement = this.getParentForScope(element, scope);
    if (!scopeElement) {
      return void 0;
    }
    val = this.getFashionAttribute(scopeElement, "$" + varName);
    return [this.elementFunction(scopeElement), val];
  },
  "setScopedVariableOnElement": function(element, varName, value) {
    var bindLink, nVal, scope, vObj, _ref, _results;
    if (typeof element === 'function') {
      element = element();
    }
    this.setFashionAttribute(element, "$" + varName, value);
    vObj = FASHION.variables[varName];
    _ref = vObj.values;
    _results = [];
    for (scope in _ref) {
      value = _ref[scope];
      if (scope !== '0') {
        if (this.matches(element, scope)) {
          this.regenerateVariableDependencies(varName, scope);
          if (vObj.dependents[scope] == null) {
            continue;
          }
          _results.push((function() {
            var _i, _len, _ref1, _results1;
            _ref1 = vObj.dependents[scope];
            _results1 = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              bindLink = _ref1[_i];
              if (bindLink[0] === 'v') {
                nVal = this.variableValue(bindLink[1], this.elementFunction(element), scope);
                _results1.push(this.setScopedVariableOnElement(element, bindLink[1], nVal));
              } else if (bindLink[0] === 'i') {
                if (this.addIndividualScopedSelectorOverride == null) {
                  continue;
                }
                _results1.push(this.addIndividualScopedSelectorOverride(bindLink[1], element));
              } else {
                if (this.addScopedSelectorOverride == null) {
                  continue;
                }
                _results1.push(this.addScopedSelectorOverride(bindLink[1], element));
              }
            }
            return _results1;
          }).call(this));
        } else {
          _results.push(void 0);
        }
      }
    }
    return _results;
  },
  "getScopedVariableOnElement": function(element, varName) {
    var scope, v, vObj, value, _ref;
    vObj = FASHION.variables[varName];
    while (true) {
      _ref = vObj.values;
      for (scope in _ref) {
        value = _ref[scope];
        if (!(scope !== '0' && this.matches(element, scope))) {
          continue;
        }
        if (v = this.getScopeOverride(element, varName, scope)[1]) {
          return v;
        }
        if (value != null) {
          return value;
        }
      }
      if (!(element = element.parentNode)) {
        break;
      }
    }
    return this.variableValue(varName, element);
  },
  "$initializeScoped": function() {
    var indMode, scope, vObj, val, varName, _ref, _results;
    window.FASHION.setElementVariable = this.setScopedVariableOnElement.bind(FASHION.runtime);
    window.FASHION.getElementVariable = this.getScopedVariableOnElement.bind(FASHION.runtime);
    indMode = this.runtimeModes.individual;
    _ref = FASHION.variables;
    _results = [];
    for (varName in _ref) {
      vObj = _ref[varName];
      _results.push((function() {
        var _ref1, _results1;
        _ref1 = vObj.values;
        _results1 = [];
        for (scope in _ref1) {
          val = _ref1[scope];
          if (scope !== '0') {
            if ((val != null) && (val.evaluate != null) && (val.mode & indMode) === indMode) {
              _results1.push(this.initializeIndividualScope(varName, scope));
            } else {
              _results1.push(void 0);
            }
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
  }
});

$wf.addRuntimeModule("scopedVariableSelector", ["scopedVariables", "sheets", "selectors"], {
  "addScopedSelectorOverride": function(selectorId, element) {
    var name, rule, selector, sheet;
    selector = FASHION.selectors[selectorId];
    name = this.getScopedSelectorName(selector, element);
    rule = this.CSSRuleForSelector(selector, element, name);
    sheet = this.getStylesheet(FASHION.config.scopedCSSID).sheet;
    sheet.rules = sheet.rules || sheet.cssRules;
    if (!selector.scopedRules) {
      selector.scopedRules = {};
    }
    if (selector.scopedRules[element.id] == null) {
      selector.scopedRules[element.id] = sheet.rules.length;
    } else {
      sheet.deleteRule(selector.scopedRules[element.id]);
    }
    return sheet.insertRule(rule, selector.scopedRules[element.id]);
  },
  "addIndividualScopedSelectorOverride": function(selectorId, element) {
    var matchElement, matches, name, rule, selector, sheet, sheetId, _i, _len;
    selector = FASHION.individual[selectorId];
    if (!selector) {
      this.throwError("Could not find individual selector " + selectorId);
    }
    if (!selector.scopedRules) {
      selector.scopedRules = {};
    }
    if (selector.scopedRules[element.id] != null) {
      sheet = document.getElementById(selector.scopedRules[element.id]);
      sheet.parentNode.removeChild(sheet);
    }
    name = this.getScopedSelectorName(selector, element);
    matches = this.elementsForSelector(name);
    if (matches.length === 0) {
      return;
    }
    sheetId = FASHION.config.scopedIndCSSPrefix + this.generateRandomId();
    sheet = this.addStylesheet(sheetId, FASHION.config.scopedCSSID).sheet;
    selector.scopedRules[element.id] = sheetId;
    for (_i = 0, _len = matches.length; _i < _len; _i++) {
      matchElement = matches[_i];
      rule = this.CSSRuleForSelector(selector, matchElement, name);
      sheet.insertRule(rule, 0);
    }
    return '';
  },
  "getScopedSelectorName": function(selector, element) {
    var name;
    if (typeof element === 'string') {
      element = document.getElementById(element);
    }
    name = this.evaluate(selector.name, element);
    name = name.replace(/\#\#/g, "#" + element.id);
    return name;
  }
});

$wf.addRuntimeModule("scopedVariableIndividual", ["scopedVariables", "DOMWatcher"], {
  "initializeIndividualScope": function(varName, scope) {
    var element, scopeVal, value, variable, _i, _len, _ref, _results;
    variable = FASHION.variables[varName];
    scopeVal = variable.values[scope];
    _ref = this.elementsForSelector(scope);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      if (!element.id) {
        element.setAttribute('id', this.generateRandomId());
      }
      value = this.evaluate(scopeVal, element);
      _results.push(this.setScopedVariableOnElement(element, varName, value));
    }
    return _results;
  },
  "addedIndividualScopedElements": function(elements) {
    var element, indMode, indValue, scope, vObj, val, varName, _ref, _results;
    indMode = this.runtimeModes.individual;
    _ref = FASHION.variables;
    _results = [];
    for (varName in _ref) {
      vObj = _ref[varName];
      _results.push((function() {
        var _ref1, _results1;
        _ref1 = vObj.values;
        _results1 = [];
        for (scope in _ref1) {
          val = _ref1[scope];
          if (scope !== '0') {
            if ((val != null) && (val.evaluate != null) && (val.mode & indMode) === indMode) {
              _results1.push((function() {
                var _i, _len, _results2;
                _results2 = [];
                for (_i = 0, _len = elements.length; _i < _len; _i++) {
                  element = elements[_i];
                  if (!(this.matches(element, scope))) {
                    continue;
                  }
                  if (!element.id) {
                    element.setAttribute('id', this.generateRandomId());
                  }
                  indValue = this.evaluate(val, element);
                  _results2.push(this.setScopedVariableOnElement(element, varName, indValue));
                }
                return _results2;
              }).call(this));
            } else {
              _results1.push(void 0);
            }
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
  },
  "$registerScopedVariableIndividual": function() {
    return this.registerDomWatcher("addNodes", this.addedIndividualScopedElements);
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
  }),
  toggle: new FunctionModule({
    output: $wf.$type.Number,
    unitFrom: 0,
    evaluate: function(currentVar, offValue, onValue) {
      if (currentVar.value === offValue.value) {
        return onValue.value;
      } else {
        return offValue.value;
      }
    }
  }),
  set: new FunctionModule({
    output: $wf.$type.None,
    capabilities: ["variables", "types"],
    evaluate: function(varName, value, delay) {
      return setTimeout((function(_this) {
        return function() {
          return _this.setVariable(varName.value, value.value);
        };
      })(this), this.timeInMs(delay));
    }
  })
};
$wf.$extend(window.fashion.$functions, {
  "@": new FunctionModule({
    output: $wf.$type.Number,
    unit: '',
    dynamic: true,
    requires: ["DOMWatcher"],
    evaluate: function(selector, property, element) {
      var matched, style;
      if (!element) {
        element = document;
      }
      matched = this.querySelector(selector.value);
      style = this.getComputedStyle(matched);
      return style[property.value];
    },
    watch: function(selector, property, element) {
      return console.log(arguments);
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
  }),
  "hsl": new FunctionModule({
    output: $wf.$type.Color,
    evaluate: function(h, s, l) {
      return "hsl(" + (parseInt(h.value)) + "," + (parseInt(s.value)) + "%," + (parseInt(l.value)) + "%)";
    }
  }),
  "hsla": new FunctionModule({
    output: $wf.$type.Color,
    evaluate: function(h, s, l, a) {
      return "hsla(" + (parseInt(h.value)) + "," + (parseInt(s.value)) + "%," + (parseInt(l.value)) + "%," + a.value + ")";
    }
  }),
  "hsb": new FunctionModule({
    output: $wf.$type.Color,
    requires: ["colors"],
    evaluate: function(h, s, b) {
      var g, r, _ref;
      _ref = this.hsbTOrgb(h.value, s.value, b.value), r = _ref.r, g = _ref.g, b = _ref.b;
      return "rgb(" + (parseInt(r)) + "," + (parseInt(g)) + "," + (parseInt(b)) + ")";
    }
  }),
  "hsba": new FunctionModule({
    output: $wf.$type.Color,
    requires: ["colors"],
    evaluate: function(h, s, b, a) {
      var g, r, _ref;
      _ref = this.hsbTOrgb(h.value, s.value, b.value), r = _ref.r, g = _ref.g, b = _ref.b;
      return "rgba(" + (parseInt(r)) + "," + (parseInt(g)) + "," + (parseInt(b)) + "," + a.value + ")";
    }
  }),
  "randomColor": new FunctionModule({
    output: $wf.$type.Color,
    watch: function(rate, c) {
      var i;
      if (!rate.value) {
        return;
      }
      i = setInterval(c, rate.value);
      return function() {
        return clearInterval(i);
      };
    },
    evaluate: function(rate) {
      var b, g, r, _ref;
      _ref = [Math.random() * 255, Math.random() * 255, Math.random() * 255], r = _ref[0], g = _ref[1], b = _ref[2];
      return "rgb(" + (parseInt(r)) + "," + (parseInt(g)) + "," + (parseInt(b)) + ")";
    }
  }),
  "randomBrightColor": new FunctionModule({
    output: $wf.$type.Color,
    requires: ["colors"],
    watch: function(rate, c) {
      var i;
      if (!rate.value) {
        return;
      }
      i = setInterval(c, rate.value);
      return function() {
        return clearInterval(i);
      };
    },
    evaluate: function(rate) {
      var b, g, r, randomHue, _ref;
      randomHue = Math.random() * 360;
      _ref = this.hsbTOrgb(randomHue, 80, 80), r = _ref.r, g = _ref.g, b = _ref.b;
      return "rgb(" + (parseInt(r)) + "," + (parseInt(g)) + "," + (parseInt(b)) + ")";
    }
  }),
  "randomDarkColor": new FunctionModule({
    output: $wf.$type.Color,
    requires: ["colors"],
    watch: function(rate, c) {
      var i;
      if (!rate.value) {
        return;
      }
      i = setInterval(c, rate.value);
      return function() {
        return clearInterval(i);
      };
    },
    evaluate: function(rate) {
      var b, g, r, randomHue, _ref;
      randomHue = Math.random() * 360;
      _ref = this.hsbTOrgb(randomHue, 80, 30), r = _ref.r, g = _ref.g, b = _ref.b;
      return "rgb(" + (parseInt(r)) + "," + (parseInt(g)) + "," + (parseInt(b)) + ")";
    }
  }),
  "changeAlpha": new FunctionModule({
    output: window.fashion.$type.Color,
    requires: ["colors"],
    evaluate: function(color, newAlpha) {
      var c;
      c = this.cssTOjs(color.value, this);
      return "rgba(" + c.r + "," + c.g + "," + c.b + "," + newAlpha.value + ")";
    }
  }),
  "invert": new FunctionModule({
    output: window.fashion.$type.Color,
    requires: ["colors"],
    evaluate: function(color) {
      var c;
      c = this.cssTOjs(color.value, this);
      c.r = parseInt(255 - c.r);
      c.g = parseInt(255 - c.g);
      c.b = parseInt(255 - c.b);
      return "rgba(" + c.r + "," + c.g + "," + c.b + "," + (c.a || 1) + ")";
    }
  }),
  "brighten": new FunctionModule({
    output: window.fashion.$type.Color,
    requires: ["colors"],
    evaluate: function(color, brightenPercent) {
      var adj, c, percent;
      percent = brightenPercent.value;
      adj = (percent > 1 ? percent / 100 : percent);
      c = this.cssTOjs(color.value, this);
      c.r = parseInt(Math.min(c.r + (255 - c.r) * adj, 255));
      c.g = parseInt(Math.min(c.g + (255 - c.g) * adj, 255));
      c.b = parseInt(Math.min(c.b + (255 - c.b) * adj, 255));
      return "rgba(" + c.r + "," + c.g + "," + c.b + "," + (c.a || 1) + ")";
    }
  }),
  "darken": new FunctionModule({
    output: window.fashion.$type.Color,
    requires: ["colors"],
    evaluate: function(color, darkenPercent) {
      var adj, c, percent;
      percent = darkenPercent.value;
      adj = 1 - (percent > 1 ? percent / 100 : percent);
      c = this.cssTOjs(color.value, this);
      c.r = parseInt(Math.max(c.r * adj, 0));
      c.g = parseInt(Math.max(c.g * adj, 0));
      c.b = parseInt(Math.max(c.b * adj, 0));
      return "rgba(" + c.r + "," + c.g + "," + c.b + "," + (c.a || 1) + ")";
    }
  })
});
$wf.$extend(window.fashion.$functions, new ((function() {
  function _Class() {
    var genericPassthrough, name, transformFunction, _i, _len;
    transformFunction = ["matrix", "matrix3d", "translate", "translate3d", "translateX", "translateY", "translateZ", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "rotate", "rotate3d", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY", "perspective"];
    genericPassthrough = function(name) {
      var body;
      body = "var a = arguments;\nvar s = \"" + name + "(\";\nfor(var i = 0; i < a.length; i++){\n	s += a[i].value + \"px\";\n	if(i<a.length-1)s += \",\";\n}\nreturn s + \")\";";
      return new Function(body);
    };
    for (_i = 0, _len = transformFunction.length; _i < _len; _i++) {
      name = transformFunction[_i];
      this[name] = new FunctionModule({
        mode: $wf.$runtimeMode["static"],
        output: $wf.$type.String,
        "evaluate": genericPassthrough(name)
      });
    }
  }

  return _Class;

})()));

$wf.$extend(window.fashion.$functions, new ((function() {
  function _Class() {
    var genericPassthrough, gradientFunctions, name, _i, _len;
    gradientFunctions = ["-webkit-linear-gradient", "-moz-linear-gradient", "-ms-linear-gradient", "-o-linear-gradient", "linear-gradient", "-webkit-radial-gradient", "-moz-radial-gradient", "-ms-radial-gradient", "-o-radial-gradient", "radial-gradient"];
    genericPassthrough = function(name) {
      var body;
      body = "var a = arguments;\nvar s = \"" + name + "(\";\nfor(var i = 0; i < a.length; i++){\n	s += a[i].value;\n	if(i<a.length-1)s += \",\";\n}\nreturn s + \")\";";
      return new Function(body);
    };
    for (_i = 0, _len = gradientFunctions.length; _i < _len; _i++) {
      name = gradientFunctions[_i];
      this[name] = new FunctionModule({
        mode: $wf.$runtimeMode["static"],
        output: $wf.$type.String,
        "evaluate": genericPassthrough(name)
      });
    }
  }

  return _Class;

})()));

$wf.$extend(window.fashion.$functions, new ((function() {
  function _Class() {
    var cssFunctions, genericPassthrough, name, _i, _len;
    cssFunctions = ["url", "calc"];
    genericPassthrough = function(name) {
      var body;
      body = "var a = arguments;\nvar s = \"" + name + "(\";\nfor(var i = 0; i < a.length; i++){\n	s += a[i].value;\n	if(i<a.length-1)s += \",\";\n}\nreturn s + \")\";";
      return new Function(body);
    };
    for (_i = 0, _len = cssFunctions.length; _i < _len; _i++) {
      name = cssFunctions[_i];
      this[name] = new FunctionModule({
        mode: $wf.$runtimeMode["static"],
        output: $wf.$type.String,
        "evaluate": genericPassthrough(name)
      });
    }
  }

  return _Class;

})()));
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
              families.push("serif");
              break;
            case "sans-serif":
              families.push("sans-serif");
              break;
            case "monospace":
              families.push("monospace");
              break;
            case "italic":
              _this.setProperty("font-style", "italic");
              break;
            case "oblique":
              _this.setProperty("font-style", "oblique");
              break;
            case "bold":
              _this.setProperty("font-weight", "bolder");
              break;
            case "light":
              _this.setProperty("font-weight", "lighter");
              break;
            case "underline":
              _this.setProperty("text-decoration", "underline");
              break;
            case "overline":
              _this.setProperty("text-decoration", "overline");
              break;
            case "line-through":
              _this.setProperty("text-decoration", "line-through");
              break;
            case "strikethrough":
              _this.setProperty("text-decoration", "line-through");
          }
          if (value.indexOf("pt") !== -1 || value.indexOf("px") !== -1) {
            return _this.setProperty("font-size", value);
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
            leftExpr = "@self.parent.width / 2 - @self.width / 2";
            return topExpr = "@self.parent.height / 2 - @self.height / 2";
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
    var applyForCaughtEvent, applyForPropogatedEvent, caughtEvents, evt, propogatedEvents, _i, _j, _len, _len1;
    caughtEvents = ["click", "dblclick", "mousedown", "mouseup", "drag", "dragdrop", "dragend", "drop", "blur", "change", "focus", "focusin", "focusout", "submit", "reset", "keydown", "keyup"];
    applyForCaughtEvent = function(evt) {
      var body;
      body = "if(this.getFashionAttribute(element,'data-hastrigger-" + evt + "'))return;\nelement.addEventListener('" + evt + "', function(eo){\n	eo.stopPropagation();\n	evaluate();\n}, false);\nthis.setFashionAttribute(element, 'data-hastrigger-" + evt + "', 'true');";
      return new Function("element", "value", "evaluate", body);
    };
    for (_i = 0, _len = caughtEvents.length; _i < _len; _i++) {
      evt = caughtEvents[_i];
      this["on-" + evt] = new PropertyModule({
        replace: true,
        mode: $wf.$runtimeMode.triggered | $wf.$runtimeMode.individual,
        "apply": applyForCaughtEvent(evt)
      });
    }
    propogatedEvents = ["mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "dragenter", "dragexit", "draggesture", "dragleave", "dragover", "dragstart"];
    applyForPropogatedEvent = function(evt) {
      var body;
      body = "if(this.getFashionAttribute(element,'data-hastrigger-" + evt + "'))return;\nelement.addEventListener('" + evt + "', evaluate, false);\nthis.setFashionAttribute(element, 'data-hastrigger-" + evt + "', 'true');";
      return new Function("element", "value", "evaluate", body);
    };
    for (_j = 0, _len1 = propogatedEvents.length; _j < _len1; _j++) {
      evt = propogatedEvents[_j];
      this["on-" + evt] = new PropertyModule({
        replace: true,
        mode: $wf.$runtimeMode.triggered | $wf.$runtimeMode.individual,
        "apply": applyForPropogatedEvent(evt)
      });
    }
  }

  return _Class;

})()));
$wf.$parser.parseColorStops = function(colorValues) {
  var color, id, stop, value, _results;
  _results = [];
  for (id in colorValues) {
    value = colorValues[id];
    color = "";
    stop = 100 * (id / (colorValues.length - 1));
    if (value.length === 2) {
      color = value[0], stop = value[1];
    } else {
      color = value[0];
    }
    _results.push(color + " " + stop + "%");
  }
  return _results;
};

$wf.$extend(window.fashion.$properties, {
  "gradient-vertical": new PropertyModule({
    replace: true,
    compile: function(values) {
      var colorStops, grd;
      colorStops = $wf.$parser.parseColorStops(values);
      grd = "-webkit-linear-gradient(top, " + (colorStops.join(',')) + ")";
      this.setProperty("background", grd);
      grd = "-moz-linear-gradient(top, " + (colorStops.join(',')) + ")";
      this.setProperty("background", grd);
      grd = "-ms-linear-gradient(top, " + (colorStops.join(',')) + ")";
      this.setProperty("background", grd);
      grd = "-o-linear-gradient(top, " + (colorStops.join(',')) + ")";
      this.setProperty("background", grd);
      grd = "linear-gradient(to bottom, " + (colorStops.join(',')) + ")";
      return this.setProperty("background", grd);
    }
  }),
  "gradient-horizontal": new PropertyModule({
    replace: true,
    compile: function(values) {
      var colorStops, grd;
      colorStops = $wf.$parser.parseColorStops(values);
      grd = "-webkit-linear-gradient(left, " + (colorStops.join(',')) + ")";
      this.setProperty("background", grd);
      grd = "-moz-linear-gradient(left, " + (colorStops.join(',')) + ")";
      this.setProperty("background", grd);
      grd = "-ms-linear-gradient(left, " + (colorStops.join(',')) + ")";
      this.setProperty("background", grd);
      grd = "-o-linear-gradient(left, " + (colorStops.join(',')) + ")";
      this.setProperty("background", grd);
      grd = "linear-gradient(to right, " + (colorStops.join(',')) + ")";
      return this.setProperty("background", grd);
    }
  }),
  "gradient-radial": new PropertyModule({
    replace: true,
    compile: function(values) {
      var colorStops, grd;
      colorStops = $wf.$parser.parseColorStops(values);
      grd = "-webkit-radial-gradient(center, ellipse cover, " + (colorStops.join(',')) + ")";
      this.setProperty("background", grd);
      grd = "-moz-radial-gradient(center, ellipse cover, " + (colorStops.join(',')) + ")";
      this.setProperty("background", grd);
      grd = "-ms-radial-gradient(center, ellipse cover, " + (colorStops.join(',')) + ")";
      this.setProperty("background", grd);
      grd = "-o-radial-gradient(center, ellipse cover, " + (colorStops.join(',')) + ")";
      this.setProperty("background", grd);
      grd = "radial-gradient(ellipse at center, " + (colorStops.join(',')) + ")";
      return this.setProperty("background", grd);
    }
  })
});
$wf.$extend(window.fashion.$properties, {
  "set-attribute": new PropertyModule({
    replace: true,
    mode: window.fashion.$runtimeMode.individual,
    apply: function(element, value, evaluate) {
      var attribute, _ref;
      _ref = evaluate().split(" "), attribute = _ref[0], value = _ref[1];
      attribute = attribute.replace(/[\'\"]/g, "");
      return element.setAttribute(attribute, value);
    }
  }),
  "canvas-render": new PropertyModule({
    replace: true,
    mode: window.fashion.$runtimeMode.individual,
    apply: function(element, value, evaluate) {
      
			//shim layer with setTimeout fallback
			window.requestAnimFrame = (function(){
			  return  window.requestAnimationFrame       ||
			          window.webkitRequestAnimationFrame ||
			          window.mozRequestAnimationFrame    ||
			          function( callback ){
			            window.setTimeout(callback, 1000 / 60);
			          };
			})();
			;
      var rateLimitedEvaluate;
      rateLimitedEvaluate = function() {
        var lrt;
        if (!element.getAttribute("last-render-time")) {
          element.setAttribute("last-render-time", new Date().getTime());
          evaluate();
        } else {
          lrt = parseInt(element.getAttribute("last-render-time"));
          if ((new Date().getTime()) - lrt > 1000 / 60) {
            evaluate();
          }
        }
        return window.requestAnimFrame(rateLimitedEvaluate.bind(this));
      };
      return rateLimitedEvaluate();
    }
  }),
  "text-content": new PropertyModule({
    replace: true,
    mode: window.fashion.$runtimeMode.individual,
    apply: function(element, value, evaluate) {
      element.innerText = evaluate();
      return element.textContent = evaluate();
    }
  }),
  "value": new PropertyModule({
    replace: true,
    mode: window.fashion.$runtimeMode.individual,
    apply: function(element, value, evaluate) {
      return element.value = evaluate();
    }
  })
});
window.fashion.$blocks = {};
window.fashion.$blocks["transition"] = new BlockModule({
  capabilities: ["transitionBlock"],
  compile: function(args, body) {
    var acc, count, currentKeyframe, depth, keyframe, keyframes, lastAcc, name, parsedBody, regex, segment, transition;
    name = args[0];
    regex = /(\s*([0-9\-\.\s\%]+?\%|start|begin|finish)\s?\{|\$([\w\-]+)\:[\s]*(.*?)[;\n]|\}|\{)/g;
    keyframes = {};
    transition = {};
    depth = lastAcc = 0;
    currentKeyframe = acc = "";
    count = 1000;
    while (--count > 0 && (segment = regex.exec(body))) {
      acc += body.substring(lastAcc, segment.index);
      lastAcc = segment.index;
      if (segment[2] && depth === 0) {
        currentKeyframe = segment[2];
        if (segment[2].indexOf("-") > 0) {
          this.requireModule("transitionRangeBlock");
        }
        depth++;
        acc = "";
        lastAcc = segment[0].length + segment.index;
      }
      if (segment[3] && segment[4] && depth === 0) {
        if (!transition['$vars']) {
          transition['$vars'] = [];
        }
        transition['$vars'].push(segment[3]);
        this.addVariable(segment[3], segment[4]);
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
    for (keyframe in keyframes) {
      body = keyframes[keyframe];
      parsedBody = this.parse(body);
      delete parsedBody.variables;
      transition[keyframe] = parsedBody;
    }
    return this.runtimeObject.transitions[name] = transition;
  },
  runtimeObject: {
    transitions: {}
  }
});

$wf.addRuntimeModule("transitionBlock", ["wait", "selectors", "types", "sheets"], {
  transitionTiming: {
    start: 10,
    end: 5,
    settle: 1
  },
  triggerTransition: function(name, duration, variables) {
    var d, keyframe, parseTree, propertySheet, transition, transitionSheet;
    duration = this.timeInMs(duration);
    transition = FASHION.modules.blocks.transition.transitions[name];
    if (transition == null) {
      return this.throwError("Transition '" + name + "' does not exist");
    }
    transitionSheet = this.addStylesheet(void 0, "FASHION-transition::temporary-" + name);
    propertySheet = this.getStylesheet("FASHION-transition::properties-" + name);
    this.moveSheetToTop(propertySheet);
    for (keyframe in transition) {
      parseTree = transition[keyframe];
      if (!(keyframe[0] !== '$')) {
        continue;
      }
      this.transitionDelayTriggers(duration, variables, keyframe, parseTree.blocks);
      this.transitionDelaySelectors(duration, variables, keyframe, transitionSheet, parseTree.selectors);
    }
    d = duration + this.transitionTiming.start + this.transitionTiming.end;
    return this.wait(d, (function(_this) {
      return function() {
        return _this.removeStylesheet(transitionSheet);
      };
    })(this));
  },
  transitionDelayTriggers: function(duration, variables, keyframe, blocks) {
    var block, name, startTime, transDuration, _i, _len, _ref, _results;
    startTime = this.transitionStartTime(duration, keyframe);
    _results = [];
    for (_i = 0, _len = blocks.length; _i < _len; _i++) {
      block = blocks[_i];
      if (!(block.type === "trigger")) {
        continue;
      }
      _ref = block["arguments"], name = _ref[0], transDuration = _ref[1];
      if (name[0] === "'" || name[0] === '"' || name[0] === "`") {
        name = name.substring(1, name.length - 1);
      }
      if (transDuration.indexOf('%') === transDuration.length - 1) {
        transDuration = parseFloat(transDuration) / 100 * duration;
      } else {
        transDuration = this.timeInMs(transDuration);
      }
      _results.push(this.wait(startTime, this.triggerTransition.bind(this, name, transDuration, variables)));
    }
    return _results;
  },
  transitionDelaySelectors: function(duration, variables, keyframe, tSheet, selectors) {
    var addSelectors, startTime;
    startTime = this.transitionStartTime(duration, keyframe);
    if (keyframe.indexOf("-") !== -1) {
      addSelectors = this.transitionKeyframeRange(keyframe, selectors, duration, tSheet.sheet, variables);
    } else {
      addSelectors = this.transitionKeyframeSingle(selectors, duration, tSheet.sheet, variables);
    }
    if (startTime > 0) {
      return this.wait(startTime, addSelectors.bind(this));
    } else {
      return addSelectors.bind(this)();
    }
  },
  transitionStartTime: function(duration, keyframe) {
    var intStartTime;
    if (keyframe === "start" || keyframe === "begin") {
      return 0;
    } else if (keyframe === "finish") {
      return duration + this.transitionTiming.start;
    } else {
      intStartTime = parseFloat(keyframe.split('-')[0]) / 100 * duration;
      return intStartTime + this.transitionTiming.start;
    }
  },
  transitionKeyframeSingle: function(selectors, duration, tSheet, variables) {
    return function() {
      var id, pSheet, selector;
      pSheet = this.getStylesheet("FASHION-transition::properties-" + name);
      for (id in selectors) {
        selector = selectors[id];
        this.transitionSelector(selector, duration, tSheet, pSheet, variables);
      }
    };
  },
  transitionSelector: function(selector, duration, tSheet, pSheet, variables, selName) {
    var properties, property, smoothProperties, tCSS, _i, _len;
    properties = selector.properties;
    smoothProperties = [];
    for (_i = 0, _len = properties.length; _i < _len; _i++) {
      property = properties[_i];
      if (typeof property.value === 'object' && property.value.transition) {
        smoothProperties.push(property);
      }
    }
    tCSS = this.generateCSSTransitions.call(this, smoothProperties, duration, variables);
    selName = selName || this.evaluate(selector.name, 0, variables);
    tSheet.insertRule("" + selName + " {" + tCSS + "}", tSheet.rules.length);
    return this.wait(this.transitionTiming.settle, ((function(_this) {
      return function(selName, properties) {
        return function() {
          var pval, _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = properties.length; _j < _len1; _j++) {
            property = properties[_j];
            pval = _this.evaluate(property.value, 0, variables);
            if (property.important) {
              pval += " !important";
            }
            _results.push(_this.setRuleOnSheet(pSheet, selName, property.name, pval));
          }
          return _results;
        };
      };
    })(this))(selName, properties));
  },
  generateCSSTransitions: function(properties, duration, variables) {
    var csstext, l, msLength, property, t, _i, _len;
    csstext = "transition: ";
    for (_i = 0, _len = properties.length; _i < _len; _i++) {
      property = properties[_i];
      if (!property.value.transition) {
        continue;
      }
      t = property.value.transition;
      if (t.duration.indexOf("%" !== -1)) {
        l = parseFloat(this.evaluate(t.duration, 0, variables)) / 100 * duration;
        msLength = l != null ? "" + l + "ms" : t.duration;
      } else {
        msLength = t.duration;
      }
      csstext += "" + property.name + " " + msLength + " " + (t.easing || '') + " " + (t.delay || '') + ",";
    }
    csstext = csstext.substr(0, csstext.length - 1) + ";";
    csstext = [csstext, "-webkit-" + csstext, "-moz-" + csstext, "-ms-" + csstext].join('');
    return csstext;
  }
});

$wf.addRuntimeModule("transitionRangeBlock", ["individualizedHelpers"], {
  transitionKeyframeRange: function(keyframe, selectors, duration, tSheet, variables) {
    return function() {
      var element, endTime, order, pSheet, selElements, selName, selector, selectorId, slice, spanDuration, startTime, _results;
      startTime = parseFloat(keyframe.split('-')[0]) / 100 * duration;
      endTime = parseFloat(keyframe.split('-')[1]) / 100 * duration;
      if (endTime <= startTime) {
        return this.throwError("Range must start before it ends.");
      }
      spanDuration = endTime - startTime;
      pSheet = this.getStylesheet("FASHION-transition::properties-" + name);
      _results = [];
      for (selectorId in selectors) {
        selector = selectors[selectorId];
        selName = this.evaluate(selector.name, 0, variables);
        selElements = this.elementsForSelector(selName);
        slice = spanDuration / selElements.length;
        _results.push((function() {
          var _results1;
          _results1 = [];
          for (order in selElements) {
            element = selElements[order];
            if (!element.id) {
              element.setAttribute('id', this.generateRandomId());
            }
            _results1.push(this.wait(slice * order, ((function(_this) {
              return function(selector, element) {
                return function() {
                  var addSelector, name;
                  name = "#" + element.id;
                  addSelector = _this.transitionSelector.bind(_this);
                  return addSelector(selector, duration, tSheet, pSheet, variables, name);
                };
              };
            })(this))(selector, element)));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };
  }
});

window.fashion.$functions["trigger"] = new FunctionModule({
  output: $wf.$type.None,
  unit: '',
  mode: $wf.$runtimeMode.individual,
  evaluate: function(name, duration, variables) {
    var k, triggerFunction, v;
    for (k in variables) {
      v = variables[k];
      variables[k] = v.value;
    }
    triggerFunction = FASHION.runtime.triggerTransition;
    return triggerFunction.call(this, name.value, duration, variables);
  }
});

window.fashion.$blocks["trigger"] = new BlockModule({
  compile: function(args, body) {
    if (args.length === 0) {
      return this.throwError("Must specify transition name and duration");
    } else if (args.length === 1) {
      return this.throwError("Must specify a duration");
    }
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
  }),
  pixelratio: new GlobalModule({
    type: $wf.$type.Number,
    get: function() {
      return window.devicePixelRatio;
    },
    watch: function(onchange) {
      var lastRatio;
      lastRatio = window.devicePixelRatio;
      return setInterval((function() {
        if (window.devicePixelRatio !== lastRatio) {
          onchange();
        }
        return lastRatio = window.devicePixelRatio;
      }), 1000);
    }
  }),
  browserwebkit: new GlobalModule({
    type: $wf.$type.Boolean,
    get: function() {
      return /WebKit/.test(navigator.userAgent);
    },
    watch: function(onchange) {
      return false;
    }
  }),
  ismobile: new GlobalModule({
    type: $wf.$type.Boolean,
    get: function() {
      return (window.orientation != null) && window.innerWidth < 800;
    },
    watch: function(onchange) {
      return false;
    }
  })
};
}());

