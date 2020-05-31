'use strict';
module.exports = pro => {
  return {
    options: {
      order: 2048,
      agent: true,
      didLoad: true,
    },
    async start() {
      pro.str *= 22;
      pro.vit *= 22;
      pro.int *= 22;
      pro.agi *= 22;
      pro.dex *= 22;
      pro.luk *= 22;
    },
  };
};
