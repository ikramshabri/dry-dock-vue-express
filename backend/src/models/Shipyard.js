const BaseModel = require('./BaseModel');

class Shipyard extends BaseModel {
  static table = 'shipyards';
  static fields = ['name', 'location'];
  static required = ['name'];
}

module.exports = Shipyard;
