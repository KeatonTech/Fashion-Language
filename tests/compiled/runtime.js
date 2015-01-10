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
    var sheet;
    sheet = document.getElementById(window.fashion.cssId);
    sheet.parentNode.removeChild(sheet);
    window.FASHION = void 0;
    window.FSMIN = void 0;
    return window.style = void 0;
  };

  window.fashiontests.runtime.getRule = function(id) {
    var rules, sheet;
    sheet = document.getElementById(window.fashion.cssId);
    rules = sheet.sheet.rules || sheet.sheet.cssRules;
    return rules[id];
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
  describe("Runtime", function() {
    return describe("Variables", window.fashiontests.runtime.variables);
  });

}).call(this);
