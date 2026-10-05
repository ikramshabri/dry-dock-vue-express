const BaseModel = require('./BaseModel');

class ExecutionRecord extends BaseModel {
  static table = 'execution_records';
  static fields = ['dry_dock_id', 'type', 'title', 'description', 'record_date', 'amount'];
  static required = ['dry_dock_id', 'type', 'title'];
  static enums = { type: ['fact', 'meeting', 'variation_order'] };
}

module.exports = ExecutionRecord;
