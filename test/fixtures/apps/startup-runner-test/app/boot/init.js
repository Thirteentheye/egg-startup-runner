'use strict';
const assert = require('assert');

module.exports = pro => {
  return {
    options: {
      app: true,
      agent: true,
      didLoad: true,
    },
    async start(meta) {
      assert(meta.stage === 'didLoad');
      await new Promise(ok => {
        setTimeout(() => {
          if (meta.pname === 'app') {
            pro.str = 8;
            pro.vit = 8;
            pro.int = 8;
            pro.agi = 8;
            pro.dex = 8;
            pro.luk = 8;
          }
          if (meta.pname === 'agent') {
            pro.str = 8;
            pro.vit = 8;
            pro.int = 8;
            pro.agi = 8;
            pro.dex = 8;
            pro.luk = 8;
          }
          ok();
        }, 1024);
      });
    },
  };
};
