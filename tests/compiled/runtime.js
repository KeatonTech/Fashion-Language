(function() {
  if (!window.fashiontests) {
    window.fashiontests = {};
  }

  window.fashiontests.runtime = {};

  window.fashiontests.runtime.simulateRuntime = function(css, js) {
    window.fashion.$dom.addStylesheet(css);
    return eval(js);
  };

  window.fashiontests.runtime.cleanup = function() {
    var sheet, sheets, tdiv, _i, _len;
    sheet = document.getElementById(window.fashion.cssId);
    if (sheet != null) {
      sheet.parentNode.removeChild(sheet);
    }
    sheet = document.getElementById(window.fashion.runtimeConfig.individualCSSID);
    if (sheet != null) {
      sheet.parentNode.removeChild(sheet);
    }
    sheet = document.getElementById(window.fashion.runtimeConfig.scopedCSSID);
    if (sheet != null) {
      sheet.parentNode.removeChild(sheet);
    }
    sheets = document.getElementsByClassName(window.fashion.runtimeConfig.scopedCSSID);
    for (_i = 0, _len = sheets.length; _i < _len; _i++) {
      sheet = sheets[_i];
      if (sheet != null) {
        sheet.parentNode.removeChild(sheet);
      }
    }
    window.FASHION = void 0;
    window.FSMIN = void 0;
    window.style = void 0;
    if (tdiv = document.getElementById("FSTESTBLOCK")) {
      document.body.removeChild(tdiv);
    }
    window.FSDOMWATCHERS = void 0;
    if (window.FSOBSERVER != null) {
      window.FSOBSERVER.disconnect();
      delete window.FSOBSERVER;
    }
    return window.FASHION_NO_OBSERVE = false;
  };

  window.fashiontests.runtime.getRule = function(id, sheetId) {
    var rules, sheet;
    if (sheetId == null) {
      sheetId = window.fashion.cssId;
    }
    sheet = document.getElementById(sheetId);
    rules = sheet.sheet.rules || sheet.sheet.cssRules;
    if (id > rules.length) {
      console.log("[FASHION] No rule at index " + id);
    }
    return rules[id];
  };

  window.fashiontests.runtime.testDiv = function(html) {
    var testDiv;
    testDiv = document.createElement("div");
    testDiv.id = "FSTESTBLOCK";
    testDiv.innerHTML = html;
    document.body.appendChild(testDiv);
    return "FSTESTBLOCK";
  };

}).call(this);
(function() {
  window.fashiontests.runtime.variables = function() {
    var $wf, getRule, testFSS;
    $wf = window.fashion;
    testFSS = function(fss) {
      var css, js, _ref;
      _ref = $wf.$actualizer.actualize($wf.$processor.process($wf.$parser.parse(fss))), css = _ref.css, js = _ref.js;
      return window.fashiontests.runtime.simulateRuntime(css, js);
    };
    afterEach(window.fashiontests.runtime.cleanup);
    getRule = window.fashiontests.runtime.getRule;
    beforeEach(function() {
      window.fsStyleHeader = $wf.styleHeader;
      $wf.styleHeader = "";
      window.fsStyleHeaderRules = $wf.styleHeaderRules;
      return $wf.styleHeaderRules = 0;
    });
    afterEach(function() {
      $wf.styleHeader = window.fsStyleHeader;
      return $wf.styleHeaderRules = window.fsStyleHeaderRules;
    });
    it('should watch for changes to the variable object', function() {
      testFSS("$color: blue;");
      style.color = "red";
      expect(style.color).toBe("red");
      return expect(FASHION.variables.color["default"]).toBe("red");
    });
    it('should change selectors when variables change', function() {
      testFSS("$color: blue;\ndiv {\n	background-color: $color;\n}");
      expect(getRule(0).style.cssText).toBe("background-color: blue;");
      style.color = "red";
      return expect(getRule(0).style.cssText).toBe("background-color: red;");
    });
    it('should change dynamically named selectors when variables change', function() {
      testFSS("$id: start;\n#$id {\n	background-color: red;\n}");
      expect(getRule(0).selectorText).toBe("#start");
      style.id = "end";
      return expect(getRule(0).selectorText).toBe("#end");
    });
    it('should maintain the !important tag on changed selectors', function() {
      testFSS("$color: blue;\ndiv {\n	background-color: $color !important;\n}");
      expect(getRule(0).style.cssText).toBe("background-color: blue !important;");
      style.color = "red";
      return expect(getRule(0).style.cssText).toBe("background-color: red !important;");
    });
    it('should change transition durations and delays', function() {
      testFSS("$duration: 300ms;\n$delay: 200ms;\ndiv {\n	background-color: [ease-out $duration $delay] red;\n}");
      expect(getRule(0).style.transition).toBe("background-color 300ms ease-out 200ms");
      style.duration = 500;
      style.delay = 100;
      return expect(getRule(0).style.transition).toBe("background-color 500ms ease-out 100ms");
    });
    return it('should change variables that rely on other variables', function() {
      testFSS("$padding: 10px;\n$width: 400px - 2 * $padding;\ndiv {\n	width: $width;\n}");
      expect(getRule(0).style.cssText).toBe("width: 380px;");
      style.padding = 100;
      return expect(getRule(0).style.cssText).toBe("width: 200px;");
    });
  };

}).call(this);
(function() {
  window.fashiontests.runtime.individual = function() {
    var $wf, getIndRule, testDiv, testFSS;
    $wf = window.fashion;
    testFSS = function(fss) {
      var css, js, _ref;
      _ref = $wf.$actualizer.actualize($wf.$processor.process($wf.$parser.parse(fss))), css = _ref.css, js = _ref.js;
      return window.fashiontests.runtime.simulateRuntime(css, js);
    };
    beforeEach(window.fashiontests.runtime.cleanup);
    afterEach(window.fashiontests.runtime.cleanup);
    getIndRule = function(rule) {
      return window.fashiontests.runtime.getRule(rule, $wf.runtimeConfig.individualCSSID);
    };
    testDiv = window.fashiontests.runtime.testDiv;
    it("should read attributes", function() {
      var id;
      id = testDiv("<div class=\"item\" color=\"red\"></div>\n<div class=\"item\" color=\"blue\"></div>\n<div class=\"item\" color=\"green\"></div>");
      testFSS(".item {\n	background-color: @self.color;\n}");
      expect(getIndRule(0).style.backgroundColor).toBe("red");
      expect(getIndRule(1).style.backgroundColor).toBe("blue");
      return expect(getIndRule(2).style.backgroundColor).toBe("green");
    });
    it("should work with modifiers like :hover", function() {
      var id;
      id = testDiv("<div class=\"item\" color=\"red\"></div>\n<div class=\"item\" color=\"blue\"></div>\n<div class=\"item\" color=\"green\"></div>");
      testFSS(".item:hover {\n	background-color: @self.color;\n}");
      expect(getIndRule(0).selectorText.indexOf(":hover")).not.toBe(-1);
      expect(getIndRule(0).style.backgroundColor).toBe("red");
      expect(getIndRule(1).style.backgroundColor).toBe("blue");
      return expect(getIndRule(2).style.backgroundColor).toBe("green");
    });
    it("should not get confused by empty selectors", function() {
      var id;
      id = testDiv("<div class=\"item\" color=\"red\"></div>\n<div class=\"item2\" color=\"blue\"></div>\n<div class=\"item3\" color=\"green\"></div>");
      testFSS(".item2 {}\n.item {\n	background-color: @self.color;\n}\n.item3 {}");
      return expect(getIndRule(0).style.backgroundColor).toBe("red");
    });
    it("should automatically process new elements added with appendChild", function(done) {
      var id, wait;
      id = testDiv("<div class=\"item\" color=\"red\"></div>");
      testFSS(".item {\n	background-color: @self.color;\n}");
      wait = function(d, f) {
        return setTimeout(f, d);
      };
      return wait(1, function() {
        var newDiv;
        newDiv = document.createElement("div");
        newDiv.setAttribute("class", "item");
        newDiv.setAttribute("color", "yellow");
        document.getElementById(id).appendChild(newDiv);
        return wait(1, function() {
          var rules, sheet;
          sheet = document.getElementById($wf.runtimeConfig.individualCSSID).sheet;
          rules = sheet.rules || sheet.cssRules;
          expect(getIndRule(rules.length - 1).style.backgroundColor).toBe("yellow");
          return done();
        });
      });
    });
    it("should automatically process new elements added with innerHTML", function(done) {
      var id, wait;
      id = testDiv("<div class=\"item\" color=\"red\"></div>");
      testFSS(".item {\n	background-color: @self.color;\n}");
      wait = function(d, f) {
        return setTimeout(f, d);
      };
      return wait(1, function() {
        var ct;
        ct = document.getElementById(id);
        ct.innerHTML += '<div class="item" color="orange"></div>';
        return wait(1, function() {
          expect(getIndRule(1).style.backgroundColor).toBe("orange");
          return done();
        });
      });
    });
    return it("should manually process additions, for browsers without O.o()", function(done) {
      var id, wait;
      window.FASHION_NO_OBSERVE = true;
      id = testDiv("<div class=\"item\" color=\"red\"></div>");
      testFSS(".item {\n	background-color: @self.color;\n}");
      wait = function(d, f) {
        return setTimeout(f, d);
      };
      return wait(1, function() {
        var ct;
        ct = document.getElementById(id);
        ct.innerHTML += '<div class="item" color="purple"></div>';
        return wait(1, function() {
          expect(getIndRule(1)).not.toBeDefined();
          FASHION.pageChanged();
          return wait(1, function() {
            expect(getIndRule(1).style.backgroundColor).toBe("purple");
            window.FASHION_NO_OBSERVE = false;
            return done();
          });
        });
      });
    });
  };

}).call(this);
(function() {
  window.fashiontests.runtime.scoped = function() {
    var $wf, getIndRule, getStaticRule, testDiv, testFSS;
    $wf = window.fashion;
    testFSS = function(fss) {
      var css, js, _ref;
      _ref = $wf.$actualizer.actualize($wf.$processor.process($wf.$parser.parse(fss))), css = _ref.css, js = _ref.js;
      return window.fashiontests.runtime.simulateRuntime(css, js);
    };
    beforeEach(window.fashiontests.runtime.cleanup);
    afterEach(window.fashiontests.runtime.cleanup);
    getStaticRule = window.fashiontests.runtime.getRule;
    getIndRule = function(rule) {
      return window.fashiontests.runtime.getRule(rule, $wf.runtimeConfig.individualCSSID);
    };
    testDiv = window.fashiontests.runtime.testDiv;
    beforeEach(function() {
      window.fsStyleHeader = $wf.styleHeader;
      $wf.styleHeader = "";
      window.fsStyleHeaderRules = $wf.styleHeaderRules;
      return $wf.styleHeaderRules = 0;
    });
    afterEach(function() {
      $wf.styleHeader = window.fsStyleHeader;
      return $wf.styleHeaderRules = window.fsStyleHeaderRules;
    });
    it("should override variables based on scope", function() {
      var id;
      id = testDiv("<div class=\"nestedItem\"></div>\n<div class=\"outsideItem\"></div>");
      testFSS("$color: red;\n.nestedItem {\n	$color: blue;\n	background-color: $color;\n}\n.outsideItem {\n	background-color: $color;\n}");
      expect(getIndRule(0).style.backgroundColor).toBe("blue");
      return expect(getStaticRule(0).style.backgroundColor).toBe("red");
    });
    it("should be able to change variables for specific elements", function() {
      var element, id;
      id = testDiv("<div class=\"item\" id=\"testColorChange\"></div>\n<div class=\"item\" id=\"testColorNotChange\"></div>");
      testFSS(".item {\n	$color: blue;\n	background-color: $color;\n}");
      expect(getIndRule(0).style.backgroundColor).toBe("blue");
      expect(getIndRule(1).style.backgroundColor).toBe("blue");
      element = document.getElementById("testColorChange");
      FASHION.setElementVariable(element, "color", "rgb(200, 100, 50)");
      expect(getIndRule(0).style.backgroundColor).toBe("rgb(200, 100, 50)");
      return expect(getIndRule(1).style.backgroundColor).toBe("blue");
    });
    it("should work in selectors", function() {
      var element, id, s1i1, s2i1;
      id = testDiv("<div id=\"select1\" class=\"select\">\n	<p class=\"i1\">Selected</p>\n	<p class=\"i2\">Not Selected</p>\n</div>\n<div id=\"select2\" class=\"select\">\n	<p class=\"i1\">Selected</p>\n	<p class=\"i2\">Not Selected</p>\n</div>");
      testFSS(".select {\n	$selected: i1;\n	p {\n		color: black;\n	}\n	.$selected {\n		color: red;\n	}\n}");
      s1i1 = window.getComputedStyle(document.querySelectorAll("#select1 .i2")[0]);
      expect(s1i1.color).toBe("rgb(0, 0, 0)");
      s2i1 = window.getComputedStyle(document.querySelectorAll("#select2 .i2")[0]);
      expect(s2i1.color).toBe("rgb(0, 0, 0)");
      element = document.getElementById("select1");
      FASHION.setElementVariable(element, "selected", "i2");
      s1i1 = window.getComputedStyle(document.querySelectorAll("#select1 .i2")[0]);
      expect(s1i1.color).toBe("rgb(255, 0, 0)");
      s2i1 = window.getComputedStyle(document.querySelectorAll("#select2 .i2")[0]);
      return expect(s2i1.color).toBe("rgb(0, 0, 0)");
    });
    it("should work in combined selectors", function() {
      var element, id, s1i1, s2i1;
      id = testDiv("<article>\n	<div id=\"select1\" class=\"select\">\n		<p class=\"i1\">Selected</p>\n		<p class=\"i2\">Not Selected</p>\n	</div>\n	<div id=\"select2\" class=\"select\">\n		<p class=\"i1\">Selected</p>\n		<p class=\"i2\">Not Selected</p>\n	</div>\n</article>");
      testFSS(".select {\n	$selected: i1;\n	p {\n		color: black;\n	}\n	^article .$selected {\n		color: red;\n	}\n}");
      s1i1 = window.getComputedStyle(document.querySelectorAll("#select1 .i2")[0]);
      expect(s1i1.color).toBe("rgb(0, 0, 0)");
      s2i1 = window.getComputedStyle(document.querySelectorAll("#select2 .i2")[0]);
      expect(s2i1.color).toBe("rgb(0, 0, 0)");
      element = document.getElementById("select1");
      FASHION.setElementVariable(element, "selected", "i2");
      s1i1 = window.getComputedStyle(document.querySelectorAll("#select1 .i2")[0]);
      expect(s1i1.color).toBe("rgb(255, 0, 0)");
      s2i1 = window.getComputedStyle(document.querySelectorAll("#select2 .i2")[0]);
      return expect(s2i1.color).toBe("rgb(0, 0, 0)");
    });
    it("should work in selectors containing individual properties", function() {
      var element, id, s1i1, s2i1;
      id = testDiv("<div id=\"select1\" class=\"select\">\n	<p class=\"i1\" color=\"rgb(10, 0, 0)\">Selected</p>\n	<p class=\"i2\" color=\"rgb(10, 10, 0)\">Not Selected</p>\n</div>\n<div id=\"select2\" class=\"select\">\n	<p class=\"i1\" color=\"rgb(0, 0, 10)\">Selected</p>\n	<p class=\"i2\" color=\"rgb(0, 10, 10)\">Not Selected</p>\n</div>");
      testFSS(".select {\n	$selected: i1;\n	p {\n		color: black;\n	}\n	.$selected {\n		color: @self.color;\n	}\n}");
      s1i1 = window.getComputedStyle(document.querySelectorAll("#select1 .i2")[0]);
      expect(s1i1.color).toBe("rgb(0, 0, 0)");
      s2i1 = window.getComputedStyle(document.querySelectorAll("#select2 .i2")[0]);
      expect(s2i1.color).toBe("rgb(0, 0, 0)");
      element = document.getElementById("select2");
      FASHION.setElementVariable(element, "selected", "i2");
      s1i1 = window.getComputedStyle(document.querySelectorAll("#select1 .i2")[0]);
      expect(s1i1.color).toBe("rgb(0, 0, 0)");
      s2i1 = window.getComputedStyle(document.querySelectorAll("#select2 .i2")[0]);
      return expect(s2i1.color).toBe("rgb(0, 10, 10)");
    });
    it("should assign overrides to each element for individualized scoped variables", function() {
      var id;
      id = testDiv("<div class=\"item\" color=\"rgb(221, 170, 0)\"><h2 id=\"t1\"></h2></div>\n<div class=\"item\" color=\"rgb(0, 153, 255)\"><h2 id=\"t2\"></h2></div>");
      testFSS(".item {\n	$color: @self.color;\n	h2 {\n		color: $color;\n	}\n}");
      expect(getIndRule(0).style.color).toBe("rgb(221, 170, 0)");
      expect(getIndRule(1).style.color).toBe("rgb(0, 153, 255)");
      expect(getIndRule(0).selectorText).toBe("#t1");
      return expect(getIndRule(1).selectorText).toBe("#t2");
    });
    return it("should process new elements with individualized scope variables", function(done) {
      var id, wait;
      id = testDiv("<div class=\"item\" color=\"rgb(221, 170, 0)\"><h2 id=\"t1\"></h2></div>\n<div class=\"item\" color=\"rgb(221, 170, 0)\"><h2 id=\"t2\"></h2></div>");
      testFSS(".item {\n	$color: @self.color;\n	h2 {\n		color: $color;\n	}\n}");
      wait = function(d, f) {
        return setTimeout(f, d);
      };
      return wait(1, function() {
        var ct;
        ct = document.getElementById(id);
        ct.innerHTML += "<div class=\"item\" color=\"rgb(32, 64, 128)\"><h2 id=\"a1\"></h2></div>'";
        return wait(1, function() {
          expect(getIndRule(2).style.color).toBe("rgb(32, 64, 128)");
          expect(getIndRule(2).selectorText).toBe("#a1");
          return done();
        });
      });
    });
  };

}).call(this);
(function() {
  window.fashiontests.runtime.functionWatchers = function() {
    var $wf, getRule, testFSS;
    $wf = window.fashion;
    beforeEach(function() {
      window.fsStyleHeader = $wf.styleHeader;
      $wf.styleHeader = "";
      window.fsStyleHeaderRules = $wf.styleHeaderRules;
      return $wf.styleHeaderRules = 0;
    });
    afterEach(function() {
      $wf.styleHeader = window.fsStyleHeader;
      return $wf.styleHeaderRules = window.fsStyleHeaderRules;
    });
    getRule = window.fashiontests.runtime.getRule;
    testFSS = function(fss) {
      var css, js, _ref;
      _ref = $wf.$actualizer.actualize($wf.$processor.process($wf.$parser.parse(fss))), css = _ref.css, js = _ref.js;
      return window.fashiontests.runtime.simulateRuntime(css, js);
    };
    return it("should watch function values and update expressions accordingly", function() {
      window.FSTCOLOR = "blue";
      window.fashion.addFunction("fstColor", {
        output: $wf.$type.Color,
        watch: function(c) {
          return window.addEventListener("FSTCHANGE", c);
        },
        evaluate: function() {
          return window.FSTCOLOR;
        }
      });
      testFSS(".item {\n	background-color: fstColor();\n}");
      expect(getRule(0).style.cssText).toBe("background-color: blue;");
      window.FSTCOLOR = "yellow";
      window.dispatchEvent(new Event("FSTCHANGE"));
      return expect(getRule(0).style.cssText).toBe("background-color: yellow;");
    });
  };

}).call(this);
(function() {
  describe("Runtime", function() {
    describe("Variables", window.fashiontests.runtime.variables);
    describe("Scoped Variables", window.fashiontests.runtime.scoped);
    describe("Individual Properties", window.fashiontests.runtime.individual);
    return describe("Function Watchers", window.fashiontests.runtime.functionWatchers);
  });

}).call(this);
