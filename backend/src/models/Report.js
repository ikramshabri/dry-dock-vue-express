const BaseModel = require('./BaseModel');

class Report extends BaseModel {
  static table = 'reports';
  static fields = ['dry_dock_id', 'type', 'name', 'report_date', 'updated_by'];
  static required = ['dry_dock_id', 'type', 'name'];
  static enums = { type: ['daily', 'completion'] };
}

module.exports = Report;
