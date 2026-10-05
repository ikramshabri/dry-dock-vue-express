const BaseModel = require('./BaseModel');

class QuotationDetail extends BaseModel {
  static table = 'quotation_details';
  static fields = [
    'dry_dock_id', 'spec_group_id', 'job_code', 'job_name',
    'vessel_name', 'machinery_group', 'machinery',
  ];
  static required = ['dry_dock_id', 'job_name'];
}

module.exports = QuotationDetail;
