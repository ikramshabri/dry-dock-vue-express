const BaseModel = require('./BaseModel');
const db = require('../config/database');
const { NotFoundError, HttpError } = require('../utils/errors');

class DryDock extends BaseModel {
  static table = 'dry_docks';
  static fields = [
    'dry_dock_no', 'vessel_id', 'shipyard_id', 'description', 'company', 'account_code',
    'responsible_rank', 'manager', 'budget', 'currency', 'priority', 'status',
    'planned_start', 'planned_end', 'actual_start', 'actual_end',
  ];
  static required = ['dry_dock_no', 'vessel_id'];
  static enums = {
    priority: ['low', 'medium', 'high'],
    status: ['planning', 'execution', 'completed'],
  };

  static baseQuery = `
    SELECT d.*, v.name AS vessel_name, v.image_url AS vessel_image, s.name AS shipyard_name,
           (SELECT COUNT(*) FROM work_orders w WHERE w.dry_dock_id = d.id) AS spec_count
    FROM dry_docks d
    JOIN vessels v ON v.id = d.vessel_id
    LEFT JOIN shipyards s ON s.id = d.shipyard_id
  `;

  static async findAll() {
    return db.query(`${this.baseQuery} ORDER BY d.id DESC`);
  }

  static async findById(id) {
    const rows = await db.query(`${this.baseQuery} WHERE d.id = ?`, [id]);
    if (!rows.length) throw new NotFoundError();
    return rows[0];
  }

  static async start(id) {
    const dock = await this.findById(id);
    if (dock.status !== 'planning') {
      throw new HttpError(409, 'Dry dock hanya bisa dimulai dari status planning');
    }
    await db.query(
      "UPDATE dry_docks SET status = 'execution', actual_start = CURDATE() WHERE id = ?",
      [id]
    );
    return this.findById(id);
  }

  // salin estimasi yard ke biaya aktual untuk semua work order
  static async copyEstimates(id) {
    await this.findById(id);
    await db.query(
      'UPDATE work_orders SET actual_yard_cost = yard_estimate WHERE dry_dock_id = ?',
      [id]
    );
  }

  // ringkasan biaya, status work order, dan perbandingan per spec group
  static async summary(id) {
    const dock = await this.findById(id);

    const [sums] = await db.query(
      `SELECT COALESCE(SUM(yard_estimate), 0) AS yard_estimates,
              COALESCE(SUM(owner_estimate), 0) AS owner_estimates,
              COALESCE(SUM(actual_yard_cost), 0) AS actual_yard_costs,
              COALESCE(SUM(actual_owner_cost), 0) AS actual_owner_costs
       FROM work_orders WHERE dry_dock_id = ?`,
      [id]
    );

    const statuses = await db.query(
      'SELECT status, COUNT(*) AS total FROM work_orders WHERE dry_dock_id = ? GROUP BY status',
      [id]
    );

    const groups = await db.query(
      `SELECT g.name,
              COALESCE(SUM(w.yard_estimate + w.owner_estimate), 0) AS total_estimates,
              COALESCE(SUM(w.actual_yard_cost + w.actual_owner_cost), 0) AS total_costs,
              COALESCE(SUM(w.budget), 0) AS total_budget
       FROM work_orders w
       JOIN spec_groups g ON g.id = w.spec_group_id
       WHERE w.dry_dock_id = ?
       GROUP BY g.id, g.name`,
      [id]
    );

    const budget = Number(dock.budget ?? 0);
    const yardEstimates = Number(sums.yard_estimates);
    const ownerEstimates = Number(sums.owner_estimates);
    const actualYardCosts = Number(sums.actual_yard_costs);
    const actualOwnerCosts = Number(sums.actual_owner_costs);
    const totalCosts = actualYardCosts + actualOwnerCosts;

    return {
      budget,
      yard_estimates: yardEstimates,
      owner_estimates: ownerEstimates,
      total_estimates: yardEstimates + ownerEstimates,
      actual_yard_costs: actualYardCosts,
      actual_owner_costs: actualOwnerCosts,
      total_costs: totalCosts,
      variance: budget - totalCosts,
      statuses: statuses.map((row) => ({ status: row.status, total: Number(row.total) })),
      groups: groups.map((row) => ({
        name: row.name,
        total_estimates: Number(row.total_estimates),
        total_costs: Number(row.total_costs),
        total_budget: Number(row.total_budget),
      })),
    };
  }
}

module.exports = DryDock;
