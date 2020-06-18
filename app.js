'use strict';

const procedure = require('./app/lib/procedure');

module.exports = class App {
  constructor(app) {
    this.app = app;
    this.app.messenger.once('egg-startup-runner-oncetask', activate => {
      if (activate) {
        this.app.createAnonymousContext().runInBackground(async () => {
          let scripts = this.scripts;
          if (!scripts) {
            scripts = await procedure.getScripts(this.app);
          }
          await procedure.runScripts(scripts.filter(s => s.options.once), 'app', 'once');
        });
        this.app.messenger.sendToApp('egg-startup-runner-oncetask', false);
      }
    });
  }

  async didLoad() {
    this.scripts = await procedure.getScripts(this.app);
    this.app.coreLogger.info('[egg-startup-runner] %d script(s) found on startup', this.scripts.length);
    await procedure.runScripts(this.scripts, 'app', 'didLoad');
  }

  async willReady() {
    await procedure.runScripts(this.scripts, 'app', 'willReady');
  }

  async didReady() {
    await procedure.runScripts(this.scripts, 'app', 'didReady');
  }

  async serverDidReady() {
    await procedure.runScripts(this.scripts, 'app', 'serverDidReady');
  }
};
