var Promise = require('bluebird'),
    Handlebars = require('handlebars');

var fs = Promise.promisifyAll(require('fs'));

var tmplRead = fs.readFileAsync('index.hbr');
var cvRead = fs.readFileAsync('cv.json', 'utf8').then(JSON.parse);

function footKey(key) {
  if (String(parseInt(key)) === key)
    return '[' + key + ']';
  return key;
}

Promise.all([tmplRead, cvRead]).then(function(values) {
  var [tmpl, cv] = values;

  var tmpl = Handlebars.compile(tmpl.toString());
  Handlebars.registerHelper('footKey', function(options) {
    return footKey(options.fn(this));
  });
  Handlebars.registerHelper('linkFootnote', function(footnote, options) {

    var rendered = options.fn(options.data.root);
    for (var key in cv.footnote) {
      var fk = footKey(key);
      rendered = rendered.split(fk).join('<sup><a href="#f_' + key + '">' + fk + '</a></sup>')
    }
    return rendered;
  });
  // Handlebars.registerHelper('', function(what) {
  //   console.log(what);
  //   return what;
  // });
  console.log(tmpl(cv));
})
