# egg-startup-runner

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-startup-runner.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-startup-runner
[travis-image]: https://img.shields.io/travis/eggjs/egg-startup-runner.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-startup-runner
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-startup-runner.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-startup-runner?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-startup-runner.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-startup-runner
[snyk-image]: https://snyk.io/test/npm/egg-startup-runner/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-startup-runner
[download-image]: https://img.shields.io/npm/dm/egg-startup-runner.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-startup-runner

<!--
Description here.
-->

## Install

```bash
$ npm i egg-startup-runner --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.startupRunner = {
  enable: true,
  package: 'egg-startup-runner',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.startupRunner = {
  paths: [ 'boot' ]
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/Thirteentheye/egg-startup-runner/issues).

## License

[MIT](LICENSE)
