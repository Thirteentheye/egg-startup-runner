'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const semver = require('semver');

const readdirAsync = util.promisify(fs.readdir);
const statAsync = util.promisify(fs.stat);

module.exports.getBootPaths = function(config, baseDir) {
  const paths = Array.isArray(config.paths) ? config.paths : [ String(config.paths) ];
  return deduplicate(paths.map(p => path.join(baseDir, 'app', p)));
};

module.exports.getFlattenedFilePaths = async function(bootPaths) {
  const readyFilePaths = [];
  for (const bootPath of bootPaths) {
    readyFilePaths.push(getDirFilePaths(bootPath));
  }
  const filePaths = await Promise.all(readyFilePaths);
  return filePaths.reduce((p, c) => p.concat(c), []);
};

module.exports.loadOrderedScripts = function(bootFiles, processer) {
  const scripts = [];
  for (const bootFile of bootFiles) {
    const bootScript = require(bootFile);
    let script = null;
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

function getDirFilePaths(bootPath) {
  if (semver.gte(process.version, '10.10.0')) {
    return readdirAsync(bootPath, { withFileTypes: true })
      .then(dirents => dirents.filter(d => d.isFile()).map(d => path.join(bootPath, d.name)))
      .catch(() => []);
  }
  return readdirAsync(bootPath)
    .then(async files => {
      const readyStats = [];
      for (const file of files) {
        const filePath = path.join(bootPath, file);
        readyStats.push(statAsync(filePath).then(stat => (stat.isFile() ? filePath : '')));
      }
      const filePaths = await Promise.all(readyStats);
      return filePaths.filter(fp => fp);
    }).catch(() => []);
}

function deduplicate(array) {
  return [ ...new Set(array) ];
}
