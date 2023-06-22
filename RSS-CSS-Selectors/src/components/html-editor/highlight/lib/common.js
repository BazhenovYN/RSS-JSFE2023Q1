var hljs = require('./core');

hljs.registerLanguage('xml', require('./languages/xml'));
hljs.registerLanguage('css', require('./languages/css'));

hljs.HighlightJS = hljs
hljs.default = hljs
module.exports = hljs;