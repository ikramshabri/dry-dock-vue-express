const BaseModel = require('./BaseModel');

class Checklist extends BaseModel {
  static table = 'checklists';
  static fields = ['dry_dock_id', 'title', 'is_done'];
  static required = ['title'];
}

module.exports = Checklist;
