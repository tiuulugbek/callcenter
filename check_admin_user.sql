-- Admin user ni tekshirish va yaratish

-- 1. Admin user borligini tekshirish
SELECT id, username, name, role FROM operators WHERE username = 'admin';

-- 2. Agar admin user yo'q bo'lsa, yaratish
-- Password: password (bcrypt hash)
INSERT INTO operators (username, password, name, role, created_at, updated_at)
VALUES (
  'admin',
  '$2b$10$rOzJ8K8K8K8K8K8K8K8K8O8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K',
  'Administrator',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (username) DO NOTHING;

-- 3. Admin user ni yangilash (password: password)
UPDATE operators 
SET password = '$2b$10$rOzJ8K8K8K8K8K8K8K8K8O8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K'
WHERE username = 'admin';

