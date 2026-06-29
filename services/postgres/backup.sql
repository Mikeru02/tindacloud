-- ==========================================
-- DROP EXISTING TABLES
-- ==========================================

DROP TABLE IF EXISTS inventory_movements CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS merchant_invitation CASCADE;
DROP TABLE IF EXISTS merchant_members CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS merchants CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ==========================================
-- 1. INDEPENDENT TABLES (No Foreign Keys)
-- ==========================================

CREATE TABLE users (
    id SERIAL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- CONSTRAINTS
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE TABLE merchants (
    id SERIAL,
    store_type VARCHAR(100) NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    store_description TEXT,
    store_address TEXT,
    store_phone VARCHAR(50),
    store_email VARCHAR(255),
    social_media_links JSONB,
    publicity BOOLEAN DEFAULT FALSE,
    store_status VARCHAR(50) DEFAULT 'active',
    notification_settings JSONB DEFAULT '{"email_orders": true, "email_low_stock": true, "email_inquiries": false, "sms_urgent": false}'::jsonb,
    operating_hours JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- CONSTRAINTS
    CONSTRAINT pk_merchants PRIMARY KEY (id),
    CONSTRAINT chk_merchants_status CHECK (store_status IN ('active', 'inactive', 'suspended'))
);

CREATE TABLE category (
    id SERIAL,
    name VARCHAR(100) NOT NULL,
    
    -- CONSTRAINTS
    CONSTRAINT pk_category PRIMARY KEY (id)
);

-- ==========================================
-- 2. DEPENDENT TABLES (Profiles & Management)
-- ==========================================

CREATE TABLE customers (
    user_id INTEGER,
    birthdate DATE,
    address TEXT,
    loyalty_points INTEGER DEFAULT 0,
    
    -- CONSTRAINTS
    CONSTRAINT pk_customers PRIMARY KEY (user_id),
    CONSTRAINT fk_customers_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_customers_points CHECK (loyalty_points >= 0)
);

CREATE TABLE merchant_members (
    merchant_id INTEGER,
    user_id INTEGER,
    role VARCHAR(50) NOT NULL,
    
    -- CONSTRAINTS
    CONSTRAINT pk_merchant_members PRIMARY KEY (merchant_id, user_id),
    CONSTRAINT fk_members_merchant FOREIGN KEY (merchant_id) 
        REFERENCES merchants(id) ON DELETE CASCADE,
    CONSTRAINT fk_members_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE merchant_invitation (
    id SERIAL,
    merchant_id INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expire_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    
    -- CONSTRAINTS
    CONSTRAINT pk_merchant_invitation PRIMARY KEY (id),
    CONSTRAINT uq_invitation_token UNIQUE (token),
    CONSTRAINT fk_invitation_merchant FOREIGN KEY (merchant_id) 
        REFERENCES merchants(id) ON DELETE CASCADE
);

-- ==========================================
-- 3. CORE PRODUCTS CATALOG
-- ==========================================

CREATE TABLE products (
    id SERIAL,
    merchant_id INTEGER NOT NULL,
    category_id INTEGER,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    wholesale_price NUMERIC(12, 2) NULL,
    wholesale_count INTEGER NULL,
    cost NUMERIC(12, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- CONSTRAINTS
    CONSTRAINT pk_products PRIMARY KEY (id),
    CONSTRAINT uq_products_merchant_sku UNIQUE (merchant_id, sku),
    CONSTRAINT fk_products_merchant FOREIGN KEY (merchant_id) 
        REFERENCES merchants(id) ON DELETE RESTRICT,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) 
        REFERENCES category(id) ON DELETE SET NULL,
    CONSTRAINT chk_products_price CHECK (price >= 0.00),
    CONSTRAINT chk_products_cost CHECK (cost >= 0.00),
    CONSTRAINT chk_products_stock CHECK (stock >= 0),
    CONSTRAINT chk_products_low_stock_threshold CHECK (low_stock_threshold >= 0)
);


-- ==========================================
-- 4. ACTIVE SHOPPING CARTS
-- ==========================================

CREATE TABLE cart (
    id SERIAL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- CONSTRAINTS
    CONSTRAINT pk_cart PRIMARY KEY (id),
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id SERIAL,
    cart_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    
    -- CONSTRAINTS
    CONSTRAINT pk_cart_items PRIMARY KEY (id),
    CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id),
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) 
        REFERENCES cart(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT chk_cart_items_qty CHECK (quantity > 0)
);

-- ==========================================
-- 5. HISTORICAL SALES & LEDGERS
-- ==========================================

CREATE TABLE orders (
    id SERIAL,
    merchant_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    source VARCHAR(50) DEFAULT 'POS', -- Integrated from migration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- CONSTRAINTS
    CONSTRAINT pk_orders PRIMARY KEY (id),
    CONSTRAINT fk_orders_merchant FOREIGN KEY (merchant_id) 
        REFERENCES merchants(id) ON DELETE RESTRICT,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_orders_amount CHECK (amount >= 0.00),
    CONSTRAINT chk_orders_source CHECK (source IN ('POS', 'INVENTORY', 'PURCHASE', 'SYSTEM')) -- Integrated from migration
);

CREATE TABLE order_items (
    id SERIAL,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    
    -- CONSTRAINTS
    CONSTRAINT pk_order_items PRIMARY KEY (id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) 
        REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT chk_order_items_qty CHECK (quantity > 0),
    CONSTRAINT chk_order_items_price CHECK (price >= 0.00)
);

-- ==========================================
-- 6. INVENTORY MOVEMENTS LOGS (Integrated Table)
-- ==========================================

CREATE TABLE inventory_movements (
    id SERIAL,
    merchant_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity_before INTEGER NOT NULL,
    quantity_after INTEGER NOT NULL,
    quantity_difference INTEGER NOT NULL,
    movement_type VARCHAR(50) NOT NULL,
    reference_type VARCHAR(50) NOT NULL,
    reference_id INTEGER,
    remarks TEXT,
    created_by INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- CONSTRAINTS
    CONSTRAINT pk_inventory_movements PRIMARY KEY (id),
    CONSTRAINT fk_inventory_movements_merchant FOREIGN KEY (merchant_id) 
        REFERENCES merchants(id) ON DELETE RESTRICT,
    CONSTRAINT fk_inventory_movements_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT fk_inventory_movements_user FOREIGN KEY (created_by) 
        REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_inventory_movements_type CHECK (movement_type IN ('SALE', 'RESTOCK', 'DAMAGED', 'EXPIRED', 'LOST', 'ADJUSTMENT')),
    CONSTRAINT chk_inventory_movements_reference_type CHECK (reference_type IN ('POS', 'INVENTORY', 'PURCHASE', 'SYSTEM'))
);

-- ==========================================
-- 7. PERFORMANCE INDEXES
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_inventory_movements_merchant ON inventory_movements(merchant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_product ON inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_type ON inventory_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_created_at ON inventory_movements(created_at);