'use strict';
module.exports = pro => {
  return {
    options: {
      order: 32,
      app: true,
      didLoad: true,
    },
    async start() {
      pro.str *= 9;
      pro.vit *= 9;
      pro.int *= 9;
      pro.agi *= 9;
      pro.dex *= 9;
      pro.luk *= 9;
    },
  };
};
