CREATE DATABASE IF NOT EXISTS drydock;
USE drydock;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS jobs, dockings, spec_updates, execution_records, reports, quotation_details,
  rfqs, tasks, checklists, purchase_orders, attachments,
  work_orders, work_order_masters, dry_docks, spec_groups, shipyards, vessels;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE vessels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  imo_number VARCHAR(20) NOT NULL UNIQUE,
  type VARCHAR(50) NULL,
  owner VARCHAR(100) NULL,
  image_url VARCHAR(255) NULL
);

CREATE TABLE shipyards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100) NULL
);

CREATE TABLE spec_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE work_order_masters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  equipment VARCHAR(200) NULL,
  spec_group_id INT NULL,
  FOREIGN KEY (spec_group_id) REFERENCES spec_groups(id) ON DELETE SET NULL
);

CREATE TABLE dry_docks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dry_dock_no VARCHAR(50) NOT NULL UNIQUE,
  vessel_id INT NOT NULL,
  shipyard_id INT NULL,
  description VARCHAR(255) NULL,
  company VARCHAR(100) NULL,
  account_code VARCHAR(50) NULL,
  responsible_rank VARCHAR(100) NULL,
  manager VARCHAR(100) NULL,
  budget DECIMAL(15,2) NULL DEFAULT 0,
  currency VARCHAR(10) NULL DEFAULT 'USD',
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  status ENUM('planning', 'execution', 'completed') NOT NULL DEFAULT 'planning',
  planned_start DATE NULL,
  planned_end DATE NULL,
  actual_start DATE NULL,
  actual_end DATE NULL,
  FOREIGN KEY (vessel_id) REFERENCES vessels(id),
  FOREIGN KEY (shipyard_id) REFERENCES shipyards(id) ON DELETE SET NULL
);

CREATE TABLE work_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dry_dock_id INT NOT NULL,
  spec_group_id INT NULL,
  job_code VARCHAR(50) NULL,
  title VARCHAR(200) NOT NULL,
  equipment VARCHAR(200) NULL,
  status ENUM('open', 'in_progress', 'on_hold', 'complete') NOT NULL DEFAULT 'open',
  budget DECIMAL(15,2) NULL DEFAULT 0,
  responsible_user VARCHAR(100) NULL,
  progress INT NOT NULL DEFAULT 0,
  last_updated_by VARCHAR(100) NULL,
  last_updated_at DATE NULL,
  yard_estimate DECIMAL(15,2) NULL DEFAULT 0,
  owner_estimate DECIMAL(15,2) NULL DEFAULT 0,
  actual_yard_cost DECIMAL(15,2) NULL DEFAULT 0,
  actual_owner_cost DECIMAL(15,2) NULL DEFAULT 0,
  FOREIGN KEY (dry_dock_id) REFERENCES dry_docks(id) ON DELETE CASCADE,
  FOREIGN KEY (spec_group_id) REFERENCES spec_groups(id) ON DELETE SET NULL
);

CREATE TABLE attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dry_dock_id INT NOT NULL,
  file_name VARCHAR(150) NOT NULL,
  title VARCHAR(150) NULL,
  include_in_specs TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (dry_dock_id) REFERENCES dry_docks(id) ON DELETE CASCADE
);

CREATE TABLE purchase_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dry_dock_id INT NOT NULL,
  po_number VARCHAR(50) NOT NULL,
  category ENUM('inventory', 'spare_part', 'machinery') NOT NULL,
  total DECIMAL(15,2) NULL DEFAULT 0,
  supplier VARCHAR(150) NULL,
  approved TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (dry_dock_id) REFERENCES dry_docks(id) ON DELETE CASCADE
);

CREATE TABLE checklists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dry_dock_id INT NULL,
  title VARCHAR(200) NOT NULL,
  is_done TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (dry_dock_id) REFERENCES dry_docks(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dry_dock_id INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  responsible VARCHAR(100) NULL,
  due_date DATE NULL,
  description TEXT NULL,
  status ENUM('open', 'in_progress', 'closed') NOT NULL DEFAULT 'open',
  FOREIGN KEY (dry_dock_id) REFERENCES dry_docks(id) ON DELETE CASCADE
);

CREATE TABLE rfqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dry_dock_id INT NOT NULL,
  rfq_no VARCHAR(50) NOT NULL,
  rfq_date DATE NULL,
  expiry_date DATE NULL,
  comments VARCHAR(255) NULL,
  FOREIGN KEY (dry_dock_id) REFERENCES dry_docks(id) ON DELETE CASCADE
);

CREATE TABLE quotation_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dry_dock_id INT NOT NULL,
  spec_group_id INT NULL,
  job_code VARCHAR(50) NULL,
  job_name VARCHAR(200) NOT NULL,
  vessel_name VARCHAR(100) NULL,
  machinery_group VARCHAR(100) NULL,
  machinery VARCHAR(200) NULL,
  FOREIGN KEY (dry_dock_id) REFERENCES dry_docks(id) ON DELETE CASCADE,
  FOREIGN KEY (spec_group_id) REFERENCES spec_groups(id) ON DELETE SET NULL
);

CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dry_dock_id INT NOT NULL,
  type ENUM('daily', 'completion') NOT NULL,
  name VARCHAR(150) NOT NULL,
  report_date DATE NULL,
  updated_by VARCHAR(100) NULL,
  FOREIGN KEY (dry_dock_id) REFERENCES dry_docks(id) ON DELETE CASCADE
);

CREATE TABLE execution_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dry_dock_id INT NOT NULL,
  type ENUM('fact', 'meeting', 'variation_order') NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  record_date DATE NULL,
  amount DECIMAL(15,2) NULL DEFAULT 0,
  FOREIGN KEY (dry_dock_id) REFERENCES dry_docks(id) ON DELETE CASCADE
);

CREATE TABLE spec_updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  work_order_id INT NOT NULL,
  progress INT NOT NULL,
  note VARCHAR(255) NULL,
  updated_by VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE
);
