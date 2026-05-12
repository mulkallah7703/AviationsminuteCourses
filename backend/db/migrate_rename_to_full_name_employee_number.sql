-- Run once if upgrading from employee_id / name columns:
-- psql "$DATABASE_URL" -f db/migrate_rename_to_full_name_employee_number.sql

ALTER TABLE users RENAME COLUMN employee_id TO employee_number;
ALTER TABLE users RENAME COLUMN name TO full_name;

DROP INDEX IF EXISTS idx_users_employee_id;
CREATE INDEX IF NOT EXISTS idx_users_employee_number ON users (employee_number);
