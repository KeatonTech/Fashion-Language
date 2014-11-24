
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
      window.fashion.$actualizer.actualizeFullSheet(parseTree, scriptIndex++);
      console.log("[FASHION] Compile finished in " + (new Date().getTime() - start) + "ms");
      if (--fileCount <= 0) {
        return allLoaded();
      }
    });
  }
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
window.fashion.$type = {
  Number: 0,
  String: 1,
  Color: 2,
  C2Number: 50,
  C4Number: 51,
  CBorder: 52,
  CShadow: 53,
  KDisplay: 100,
  KCenter: 101,
  KListStyle: 102,
  KLineStyle: 103,
  KInset: 104,
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
      window.fashion.$parser.backlinkDependencies(key, nb, parsed.variables);
      window.fashion.$parser.backlinkGlobals(parsed, key, nb, $wf.$globals);
    }
    return parsed;
  }
};
window.fashion.$parser.parseSections = function(fashionText) {
  var blocks, newSels, regex, sObj, segment, selectors, startIndex, variables, _i, _len;
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
    } else if (segment[5] && segment[6]) {
      startIndex = segment.index + segment[0].length;
      blocks.push({
        type: segment[5],
        "arguments": segment[7],
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
  return fashionText.substring(startIndex, endIndex);
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

window.fashion.$parser.backlinkDependencies = function(selector, properties, variables) {
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
  regex = /[\s]*([\w\-\s]*)\:[\s]*(\[([\w\-\$\@]*)[\s]*([\w\-\$\@]*)[\s]*([\w\-\$\@]*)\]){0,1}[\s]*(.*?)[\s]*(!important)?[;}\n]/g;
  while (property = regex.exec(bodyString)) {
    if (property.length < 7) {
      continue;
    }
    value = property[6];
    if (value.indexOf(',') !== -1) {
      value = value.split(",");
      for (i in value) {
        item = value[i];
        value[i] = item.trim();
      }
      for (i in value) {
        item = value[i];
        value[i] = window.fashion.$parser.parsePropertyValue(item, vars, true, true);
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

window.fashion.$parser.parsePropertyValue = function(value, variables, allowExpression, forceArray) {
  var piece;
  if (allowExpression == null) {
    allowExpression = true;
  }
  if (forceArray == null) {
    forceArray = false;
  }
  if (allowExpression && value.match(/[\+\-\/\*\(\)\=]/g)) {
    return window.fashion.$parser.parseSingleValue(value, variables, true);
  }
  if (forceArray || (typeof value === "string" && value.indexOf(" ") !== -1)) {
    return (function() {
      var _i, _len, _ref, _results;
      _ref = value.split(" ");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        piece = _ref[_i];
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
    vars = valueObject.dependencies = value.match(/(\$([\w\-\$]*)|\@([\w\-\$]*))/g);
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
  if (allowExpression && value.match(/[\+\-\/\*\(\)\=]/g)) {
    return window.fashion.$parser.parseExpression(value, variables, window.fashion.$functions, window.fashion.$globals);
  } else if (hasVariable) {
    valueObject.link = vars[0];
    return valueObject;
  }
  return value;
};
window.fashion.$parser.spliceString = function(string, start, length, replacement) {
  return string.substr(0, start) + replacement + string.substr(start + length);
};

window.fashion.$parser.parseExpression = function(expressionString, vars, funcs, globals) {
  var dependencies, depth, evaluate, fObj, functions, gObj, numberType, regex, script, section, si, strSplice, string, stringOffset, topLevelTypeUnit, typeUnit, unit, unittedValue, vObj, _i, _len;
  strSplice = window.fashion.$parser.spliceString;
  string = expressionString;
  dependencies = [];
  functions = [];
  unit = void 0;
  regex = /(\$([\w\-]+)|\@([\w\-]+)|([\-]{0,1}([\.]{0,1}\d+|\d+(\.\d*)?)[a-zA-Z]{1,4})|([\w\-]*)\(|\))/g;
  depth = 0;
  stringOffset = 0;
  topLevelTypeUnit = [];
  while (section = regex.exec(expressionString)) {
    si = section.index + stringOffset;
    if (section[2]) {
      vObj = vars[section[2]];
      if (!vObj) {
        console.log("[FASHION] Variable $" + section[2] + " does not exist.");
      } else {
        dependencies.push("$" + section[2]);
        if (depth === 0) {
          topLevelTypeUnit.push([vObj.type, vObj.unit]);
        }
        stringOffset += ("v." + section[2] + ".value").length - section[0].length;
        string = strSplice(string, si, section[0].length, "v." + section[2] + ".value");
      }
    }
    if (section[3]) {
      section[3] = section[3].toLowerCase();
      gObj = globals[section[3]];
      if (!gObj) {
        console.log("[FASHION] Global @" + section[3] + " does not exist.");
      } else {
        dependencies.push("@" + section[3]);
        if (depth === 0) {
          topLevelTypeUnit.push([gObj.type, gObj.unit]);
        }
        stringOffset += ("g." + section[3] + ".get()").length - section[0].length;
        string = strSplice(string, si, section[0].length, "g." + section[3] + ".get()");
      }
    } else if (section[4]) {
      numberType = window.fashion.$type.Number;
      unittedValue = window.fashion.$run.getUnit(section[4], numberType, window.fashion.$type, window.fashion.$unit);
      if (unittedValue.value === NaN) {
        unittedValue.value = 0;
      }
      if (depth === 0) {
        topLevelTypeUnit.push([numberType, unittedValue.unit]);
      }
      stringOffset += unittedValue.value.toString().length - section[0].length;
      string = strSplice(string, si, section[0].length, unittedValue.value.toString());
    } else if (section[6]) {
      depth++;
      fObj = funcs[section[6]];
      if (!fObj) {
        console.log("[FASHION] Function '" + section[6] + "' does not exist.");
      } else {
        functions.push(section[6]);
        if (depth === 1) {
          topLevelTypeUnit.push([fObj.output, false]);
        }
        stringOffset += ("f." + section[6] + "(").length - section[0].length;
        string = strSplice(string, si, section[0].length, "f." + section[6] + "(");
      }
    } else if (section[0] === ")") {
      depth--;
    }
  }
  for (_i = 0, _len = topLevelTypeUnit.length; _i < _len; _i++) {
    typeUnit = topLevelTypeUnit[_i];
    if (typeUnit[1]) {
      if (!unit) {
        unit = typeUnit[1];
      } else if (unit !== typeUnit[1]) {
        console.log("[FASHION] Conflicting units '" + unit + "' and '" + typeUnit[1] + "'");
        console.log("[FASHION] Unit conversion will be implemented in the future");
        return "";
      }
    }
  }
  script = "return (" + string + ") + '" + (unit || '') + "'";
  evaluate = Function("v", "g", "f", script);
  return {
    dependencies: dependencies,
    functions: functions,
    dynamic: dependencies.length > 0,
    evaluate: evaluate,
    script: script
  };
};
window.fashion.$run = {
  throwError: function(message) {
    return console.log("[FASHION] " + message);
  },
  initializeSelector: function(selectors) {
    var key, pVal, properties, sel, _results;
    if (selectors == null) {
      selectors = FASHION.selectors;
    }
    _results = [];
    for (sel in selectors) {
      properties = selectors[sel];
      _results.push((function() {
        var _results1;
        _results1 = [];
        for (key in properties) {
          pVal = properties[key];
          if (typeof pVal === "object" && pVal["script"]) {
            _results1.push(pVal["evaluate"] = Function("v", "g", "f", pVal["script"]));
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      })());
    }
    return _results;
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
  updateSelector: function(name, variables, selectors, map) {
    var cssElem, location, properties;
    if (!variables) {
      variables = FASHION.variables;
    }
    if (!selectors) {
      selectors = FASHION.selectors;
    }
    if (!map) {
      map = FASHION.cssMap;
    }
    properties = selectors[name];
    if (!properties) {
      return this.throwError("Could not find selector '" + name + "'");
    }
    location = map[name];
    if (!location) {
      return this.throwError("Could not find selector '" + name + "' in CSS");
    }
    cssElem = document.getElementById("" + FASHION.config.cssId + location[0]);
    cssElem.sheet.deleteRule(location[1]);
    return cssElem.sheet.insertRule(this.regenerateSelector(name, properties), location[1]);
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
      if (dynamicSelector || valueObject.dynamic === true) {
        val = this.evaluate(valueObject, void 0, variables);
        dynamicProps += "" + property + ": " + val + ";";
      }
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
  var evaluateSingleValue, joinArray, value;
  if (!variables) {
    variables = FASHION.variables;
  }
  if (!types) {
    types = FASHION.type;
  }
  if (!funcs) {
    funcs = window.fashion.$functions;
  }
  if (!globals) {
    globals = FASHION.globals;
  }
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
      return valueObject.evaluate(variables, globals, funcs);
    }
  };
  if (typeof valueObject === "array") {
    joinArray = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = valueObject.length; _i < _len; _i++) {
        value = valueObject[_i];
        _results.push(evaluateSingleValue(valueObject));
      }
      return _results;
    })();
    return joinArray.join(' ');
  } else {
    return evaluateSingleValue(valueObject);
  }
};
window.fashion.$run.defineProperties = function(variables, objectName) {
  var container, propObject, varName, varObj, _results;
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
    _results.push(Object.defineProperty(container, "$" + varName, propObject));
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
window.fashion.$actualizer = {
  actualizeFullSheet: function(parseTree, index) {
    var selMap;
    selMap = window.fashion.$actualizer.makeDomStyleFromTree(parseTree, index);
    window.fashion.$actualizer.addScriptFromTree(parseTree, selMap);
    return true;
  }
};
window.fashion.$actualizer.makeDomStyleFromTree = function(parseTree, index) {
  var dynamicMap, dynamicSheet, row, rule, rules, staticMap, staticSheet, _ref, _ref1;
  dynamicSheet = window.fashion.$dom.makeStylesheet("fashionDynamic", index, true);
  staticSheet = window.fashion.$dom.makeStylesheet("fashionStatic", index, false);
  window.fashion.$dom.addElementToHead(staticSheet);
  window.fashion.$dom.addElementToHead(dynamicSheet);
  rules = window.fashion.$actualizer.generateStyleProperties(parseTree.selectors, parseTree.variables);
  console.table(rules["static"]);
  console.table(rules.dynamic);
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
  return dynamicMap;
};

window.fashion.$actualizer.generateStyleProperties = function(selectors, variables) {
  var dynamicProps, dynamicSelector, hasDynamicProps, hasStaticProps, hasTransition, newSelector, properties, property, rDynamic, rStatic, selector, staticProps, tCSS, tDynamic, tStatic, transitions, val, valueObject;
  rStatic = [];
  rDynamic = [];
  tStatic = [];
  tDynamic = [];
  for (selector in selectors) {
    properties = selectors[selector];
    newSelector = window.fashion.$run.expandVariables(selector, variables);
    dynamicProps = staticProps = "" + newSelector + " {";
    dynamicSelector = newSelector !== selector;
    hasDynamicProps = hasStaticProps = false;
    if (dynamicSelector) {
      hasDynamicProps = true;
    }
    transitions = [];
    hasTransition = false;
    for (property in properties) {
      valueObject = properties[property];
      val = window.fashion.$run.evaluate(valueObject, void 0, variables, $wf.$type, {}, $wf.$globals);
      if (typeof valueObject === 'object' && valueObject['transition']) {
        hasTransition = true;
        transitions[property] = valueObject.transition;
      }
      if (dynamicSelector || valueObject["dynamic"] === true) {
        dynamicProps += "" + property + ": " + val + ";";
        hasDynamicProps = true;
      } else {
        staticProps += "" + property + ": " + val + ";";
        hasStaticProps = true;
      }
    }
    tCSS = window.fashion.$actualizer.addTransitions(transitions);
    if (tCSS["static"]) {
      tStatic.push({
        name: selector,
        value: staticProps + tCSS["static"] + "}"
      });
    }
    if (tCSS.dynamic) {
      tDynamic.push({
        name: selector,
        value: dynamicProps + tCSS.dynamic + "}"
      });
    }
    if (hasStaticProps) {
      rStatic.push({
        name: selector,
        value: staticProps + "}"
      });
    }
    if (hasDynamicProps) {
      rDynamic.push({
        name: selector,
        value: dynamicProps + "}"
      });
    }
  }
  return {
    "static": rStatic,
    dynamic: rDynamic,
    final: {
      "static": tStatic,
      dynamic: tDynamic
    }
  };
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
window.fashion.$actualizer.addScriptFromTree = function(tree, selMap) {
  var jsElement, jsText;
  jsText = window.fashion.$actualizer.createScriptFromTree(tree, selMap);
  jsElement = window.fashion.$dom.makeScriptTag(jsText);
  window.fashion.$dom.addElementToHead(jsElement);
  return jsElement;
};

window.fashion.$actualizer.createScriptFromTree = function(tree, selMap) {
  var jsText;
  jsText = window.fashion.$blueprint.initialize(tree, selMap);
  jsText += window.fashion.$blueprint.basicRuntime() + "\n";
  jsText += window.fashion.$actualizer.addGlobals(tree) + "\n";
  jsText += window.fashion.$blueprint.startRuntime();
  return jsText;
};

window.fashion.$actualizer.addGlobals = function(tree, globals) {
  var acc, k, name, obj, objString, v, _ref, _ref1;
  if (globals == null) {
    globals = $wf.$globals;
  }
  if (JSON.stringify(tree.globals) === "{}") {
    return "";
  }
  acc = "w.FASHION.globals = {\n";
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
    objString = "{type: " + obj.type + ", unit: '" + obj.unit + "', dependants: " + (JSON.stringify(obj.dependants)) + ", \nget: " + (obj.get.toString()) + ", watch: " + (obj.watch.toString()) + "}";
    acc += "" + name + ": " + (objString.replace('\n', '')) + ",\n";
  }
  return acc.substr(0, acc.length - 2) + "};";
};
window.fashion.$blueprint = {
  initialize: function(parseTree, selMap) {
    return "" + window.fashion.fileHeader + "\nw = window;\nw.FASHION = {\n	variables: " + (JSON.stringify(parseTree.variables)) + ",\n	selectors:  " + (JSON.stringify(parseTree.selectors)) + ",\n	cssMap: " + (JSON.stringify(selMap)) + ",\n	type: " + (JSON.stringify(window.fashion.$type)) + ",\n	unit: " + (JSON.stringify(window.fashion.$unit)) + ",\n	constants: " + (JSON.stringify(window.fashion.$typeConstants)) + ",\n	config: {\n		variableObject: '" + window.fashion.variableObject + "',\n		cssId: '" + window.fashion.cssId + "'\n	}\n};\n";
  },
  basicRuntime: function() {
    return "var __indexOf = " + ('[].indexOf' || __indexOf.toString()) + ";\nw.FASHION.runtime = {\n	throwError: " + (window.fashion.$run.throwError.toString()) + ",\n	initializeSelector: " + (window.fashion.$run.initializeSelector.toString()) + ",\n	updateVariable: " + (window.fashion.$run.updateVariable.toString()) + ",\n	getVariable: " + (window.fashion.$run.getVariable.toString()) + ",\n	evaluate: " + (window.fashion.$run.evaluate.toString()) + ",\n	determineType: " + (window.fashion.$run.determineType.toString()) + ",\n	getUnit: " + (window.fashion.$run.getUnit.toString()) + ",\n	defineProperties: " + (window.fashion.$run.defineProperties.toString()) + ",\n	watchGlobals: " + (window.fashion.$run.watchGlobals.toString()) + ",\n	updateSelector: " + (window.fashion.$run.updateSelector.toString()) + ",\n	regenerateSelector: " + (window.fashion.$run.regenerateSelector.toString()) + ",\n	expandVariables: " + (window.fashion.$run.expandVariables.toString()) + "\n}";
  },
  startRuntime: function() {
    return "w.FASHION.runtime.initializeSelector()\nw.FASHION.runtime.defineProperties.call(w.FASHION.runtime)\nw.FASHION.runtime.watchGlobals.call(w.FASHION.runtime)";
  }
};
window.fashion.$functions = {
  round: {
    output: $wf.$type.Number,
    unitFrom: 0,
    evaluate: function(n) {
      return Math.round(n.value);
    }
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
