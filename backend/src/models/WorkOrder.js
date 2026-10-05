const BaseModel = require('./BaseModel');

class WorkOrder extends BaseModel {
  static table = 'work_orders';
  static fields = [
    'dry_dock_id', 'spec_group_id', 'job_code', 'title', 'equipment', 'status', 'budget',
    'yard_estimate', 'owner_estimate', 'actual_yard_cost', 'actual_owner_cost',
    'responsible_user', 'progress', 'last_updated_by', 'last_updated_at',
  ];
  static required = ['dry_dock_id', 'title'];
  static enums = { status: ['open', 'in_progress', 'on_hold', 'complete'] };
}

module.exports = WorkOrder;
