'use strict';
module.exports = pro => {
  return {
    options: {
      order: 8,
      app: true,
      didLoad: true,
    },
    async start() {
      pro.str += 2;
      pro.vit += 4;
      pro.int += 8;
      pro.agi += 16;
      pro.dex += 32;
      pro.luk += 64;
    },
  };
};
