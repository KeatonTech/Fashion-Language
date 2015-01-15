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
  version: "0.3.2",
  url: "http://writefashion.org",
  author: "Keaton Brandt",
  mimeType: "text/x-fashion",
  cssId: "FASHION-stylesheet",
  minifiedObject: "FSMIN",
  runtimeObject: "FASHION",
  runtimeModules: [],
  readyEvent: "fashion-ready"
};

window.fashion.runtimeConfig = {
  variableObject: "style",
  idPrefix: "FS-",
  individualCSSID: "FASHION-individual",
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

window.fashion.live = {
  loadedEvent: "fashion-loaded"
};

currentScript = document.currentScript || document.scripts[document.scripts.length - 1];

document.addEventListener('readystatechange', function() {
  if (document.readyState === "complete") {
    return window.fashion.$loader.loadStyles(function(scriptText) {
      var css, event, js, parseTree, start, _ref;
      start = new Date().getTime();
      parseTree = window.fashion.$parser.parse(scriptText);
      parseTree = window.fashion.$processor.process(parseTree);
      _ref = window.fashion.$actualizer.actualize(parseTree), css = _ref.css, js = _ref.js;
      console.log("[FASHION] Compile finished in " + (new Date().getTime() - start) + "ms");
      start = new Date().getTime();
      $wf.$dom.addStylesheet(css);
      $wf.$dom.addScript(js);
      console.log("[FASHION] Page initialize finished in " + (new Date().getTime() - start) + "ms");
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
    this.mode = $wf.$runtimeMode.dynamic;
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
    this.rawName = this.name = name;
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
  function PropertyTransition(easing, duration, delay) {
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
      return this.evaluate = Function("v", "g", "f", "t", "e", this.script);
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
    this.dom = [];
    switch (startType) {
      case "variable":
        this.addVariableBinding(startVal);
        break;
      case "global":
        this.addGlobalBinding(startVal);
        break;
      case "dom":
        console.log("[FASHION] DOM Bindings not yet supported");
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
    _ref2 = bindingObject.dom;
    _results = [];
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      v = _ref2[_k];
      _results.push(ext(this.dom, v));
    }
    return _results;
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
      ReturnValueModule.__super__.constructor.call(this, args);
    }
  }

  return ReturnValueModule;

})(Module);

GlobalModule = (function(_super) {
  __extends(GlobalModule, _super);

  function GlobalModule(args) {
    this.watch = args.watch;
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
6-bit Mode -----------------------------------------------------------------------
	000001 (Bit 0): Can change, needs to be included in the JS
	000010 (Bit 1): Can rely on non-top-level variables
	000100 (Bit 2): Can rely on relative styles & attributes
	001000 (Bit 3): Needs to be continuously recomputed
	010000 (Bit 4): Can rely on globals, cannot be pre-computed
	100000 (Bit 5): Triggered property, does not need recomputing
----------------------------------------------------------------------------------
 */
window.fashion.$runtimeMode = {
  "static": 0,
  dynamic: 1,
  scoped: 3,
  globalDynamic: 17,
  individual: 7,
  live: 9,
  triggered: 32,
  generate: function(dynamic, individualized, live, scoped, globals) {
    return (dynamic ? 1 : 0) | (individualized ? 7 : 0) | (live ? 9 : 0) | (scoped ? 3 : 0) | (globals ? 17 : 0);
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
  regex = /([^\(\)\"\'\`\s]*\(|\)|\"|\'|\`|([^\`\"\'\s]+(\s+[\+\-\/\*\=]\s+|[\+\/\*\=]))+[^\`\"\'\s]+|\s+(\&\&|\|\|)\s+|\s+(==|!==)\s+|if\s+|\s+then\s+|\s+else\s+|\s|[^\(\)\"\'\`\s]+)/g;
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
    } else {
      console.log("[FASHION] Problem around '" + segment[0] + "';");
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
    } else if ((segment[3] && segment[4]) || segment[6]) {
      topSel.addToBody(fashionText.substring(segment.index, lastIndex));
    } else if (segment[8]) {
      name = $wf.$parser.nestSelector(topSel.rawName, segment[8]);
      selectors.push($wf.$parser.createSelector(parseTree, name));
      selectorStack.push(selectors.length - 1);
      bracketDepth++;
    }
  }
  return selectors;
};

window.fashion.$parser.nestSelector = function(outer, inner) {
  var acc, istring, ostring, _i, _j, _len, _len1, _ref, _ref1;
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
    ostring = ostring.trim();
    _ref1 = inner.split(",");
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      istring = _ref1[_j];
      istring = istring.trim();
      if (istring[0] === "&") {
        acc.push(ostring + istring.substr(1));
      } else {
        acc.push(ostring + " " + istring);
      }
    }
  }
  return acc.join(",");
};

window.fashion.$parser.createSelector = function(parseTree, name) {
  var bindings, dmode, expander, foundVar, lastIndex, regex, script, selector, trimmed, vExpr;
  selector = new Selector(name);
  parseTree.addSelector(selector);
  if (name.indexOf("$") === -1) {
    return selector;
  }
  script = "return ";
  lastIndex = 0;
  bindings = new ExpressionBindings();
  regex = /\$([\w\-]+)/g;
  while (foundVar = regex.exec(name)) {
    if (foundVar.index > lastIndex) {
      script += "'" + (name.substring(lastIndex, foundVar.index)) + "'+";
    }
    lastIndex = foundVar.index + foundVar[0].length;
    expander = $wf.$parser.expressionExpander.localVariable;
    vExpr = expander(foundVar[1], parseTree);
    bindings.extend(vExpr.bindings);
    script += vExpr.script + "+";
  }
  if (name.length > lastIndex) {
    script += "'" + (name.substr(lastIndex)) + "'+";
  }
  trimmed = script.substr(0, script.length - 1);
  dmode = selector.mode = $wf.$runtimeMode.dynamic;
  selector.name = new Expression(trimmed, $wf.$type.String, 0, bindings, dmode);
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
  regex = /[\s]*(\$?[\w\-\s]*)\:[\s]*(\[([\w\-\$\@]*)[\s]*([\w\-\$\@\%]*)[\s]*([\w\-\$\@\%]*)\]){0,1}[\s]*([^;}\n]*?)[\s]*(\![A-z0-9\-]+?)?[;}\n]/g;
  _results = [];
  while (property = regex.exec(bodyString)) {
    transition = void 0;
    if (property.length < 7) {
      continue;
    }
    value = $wf.$parser.parsePropertyValues(property[6], parseTree);
    name = property[1];
    if (name[0] === "$") {
      $wf.$parser.parseScopedVariable(name, value, property, selector.name, parseTree);
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
  return $wf.$parser.addVariable(parseTree, name, value, property[7], scope);
};

window.fashion.$parser.parsePropertyValues = function(value, parseTree) {
  var i, item, ret, split;
  if (value.indexOf(',') !== -1) {
    split = window.fashion.$parser.splitByTopLevelCommas(value);
    if (split.length === 1) {
      return window.fashion.$parser.parsePropertyValue(split[0], parseTree);
    } else {
      ret = [];
      for (i in split) {
        item = split[i];
        split[i] = item.trim();
      }
      for (i in split) {
        item = split[i];
        ret[i] = window.fashion.$parser.parsePropertyValue(item, parseTree, true, true);
      }
      return ret;
    }
  } else {
    return window.fashion.$parser.parsePropertyValue(value, parseTree);
  }
};

window.fashion.$parser.parsePropertyValue = function(value, parseTree, allowExpression, forceArray) {
  var parts, v, val, vals, _i, _len;
  if (allowExpression == null) {
    allowExpression = true;
  }
  if (forceArray == null) {
    forceArray = false;
  }
  if (forceArray || (typeof value === "string" && value.indexOf(" ") !== -1)) {
    parts = $wf.$parser.splitByTopLevelSpaces(value);
    if (!forceArray && parts.length === 1) {
      return window.fashion.$parser.parseSingleValue(value, parseTree);
    }
    vals = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        v = parts[_i];
        _results.push($wf.$parser.parseSingleValue(v, parseTree));
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
    return window.fashion.$parser.parseSingleValue(value, parseTree);
  }
};

window.fashion.$parser.identifyExpression = function() {
  return /(([\s][\+\-\/\*\=][\s])|\s(\&\&|\|\|)\s|if\s.*?\sthen\s|\selse\s|[\(\)\[\]]|\@|\$)/g;
};

window.fashion.$parser.parseSingleValue = function(value, parseTree, isVar) {
  if (isVar == null) {
    isVar = false;
  }
  if (!value || typeof value !== 'string') {
    return value;
  }
  if (value.match($wf.$parser.identifyExpression())) {
    return window.fashion.$parser.parseExpression(value, parseTree, window.fashion.$functions, window.fashion.$globals, true, isVar);
  }
  return value;
};
window.fashion.$parser.parseExpression = function(expString, parseTree, funcs, globals, top, hideUnits, wrap) {
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
  regex = /(\$([\w\-]+)\s*?\=|\@(self|this|parent)\.?([a-zA-Z0-9\-\_\.]*)|\$([\w\-]+)|\@([\w\-]+)|(\#[0-9A-Fa-f]{3,6})|([\-]{0,1}([\.]\d+|\d+(\.\d+)*)[a-zA-Z]{1,4})|([\w\-\@\$]*)\(|\)([^\s\)]*)|if(.*?)then(.*?)else(.*)|if(.*?)then(.*)|[`'"](.*?)[`'"])/g;
  shouldBreak = false;
  matchCount = 0;
  while (!shouldBreak && (section = regex.exec(expString))) {
    matchCount++;
    eObj = void 0;
    start = section.index;
    length = section[0].length;
    end = start + length;
    if (section[2]) {
      eObj = expander.localVariable(section[2], parseTree, true);
      isSetter = true;
    } else if (section[3]) {
      eObj = expander.relativeObject(section[3], section[4]);
    } else if (section[5]) {
      eObj = expander.localVariable(section[5], parseTree);
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
  return console.log("[FASHION] Could not match parens: " + string);
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
        console.log("[FASHION] Found mixed types in expression: '" + expression + "'");
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
  localVariable: function(name, parseTree, isSetter) {
    var bindings, isIndividual, isIndividualized, mode, script, selector, selectors, type, unit, vObj, vars;
    if (isSetter == null) {
      isSetter = false;
    }
    vars = parseTree.variables;
    selectors = vars[name];
    if (!selectors) {
      return console.log("[FASHION] Variable $" + name + " does not exist.");
    }
    isIndividual = false;
    type = unit = mode = -1;
    for (selector in selectors) {
      vObj = selectors[selector];
      if (selector !== 0) {
        isIndividualized = false;
      }
      type = vObj.type;
      unit = vObj.unit;
      mode = vObj.mode;
    }
    if (isSetter) {
      script = "v('" + name + "'" + (isIndividual ? ',e' : '') + ").value =";
    } else {
      bindings = new ExpressionBindings("variable", name);
      script = "v('" + name + "'" + (isIndividual ? ',e' : '') + ").value";
    }
    mode = isIndividual ? mode | $wf.$runtimeMode.individual : mode;
    return new Expression(script, type, unit, bindings, mode);
  },
  globalVariable: function(name, globals, parseTree) {
    var bindings, script, vObj;
    name = name.toLowerCase();
    vObj = globals[name];
    if (!vObj) {
      return console.log("[FASHION] Variable $" + name + " does not exist.");
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
    var arg, argComponents, args, bindings, expr, expressions, fObj, funcs, globals, mode, namedArgs, objectProp, ogstring, parseTree, script, scripts, unit, vars, _i, _j, _len, _len1;
    ogstring = parseArgs[0], parseTree = parseArgs[1], funcs = parseArgs[2], globals = parseArgs[3];
    vars = parseTree.variables;
    fObj = funcs[name];
    if (!fObj) {
      return console.log("[FASHION] Function $" + name + " does not exist.");
    }
    if (argumentsString.length > 1) {
      args = window.fashion.$parser.splitByTopLevelCommas(argumentsString);
      expressions = [];
      namedArgs = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        if (argComponents = arg.match(/([a-zA-Z0-9\-\'\"]+)\s*\:\s*(.*)/)) {
          objectProp = "'" + argComponents[1] + "': ";
          objectProp += window.fashion.$parser.parseExpression(argComponents[2], parseTree, funcs, globals, 0).script;
          namedArgs.push(objectProp);
        } else {
          expressions.push(window.fashion.$parser.parseExpression(arg, parseTree, funcs, globals, false));
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
    script = "f['" + name + "'].get.call(" + (scripts.join(',')) + ")";
    return new Expression(script, fObj.type, inputUnit || unit, bindings, mode);
  },
  ternary: function(ifExp, trueExp, falseExp, parseArgs, top) {
    var bindings, funcs, globals, mode, ogstring, parse, parseTree, script;
    ogstring = parseArgs[0], parseTree = parseArgs[1], funcs = parseArgs[2], globals = parseArgs[3];
    bindings = new ExpressionBindings;
    mode = 0;
    parse = function(arg) {
      var e;
      e = window.fashion.$parser.parseExpression(arg, parseTree, funcs, globals, false, true, false);
      bindings.extend(e.bindings);
      mode |= e.mode;
      return e;
    };
    ifExp = parse(ifExp.trim());
    trueExp = parse(trueExp.trim());
    falseExp = parse(falseExp.trim());
    if (trueExp.type !== falseExp.type) {
      return console.log("[FASHION] Ternary results must return the same type");
    }
    if (trueExp.unit !== falseExp.unit) {
      return console.log("[FASHION] Ternary results must return the same unit");
    }
    script = "(" + ifExp.script + " ? " + trueExp.script + " : " + falseExp.script + ")";
    return new Expression(script, trueExp.type, trueExp.unit, bindings, mode);
  }
};
window.fashion.$parser.addVariable = function(parseTree, name, value, flag, scope) {
  var type, typedValue, unit, unittedValue, val, variableObject;
  value = $wf.$parser.parseSingleValue(value, parseTree, true);
  variableObject = new Variable(name, value, scope);
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
window.fashion.$shared.getVariable = function(variables, globals, funcs, runtime, varName, elem) {
  var vObj;
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
  if (vObj.scope && vObj.scope.length > 0) {
    return this.throwError("Scoped variables are not yet supported");
  } else if (vObj["default"] !== void 0) {
    if (vObj["default"].evaluate) {
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

window.fashion.$shared.evaluate = function(valueObject, variables, globals, funcs, runtime, element, cssMode) {
  var addSuffix, evaluateSingleValue, iMode, isImportant, string, value, vi, vo, _ref, _ref1;
  if (cssMode == null) {
    cssMode = true;
  }
  isImportant = false;
  iMode = ((_ref = this.runtimeModes) != null ? _ref.individual : void 0) || (typeof $wf !== "undefined" && $wf !== null ? (_ref1 = $wf.$runtimeMode) != null ? _ref1.individual : void 0 : void 0);
  evaluateSingleValue = (function(_this) {
    return function(valueObject) {
      var e, elmLookup, v, val, varLookup, varObjects, _i, _len;
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
      if (((valueObject.mode & iMode) === iMode || (element != null)) && (_this.elementFunction != null)) {
        if (element == null) {
          return _this.throwError("Expression requires element but none provided");
        }
        elmLookup = _this.elementFunction(element);
        if (elmLookup == null) {
          return _this.throwError("Could not generate element function");
        }
      }
      if (valueObject.evaluate) {
        try {
          val = valueObject.evaluate(varLookup, globals, funcs, runtime, elmLookup);
        } catch (_error) {
          e = _error;
          console.log("[FASHION] Could not evaluate: " + valueObject.evaluate);
          return console.log(e);
        }
        if (valueObject.important === true) {
          isImportant = true;
        }
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
    parseTree.scripts.push("document.dispatchEvent(new Event('" + $wf.readyEvent + "'));");
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
    selectors: {},
    individual: {},
    variables: {}
  })) + ";\nFSEXPAND = " + ($wf.$stringify($wf.$actualizer.minifier.expandRuntimeData)) + ";\nFSEXPAND(window." + $wf.minifiedObject + ",window." + $wf.runtimeObject + ");\nFSREADY = function(r){d=document;c=\"complete\";\n	if(d.readyState==c)r()\n	else d.addEventListener('readystatechange',function(){if(d.readyState==c)r()})\n}\n" + (scripts.join('\n'));
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
  return $wf.$actualizer.bindVariables(runtimeData);
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

window.fashion.$actualizer.bindExpression = function(runtimeData, expression, bindLink) {
  var gObj, globalName, vObj, varName, _i, _j, _len, _len1, _ref, _ref1, _results;
  _ref = expression.bindings.variables;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    varName = _ref[_i];
    vObj = runtimeData.variables[varName];
    if (!vObj) {
      console.log("[FASHION] Could not bind to nonexistent variable: '" + varName + "'");
    } else {
      vObj.addDependent(bindLink);
    }
  }
  _ref1 = expression.bindings.globals;
  _results = [];
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    globalName = _ref1[_j];
    gObj = runtimeData.modules.globals[globalName];
    if (!gObj) {
      _results.push(console.log("[FASHION] Could not bind to nonexistent global: '" + varName + "'"));
    } else {
      if (gObj.dependents == null) {
        gObj.dependents = [];
      }
      if (__indexOf.call(gObj.dependents, bindLink) >= 0) {
        continue;
      }
      _results.push(gObj.dependents.push(bindLink));
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

  RuntimeVariable.prototype.addDependent = function(bindLink) {
    if (__indexOf.call(this.dependents, bindLink) >= 0) {
      return;
    }
    return this.dependents.push(bindLink);
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
      if (property.value == null) {
        console.log(selector);
      }
      if ((selector.mode & $wf.$runtimeMode.globalDynamic) > 2) {
        continue;
      }
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
  return "" + selector + " {" + (properties.join('')) + "}\n";
};

window.fashion.$actualizer.cssTransitionTemplate = function(property, duration, easing, delay) {
  return "" + property + " " + (duration || '1s') + " " + (easing || '') + (delay ? ' ' + delay : '');
};
window.fashion.$runtimeCapability = {
  variables: "variables",
  scopedVariables: "scopedVariables",
  individualProps: "individualized",
  liveProps: "liveProperties",
  globals: "globals"
};

window.fashion.$actualizer.autoAddRequirements = function(runtimeData, parseTree) {
  var add, variable, _i, _len, _ref;
  add = parseTree.addRequirements.bind(parseTree);
  if (JSON.stringify(runtimeData.variables) !== "{}") {
    add([$wf.$runtimeCapability.variables]);
    _ref = runtimeData.variables;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      variable = _ref[_i];
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
    return add([$wf.$runtimeCapability.globals]);
  }
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
  var cid, functionName, key, module, moduleName, _i, _len, _ref;
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
};
window.fashion.$actualizer.hideIndividualizedSelectors = function(cssSelectors, scripts, indSels) {
  var hideSel, hideSelectors, id, joinedSelector, key, len, selector, value;
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
  len = $wf.styleHeaderRules;
  for (key in cssSelectors) {
    value = cssSelectors[key];
    len++;
  }
  return scripts.push("FSREADY(function(){\n	ss = document.getElementById(FASHION.config.cssId);\n	if(ss&&ss.sheet)ss.sheet.deleteRule(" + (len - 1) + ");\n});");
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
    var $wfam, defaultVal, r, v, values, _i, _len, _ref;
    $wfam = window.fashion.$actualizer.minifier;
    if (!varObj || !(varObj instanceof RuntimeVariable)) {
      return;
    }
    if (varObj["default"] instanceof Expression) {
      defaultVal = $wfam.expression(varObj["default"]);
    } else {
      defaultVal = varObj["default"];
    }
    values = [];
    _ref = varObj.values;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      v = _ref[_i];
      if (v instanceof Expression) {
        values.push($wfam.expression(v));
      } else {
        values.push(v);
      }
    }
    r = ["v", varObj.name, varObj.type, varObj.unit, varObj.mode, defaultVal, varObj.dependents];
    if (varObj.scopes) {
      r.push.apply(r, [varObj.scopes, values]);
    }
    return r;
  }
};
window.fashion.$actualizer.minifier.expandRuntimeData = function(minData, expandTo) {
  var expand, expanderFunctions, selector, selobj, variable, vobj, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
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
        scopes: v[7],
        values: expand(v[8])
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
  evaluate: function(value, element, extraVariables) {
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
    return this.evaluate_Shared(value, vars, FASHION.modules.globals, FASHION.modules.functions, FASHION.runtime, element);
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
    if (vObj.mode === 0) {
      return this.throwError("Cannot change static variables");
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
    var bindLink, vObj, _i, _len, _ref, _results;
    vObj = FASHION.variables[varName];
    _ref = vObj.dependents;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      bindLink = _ref[_i];
      if (bindLink[0] === "v") {
        _results.push(this.updateDependencies(bindLink[1]));
      } else if (bindLink.length === 3) {
        _results.push(this.setPropertyOnSelector(bindLink[0], bindLink[1], bindLink[2]));
      } else {
        _results.push(this.regenerateSelector(bindLink[0], bindLink[1]));
      }
    }
    return _results;
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
  },
  setPropertyOnSelector: function(sheet, selectorId, propertyName) {
    var pObj, regex, replacement, rule, rules, selector, _i, _len, _ref, _results;
    if (sheet === "i") {
      return this.setPropertyOnIndividual(selectorId, propertyName);
    }
    selector = FASHION.selectors[selectorId];
    sheet = document.getElementById(FASHION.config.cssId).sheet;
    rules = sheet.rules || sheet.cssRules;
    rule = sheet.rules[selector.rule];
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
    var cssElem, selector, stylesheet;
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
    return stylesheet.insertRule(this.CSSRuleForSelector(selector), selector.rule);
  },
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
      module.apply(element, propertyObject.value, evalFunction);
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
  }
});
$wf.addRuntimeModule("individualized", ["selectors", "elements", "stylesheet-dom", "individualizedHelpers"], {
  $initializeIndividualProperties: function() {
    var id, selector, _ref, _ref1;
    FASHION.individualSheet = this.addStylesheet("" + FASHION.config.individualCSSID).sheet;
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
    this.watchForDOMAddition();
    return window.FASHION.pageChanged = window.FASHION.domChanged = this.pageChanged.bind(this);
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
    var id, individual, pObj, rule, selector, _ref, _results;
    selector = FASHION.individual[selectorId];
    _ref = selector.elements;
    _results = [];
    for (id in _ref) {
      individual = _ref[id];
      if ((individual.cssid == null) || individual.cssid === -1) {
        this.regenerateElementSelector(selector, id, individual);
        continue;
      }
      rule = FASHION.individualSheet.rules[individual.cssid];
      _results.push((function() {
        var _i, _len, _ref1, _results1;
        _ref1 = selector.properties;
        _results1 = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          pObj = _ref1[_i];
          if (this.makeCamelCase(pObj) === propertyName) {
            _results1.push(rule.style[propertyName] = this.CSSRuleForProperty(pObj, individual.element, true));
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
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
    var css;
    if (element.cssid !== -1) {
      FASHION.individualSheet.deleteRule(element.cssid);
    } else {
      element.cssid = FASHION.individualSheet.rules.length;
    }
    css = this.CSSRuleForSelector(selector, element.element, "#" + id);
    return FASHION.individualSheet.insertRule(css, element.cssid);
  },
  watchForDOMAddition: function() {
    if (window.FASHION_NO_OBSERVE === true) {
      return;
    }
    window.FSOBSERVER = new MutationObserver(function(mutations) {
      var mutation, _i, _len;
      if ((window.FSOBSERVER == null) || (window.FASHION == null) || (FASHION.runtime.addedElements == null) || window.FASHION_NO_OBSERVE === true) {
        return;
      }
      for (_i = 0, _len = mutations.length; _i < _len; _i++) {
        mutation = mutations[_i];
        if (mutation.addedNodes.length > 0) {
          FASHION.runtime.addedElements(mutation.addedNodes);
        }
      }
      return true;
    });
    return window.FSOBSERVER.observe(document.body, {
      childList: true,
      subtree: true
    });
  },
  pageChanged: function(addedElements) {
    var element, id, matchedElements, selector, _i, _len, _ref;
    if (addedElements != null) {
      return this.addedElements(addedElements);
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
    return this.addedElements(addedElements);
  },
  addedElements: function(elements) {
    var element, id, indElement, indObj, matches, _i, _len, _results;
    if (typeof FASHION === "undefined" || FASHION === null) {
      return;
    }
    _results = [];
    for (_i = 0, _len = elements.length; _i < _len; _i++) {
      element = elements[_i];
      matches = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector;
      _results.push((function() {
        var _ref, _results1;
        _ref = FASHION.individual;
        _results1 = [];
        for (id in _ref) {
          indObj = _ref[id];
          if (!(!indObj.elements[element.id])) {
            continue;
          }
          if (!element.matches(indObj.name)) {
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
    return _results;
  }
});

$wf.addRuntimeModule("individualizedHelpers", [], {
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
      if (!(global.watch != null)) {
        continue;
      }
      global.watch(onChangeFunction(global));
      _results.push(this.updateGlobal(global));
    }
    return _results;
  },
  updateGlobal: function(global) {
    var bindLink, _i, _len, _ref, _results;
    if ((global == null) || (global.dependents == null)) {
      return;
    }
    _ref = global.dependents;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      bindLink = _ref[_i];
      if (bindLink[0] === "v") {
        _results.push(this.updateDependencies(bindLink[1]));
      } else if (bindLink.length === 3) {
        _results.push(this.setPropertyOnSelector(bindLink[0], bindLink[1], bindLink[2]));
      } else {
        _results.push(this.regenerateSelector(bindLink[0], bindLink[1]));
      }
    }
    return _results;
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
        if ((property == null) && (keyword != null)) {
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
        return element.getAttribute(property);
      };
    })(this);
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
        sheet.removeRule(id);
        sheet.insertRule(ruleText, sheet.rules.length);
      }
      return;
    }
    return sheet.insertRule("" + selector + " {" + property + ": " + value + ";}", sheet.rules.length);
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
    capabilities: ["colors"],
    evaluate: function(h, s, b) {
      var g, r, _ref;
      _ref = this.hsbTOrgb(h.value, s.value, b.value), r = _ref.r, g = _ref.g, b = _ref.b;
      return "rgb(" + (parseInt(r)) + "," + (parseInt(g)) + "," + (parseInt(b)) + ")";
    }
  }),
  "hsba": new FunctionModule({
    output: $wf.$type.Color,
    capabilities: ["colors"],
    evaluate: function(h, s, b, a) {
      var g, r, _ref;
      _ref = this.hsbTOrgb(h.value, s.value, b.value), r = _ref.r, g = _ref.g, b = _ref.b;
      return "rgba(" + (parseInt(r)) + "," + (parseInt(g)) + "," + (parseInt(b)) + "," + a.value + ")";
    }
  }),
  "changeAlpha": new FunctionModule({
    output: window.fashion.$type.Color,
    capabilities: ["colors"],
    evaluate: function(color, newAlpha) {
      var c;
      c = this.cssTOjs(color.value, this);
      return "rgba(" + c.r + "," + c.g + "," + c.b + "," + newAlpha.value + ")";
    }
  }),
  "brighten": new FunctionModule({
    output: window.fashion.$type.Color,
    capabilities: ["colors"],
    evaluate: function(color, brightenPercent) {
      var adj, c, percent;
      percent = brightenPercent.value;
      adj = 1 + (percent > 1 ? percent / 100 : percent);
      c = this.cssTOjs(color.value, this);
      c.r = parseInt(Math.max(c.r * adj, 0));
      c.g = parseInt(Math.max(c.g * adj, 0));
      c.b = parseInt(Math.max(c.b * adj, 0));
      return "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a + ")";
    }
  }),
  "darken": new FunctionModule({
    output: window.fashion.$type.Color,
    capabilities: ["colors"],
    evaluate: function(color, darkenPercent) {
      var adj, c, percent;
      percent = darkenPercent.value;
      adj = 1 - (percent > 1 ? percent / 100 : percent);
      c = this.cssTOjs(color.value, this);
      c.r = parseInt(Math.max(c.r * adj, 0));
      c.g = parseInt(Math.max(c.g * adj, 0));
      c.b = parseInt(Math.max(c.b * adj, 0));
      return "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a + ")";
    }
  })
});
$wf.$extend(window.fashion.$functions, new ((function() {
  function _Class() {
    var genericPassthrough, name, transformFunction, _i, _len;
    transformFunction = ["matrix", "matrix3d", "translate", "translate3d", "translateX", "translateY", "translateZ", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "rotate", "rotate3d", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY", "perspective"];
    genericPassthrough = function(name) {
      var body;
      body = "var a = arguments;\nvar s = \"" + name + "(\";\nfor(var i = 0; i < a.length; i++){\n	s += a[i].value;\n	if(i<a.length-1)s += \",\";\n}\nreturn s + \")\";";
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
      body = "if(element.getAttribute('data-hastrigger-" + evt + "'))return;\nelement.addEventListener('" + evt + "', function(eo){\n	eo.stopPropagation();\n	evaluate();\n}, false);\nelement.setAttribute('data-hastrigger-" + evt + "', 'true');";
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
      body = "if(element.getAttribute('data-hastrigger-" + evt + "'))return;\nelement.addEventListener('" + evt + "', evaluate, false);\nelement.setAttribute('data-hastrigger-" + evt + "', 'true');";
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
window.fashion.$blocks = {};
window.fashion.$blocks["transition"] = new BlockModule({
  capabilities: ["transitionBlock"],
  compile: function(args, body) {
    var acc, count, currentKeyframe, depth, keyframe, keyframes, lastAcc, name, regex, segment, transition;
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
      transition[keyframe] = this.parse(body);
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
      l = parseFloat(this.evaluate(t.duration, 0, variables)) / 100 * duration;
      msLength = l != null ? "" + l + "ms" : t.duration;
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
  })
};
}());

