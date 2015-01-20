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
    var sheet, tdiv;
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
    window.FASHION = void 0;
    window.FSMIN = void 0;
    window.style = void 0;
    if (tdiv = document.getElementById("FSTESTBLOCK")) {
      document.body.removeChild(tdiv);
    }
    if (window.FSOBSERVER != null) {
      window.FSOBSERVER.disconnect();
      return window.FSOBSERVER = void 0;
    }
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
          expect(getIndRule(1).style.backgroundColor).toBe("yellow");
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
    return it("should work in combined selectors", function() {
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
  };

}).call(this);
(function() {
  describe("Runtime", function() {
    describe("Variables", window.fashiontests.runtime.variables);
    describe("Scoped Variables", window.fashiontests.runtime.scoped);
    return describe("Individual Properties", window.fashiontests.runtime.individual);
  });

}).call(this);
