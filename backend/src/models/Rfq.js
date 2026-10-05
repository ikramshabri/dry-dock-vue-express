const BaseModel = require('./BaseModel');

class Rfq extends BaseModel {
  static table = 'rfqs';
  static fields = ['dry_dock_id', 'rfq_no', 'rfq_date', 'expiry_date', 'comments'];
  static required = ['dry_dock_id', 'rfq_no'];
}

module.exports = Rfq;
