/*jshint node:true*/
module.exports = {
  description: '',

  normalizeEntityName: function() {},

  afterInstall: function(options) {
    return this.addPackagesToProject([
      { name: 'ember-select', target: '0.0.7' },
      { name: 'ember-simple-tree', target: '0.0.1' }
    ]);
  }
};
