var Promise = require('bluebird'),
    Handlebars = require('handlebars');

var fs = Promise.promisifyAll(require('fs'));

var tmplRead = fs.readFileAsync('index.hbr');
var cvRead = fs.readFileAsync('cv.json', 'utf8').then(JSON.parse);
var localRead = fs.readFileAsync('local.json', 'utf8').then(JSON.parse);

function footKey(key) {
  if (String(parseInt(key)) === key)
    return '[' + key + ']';
  return key;
}

Promise.all([tmplRead, cvRead, localRead]).then(function(values) {
  var [tmpl, cv, local] = values;

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

  var tmpl = Handlebars.compile(tmpl.toString());

  var dat = Object.assign(cv, local);

  console.log(tmpl(dat));
})
