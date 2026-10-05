const BaseModel = require('./BaseModel');

class Attachment extends BaseModel {
  static table = 'attachments';
  static fields = ['dry_dock_id', 'file_name', 'title', 'include_in_specs'];
  static required = ['dry_dock_id', 'file_name'];
}

module.exports = Attachment;
