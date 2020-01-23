import JSDOM from "jsdom";

export default function(markup) {
  if (typeof document !== 'undefined') return;

  var jsdom = JSDOM.jsdom;

  global.document = jsdom(markup || '');
  global.window = document.parentWindow;

  global.$ = global.jQuery = require('jquery')(global.window);
  global.navigator = {
    userAgent: 'node.js'
  };
};
