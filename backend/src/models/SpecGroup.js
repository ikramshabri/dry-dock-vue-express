const BaseModel = require('./BaseModel');

class SpecGroup extends BaseModel {
  static table = 'spec_groups';
  static fields = ['name'];
  static required = ['name'];
}

module.exports = SpecGroup;
