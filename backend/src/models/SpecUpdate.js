const BaseModel = require('./BaseModel');
const db = require('../config/database');
const { ValidationError } = require('../utils/errors');

class SpecUpdate extends BaseModel {
  static table = 'spec_updates';
  static fields = ['work_order_id', 'progress', 'note', 'updated_by'];
  static required = ['work_order_id', 'progress'];

  static validate(data, partial = false) {
    super.validate(data, partial);
    if (data.progress != null && (data.progress < 0 || data.progress > 100)) {
      throw new ValidationError({ progress: 'progress harus antara 0 sampai 100' });
    }
  }

  // setelah update dicatat, progress dan status work order ikut diperbarui
  static async create(data) {
    const update = await super.create(data);
    const progress = Number(update.progress);
    let status = 'open';
    if (progress >= 100) status = 'complete';
    else if (progress > 0) status = 'in_progress';

    await db.query(
      `UPDATE work_orders
       SET progress = ?, status = ?, last_updated_by = ?, last_updated_at = CURDATE()
       WHERE id = ?`,
      [progress, status, update.updated_by, update.work_order_id]
    );
    return update;
  }
}

module.exports = SpecUpdate;
