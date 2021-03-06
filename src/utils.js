const fs = require('fs');
const mkdirp = require('mkdirp');
const cheerio = require('cheerio');
const path = require('path-posix');
const osPathSep = require('path').sep;
const _ = require('lodash');
const fp = require('lodash/fp');

const isPosixOS = osPathSep === '/';

function toPosixPath(filePath) {
  return !isPosixOS ? filePath.split(osPathSep).join('/') : filePath;
}

function stripExtension(filePath) {
  return filePath.replace(/\.[^/.]+$/, '');
}

function makeAssetId(relativePath, stripDirs, idGen) {
  return fp.pipe(
    (idGenPath) => (stripDirs ? path.basename(idGenPath) : idGenPath),
    stripExtension,
    idGen
  )(relativePath);
}

function relativePathFor(filePath, inputPath) {
  return filePath.replace(`${inputPath}${path.sep}`, '');
}

function svgDataFor(svgContent) {
  let $svg = cheerio.load(svgContent, { xmlMode: true })('svg');

  return {
    content: $svg.html(),
    attrs: $svg.attr()
  };
}

const readFile = _.partial(fs.readFileSync, _, 'UTF-8');

const saveToFile = _.curry((filePath, data) => {
  mkdirp.sync(path.dirname(filePath));
  fs.writeFileSync(filePath, data);
});

module.exports = {
  makeAssetId,
  relativePathFor,
  svgDataFor,
  readFile,
  saveToFile,
  toPosixPath
};
