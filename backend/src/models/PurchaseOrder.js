const BaseModel = require('./BaseModel');

class PurchaseOrder extends BaseModel {
  static table = 'purchase_orders';
  static fields = ['dry_dock_id', 'po_number', 'category', 'total', 'supplier', 'approved'];
  static required = ['dry_dock_id', 'po_number', 'category'];
  static enums = { category: ['inventory', 'spare_part', 'machinery'] };
}

module.exports = PurchaseOrder;
