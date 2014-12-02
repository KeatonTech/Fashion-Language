
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
window.fashion.addProperty = function(name, propertyObject, force) {
  if (force == null) {
    force = false;
  }
  if (!globalObject.compile && !globalObject.apply) {
    return new Error("Property objects must have either a 'compile' or 'apply' function");
  }
  if (!force && window.fashion.$properties[name]) {
    return new Error("There is already a property named " + name);
  }
  return window.fashion.$properties[name] = globalObject;
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

window.fashion.addFunction = function(name, functionObject, force) {
  if (force == null) {
    force = false;
  }
  if (!functionObject.output || !functionObject.evaluate) {
    return new Error("Function objects must have 'output' and 'evaluate' properties");
  }
  if (!force && window.fashion.$functions[name]) {
    return new Error("There is already a function named " + name);
  }
  return window.fashion.$functions[name] = functionObject;
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

window.fashion.addGlobal = function(name, globalObject, force) {
  if (force == null) {
    force = false;
  }
  if (!globalObject.type || !globalObject.unit) {
    return new Error("Global objects must specify type and unit properties");
  }
  if (!globalObject.get) {
    return new Error("Global objects must have a 'get' function");
  }
  if (!globalObject.watch) {
    return new Error("Global objects must have a 'watch' function");
  }
  if (!force && window.fashion.$globals[name]) {
    return new Error("There is already a global named " + name);
  }
  return window.fashion.$globals[name] = globalObject;
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
window.fashion.$type = {
  None: 0,
  Number: 1,
  String: 2,
  Color: 3,
  C2Number: 50,
  C4Number: 51,
  CBorder: 52,
  CShadow: 53,
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
  },
  Color: {
    Const: 0,
    Hex: 1,
    RGB: 2,
    RGBA: 3,
    HSB: 4,
    HSBA: 5,
    HSL: 6,
    HSLA: 7
  }
};
window.fashion.$typeConstants = {
  colors: ["aqua", "black", "blue", "fuchsia", "gray", "green", "lime", "maroon", "navy", "olive", "purple", "red", "silver", "teal", "white", "yellow"]
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
    var body, key, nb, parsed, variable, _ref, _ref1;
    parsed = window.fashion.$parser.parseSections(fashionText);
    _ref = parsed.variables;
    for (key in _ref) {
      variable = _ref[key];
      parsed.variables[key] = window.fashion.$parser.parseVariable(variable);
    }
    _ref1 = parsed.selectors;
    for (key in _ref1) {
      body = _ref1[key];
      nb = window.fashion.$parser.parseSelectorBody(body, parsed.variables);
      parsed.selectors[key] = nb;
      window.fashion.$parser.backlinkVariables(key, nb, parsed.variables);
      window.fashion.$parser.backlinkGlobals(parsed, key, nb, $wf.$globals);
    }
    return parsed;
  }
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
  regex = /(\(|\)|\"|\'|\`|\s|[^\(\)\"\'\`\s]+)/g;
  while (token = regex.exec(value)) {
    if (token[0] === " " && depth === 0 && !sq && !dq && !bt) {
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
window.fashion.$parser.parseSections = function(fashionText) {
  var blockArgs, blocks, newSels, regex, sObj, segment, selectors, startIndex, variables, _i, _len;
  variables = {};
  selectors = {};
  blocks = [];
  regex = /([\s]*(\$([\w\-]+)\:[\s]*(.*?)\;|\@([\w\-]+)[\s]*(.*?)[\s]*\{|(.*?)[\s]*?\{)|\{|\})/g;
  while (segment = regex.exec(fashionText)) {
    if (segment.length < 8 || !segment[0]) {
      break;
    }
    if (segment[3] && segment[4]) {
      variables[segment[3]] = {
        raw: segment[4]
      };
    } else if (segment[5]) {
      startIndex = segment.index + segment[0].length;
      if (segment[6]) {
        blockArgs = $wf.$parser.splitByTopLevelSpaces(segment[6]);
      } else {
        blockArgs = [];
      }
      blocks.push({
        type: segment[5],
        "arguments": blockArgs,
        body: window.fashion.$parser.parseBlock(fashionText, regex, startIndex)
      });
    } else if (segment[7]) {
      newSels = window.fashion.$parser.parseSelector(fashionText, segment[7], regex, segment.index + segment[0].length);
      for (_i = 0, _len = newSels.length; _i < _len; _i++) {
        sObj = newSels[_i];
        if (selectors[sObj.name]) {
          selectors[sObj.name] += sObj.value;
        } else {
          selectors[sObj.name] = sObj.value;
        }
      }
    } else {
      console.log("There's a problem somewhere in your file. Sorry.");
    }
  }
  return {
    variables: variables,
    selectors: selectors,
    blocks: blocks,
    globals: {}
  };
};

window.fashion.$parser.parseSelector = function(fashionText, name, regex, lastIndex) {
  var bracketDepth, segment, sel, selectorStack, selectors, stackName, topSel, _i, _len;
  selectors = [
    {
      name: name,
      value: ""
    }
  ];
  bracketDepth = 1;
  selectorStack = [];
  selectorStack = [];
  selectorStack.push(name);
  while (bracketDepth > 0 && (segment = regex.exec(fashionText))) {
    stackName = selectorStack[selectorStack.length - 1];
    for (_i = 0, _len = selectors.length; _i < _len; _i++) {
      sel = selectors[_i];
      if (sel.name === stackName) {
        topSel = sel;
        break;
      }
    }
    topSel.value += fashionText.substring(lastIndex, segment.index);
    lastIndex = segment.index + segment[0].length;
    if (segment[0] === "}") {
      selectorStack.pop();
      bracketDepth--;
    } else if (segment[7]) {
      name = void 0;
      if (segment[7][0] === "&") {
        name = stackName + segment[7].substr(1);
      } else {
        name = stackName + " " + segment[7];
      }
      selectorStack.push(name);
      selectors.push({
        name: name,
        value: ""
      });
      bracketDepth++;
    }
  }
  return selectors;
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
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

window.fashion.$parser.parseVariable = function(variableObject) {
  var typ, unittedValue, val;
  val = variableObject.raw || variableObject.value;
  if (!val) {
    return {};
  }
  typ = variableObject.type = window.fashion.$run.determineType(val, window.fashion.$type, window.fashion.$typeConstants);
  unittedValue = window.fashion.$run.getUnit(val, typ, window.fashion.$type, window.fashion.$unit);
  variableObject.value = unittedValue['value'];
  variableObject.unit = unittedValue['unit'];
  variableObject.dependants = {};
  return variableObject;
};

window.fashion.$parser.backlinkVariables = function(selector, properties, variables) {
  var depVar, k, key, linkDependenciesList, p, regex, tk, tp, vObj, varName, _ref, _results;
  linkDependenciesList = function(list, propertyName) {
    var depVar, varName, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      varName = list[_i];
      if (varName[0] === "$") {
        varName = varName.substr(1);
        depVar = variables[varName];
        if (depVar !== void 0) {
          if (!depVar['dependants'][selector]) {
            depVar['dependants'][selector] = [];
          }
          _results.push(depVar['dependants'][selector].push(propertyName));
        } else {

        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  for (k in properties) {
    p = properties[k];
    if (p['dependencies']) {
      linkDependenciesList(p['dependencies'], k);
    }
    if (p['transition']) {
      _ref = p['transition'];
      for (tk in _ref) {
        tp = _ref[tk];
        key = "transition." + k;
        if (tp['dependencies']) {
          linkDependenciesList(tp['dependencies'], key);
        }
      }
    }
  }
  regex = /\$([\w\-]+)/g;
  _results = [];
  while (vObj = regex.exec(selector)) {
    varName = vObj[1];
    depVar = variables[varName];
    if (depVar !== void 0) {
      if (!depVar['dependants'][selector]) {
        depVar['dependants'][selector] = [];
      }
      _results.push(depVar['dependants'][selector].push(" "));
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

window.fashion.$parser.backlinkGlobals = function(parseTree, selector, properties, globals) {
  var k, p, varName, _results;
  _results = [];
  for (k in properties) {
    p = properties[k];
    if (p['dependencies']) {
      _results.push((function() {
        var _i, _len, _ref, _results1;
        _ref = p['dependencies'];
        _results1 = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          varName = _ref[_i];
          if (!(varName[0] === "@")) {
            continue;
          }
          varName = varName.substr(1);
          if (!(__indexOf.call(parseTree.globals, varName) >= 0)) {
            parseTree.globals[varName] = {
              dependants: {}
            };
          }
          if (!parseTree.globals[varName].dependants[selector]) {
            parseTree.globals[varName].dependants[selector] = [];
          }
          _results1.push(parseTree.globals[varName].dependants[selector].push(k));
        }
        return _results1;
      })());
    }
  }
  return _results;
};
window.fashion.$parser.parseSelectorBody = function(bodyString, vars) {
  var i, item, properties, property, regex, value;
  properties = {};
  regex = /[\s]*([\w\-\s]*)\:[\s]*(\[([\w\-\$\@]*)[\s]*([\w\-\$\@\%]*)[\s]*([\w\-\$\@\%]*)\]){0,1}[\s]*(.*?)[\s]*(!important)?[;}\n]/g;
  while (property = regex.exec(bodyString)) {
    if (property.length < 7) {
      continue;
    }
    value = property[6];
    if (value.indexOf(',') !== -1) {
      value = window.fashion.$parser.splitByTopLevelCommas(value);
      if (value.length === 1) {
        value = window.fashion.$parser.parsePropertyValue(value[0], vars);
      } else {
        for (i in value) {
          item = value[i];
          value[i] = item.trim();
        }
        for (i in value) {
          item = value[i];
          value[i] = window.fashion.$parser.parsePropertyValue(item, vars, true, true);
        }
      }
    } else {
      value = window.fashion.$parser.parsePropertyValue(value, vars);
    }
    if (property[3]) {
      if (typeof value !== 'object') {
        value = {
          value: value
        };
      }
      value.transition = {
        easing: window.fashion.$parser.parsePropertyValue(property[3], vars, false),
        duration: window.fashion.$parser.parsePropertyValue(property[4], vars, false),
        delay: window.fashion.$parser.parsePropertyValue(property[5], vars, false)
      };
    }
    if (property[7] === "!important") {
      if (typeof value === "string") {
        value += " !important";
      }
      if (typeof value === "object") {
        value.important = true;
      }
    }
    properties[property[1]] = value;
  }
  return properties;
};

window.fashion.$parser.identifyExpression = function() {
  return /(([\s][\+\-\/\*\=][\s])|[\(\)\[\]]|\@|\$)/g;
};

window.fashion.$parser.parsePropertyValue = function(value, variables, allowExpression, forceArray) {
  var parts, piece;
  if (allowExpression == null) {
    allowExpression = true;
  }
  if (forceArray == null) {
    forceArray = false;
  }
  if (allowExpression && value.match($wf.$parser.identifyExpression())) {
    return window.fashion.$parser.parseSingleValue(value, variables, true);
  }
  if (forceArray || (typeof value === "string" && value.indexOf(" ") !== -1)) {
    parts = value.match(/(["'][^'"]*["']|[\S]+)/g);
    if (!forceArray && parts.length === 1) {
      return window.fashion.$parser.parseSingleValue(value, variables, allowExpression);
    }
    return (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        piece = parts[_i];
        _results.push(window.fashion.$parser.parseSingleValue(piece, variables, allowExpression));
      }
      return _results;
    })();
  } else {
    return window.fashion.$parser.parseSingleValue(value, variables, allowExpression);
  }
};

window.fashion.$parser.parseSingleValue = function(value, variables, allowExpression) {
  var hasVariable, valueObject, vars;
  if (allowExpression == null) {
    allowExpression = true;
  }
  valueObject = {
    dynamic: false
  };
  hasVariable = false;
  if (value.indexOf("$") !== -1 || value.indexOf("@") !== -1) {
    vars = valueObject.dependencies = value.match(/(\$([\w\-]*)|\@([\w\-]*))/g);
    valueObject.dynamic = true;
    hasVariable = vars.length > 0;
    if (vars.length === 1 && vars[0] === value) {
      if (vars[0][0] === "@") {
        vars[0] = vars[0].toLowerCase();
      }
      valueObject.link = vars[0];
      return valueObject;
    }
  }
  if (allowExpression && value.match($wf.$parser.identifyExpression())) {
    return window.fashion.$parser.parseExpression(value, variables, window.fashion.$functions, window.fashion.$globals);
  } else if (hasVariable) {
    valueObject.link = vars[0];
    return valueObject;
  }
  return value;
};
window.fashion.$parser.parseExpression = function(expString, vars, funcs, globals, top) {
  var contained, dependencies, dynamic, e, eObj, end, evaluate, expander, functions, funit, individualized, length, matchParens, regex, replaceInScript, script, scriptOffset, section, shouldBreak, start, type, types, unit, units, _ref, _ref1;
  if (top == null) {
    top = true;
  }
  expander = $wf.$parser.expressionExpander;
  matchParens = window.fashion.$parser.matchParenthesis;
  dependencies = [];
  functions = [];
  script = expString;
  individualized = dynamic = false;
  types = [];
  units = [];
  scriptOffset = 0;
  replaceInScript = function(start, length, string) {
    script = $wf.$parser.spliceString(script, start + scriptOffset, length, string);
    return scriptOffset += string.length - length;
  };
  regex = /(\@(self|this|parent)\.?([^\s\)]*)|\$([\w\-]+)|\@([\w\-]+)|([\-]{0,1}([\.]{0,1}\d+|\d+(\.\d*)?)[a-zA-Z]{1,4})|([\w\-\@\$]*)\(|\(|\)([\S]*))/g;
  shouldBreak = false;
  while (!shouldBreak && (section = regex.exec(expString))) {
    start = section.index;
    length = section[0].length;
    end = start + length;
    if (section[2]) {
      eObj = expander.relativeObject(section[2], section[3]);
    } else if (section[4]) {
      eObj = expander.localVariable(section[4], vars);
    } else if (section[5]) {
      eObj = expander.globalVariable(section[5], globals);
    } else if (section[6]) {
      eObj = expander.numberWithUnit(section[6]);
    } else if (section[9]) {
      _ref = matchParens(regex, expString, end), contained = _ref.body, funit = _ref.unit;
      if (!contained) {
        contained = expString.substring(end, expString.length - 1);
        shouldBreak = true;
      }
      length += contained.length + 1;
      if (funit) {
        length += funit.length;
      }
      eObj = expander["function"](section[9], contained, funit, vars, funcs, globals);
    }
    if (!eObj) {
      continue;
    }
    if (eObj.script) {
      replaceInScript(start, length, eObj.script);
    }
    if (eObj.dependencies) {
      dependencies.push.apply(dependencies, eObj.dependencies);
    }
    if (eObj.functions) {
      functions.push.apply(functions, eObj.functions);
    }
    if (eObj.dynamic === true) {
      dynamic = true;
    }
    if (eObj.individualized === true) {
      individualized = true;
    }
    types.push(eObj.type === void 0 ? $wf.$type.Unknown : eObj.type);
    units.push(eObj.unit || '');
  }
  _ref1 = $wf.$parser.determineExpressionType(types, units), type = _ref1.type, unit = _ref1.unit;
  if (expString.match(/\s\=\s/g)) {
    unit = void 0;
  }
  if (top) {
    if (unit) {
      script = "return (" + script + ") + '" + unit + "'";
    } else {
      script = "return " + script;
    }
    try {
      evaluate = Function("v", "g", "f", "t", "e", script);
    } catch (_error) {
      e = _error;
      console.log("[FASHION] Could not compile script: " + script);
      throw e;
      evaluate = void 0;
    }
  } else {
    script = "{value: " + script + ", type: " + type + ", unit: '" + unit + "'}";
  }
  return {
    type: type,
    unit: unit,
    dynamic: dynamic,
    individualized: individualized,
    script: script,
    evaluate: evaluate,
    dependencies: dependencies,
    functions: functions
  };
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
    if (type === $wf.$type.Number) {
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
  localVariable: function(name, vars) {
    var vObj;
    vObj = vars[name];
    if (!vObj) {
      return console.log("[FASHION] Variable $" + name + " does not exist.");
    }
    return {
      type: vObj.type,
      unit: vObj.unit,
      dynamic: true,
      script: "v." + name + ".value",
      dependencies: ["$" + name]
    };
  },
  globalVariable: function(name, globals) {
    var vObj;
    name = name.toLowerCase();
    vObj = globals[name];
    if (!vObj) {
      return console.log("[FASHION] Variable $" + name + " does not exist.");
    }
    return {
      type: vObj.type,
      unit: vObj.unit,
      dynamic: true,
      script: "g." + name + ".get()",
      dependencies: ["@" + name]
    };
  },
  numberWithUnit: function(value) {
    var numberType, unittedValue;
    numberType = window.fashion.$type.Number;
    unittedValue = window.fashion.$run.getUnit(value, numberType, $wf.$type, $wf.$unit);
    if (unittedValue.value === NaN) {
      unittedValue.value = 0;
    }
    return {
      type: numberType,
      unit: unittedValue.unit,
      script: unittedValue.value.toString()
    };
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
    return {
      type: type,
      unit: unit,
      script: script,
      dynamic: true,
      individualized: true
    };
  },
  "function": function(name, argumentsString, inputUnit, vars, funcs, globals) {
    var arg, args, dependencies, dynamic, expression, expressions, fObj, functions, individualized, scripts, unit, _i, _len;
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
          _results.push(window.fashion.$parser.parseExpression(arg, vars, funcs, globals, false));
        }
        return _results;
      })();
    } else {
      expressions = [];
    }
    dependencies = [];
    functions = [name];
    scripts = ["t"];
    individualized = fObj.individualized || false;
    dynamic = fObj.dynamic || false;
    for (_i = 0, _len = expressions.length; _i < _len; _i++) {
      expression = expressions[_i];
      if (expression.dynamic === true) {
        dynamic = true;
      }
      if (expression.individualized === true) {
        individualized = true;
      }
      dependencies.push.apply(dependencies, expression.dependencies || []);
      functions.push.apply(functions, expression.functions || []);
      scripts.push(expression.script);
    }
    if (fObj.unit !== void 0) {
      unit = fObj.unit;
    } else if (fObj.unitFrom !== void 0) {
      unit = expressions[fObj.unitFrom].unit;
    } else {
      unit = "";
    }
    return {
      type: fObj.output,
      unit: inputUnit || unit,
      script: "f['" + name + "'].evaluate.call(" + (scripts.join(',')) + ")",
      dependencies: dependencies,
      functions: functions,
      dynamic: dynamic,
      individualized: individualized
    };
  }
};
window.fashion.$processor = {
  process: function(parseTree) {
    parseTree["javascript"] = [];
    window.fashion.$processor.listRequirements(parseTree);
    parseTree = window.fashion.$processor.blocks(parseTree, $wf.$blocks);
    parseTree = window.fashion.$processor.properties(parseTree, $wf.$properties);
    return parseTree;
  },
  listRequirements: function(parseTree) {
    var bName, block, fName, gName, properties, property, req, selector, vName, value, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _results;
    parseTree.requirements = {
      globals: {},
      functions: {},
      blocks: {},
      properties: {}
    };
    req = parseTree.requirements;
    _ref = parseTree.selectors;
    for (selector in _ref) {
      properties = _ref[selector];
      for (property in properties) {
        value = properties[property];
        if (!(typeof value === "object")) {
          continue;
        }
        if ($wf.$properties[property]) {
          req.properties[property] = $wf.$properties[property];
        }
        if (value.dependencies) {
          _ref1 = value.dependencies;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            vName = _ref1[_i];
            if (vName[0] === "@") {
              gName = vName.substr(1);
              if ($wf.$globals[gName]) {
                req.globals[gName] = $wf.$globals[property];
              }
            }
          }
        }
        if (value.functions) {
          _ref2 = value.functions;
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            fName = _ref2[_j];
            if ($wf.$functions[fName]) {
              req.functions[fName] = $wf.$functions[fName];
            }
          }
        }
      }
    }
    _ref3 = parseTree.blocks;
    _results = [];
    for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
      block = _ref3[_k];
      bName = block.type;
      if ($wf.$blocks[bName]) {
        _results.push(req.blocks[bName] = $wf.$blocks[bName]["runtimeObject"]);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  }
};
window.fashion.$processor.api = {
  throwError: function(property, error) {
    return console.log("[FASHION: " + property + "] " + error);
  },
  setProperty: function(parseTree, selector, insertIndex, name, value) {
    var index, k, properties, v, _i, _len;
    properties = parseTree.selectors[selector];
    if (!properties) {
      return false;
    }
    index = 0;
    for (v = _i = 0, _len = properties.length; _i < _len; v = ++_i) {
      k = properties[v];
      index++;
      if (index < insertIndex) {
        continue;
      }
      if (k === name) {
        return false;
      }
    }
    return properties[name] = value;
  },
  getProperty: function(parseTree, selector, property) {
    var properties;
    properties = parseTree.selectors[selector];
    if (!properties) {
      return false;
    }
    return properties[property];
  },
  addRule: function(parseTree, selector, properties) {
    if (parseTree.selectors[selector]) {
      return $wf.$extend(parseTree.selectors[selector], properties);
    } else {
      return parseTree.selectors[selector] = properties;
    }
  },
  addScript: function(parseTree, script) {
    if (!parseTree["javascript"]) {
      parseTree["javascript"] = [];
    }
    return parseTree.javascript.push(script);
  },
  parseValue: function(value) {
    if (!value || typeof value !== "string") {
      return "";
    }
    return $wf.$parser.parseSingleValue(value);
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
      addRule: funcs.setProperty.bind(0, parseTree),
      getProperty: funcs.setProperty.bind(0, parseTree),
      addScript: funcs.addScript.bind(0, parseTree),
      parseValue: funcs.parseValue,
      parse: $wf.$parser.parse,
      runtimeObject: parseTree.requirements.blocks[block.type]
    };
    blockObj.compile.call(API, block["arguments"], block.body);
  }
  return parseTree;
};
window.fashion.$processor.properties = function(parseTree, properties) {
  var API, funcs, index, property, selector, selectorProperties, value, _ref;
  funcs = window.fashion.$processor.api;
  _ref = parseTree.selectors;
  for (selector in _ref) {
    selectorProperties = _ref[selector];
    index = -1;
    for (property in selectorProperties) {
      value = selectorProperties[property];
      index++;
      if (properties[property] && properties[property]['compile']) {
        API = {
          throwError: funcs.throwError.bind(0, property),
          setProperty: funcs.setProperty.bind(0, parseTree, selector, index),
          getProperty: funcs.setProperty.bind(0, parseTree, selector),
          parseValue: funcs.parseValue
        };
        properties[property].compile.call(API, value);
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
    vObj.raw = value;
    unittedValue = this.getUnit(value, vObj.type, types);
    if (unittedValue.unit && unittedValue.unit !== vObj.unit) {
      vObj.unit = unittedValue.unit;
    }
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
  var compositeTypeMap, determineCompositeType, determineConstantType, determineSinglePartType;
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
    if (__indexOf.call(constants.colors, value) >= 0) {
      return types.Color;
    }
  };
  compositeTypeMap = {
    C2Number: [0, 0],
    C4Number: [0, 0, 0, 0],
    CBorder: [[0, 103, 2], [104, 0, 103, 2]]
  };
  determineCompositeType = function(value) {};
  if (value.indexOf(" ") === -1) {
    return determineSinglePartType(value);
  } else {
    return determineCompositeType(value);
  }
};
window.fashion.$run.getUnit = function(rawValue, varType, type, unit) {
  var getColorUnit, getNumberUnit;
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
  getColorUnit = function() {
    if (rawValue[0] === "#") {
      return {
        value: rawValue,
        unit: unit.Color.Hex
      };
    }
    if (rawValue.toLowerCase().indexOf("rgba") === 0) {
      return {
        value: rawValue,
        unit: unit.Color.RGBA
      };
    }
    if (rawValue.toLowerCase().indexOf("rgb") === 0) {
      return {
        value: rawValue,
        unit: unit.Color.RGB
      };
    }
    return {
      value: rawValue,
      unit: unit.Color.Const
    };
  };
  if (varType === type.Number) {
    return getNumberUnit();
  }
  if (varType === type.Color) {
    return getColorUnit();
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
  actualizeFullSheet: function(parseTree, index) {
    var rules, selMap, _ref;
    _ref = $wf.$actualizer.makeDomStyleFromTree(parseTree, index), selMap = _ref.map, rules = _ref.rules;
    window.fashion.$actualizer.addScriptFromTree(parseTree, selMap, rules);
    return true;
  }
};
window.fashion.$actualizer.generateStyleProperties = function(selectors, variables) {
  var evaluated, newSelector, properties, ps, rules, selector, selectorIsDynamic, sheets, tCSS, wrap;
  rules = {
    dynamic: [],
    "static": [],
    javascript: {
      dynamic: {},
      individual: {}
    },
    final: {
      dynamic: [],
      "static": []
    }
  };
  for (selector in selectors) {
    properties = selectors[selector];
    newSelector = window.fashion.$run.expandVariables(selector, variables);
    selectorIsDynamic = newSelector !== selector;
    sheets = $wf.$actualizer.splitProperties(properties, !selectorIsDynamic);
    ps = sheets.props;
    wrap = (function(sel) {
      return function(css) {
        return {
          name: sel,
          value: css
        };
      };
    })(selector);
    if (sheets.lengths["static"] > 0) {
      evaluated = $wf.$actualizer.propertiesToCSS(ps["static"], variables);
      rules["static"].push(wrap("" + newSelector + " {" + (evaluated.join('')) + "}"));
    }
    if (sheets.lengths.dynamic > 0) {
      evaluated = $wf.$actualizer.propertiesToCSS(ps.dynamic, variables);
      rules.dynamic.push(wrap("" + newSelector + " {" + (evaluated.join('')) + "}"));
    }
    if (sheets.lengths.dynamic > 0) {
      rules.javascript.dynamic[selector] = ps.dynamic;
    }
    if (sheets.lengths.individual > 0) {
      rules.javascript.individual[selector] = ps.individual;
    }
    tCSS = window.fashion.$actualizer.addTransitions(sheets.transitions);
    if (sheets.lengths["static"] > 0 && tCSS["static"]) {
      evaluated = $wf.$actualizer.propertiesToCSS(ps["static"], variables);
      rules["static"].push(wrap("" + newSelector + " {" + (evaluated.join('')) + tCSS["static"] + "}"));
    }
    if (sheets.lengths.dynamic > 0 && tCSS.dynamic) {
      evaluated = $wf.$actualizer.propertiesToCSS(ps.dynamic, variables);
      rules.dynamic.push(wrap("" + newSelector + " {" + (evaluated.join('')) + tCSS.dynamic + "}"));
    }
  }
  return rules;
};

window.fashion.$actualizer.splitProperties = function(properties, allowStatic) {
  var lengths, property, props, transitions, value, vi;
  if (allowStatic == null) {
    allowStatic = true;
  }
  props = {
    dynamic: {},
    "static": {},
    individual: {}
  };
  lengths = {
    dynamic: 0,
    "static": 0,
    individual: 0
  };
  transitions = [];
  for (property in properties) {
    value = properties[property];
    if (typeof value === 'object' && value['transition']) {
      transitions[property] = value.transition;
      value.transition = void 0;
    }
    if (value instanceof Array) {
      if (((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          vi = value[_i];
          if (vi["individualized"]) {
            _results.push(true);
          }
        }
        return _results;
      })())[0]) {
        props.individual[property] = value;
        lengths.individual++;
      } else if (!allowStatic || ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          vi = value[_i];
          if (vi["dynamic"]) {
            _results.push(true);
          }
        }
        return _results;
      })())[0]) {
        props.dynamic[property] = value;
        lengths.dynamic++;
      } else {
        props["static"][property] = value;
        lengths["static"]++;
      }
    } else if (typeof value === 'object') {
      if (value["individualized"] === true) {
        props.individual[property] = value;
        lengths.individual++;
      } else if (!allowStatic || value["dynamic"] === true) {
        props.dynamic[property] = value;
        lengths.dynamic++;
      } else {
        props["static"][property] = value;
        lengths["static"]++;
      }
    } else if (allowStatic) {
      props["static"][property] = value;
      lengths["static"]++;
    } else {
      props.dynamic[property] = value;
      lengths.dynamic++;
    }
  }
  return {
    props: props,
    lengths: lengths,
    transitions: transitions
  };
};

window.fashion.$actualizer.propertiesToCSS = function(properties, variables, evalFunction) {
  var cssValues, property, val, valueObject, vi, vo;
  if (!evalFunction) {
    evalFunction = window.fashion.$run.evaluate;
  }
  cssValues = [];
  for (property in properties) {
    valueObject = properties[property];
    if (valueObject instanceof Array) {
      if (valueObject[0] instanceof Array) {
        val = ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = valueObject.length; _i < _len; _i++) {
            vi = valueObject[_i];
            _results.push(((function() {
              var _j, _len1, _results1;
              _results1 = [];
              for (_j = 0, _len1 = vi.length; _j < _len1; _j++) {
                vo = vi[_j];
                _results1.push(evalFunction(vo, 0, variables, $wf.$type, {}, $wf.$globals));
              }
              return _results1;
            })()).join(" "));
          }
          return _results;
        })()).join(", ");
      } else {
        val = ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = valueObject.length; _i < _len; _i++) {
            vi = valueObject[_i];
            _results.push(evalFunction(vi, 0, variables, $wf.$type, {}, $wf.$globals));
          }
          return _results;
        })()).join(" ");
      }
    } else {
      val = evalFunction(valueObject, 0, variables, $wf.$type, $wf.$functions, $wf.$globals);
    }
    cssValues.push("" + property + ": " + val + ";");
  }
  return cssValues;
};

window.fashion.$actualizer.addTransitions = function(transitions) {
  var hasDynamic, hasStatic, isDynamic, property, t, tDynamic, tStatic, tString;
  tStatic = tDynamic = "transition: ";
  hasStatic = hasDynamic = false;
  for (property in transitions) {
    t = transitions[property];
    isDynamic = t.easing && typeof t.easing === 'object' && t.easing.dynamic;
    isDynamic &= t.duration && typeof t.duration === 'object' && t.duration.dynamic;
    isDynamic &= t.delay && typeof t.delay === 'object' && t.delay.dynamic;
    tString = "" + property + " " + (t.duration || '1s') + " " + (t.easing || '') + " " + (t.delay || '') + ",";
    if (isDynamic) {
      tDynamic += tString;
    } else {
      tStatic += tString;
    }
    if (isDynamic) {
      hasDynamic = true;
    } else {
      hasStatic = true;
    }
  }
  tStatic = tStatic.substr(0, tStatic.length - 1) + ";";
  tDynamic = tDynamic.substr(0, tDynamic.length - 1) + ";";
  tStatic = [tStatic, "-webkit-" + tStatic, "-moz-" + tStatic, "-ms-" + tStatic].join('');
  tDynamic = [tDynamic, "-webkit-" + tDynamic, "-moz-" + tDynamic, "-ms-" + tDynamic].join('');
  return {
    "static": (hasStatic ? tStatic : false),
    dynamic: (hasDynamic ? tDynamic : false)
  };
};
window.fashion.$actualizer.makeDomStyleFromTree = function(parseTree, index) {
  var dynamicMap, dynamicSheet, row, rule, rules, staticMap, staticSheet, _ref, _ref1;
  dynamicSheet = window.fashion.$dom.makeStylesheet("fashionDynamic", index, true);
  staticSheet = window.fashion.$dom.makeStylesheet("fashionStatic", index, false);
  window.fashion.$dom.addElementToHead(staticSheet);
  window.fashion.$dom.addElementToHead(dynamicSheet);
  rules = window.fashion.$actualizer.generateStyleProperties(parseTree.selectors, parseTree.variables);
  staticMap = {};
  _ref = rules["static"];
  for (row in _ref) {
    rule = _ref[row];
    staticMap[rule.name] = [index, parseInt(row)];
    window.fashion.$actualizer.addCSSRule(rule.value, staticSheet);
  }
  dynamicMap = {};
  _ref1 = rules.dynamic;
  for (row in _ref1) {
    rule = _ref1[row];
    dynamicMap[rule.name] = [index, parseInt(row)];
    window.fashion.$actualizer.addCSSRule(rule.value, dynamicSheet);
  }
  wait(1, function() {
    return window.fashion.$actualizer.subInFinalRules(rules.final, staticMap, dynamicMap, staticSheet, dynamicSheet);
  });
  return {
    map: dynamicMap,
    rules: rules
  };
};

window.fashion.$actualizer.subInFinalRules = function(final, staticMap, dynamicMap, staticSheet, dynamicSheet) {
  var row, rule, _i, _j, _len, _len1, _ref, _ref1, _results;
  _ref = final["static"];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    rule = _ref[_i];
    row = staticMap[rule.name][1];
    window.fashion.$actualizer.subCSSRule(rule.value, staticSheet, row);
  }
  _ref1 = final.dynamic;
  _results = [];
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    rule = _ref1[_j];
    row = dynamicMap[rule.name][1];
    _results.push(window.fashion.$actualizer.subCSSRule(rule.value, dynamicSheet, row));
  }
  return _results;
};

window.fashion.$actualizer.addCSSRule = function(ruleText, sheetElement) {
  var error, staticIndex;
  staticIndex = window.fashion.$dom.incrementSheetIndex(sheetElement);
  try {
    sheetElement.sheet.insertRule(ruleText, staticIndex);
  } catch (_error) {
    error = _error;
    console.log("[FASHION] Invalid rule: '" + ruleText + "'");
  }
  return staticIndex;
};

window.fashion.$actualizer.subCSSRule = function(ruleText, sheetElement, index) {
  sheetElement.sheet.deleteRule(index);
  return sheetElement.sheet.insertRule(ruleText, index);
};
window.fashion.$actualizer.addScriptFromTree = function(tree, selMap, rules) {
  var jsElement, jsText;
  jsText = $wf.$actualizer.createScriptFromTree(tree, selMap, rules);
  jsElement = $wf.$dom.makeScriptTag(jsText);
  window.fashion.$dom.addElementToHead(jsElement);
  return jsElement;
};

window.fashion.$actualizer.createScriptFromTree = function(tree, selMap, rules) {
  var jsText, s, tr, _i, _len, _ref;
  jsText = window.fashion.$blueprint.initialize(tree, selMap);
  jsText += window.fashion.$blueprint.basicRuntime() + "\n";
  jsText += window.fashion.$actualizer.addSelectorsToJS(rules);
  jsText += window.fashion.$actualizer.addGlobalsToJS(tree) + "\n";
  tr = tree.requirements;
  jsText += "w.FASHION.functions = " + (window.fashion.$stringify(tr.functions)) + ";\n";
  jsText += "w.FASHION.properties = " + (window.fashion.$stringify(tr.properties)) + ";\n";
  jsText += "w.FASHION.blocks = " + (window.fashion.$stringify(tr.blocks)) + ";\n";
  _ref = tree.javascript;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    s = _ref[_i];
    jsText += s;
  }
  jsText += window.fashion.$blueprint.startRuntime();
  return jsText;
};

window.fashion.$actualizer.addSelectorsToJS = function(rules) {
  var selectors;
  selectors = {
    dynamic: rules.javascript.dynamic,
    individual: rules.javascript.individual
  };
  return "w.FASHION.selectors = " + (window.fashion.$stringify(selectors)) + ";\n";
};

window.fashion.$actualizer.addGlobalsToJS = function(tree, globals) {
  var acc, k, name, obj, objString, v, _ref, _ref1;
  if (globals == null) {
    globals = $wf.$globals;
  }
  if (JSON.stringify(tree.globals) === "{}") {
    return "";
  }
  acc = "w.FASHION.globals = {";
  _ref = tree.globals;
  for (name in _ref) {
    obj = _ref[name];
    if (!globals[name]) {
      continue;
    }
    _ref1 = globals[name];
    for (k in _ref1) {
      v = _ref1[k];
      obj[k] = v;
    }
    objString = window.fashion.$stringify(obj);
    acc += "" + name + ": " + (objString.replace('\n', '')) + ",\n";
  }
  return acc.substr(0, acc.length - 2) + "};";
};
window.fashion.$blueprint = {
  initialize: function(parseTree, selMap) {
    return "" + window.fashion.fileHeader + "\nw = window;\nw.FASHION = {\n	variables: " + (JSON.stringify(parseTree.variables)) + ",\n	cssMap: " + (JSON.stringify(selMap)) + ",\n	type: " + (JSON.stringify(window.fashion.$type)) + ",\n	unit: " + (JSON.stringify(window.fashion.$unit)) + ",\n	constants: " + (JSON.stringify(window.fashion.$typeConstants)) + ",\n	config: {\n		variableObject: '" + window.fashion.variableObject + "',\n		cssId: '" + window.fashion.cssId + "'\n	}\n};\n";
  },
  basicRuntime: function() {
    return "var __indexOf = " + ('[].indexOf' || __indexOf.toString()) + ";\nw.FASHION.runtime = " + (window.fashion.$stringify(window.fashion.$run));
  },
  startRuntime: function() {
    return "w.FASHION.runtime.defineProperties.call(w.FASHION.runtime);\nw.FASHION.runtime.watchGlobals.call(w.FASHION.runtime);\nw.FASHION.runtime.applyIndividualizedSelectors.call(\n	w.FASHION.runtime, w.FASHION.selectors.individual);";
  }
};
window.fashion.$functions = {
  random: {
    output: $wf.$type.Number,
    unit: '',
    evaluate: function() {
      return Math.random();
    }
  },
  round: {
    output: $wf.$type.Number,
    unitFrom: 0,
    evaluate: function(n) {
      return Math.round(n.value);
    }
  },
  min: {
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
  },
  max: {
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
  }
};
$wf.$extend(window.fashion.$functions, {
  "@": {
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
  }
});
window.fashion.$properties = {
  "text-style": {
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
  }
};
$wf.$extend(window.fashion.$properties, {
  pin: {
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
  }
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
      this["on-" + evt] = {
        replace: true,
        individualized: true,
        "apply": applyForEvent(evt)
      };
    }
  }

  return _Class;

})()));
window.fashion.$blocks = {};
window.fashion.$blocks["transition"] = {
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
};

window.fashion.$functions["trigger"] = {
  output: $wf.$type.None,
  unit: '',
  dynamic: false,
  individualized: true,
  evaluate: function(name, duration, element) {
    return w.FASHION.blocks.transition.trigger.call(this, name.value, duration, element);
  }
};
window.fashion.$globals = {
  width: {
    type: $wf.$type.Number,
    unit: "px",
    get: function() {
      return window.innerWidth;
    },
    watch: function(onchange) {
      return window.addEventListener("resize", onchange, false);
    }
  },
  height: {
    type: $wf.$type.Number,
    unit: "px",
    get: function() {
      return window.innerHeight;
    },
    watch: function(onchange) {
      return window.addEventListener("resize", onchange, false);
    }
  },
  scrolly: {
    type: $wf.$type.Number,
    unit: "px",
    get: function() {
      return window.scrollY;
    },
    watch: function(onchange) {
      return window.addEventListener("onscroll", onchange);
    }
  },
  scrollx: {
    type: $wf.$type.Number,
    unit: "px",
    get: function() {
      return window.scrollX;
    },
    watch: function(onchange) {
      return window.addEventListener("onscroll", onchange);
    }
  },
  mousey: {
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
  },
  mousex: {
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
  }
};
