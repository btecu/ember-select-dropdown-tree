/*jshint node:true*/
module.exports = {
  description: '',

  normalizeEntityName: function() {},

  afterInstall: function(options) {
    return this.addPackagesToProject([
      { name: 'ember-select', target: '^0.1.4' },
      { name: 'ember-simple-tree', target: '^0.0.2' }
    ]);
  }
};
