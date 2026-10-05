const BaseModel = require('./BaseModel');

class Vessel extends BaseModel {
  static table = 'vessels';
  static fields = ['name', 'imo_number', 'type', 'owner', 'image_url'];
  static required = ['name', 'imo_number'];
}

module.exports = Vessel;
