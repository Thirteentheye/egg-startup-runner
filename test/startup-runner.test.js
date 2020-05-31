'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('test/startup-runner.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/startup-runner-test',
    });
    return app.ready();
  });

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, startupRunner')
      .expect(200);
  });

  it('should app.str is (8 + 2 + 2) * 9 + 2', () => {
    assert(app.str === (8 + 2 + 2) * 9 + 2);
  });

  it('should app.vit is (8 + 4 + 4) * 9 + 4', () => {
    assert(app.vit === (8 + 4 + 4) * 9 + 4);
  });

  it('should app.int is (8 + 8 + 8) * 9 + 8', () => {
    assert(app.int === (8 + 8 + 8) * 9 + 8);
  });

  it('should app.agi is (8 + 16 + 16) * 9 + 16', () => {
    assert(app.agi === (8 + 16 + 16) * 9 + 16);
  });

  it('should app.dex is (8 + 32 + 32) * 9 + 32', () => {
    assert(app.dex === (8 + 32 + 32) * 9 + 32);
  });

  it('should app.luk is (8 + 64 + 64) * 9 + 64', () => {
    assert(app.luk === (8 + 64 + 64) * 9 + 64);
  });

  after(() => app.close());
  afterEach(mock.restore);
});
