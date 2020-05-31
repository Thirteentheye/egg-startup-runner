'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const readdirAsync = util.promisify(fs.readdir);

module.exports.getBootPaths = function(config, baseDir) {
  const paths = Array.isArray(config.paths) ? config.paths : [ String(config.paths) ];
  return deduplicate(paths.map(p => path.join(baseDir, 'app', p)));
};

module.exports.getFlattenedFilePaths = async function(bootPaths) {
  const readyFilePaths = [];
  for (const bootPath of bootPaths) {
    readyFilePaths.push(readdirAsync(bootPath, { withFileTypes: true })
      .then(dirents => {
        const filePaths = [];
        for (const dirent of dirents) {
          if (dirent.isFile()) {
            filePaths.push(path.join(bootPath, dirent.name));
          }
        }
        return filePaths;
      }).catch(() => [])
    );
  }
  const filePaths = await Promise.all(readyFilePaths);
  return filePaths.flat(1);
};

module.exports.loadOrderedScripts = function(bootFiles, processer) {
  const scripts = [];
  for (const bootFile of bootFiles) {
    const bootScript = require(bootFile);
    let script;
    if (typeof bootScript === 'function') {
      script = bootScript(processer);
    }
    if (typeof bootScript === 'object' && typeof bootScript.default === 'function') {
      script = bootScript.default(processer);
    }
    if (script !== null && typeof script === 'object' && typeof script.start === 'function') {
      script.options = Object.assign({ order: 0 }, script.options);
      scripts.push(script);
    }
  }
  return scripts.sort((p, v) => p.options.order - v.options.order);
};

module.exports.runScripts = async function(scripts, pname, stage) {
  let lastOrder = Number.NEGATIVE_INFINITY;
  let batch = [];
  for (const script of scripts) {
    if (script.options[stage] === true && script.options[pname] === true) {
      if (script.options.order !== lastOrder) {
        await Promise.all(batch);
        lastOrder = script.options.order;
        batch = [];
      }
      batch.push(script.start({ pname, stage }));
    }
  }
  await Promise.all(batch);
};

function deduplicate(array) {
  return [ ...new Set(array) ];
}
