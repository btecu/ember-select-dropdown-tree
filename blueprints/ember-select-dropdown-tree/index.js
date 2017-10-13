/* eslint-env node */
'use strict';

module.exports = {
  description: '',

  normalizeEntityName: function() {},

  afterInstall: function(options) {
    return this.addPackagesToProject([
      { name: 'ember-select', target: '^0.4.0' },
      { name: 'ember-simple-tree', target: '^0.2.0' }
    ]);
  }
};
