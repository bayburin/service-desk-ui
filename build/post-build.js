const path = require('path');
const fs = require('fs');
const util = require('util');

// get application version from package.json
const appVersion = require('../package.json').version;

// promisify core API's
const readDir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

console.log('\nRunning post-build tasks');

// our version.json will be in the dist folder
const versionFilePath = path.join(__dirname + '/../dist/service-desk-ui/version.json');

// Основной хэш
let mainHash = '';
// Файл, у которого будет взят хэш
let mainBundleFile = '';
// Файлы, в коде которых нужно будет установить хэш
let bundleFiles = [];

// Регулярное выражения для поиска файлов main-es5.js и main-es2015.js
let mainBundleRegexp = /^main\-es(2015|5).?([a-z0-9]*)?.js$/;

// read the dist folder files and find the one we're looking for
readDir(path.join(__dirname, '../dist/service-desk-ui'))
  .then(files => {
    bundleFiles = files.filter(f => mainBundleRegexp.test(f));
    mainBundleFile = bundleFiles[0];

    if (mainBundleFile) {
      let matchHash = mainBundleFile.match(mainBundleRegexp);

      // if it has a hash in it's name, mark it down
      if (matchHash.length > 1 && !!matchHash[2]) {
        mainHash = matchHash[2];
      }
    }

    console.log(`Writing version and hash to ${versionFilePath}`);

    const src = `{"version": "${appVersion}", "hash": "${mainHash}"}`;

    // Записать версия в файл version.json
    return writeFile(versionFilePath, src);
  }).then(() => {
    // Если файлы не найдены, выход
    if (bundleFiles.length === 0) {
      return;
    }

    // Вставляет хэш в найденные файлы
    bundleFiles.forEach(file => {
      let mainFilepath = path.join(__dirname, '../dist/service-desk-ui', file);

      console.log(`Replacing hash in the ${file}`);
      readFile(mainFilepath, 'utf8')
        .then(mainFileData => {
          const replacedFile = mainFileData.replace('{{POST_BUILD_ENTERS_HASH_HERE}}', mainHash);

          return writeFile(mainFilepath, replacedFile);
        });
    });
  }).catch(err => {
    console.log('Error with post build:', err);
  });