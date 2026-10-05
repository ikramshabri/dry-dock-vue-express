const BaseModel = require('./BaseModel');

class WorkOrderMaster extends BaseModel {
  static table = 'work_order_masters';
  static fields = ['title', 'equipment', 'spec_group_id'];
  static required = ['title'];
}

module.exports = WorkOrderMaster;
