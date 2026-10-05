const BaseModel = require('./BaseModel');

class Task extends BaseModel {
  static table = 'tasks';
  static fields = ['dry_dock_id', 'category', 'responsible', 'due_date', 'description', 'status'];
  static required = ['dry_dock_id', 'category'];
  static enums = { status: ['open', 'in_progress', 'closed'] };
}

module.exports = Task;
