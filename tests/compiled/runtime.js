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
  window.fashiontests.runtime.selectors = function() {
    var $wf, getRule, testFSS;
    $wf = window.fashion;
    testFSS = function(fss) {
      var css, js, _ref;
      _ref = $wf.$actualizer.actualize($wf.$processor.process($wf.$parser.parse(fss))), css = _ref.css, js = _ref.js;
      return window.fashiontests.runtime.simulateRuntime(css, js);
    };
    afterEach(window.fashiontests.runtime.cleanup);
    getRule = window.fashiontests.runtime.getRule;
    it('should change selectors when variables change', function() {
      testFSS("$color: blue;\ndiv {\n	background-color: $color;\n}");
      expect(getRule(0).style.cssText).toBe("background-color: blue;");
      style.color = "red";
      return expect(getRule(0).style.cssText).toBe("background-color: red;");
    });
    return it('should maintain the !important tag on changed selectors', function() {
      testFSS("$color: blue;\ndiv {\n	background-color: $color !important;\n}");
      expect(getRule(0).style.cssText).toBe("background-color: blue !important;");
      style.color = "red";
      return expect(getRule(0).style.cssText).toBe("background-color: red !important;");
    });
  };

}).call(this);
(function() {
  describe("Runtime", function() {
    return describe("Selectors", window.fashiontests.runtime.selectors);
  });

}).call(this);
