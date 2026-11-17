-- ERP SQLite 초기 스키마 (kimdev, ce9f671)

CREATE TABLE IF NOT EXISTS company (
  company_id BIGINT NOT NULL PRIMARY KEY,
  company_name TEXT NOT NULL CHECK (length(company_name) <= 100),
  business_number TEXT NOT NULL CHECK (length(business_number) <= 12),
  email TEXT NOT NULL CHECK (length(email) <= 100)
);

CREATE TABLE IF NOT EXISTS employee (
  emp_id TEXT NOT NULL PRIMARY KEY CHECK (length(emp_id) <= 50),
  emp_name TEXT NOT NULL CHECK (length(emp_name) <= 50),
  department TEXT NOT NULL CHECK (length(department) <= 20),
  job_position TEXT NOT NULL CHECK (length(job_position) <= 20),
  status TEXT CHECK (length(status) <= 20),
  join_date DATE NOT NULL,
  created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
  -- JWT 검증에 사용하는 회원 ID의 재사용을 방지합니다.
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL CHECK (length(first_name) <= 50),
  last_name TEXT NOT NULL CHECK (length(last_name) <= 50),
  email TEXT NOT NULL UNIQUE CHECK (length(email) <= 100),
  password TEXT NOT NULL CHECK (length(password) <= 255),
  emp_id TEXT UNIQUE,
  member_role TEXT NOT NULL CHECK (member_role IN ('ADMIN', 'MANAGER', 'USER')),
  is_active INTEGER NOT NULL CHECK (is_active IN (0, 1)),
  tel TEXT CHECK (length(tel) <= 20),
  address TEXT CHECK (length(address) <= 255),
  detail_address TEXT CHECK (length(detail_address) <= 255),
  gender TEXT CHECK (length(gender) <= 20),
  google_id TEXT UNIQUE CHECK (length(google_id) <= 255),
  kakao_id TEXT UNIQUE CHECK (length(kakao_id) <= 32),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  password_reset_token_hash TEXT UNIQUE CHECK (length(password_reset_token_hash) <= 64),
  password_reset_expires_at TIMESTAMP,
  CONSTRAINT fk_members_employee FOREIGN KEY (emp_id) REFERENCES employee (emp_id)
);

CREATE TABLE IF NOT EXISTS inventory_item (
  item_id TEXT NOT NULL PRIMARY KEY CHECK (length(item_id) <= 50),
  item_name TEXT NOT NULL CHECK (length(item_name) <= 100),
  category TEXT NOT NULL CHECK (length(category) <= 20),
  stock INTEGER NOT NULL,
  safety_stock INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  status TEXT CHECK (length(status) <= 20),
  created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS production_order (
  order_id TEXT NOT NULL PRIMARY KEY CHECK (length(order_id) <= 50),
  item_id TEXT,
  product_name TEXT NOT NULL CHECK (length(product_name) <= 100),
  quantity INTEGER NOT NULL,
  status TEXT CHECK (length(status) <= 20),
  progress INTEGER,
  due_date DATE,
  created_at TIMESTAMP,
  completed_at TIMESTAMP,
  CONSTRAINT fk_production_order_item FOREIGN KEY (item_id) REFERENCES inventory_item (item_id)
);

CREATE TABLE IF NOT EXISTS calendar_schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  schedule_date DATE NOT NULL,
  content TEXT NOT NULL CHECK (length(content) <= 1000),
  status TEXT NOT NULL CHECK (length(status) <= 10),
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (member_id) REFERENCES members (id)
);

CREATE INDEX IF NOT EXISTS idx_schedule_member_date
  ON calendar_schedules (member_id, schedule_date);

CREATE TABLE IF NOT EXISTS stock_movement (
  movement_id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id TEXT NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('INITIAL', 'IN', 'OUT', 'PRODUCTION')),
  quantity INTEGER NOT NULL,
  stock_after INTEGER NOT NULL,
  order_id TEXT CHECK (length(order_id) <= 50),
  memo TEXT CHECK (length(memo) <= 200),
  member_id INTEGER,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT fk_stock_movement_item FOREIGN KEY (item_id) REFERENCES inventory_item (item_id),
  CONSTRAINT fk_stock_movement_member FOREIGN KEY (member_id) REFERENCES members (id)
);

CREATE INDEX IF NOT EXISTS idx_stock_movement_item
  ON stock_movement (item_id, movement_id);

CREATE TABLE IF NOT EXISTS document_sequence (
  sequence_key TEXT NOT NULL PRIMARY KEY CHECK (length(sequence_key) <= 30),
  last_value INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS google_auth_flows (
  state_hash TEXT NOT NULL PRIMARY KEY CHECK (length(state_hash) <= 64),
  flow_token_hash TEXT NOT NULL CHECK (length(flow_token_hash) <= 64),
  auth_nonce TEXT NOT NULL CHECK (length(auth_nonce) <= 64),
  code_verifier TEXT NOT NULL CHECK (length(code_verifier) <= 64),
  is_signup INTEGER NOT NULL CHECK (is_signup IN (0, 1)),
  first_name TEXT CHECK (length(first_name) <= 50),
  last_name TEXT CHECK (length(last_name) <= 50),
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_google_auth_expires
  ON google_auth_flows (expires_at);
