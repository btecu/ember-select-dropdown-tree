/*jshint node:true*/
module.exports = {
  description: '',

  normalizeEntityName: function() {},

  afterInstall: function(options) {
    return this.addPackagesToProject([
      { name: 'ember-select', target: '^0.1.3' },
      { name: 'ember-simple-tree', target: '0.0.1' }
    ]);
  }
};
