const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const files = {
  'jquery/dist/jquery.min.js': 'static/js/jquery.min.js',
  'jquery/dist/jquery.min.map': 'static/js/jquery.min.map',
  'bootstrap/dist/js/bootstrap.bundle.min.js': 'static/js/bootstrap.min.js',
  'bootstrap/dist/js/bootstrap.bundle.min.js.map': 'static/js/bootstrap.bundle.min.js.map',
  'bootstrap/dist/css/bootstrap.min.css': 'static/css/bootstrap.min.css',
  'bootstrap/dist/css/bootstrap.min.css.map': 'static/css/bootstrap.min.css.map',
  'js-cookie/dist/js.cookie.min.js': 'static/js/js.cookie.min.js',
};
for (const [source, destination] of Object.entries(files)) {
  fs.copyFileSync(path.join(root, 'node_modules', source), path.join(root, destination));
}
console.log('Frontend libraries synchronized from package-lock.json.');
