var rework = require('rework');
var queryless = require('..');
var fs = require('fs');
var path = require('path');
var read = fs.readFileSync;
var readdir = fs.readdirSync;

describe('should support', function(){
  readdir('test/cases').forEach(function(file){
    if (~file.indexOf('.out')) return;
    var base = path.basename(file, '.css');
    var options = createMediaQuery(base);
    var input = read('test/cases/' + file, 'utf8');
    var output = read('test/cases/' + base + '.out.css', 'utf8');

    it(base, function() {
      var css = rework(input)
        .use(queryless(options))
        .toString();

      css.trim().should.equal(output.trim());
    });
  });
})

/**
 * Create a media query from the filename
 */
function createMediaQuery(filename) {
  if (filename === 'noop') return;
  if (filename === 'none') return 'none';
  if (filename === 'complex') return [
    'print',
    'screen and (min-width: 1000px)'
  ];

  filename = filename.split('_');
  return [filename[0] + ' and (' + filename[1] + ': ' + filename[2] + ')'];
}

