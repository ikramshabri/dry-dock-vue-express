USE drydock;

INSERT INTO vessels (name, imo_number, type, owner) VALUES
  ('Ocean Star', '9123456', 'Container Ship', 'UHC Pvt. Ltd.');

INSERT INTO shipyards (name, location) VALUES
  ('Mitsubishi Yard', 'Nagasaki'),
  ('Aqua Marine Yard', 'Dubai');

INSERT INTO spec_groups (name) VALUES
  ('General'), ('Hull'), ('Machinery Main Components'),
  ('Equipment for Crew'), ('Ship Common Systems'), ('Fasting');

INSERT INTO work_order_masters (title, equipment, spec_group_id) VALUES
  ('3 Month Routine Check and Inspection El. Motor', 'Yokohama Fender crane no.4 (115.041)', 1);

INSERT INTO dry_docks (dry_dock_no, vessel_id, shipyard_id, description, company, account_code,
  responsible_rank, budget, currency, priority, status, planned_start, planned_end) VALUES
  ('SEPT2020/DD1', 1, 1, 'DD Required to change BWT', 'UHC Pvt. Ltd.', 'ABC-123',
   'Roshan Ahluwalia/CE', 200000, 'USD', 'medium', 'planning', '2020-01-01', '2020-02-01');

INSERT INTO work_orders (dry_dock_id, spec_group_id, title, equipment, status,
  yard_estimate, owner_estimate, actual_yard_cost, actual_owner_cost) VALUES
  (1, 1, '5 Monthly check of Auxiliary engine', 'Yokohama Fender crane no.4 (115.041)', 'open', 100, 70, 80, 40),
  (1, 2, '3 Month Routine Check and Inspection El. Motor', 'Hull plating', 'on_hold', 30, 30, 30, 30),
  (1, 3, '3 Month Routine Check and Inspection El. Motor', 'No.2 Cargo Pump (114.001B)', 'complete', 30, 30, 20, 40),
  (1, 4, '2 Months Routine for Greasing of Anchor Windlass', 'Yokohama Fender Crane No.2 (115.039)', 'in_progress', 150, 150, 90, 90),
  (1, 5, 'Sub Job 5', 'No.1 Cargo Pump (114.001A)', 'open', 30, 30, 30, 30);

INSERT INTO attachments (dry_dock_id, file_name, title, include_in_specs) VALUES
  (1, 'PROCEDURE.PDF', 'Include in Specs', 1),
  (1, 'FINDINGS.DOCX', 'Include in Specs', 0);

INSERT INTO purchase_orders (dry_dock_id, po_number, category, total, supplier, approved) VALUES
  (1, 'SD10/O/PO/18/0059C', 'inventory', 2725, 'Mitsubishi Kakoki Kaisha Ltd', 1),
  (1, 'SD10/O/PO/22/0009A', 'inventory', 200, 'VARA ENERGY', 0),
  (1, 'SW10/O/PO/21/0192', 'spare_part', 1918.08, 'Offshore & Maritime Resources FZE', 1),
  (1, 'SW24/O/PO/21/0149', 'machinery', 440, 'VARA ENERGY', 0);

UPDATE work_orders SET
  budget = (yard_estimate + owner_estimate) / 25,
  responsible_user = 'Roshan',
  progress = CASE status WHEN 'complete' THEN 100 WHEN 'in_progress' THEN 60 WHEN 'on_hold' THEN 30 ELSE 0 END,
  last_updated_by = 'Roshan',
  last_updated_at = '2022-10-12';

INSERT INTO tasks (dry_dock_id, category, responsible, due_date, description, status) VALUES
  (1, 'Visa Requirement', 'Roshan', '2022-10-10', 'Siapkan visa untuk kru yard.', 'open'),
  (1, 'Permit Requirement', 'Joanne', '2022-10-10', 'Urus izin kerja panas di area dock.', 'open'),
  (1, 'Agency Requirement', 'Raja', '2022-10-10', 'Konfirmasi agen pelabuhan.', 'closed');

INSERT INTO rfqs (dry_dock_id, rfq_no, rfq_date, expiry_date, comments) VALUES
  (1, 'SD10/S/RFQ/17/0057', '2017-06-18', '2017-07-02', 'with class approved certificate');

INSERT INTO quotation_details (dry_dock_id, spec_group_id, job_code, job_name, vessel_name, machinery_group, machinery) VALUES
  (1, 1, 'C001', '5 Monthly check of Auxiliary engine', 'SDSD24', 'COMPRESSED AIR SYSTEM', 'Yokohama Fender crane no.4 (115.041)'),
  (1, 1, 'C001', '6 Months Routine Check and Operate The Electro Hydraulic Controls', 'SDSD20', 'LIFE SAVING AND FIRE FIGHTING', 'Thermal Oil Heater Fuel Oil Booster Pump Motor');

INSERT INTO reports (dry_dock_id, type, name, report_date, updated_by) VALUES
  (1, 'daily', 'Daily', '2022-10-11', 'Roshan'),
  (1, 'daily', 'Daily Report', '2022-10-12', 'Roshan');

INSERT INTO execution_records (dry_dock_id, type, title, description, record_date, amount) VALUES
  (1, 'meeting', 'Kick-off Meeting', 'Pertemuan awal dengan yard.', '2022-10-10', 0),
  (1, 'variation_order', 'Tambahan penggantian pipa', 'Temuan saat inspeksi.', '2022-10-12', 1500);

UPDATE work_orders SET job_code = CONCAT('C00', id);

INSERT INTO vessels (name, imo_number, type, owner) VALUES
  ('MV Glory', '9234567', 'Offshore Vessel', 'UHC Pvt. Ltd.'),
  ('MV Happy', '9345678', 'Container Ship', 'UHC Pvt. Ltd.');

INSERT INTO dry_docks (dry_dock_no, vessel_id, description, company, manager, budget, currency,
  priority, status, planned_start, planned_end, actual_start, actual_end) VALUES
  ('SEPT2020/DD2', 2, 'DD Required to change BWT', 'UHC Pvt. Ltd.', 'Mark/Master', 150000, 'USD', 'medium', 'planning', '2020-09-01', '2020-09-30', NULL, NULL),
  ('OCT2020DD2', 3, 'DD Needed to change OIL TANK', 'UHC Pvt. Ltd.', 'Mark/Master', 90000, 'USD', 'high', 'execution', '2020-03-01', '2020-03-31', '2020-03-01', '2020-03-31'),
  ('OCT2020DD3', 3, 'DD to change navigation equipment', 'UHC Pvt. Ltd.', 'Mark/Master', 60000, 'USD', 'low', 'completed', '2020-04-01', '2020-04-30', '2020-04-01', '2020-04-30');

UPDATE dry_docks SET manager = 'Mark/Master' WHERE manager IS NULL;

INSERT INTO work_orders (dry_dock_id, spec_group_id, job_code, title, equipment, status, budget, responsible_user) VALUES
  (1, 6, 'UYU789', 'Decking Eng', 'Buster fuel', 'open', 0, 'Roshan');

-- Data tambahan untuk dry dock 2, 3, dan 4 agar grafik dan daftar tidak kosong
SET @dd2 = (SELECT id FROM dry_docks WHERE dry_dock_no = 'SEPT2020/DD2');
SET @dd3 = (SELECT id FROM dry_docks WHERE dry_dock_no = 'OCT2020DD2');
SET @dd4 = (SELECT id FROM dry_docks WHERE dry_dock_no = 'OCT2020DD3');

SET @general = (SELECT id FROM spec_groups WHERE name = 'General' LIMIT 1);
SET @hull = (SELECT id FROM spec_groups WHERE name = 'Hull' LIMIT 1);
SET @machinery = (SELECT id FROM spec_groups WHERE name = 'Machinery Main Components' LIMIT 1);
SET @crew = (SELECT id FROM spec_groups WHERE name = 'Equipment for Crew' LIMIT 1);
SET @common = (SELECT id FROM spec_groups WHERE name = 'Ship Common Systems' LIMIT 1);

INSERT INTO work_orders
  (dry_dock_id, spec_group_id, job_code, title, equipment, status, budget,
   yard_estimate, owner_estimate, actual_yard_cost, actual_owner_cost,
   responsible_user, progress, last_updated_by, last_updated_at)
VALUES
  -- SEPT2020/DD2 (planning): baru ada estimasi, belum ada biaya aktual
  (@dd2, @general, 'C101', 'Initial survey', 'Hull', 'open', 200, 150, 50, 0, 0, 'Mark', 0, 'Mark', '2020-08-20'),
  (@dd2, @hull, 'C102', 'Hull plating renewal', 'Hull plating', 'open', 600, 400, 150, 0, 0, 'Mark', 0, 'Mark', '2020-08-20'),
  (@dd2, @machinery, 'C103', 'Change BWT', 'BWT unit', 'open', 500, 320, 120, 0, 0, 'Mark', 0, 'Mark', '2020-08-21'),
  (@dd2, @common, 'C104', 'Piping renewal', 'Ballast piping', 'open', 300, 180, 90, 0, 0, 'Mark', 0, 'Mark', '2020-08-21'),

  -- OCT2020DD2 (execution): campuran status dengan nilai besar
  (@dd3, @general, 'C201', 'Cleaning and painting of hull', 'Hull plating', 'in_progress', 500, 300, 150, 250, 120, 'Mark', 60, 'Mark', '2020-03-15'),
  (@dd3, @general, 'C202', 'Anchor chain inspection', 'Anchor windlass', 'complete', 400, 250, 100, 260, 90, 'Raja', 100, 'Raja', '2020-03-12'),
  (@dd3, @hull, 'C203', 'Hull blasting', 'Hull', 'in_progress', 800, 500, 200, 300, 100, 'Mark', 40, 'Mark', '2020-03-16'),
  (@dd3, @machinery, 'C204', 'Overhaul main engine', 'Main engine No.1', 'on_hold', 900, 600, 250, 0, 0, 'Roshan', 10, 'Roshan', '2020-03-10'),
  (@dd3, @crew, 'C205', 'Replace lifeboat davit', 'Lifeboat', 'open', 350, 200, 100, 0, 0, 'Raja', 0, 'Raja', '2020-03-08'),
  (@dd3, @common, 'C206', 'Ballast water treatment fix', 'BWT unit', 'in_progress', 600, 350, 200, 200, 150, 'Mark', 50, 'Mark', '2020-03-17'),

  -- OCT2020DD3 (completed): semua selesai
  (@dd4, @general, 'C301', 'Navigation equipment survey', 'Bridge', 'complete', 150, 100, 40, 110, 45, 'Mark', 100, 'Mark', '2020-04-20'),
  (@dd4, @crew, 'C302', 'Replace radar', 'Radar X-band', 'complete', 450, 300, 120, 310, 130, 'Mark', 100, 'Mark', '2020-04-22'),
  (@dd4, @machinery, 'C303', 'Gyro compass overhaul', 'Gyro compass', 'complete', 250, 150, 80, 145, 95, 'Raja', 100, 'Raja', '2020-04-25'),
  (@dd4, @common, 'C304', 'ECDIS update', 'ECDIS', 'complete', 120, 80, 30, 75, 35, 'Roshan', 100, 'Roshan', '2020-04-28');