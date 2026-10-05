const db = require('../config/database');
const { NotFoundError, ValidationError } = require('../utils/errors');

class BaseModel {
  static table = '';
  static fields = [];
  static required = [];
  static enums = {};

  // filters hanya dipakai untuk kolom yang terdaftar di `fields`
  static async findAll(filters = {}) {
    const keys = Object.keys(filters).filter((key) => this.fields.includes(key));
    const where = keys.length ? `WHERE ${keys.map((key) => `${key} = ?`).join(' AND ')}` : '';
    return db.query(
      `SELECT * FROM ${this.table} ${where} ORDER BY id`,
      keys.map((key) => filters[key])
    );
  }

  static async findById(id) {
    const rows = await db.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
    if (!rows.length) throw new NotFoundError();
    return rows[0];
  }

  static async create(data) {
    const payload = this.sanitize(data);
    this.validate(payload);
    const result = await db.query(`INSERT INTO ${this.table} SET ?`, [payload]);
    return this.findById(result.insertId);
  }

  static async update(id, data) {
    await this.findById(id);
    const payload = this.sanitize(data);
    this.validate(payload);
    await db.query(`UPDATE ${this.table} SET ? WHERE id = ?`, [payload, id]);
    return this.findById(id);
  }

  // ubah sebagian kolom saja
  static async patch(id, data) {
    await this.findById(id);
    const payload = this.sanitize(data);
    this.validate(payload, true);
    if (Object.keys(payload).length) {
      await db.query(`UPDATE ${this.table} SET ? WHERE id = ?`, [payload, id]);
    }
    return this.findById(id);
  }

  static async remove(id) {
    await this.findById(id);
    await db.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
  }

  // ambil field yang diizinkan saja, string kosong dijadikan null
  static sanitize(data = {}) {
    const result = {};
    for (const field of this.fields) {
      if (data[field] === undefined) continue;
      result[field] = data[field] === '' ? null : data[field];
    }
    return result;
  }

  static validate(data, partial = false) {
    const errors = {};

    for (const field of this.required) {
      const missing = data[field] === undefined || data[field] === null;
      if (missing && (!partial || field in data)) {
        errors[field] = `${field} wajib diisi`;
      }
    }

    for (const [field, allowed] of Object.entries(this.enums)) {
      if (data[field] != null && !allowed.includes(data[field])) {
        errors[field] = `${field} harus salah satu dari: ${allowed.join(', ')}`;
      }
    }

    if (Object.keys(errors).length) throw new ValidationError(errors);
  }
}

module.exports = BaseModel;
