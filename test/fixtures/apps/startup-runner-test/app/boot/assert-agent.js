'use strict';
const assert = require('assert');

module.exports = pro => {
  return {
    options: {
      order: 65535,
      agent: true,
      serverDidReady: true,
    },
    async start() {
      assert(pro.str === (8 + 2018) * 22);
      assert(pro.vit === (8 + 2019) * 22);
      assert(pro.int === (8 + 2020) * 22);
      assert(pro.agi === (8 + 2021) * 22);
      assert(pro.dex === (8 + 2022) * 22);
      assert(pro.luk === (8 + 2023) * 22);
    },
  };
};
