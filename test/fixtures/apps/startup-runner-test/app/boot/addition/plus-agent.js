'use strict';
module.exports = pro => {
  return {
    options: {
      order: 1024,
      agent: true,
      didLoad: true,
    },
    async start() {
      pro.str += 2018;
      pro.vit += 2019;
      pro.int += 2020;
      pro.agi += 2021;
      pro.dex += 2022;
      pro.luk += 2023;
    },
  };
};
