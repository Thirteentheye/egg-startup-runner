# egg-startup-runner

[![NPM version][npm-image]][npm-url]
[![build status][actions-image]][actions-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-startup-runner.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-startup-runner
[actions-image]: https://github.com/Thirteentheye/egg-startup-runner/workflows/Node.js%20CI/badge.svg
[actions-url]: https://github.com/Thirteentheye/egg-startup-runner/actions
[david-image]: https://img.shields.io/david/Thirteentheye/egg-startup-runner.svg?style=flat-square
[david-url]: https://david-dm.org/Thirteentheye/egg-startup-runner
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

`start`函数被调用时插件会将当前的执行进程和生命周期作为参数传入，如上`meta`中的`pname`为当前的执行进程名字，值为`"app"`或`"agent"`。`stage`为当前的生命周期名字，值`"didLoad"`、`"willReady"`、`"didReady"`和`"serverDidReady"`中的一个。

### 单次运行

一些初始任务只需要单个进程运行（也可以交由`agent`进程运行，`agent`毕竟只有一个，这里设置的是单个`app`中的情况），此时可通过以下方式进行。**注意，由于目前只能通过进程间通讯较为简单地达成向任意单个`worker（app）`进程发送命令，所以单次运行的任务只会在`serverDidReady`生命周期后运行。**

```js
// app/boot/once.js
module.exports = app => {
  return {
    options: {
      order: 1,
      app: true,
      once: true
    },
    async start(meta) {
      if (meta.pname === 'app') {
        app.str = 8;
      }
      if (meta.stage === 'once') {
        app.vit = 8;
      }
    },
  };
};
```

`app: true`必选。

由于设置了`once`，`once`的任务执行时只会在`app`进行，所以传入的参数只会是app实例，当然，如果设置了`agent`和其它生命周期，在对应周期也会是对应实例。

`once`任务中，`meta`参数将传入字符串`"app"`和`"once"`。

## License

[MIT](LICENSE)
