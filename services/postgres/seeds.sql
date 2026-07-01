BEGIN;

INSERT INTO users (id, email, password, first_name, last_name, phone, status, created_at, updated_at) VALUES
(1, 'johndoe@mail.com', '$2b$10$GE1NMD6zSkSibmQgqz/lvuzp.IC7PVByrKopJa1lHi.y0zfB/gFJG', 'John', 'Doe', '1234567890', 'active', NOW(), NOW()),
(2, 'manager@mail.com', '$2b$10$GE1NMD6zSkSibmQgqz/lvuzp.IC7PVByrKopJa1lHi.y0zfB/gFJG', 'Manager', 'Doe', '1234567890', 'active', NOW(), NOW()),
(3, 'cashier@mail.com', '$2b$10$GE1NMD6zSkSibmQgqz/lvuzp.IC7PVByrKopJa1lHi.y0zfB/gFJG', 'Cashier', 'Doe', '1234567890', 'active', NOW(), NOW());

INSERT INTO merchants (id, store_type, store_name, store_description, store_address, store_phone, store_email, social_media_links, publicity, store_status, notification_settings) VALUES
(1, 'retail', 'John Doe Store', 'John Doe Store', '123 Main St', '1234567890', 'johndoe@mail.com', '{}', FALSE, 'active',  '{"sms_urgent": false, "email_orders": true, "email_inquiries": false, "email_low_stock": true}'),
(2, 'retail', 'John Doe SuperStore', 'John Doe SuperStore', '123 Main St', '1234567890', 'johndoe@mail.com', '{}', FALSE, 'active',  '{"sms_urgent": false, "email_orders": true, "email_inquiries": false, "email_low_stock": true}'),
(3, 'retail', 'John Doe Resto', 'John Doe Resto', '123 Main St', '1234567890', 'johndoe@mail.com', '{}', FALSE, 'active',  '{"sms_urgent": false, "email_orders": true, "email_inquiries": false, "email_low_stock": true}');


INSERT INTO merchant_members (merchant_id, user_id, role) VALUES
(1, 1, 'owner'),
(2, 1, 'owner'),
(3, 1, 'owner'),
(1, 2, 'manager'),
(1, 3, 'cashier'),
(2, 3, 'cashier'),
(3, 3, 'cashier');

COMMIT;