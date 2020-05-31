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

Run startup codes in parallel and serially from different files

## 依赖说明

### 依赖的 egg 版本

egg-startup-runner 版本 | egg 2.x
--- | ---
2.x | 😁
1.x | ❌
0.x | ❌

## 开启插件

```js
// config/plugin.js
exports.startupRunner = {
  enable: true,
  package: 'egg-startup-runner',
};
```

## 使用场景

### 背景

部分初始化工作较为复杂，全部写在`app`或`agent`中相对拥挤，所以将这些初始化工作放在不同的文件中，由插件负责加载运行

### 使用方式

#### 配置

插件默认从`app/boot`目录中加载需要运行的文件，可以在配置改变读取的目录，例如下方的配置将读取`app/startup1`和`app/startup2`中的文件。

```js
// config/config.default.js
exports.startupRunner = {
  paths: [ 'startup1', 'startup2' ]
}
```

注意插件只会读取配置在paths中的目录，也就是说插件不会将子文件夹中的文件也读取加载，要读取子文件夹时需要将子文件夹路径也配置出来。例如

```js
// config/config.default.js
exports.startupRunner = {
  paths: [ 'startup1', 'startup1/subStartup1' ]
}
```

#### 加载文件

需要加载的文件要特定的结构才能生效，结构类似`egg`的定时任务`schedule`

```js
// app/boot/init.js
module.exports = pro => {
  return {
    options: {
      order: 8,
      app: true,
      agent: true,
      didLoad: true,
      willReady: true,
      didReady: true,
      serverDidReady: true
    },
    async start(meta) {
      if (meta.pname === 'app') {
        pro.str = 8;
      }
      if (meta.stage === 'willReady') {
        pro.vit = 8;
      }
    },
  };
};
```

如上方代码所示，是一个基本加载文件结构，`options`中定义了运行顺序、需要运行的进程和生命周期。对应布尔值选项为`false`时可以不写。

插件加载文件后将按照`options`中的`order`对所有文件进行升序排序，在同一个生命周期内，`order`越小优先级最高，最先被执行。此外在同一个生命周期内，`order`相同的将会并行执行，可用于相互没有关联的逻辑。`order`默认值为`0`。

`options`中的`app`和`agent`选项表示代码将在哪个进程运行，在设置了`app`为`true`后插件将在`app`对应的生命周期运行该文件的`start`函数，`pro`参数则是当前运行的进程`app`实例。同理，在`agent`设置为`true`后`agent`也会运行`start`函数，`pro`参数也自然是`agent`实例。

`options`中`didLoad`、`willReady`、`didReady`和`serverDidReady`对应需要运行的生命周期，设置为`true`后将在相应的生命周期内运行`start`函数。

`start`函数被调用时插件会将当前的执行进程和生命周期作为参数传入，如上`meta`中的`pname`为当前的执行进程名字，值为`"app"`或`"agent"`。`stage`为当前的生命周期名字，值`didLoad`、`willReady`、`didReady`和`serverDidReady`中的一个。

## License

[MIT](LICENSE)
