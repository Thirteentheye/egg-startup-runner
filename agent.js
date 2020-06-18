'use strict';

const procedure = require('./app/lib/procedure');

module.exports = class Agent {
  constructor(agent) {
    this.agent = agent;
  }

  async didLoad() {
    this.scripts = await procedure.getScripts(this.agent);
    await procedure.runScripts(this.scripts, 'agent', 'didLoad');
  }

  async willReady() {
    await procedure.runScripts(this.scripts, 'agent', 'willReady');
  }

  async didReady() {
    await procedure.runScripts(this.scripts, 'agent', 'didReady');
  }

  async serverDidReady() {
    await procedure.runScripts(this.scripts, 'agent', 'serverDidReady');
    this.agent.messenger.sendRandom('egg-startup-runner-oncetask', true);
  }
};
