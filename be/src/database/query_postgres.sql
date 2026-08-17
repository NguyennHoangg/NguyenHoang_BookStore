-- PostgreSQL Database Script for OnlineBookStore
-- Upgraded: constraints, indexes, shipping status, coupon limits, reviews audit

-- =============================================
-- IMPORTANT: Run this command separately first:
-- CREATE DATABASE OnlineBookStore;
-- Then connect to the database and run the rest of this script
-- =============================================

-- Drop tables if they exist (for idempotent execution)
DROP TABLE IF EXISTS cartdetail CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS bookauthor CASCADE;
DROP TABLE IF EXISTS author CASCADE;
DROP TABLE IF EXISTS shippinginfo CASCADE;
DROP TABLE IF EXISTS ordercoupons CASCADE;
DROP TABLE IF EXISTS orderdetails CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookstock CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS publishers CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;

-- =============================================
-- Table: Accounts
-- =============================================
CREATE TABLE accounts (
    accountid   VARCHAR(10)  PRIMARY KEY,
    identifier  VARCHAR(100) NOT NULL UNIQUE,
    identifiervalue VARCHAR(100) NOT NULL UNIQUE,
    passwordhash VARCHAR(255) NOT NULL,
    role        VARCHAR(10)  DEFAULT 'user'
                             CHECK (role IN ('user', 'admin', 'curator')),
    createdat   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updatedat   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    isactive    BOOLEAN      DEFAULT TRUE,
    avatar      VARCHAR(500),
    lastloginat TIMESTAMP
);

-- =============================================
-- Table: Users
-- =============================================
CREATE TABLE users (
    userid    VARCHAR(10)  PRIMARY KEY,
    accountid VARCHAR(10)  UNIQUE,
    fullname  VARCHAR(100) NOT NULL,
    phone     VARCHAR(20),
    dob       DATE,
    gender    VARCHAR(10)  CHECK (gender IN ('Male', 'Female', 'Other')),
    address   VARCHAR(255),
    createdat TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (accountid) REFERENCES accounts(accountid) ON DELETE CASCADE
);

-- =============================================
-- Table: Categories
-- =============================================
CREATE TABLE categories (
    categoryid   VARCHAR(10)  PRIMARY KEY,
    categoryname VARCHAR(255) NOT NULL,
    description  VARCHAR(500),
    slug         VARCHAR(100) UNIQUE
);

-- =============================================
-- Table: Publishers
-- =============================================
CREATE TABLE publishers (
    publisherid   VARCHAR(10)  PRIMARY KEY,
    publishername VARCHAR(255) NOT NULL,
    address       VARCHAR(500)
);

-- =============================================
-- Table: Books
-- =============================================
CREATE TABLE books (
    bookid         VARCHAR(20)    PRIMARY KEY,
    title          VARCHAR(255)   NOT NULL,
    author         VARCHAR(255)   NOT NULL,  -- source column used by trigger → BookAuthor
    publisherid    VARCHAR(10),
    categoryid     VARCHAR(10),
    price          DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock          INTEGER        NOT NULL   DEFAULT 0 CHECK (stock >= 0),
    imageurl       VARCHAR(500),
    description    TEXT,
    createdat      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updatedat      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    url            VARCHAR(255)   NOT NULL,
    pages          INTEGER        NOT NULL   CHECK (pages > 0),
    barcode        VARCHAR(30)    NOT NULL,
    sku            VARCHAR(30)    NOT NULL   UNIQUE,
    isactive       BOOLEAN        DEFAULT TRUE,
    releaseyear    INTEGER        CHECK (releaseyear >= 1000 AND releaseyear <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    compareatprice DECIMAL(10, 2) CHECK (compareatprice >= 0),
    weight         VARCHAR(50),
    soldcount      INTEGER        NOT NULL DEFAULT 0 CHECK (soldcount >= 0),
    rating         DECIMAL(3, 2)  NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    discount       DECIMAL(5, 2)  NOT NULL DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
    FOREIGN KEY (categoryid)  REFERENCES categories(categoryid)  ON DELETE SET NULL,
    FOREIGN KEY (publisherid) REFERENCES publishers(publisherid) ON DELETE SET NULL
);

-- =============================================
-- Table: Warehouses
-- =============================================
CREATE TABLE warehouses (
    warehouseid VARCHAR(10)  PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    location    VARCHAR(255) NOT NULL
);

-- =============================================
-- Table: BookStock
-- =============================================
CREATE TABLE bookstock (
    bookid      VARCHAR(20) NOT NULL,
    warehouseid VARCHAR(10) NOT NULL,
    quantity    INTEGER     NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    updatedat   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (bookid, warehouseid),
    FOREIGN KEY (bookid)      REFERENCES books(bookid)      ON DELETE CASCADE,
    FOREIGN KEY (warehouseid) REFERENCES warehouses(warehouseid) ON DELETE CASCADE
);

-- =============================================
-- Table: Coupons
-- =============================================
CREATE TABLE coupons (
    couponid        VARCHAR(10)   PRIMARY KEY,
    code            VARCHAR(20)   NOT NULL UNIQUE,
    description     VARCHAR(255),
    discountpercent DECIMAL(5, 2) CHECK (discountpercent >= 0.01 AND discountpercent <= 100),
    maxusage        INTEGER       CHECK (maxusage > 0),       -- NULL = unlimited
    usedcount       INTEGER       NOT NULL DEFAULT 0 CHECK (usedcount >= 0),
    startdate       TIMESTAMP     NOT NULL,
    enddate         TIMESTAMP     NOT NULL,
    isactive        BOOLEAN       DEFAULT TRUE,
    minorderamount  DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (minorderamount >= 0),
    CONSTRAINT chk_coupon_dates CHECK (enddate > startdate)
);

-- =============================================
-- Table: Orders
-- =============================================
CREATE TABLE orders (
    orderid      VARCHAR(10)    PRIMARY KEY,
    accountid    VARCHAR(10),
    orderdate    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    status       VARCHAR(20)    DEFAULT 'Pending'
                                CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded')),
    total        DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    shippingfee  DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (shippingfee >= 0),
    notes        TEXT,
    updatedat    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (accountid) REFERENCES accounts(accountid) ON DELETE SET NULL
);

-- =============================================
-- Table: Payment
-- =============================================
CREATE TABLE payment (
    paymentid     VARCHAR(10)    PRIMARY KEY,
    orderid       VARCHAR(10)    UNIQUE,
    paymentmethod VARCHAR(50)    NOT NULL
                                 CHECK (paymentmethod IN ('Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'E-Wallet')),
    paymentstatus VARCHAR(20)    DEFAULT 'Pending'
                                 CHECK (paymentstatus IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    amount        DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    transactionid VARCHAR(100),
    paymentdate   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    createdat     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updatedat     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    notes         TEXT,
    FOREIGN KEY (orderid) REFERENCES orders(orderid) ON DELETE CASCADE
);

-- =============================================
-- Table: OrderDetails
-- =============================================
CREATE TABLE orderdetails (
    orderdetailid VARCHAR(10)    PRIMARY KEY,
    orderid       VARCHAR(10),
    bookid        VARCHAR(20),
    quantity      INTEGER        NOT NULL CHECK (quantity >= 1),
    unitprice     DECIMAL(10, 2) NOT NULL CHECK (unitprice >= 0),
    discount      DECIMAL(5, 2)  NOT NULL DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
    FOREIGN KEY (orderid) REFERENCES orders(orderid)  ON DELETE CASCADE,
    FOREIGN KEY (bookid)  REFERENCES books(bookid)    ON DELETE SET NULL
);

-- =============================================
-- Table: OrderCoupons
-- =============================================
CREATE TABLE ordercoupons (
    ordercouponid VARCHAR(10) PRIMARY KEY,
    orderid       VARCHAR(10),
    couponid      VARCHAR(10),
    FOREIGN KEY (orderid)   REFERENCES orders(orderid)   ON DELETE CASCADE,
    FOREIGN KEY (couponid)  REFERENCES coupons(couponid) ON DELETE SET NULL,
    UNIQUE (orderid, couponid)
);

-- =============================================
-- Table: Reviews
-- =============================================
CREATE TABLE reviews (
    reviewid   VARCHAR(10) PRIMARY KEY,
    accountid  VARCHAR(10),
    bookid     VARCHAR(20),
    rating     INTEGER     CHECK (rating >= 1 AND rating <= 5),
    title      VARCHAR(255),
    comment    TEXT,
    isedited   BOOLEAN     DEFAULT FALSE,
    reviewdate TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    updatedat  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (accountid) REFERENCES accounts(accountid) ON DELETE SET NULL,
    FOREIGN KEY (bookid)    REFERENCES books(bookid)        ON DELETE CASCADE,
    UNIQUE (accountid, bookid)  -- một user chỉ review một sách một lần
);

-- =============================================
-- Table: ShippingInfo
-- =============================================
CREATE TABLE shippinginfo (
    shippingid        VARCHAR(10) PRIMARY KEY,
    orderid           VARCHAR(10) UNIQUE,
    fullname          VARCHAR(100) NOT NULL,
    phone             VARCHAR(20)  NOT NULL,
    addressline       VARCHAR(255) NOT NULL,
    city              VARCHAR(100) NOT NULL,
    postalcode        VARCHAR(20),
    country           VARCHAR(100) DEFAULT 'Vietnam',
    status            VARCHAR(20)  DEFAULT 'Preparing'
                                   CHECK (status IN ('Preparing', 'In Transit', 'Delivered', 'Failed', 'Returned')),
    shippingdate      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    estimateddelivery DATE,
    deliveredat       TIMESTAMP,
    trackingnumber    VARCHAR(100),
    carrier           VARCHAR(100),
    updatedat         TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderid) REFERENCES orders(orderid) ON DELETE CASCADE
);

-- =============================================
-- Table: author
-- =============================================
CREATE TABLE author (
    authorid VARCHAR(15)  PRIMARY KEY,
    name     VARCHAR(255) NOT NULL UNIQUE,
    bio      TEXT,
    country  VARCHAR(255)
);

-- =============================================
-- Table: BookAuthor (AuthorName removed — JOIN author.name instead)
-- =============================================
CREATE TABLE bookauthor (
    bookid    VARCHAR(20) NOT NULL,
    authorid  VARCHAR(15) NOT NULL,
    PRIMARY KEY (bookid, authorid),
    FOREIGN KEY (bookid)   REFERENCES books(bookid)   ON DELETE CASCADE,
    FOREIGN KEY (authorid) REFERENCES author(authorid) ON DELETE CASCADE
);

-- =============================================
-- Table: Cart
-- =============================================
CREATE TABLE cart (
    cartid    VARCHAR(10) PRIMARY KEY,
    accountid VARCHAR(10) NOT NULL UNIQUE,
    createdat TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (accountid) REFERENCES accounts(accountid) ON DELETE CASCADE
);

-- =============================================
-- Table: CartDetail
-- =============================================
CREATE TABLE cartdetail (
    cartdetailid VARCHAR(10)    PRIMARY KEY,
    cartid       VARCHAR(10)    NOT NULL,
    bookid       VARCHAR(20)    NOT NULL,
    quantity     INTEGER        NOT NULL CHECK (quantity >= 1),
    unitprice    DECIMAL(10, 2) NOT NULL CHECK (unitprice >= 0),
    createdat    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updatedat    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cartid)  REFERENCES cart(cartid)   ON DELETE CASCADE,
    FOREIGN KEY (bookid)  REFERENCES books(bookid)  ON DELETE CASCADE,
    UNIQUE (cartid, bookid)
);

-- =============================================
-- Insert Data: Categories
-- =============================================
INSERT INTO categories (categoryid, categoryname, description) VALUES
('CAT001', 'Phát triển bản thân', NULL),
('CAT002', 'Văn học nước ngoài', NULL),
('CAT003', 'Văn học Việt Nam', NULL),
('CAT004', 'Trinh thám - Kinh dí', NULL),
('CAT005', 'Khoa học viễn tưởng', NULL),
('CAT006', 'Tâm lý học', NULL),
('CAT007', 'Kinh tế - Kinh doanh', NULL),
('CAT008', 'Lịch sử', NULL),
('CAT009', 'Thiếu nhi', NULL),
('CAT010', 'Tiểu thuyết tình yêu', NULL),
('CAT011', 'Sách tham khảo', NULL),
('CAT012', 'Nghệ thuật', NULL),
('CAT013', 'Sức khỏe', NULL),
('CAT014', 'Chính trị - Xã hội', NULL),
('CAT015', 'Tôn giáo - Tâm linh', NULL),
('CAT016', 'Khoa học - Công nghệ', NULL),
('CAT017', 'Thơ ca', NULL),
('CAT018', 'Truyện ngắn', NULL),
('CAT019', 'Manga - Truyện tranh', NULL),
('CAT020', 'Giáo dục', NULL);

-- =============================================
-- Insert Data: Publishers
-- =============================================
INSERT INTO publishers (publisherid, publishername, address) VALUES
('PUB001', 'Dân Trí', 'Hà Nội'),
('PUB002', 'Văn Học', 'TP.HCM'),
('PUB003', 'Hội Nhà Văn', 'Hà Nội'),
('PUB004', 'Thế Giới', 'Hà Nội'),
('PUB005', 'Hà Nội', 'Hà Nội'),
('PUB006', 'Thông Tấn', 'Hà Nội'),
('PUB007', 'Công Thương', 'TP.HCM'),
('PUB008', 'Tổng Hợp', 'TP.HCM'),
('PUB009', 'Kim Đồng', 'Hà Nội'),
('PUB010', 'First News', 'TP.HCM'),
('PUB011', 'Đang cập nhật', ''),
('PUB012', 'Tổng hợp Thành phố Hồ Chí Minh', 'TP.HCM'),
('PUB013', 'Tổng Hợp TPHCM', 'TP.HCM'),
('PUB014', 'Phụ Nữ Việt Nam', 'Hà Nội'),
('PUB015', 'Lao Động', 'Hà Nội'),
('PUB016', 'Trẻ', 'TP.HCM'),
('PUB017', 'Alpha Books', 'TP.HCM'),
('PUB018', 'Nhã Nam', 'Hà Nội'),
('PUB019', 'IPM', 'TP.HCM'),
('PUB020', 'Thanh Niên', 'TP.HCM');

-- =============================================
-- Functions for Publisher and Category Mapping
-- =============================================

-- Function to get publisherid from publisher name
CREATE OR REPLACE FUNCTION GetPublisherID(publisher_name VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    publisher_id VARCHAR(10);
BEGIN
    SELECT publisherid INTO publisher_id
    FROM publishers
    WHERE LOWER(TRIM(publishername)) = LOWER(TRIM(publisher_name));
    
    IF publisher_id IS NULL THEN
        publisher_id := 'PUB011';
    END IF;
    
    RETURN publisher_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get default categoryid
CREATE OR REPLACE FUNCTION GetDefaultCategoryID(
    title VARCHAR,
    author VARCHAR,
    description TEXT
)
RETURNS VARCHAR AS $$
DECLARE
    category_id VARCHAR(10) := 'CAT002';
    text_to_check TEXT;
BEGIN
    text_to_check := LOWER(COALESCE(title, '') || ' ' || COALESCE(author, '') || ' ' || COALESCE(description, ''));
    
    -- Foreign authors
    IF text_to_check LIKE '%colleen hoover%' OR text_to_check LIKE '%haruki murakami%' OR 
       text_to_check LIKE '%guillaume musso%' OR text_to_check LIKE '%ray bradbury%' THEN
        category_id := 'CAT002';
    
    -- Vietnamese authors
    ELSIF text_to_check LIKE '%nguyễn nhật ánh%' OR text_to_check LIKE '%huỳnh mai liên%' THEN
        category_id := 'CAT003';
    
    -- Self-development
    ELSIF text_to_check LIKE '%phát triển%' OR text_to_check LIKE '%kỹ năng%' OR 
          text_to_check LIKE '%thành công%' OR text_to_check LIKE '%leadership%' THEN
        category_id := 'CAT001';
    
    -- Detective - Horror
    ELSIF text_to_check LIKE '%trinh thám%' OR text_to_check LIKE '%kinh dị%' OR 
          text_to_check LIKE '%bí ẩn%' OR text_to_check LIKE '%detective%' THEN
        category_id := 'CAT004';
    
    -- Science Fiction
    ELSIF text_to_check LIKE '%khoa học viễn tưởng%' OR text_to_check LIKE '%sci-fi%' OR 
          text_to_check LIKE '%tương lai%' THEN
        category_id := 'CAT005';
    
    -- Psychology
    ELSIF text_to_check LIKE '%tâm lý%' OR text_to_check LIKE '%psychology%' OR 
          text_to_check LIKE '%cảm xúc%' THEN
        category_id := 'CAT006';
    
    -- Economics - Business
    ELSIF text_to_check LIKE '%kinh tế%' OR text_to_check LIKE '%kinh doanh%' OR 
          text_to_check LIKE '%business%' OR text_to_check LIKE '%marketing%' THEN
        category_id := 'CAT007';
    
    -- History
    ELSIF text_to_check LIKE '%lịch sử%' OR text_to_check LIKE '%history%' OR 
          text_to_check LIKE '%historical%' THEN
        category_id := 'CAT008';
    
    -- Children
    ELSIF text_to_check LIKE '%thiếu nhi%' OR text_to_check LIKE '%trẻ em%' OR 
          text_to_check LIKE '%children%' THEN
        category_id := 'CAT009';
    
    -- Romance
    ELSIF text_to_check LIKE '%tình yêu%' OR text_to_check LIKE '%romance%' OR 
          text_to_check LIKE '%love story%' THEN
        category_id := 'CAT010';
    END IF;
    
    RETURN category_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Function: Get or Create authorid
-- =============================================
CREATE OR REPLACE FUNCTION GetOrCreateAuthorID(author_name VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    author_id VARCHAR(15);
    clean_author_name VARCHAR(255);
    timestamp_val VARCHAR(6);
    random_val VARCHAR(3);
BEGIN
    clean_author_name := TRIM(author_name);
    
    -- Check if author exists
    SELECT authorid INTO author_id
    FROM author
    WHERE name = clean_author_name;
    
    -- Create new author if not exists
    IF author_id IS NULL THEN
        timestamp_val := LPAD(CAST(EXTRACT(EPOCH FROM NOW())::BIGINT % 1000000 AS VARCHAR), 6, '0');
        random_val := LPAD(CAST(FLOOR(RANDOM() * 1000)::INTEGER AS VARCHAR), 3, '0');
        author_id := 'AUT' || timestamp_val || random_val;
        
        -- Ensure unique authorid
        WHILE EXISTS (SELECT 1 FROM author WHERE authorid = author_id) LOOP
            random_val := LPAD(CAST(FLOOR(RANDOM() * 1000)::INTEGER AS VARCHAR), 3, '0');
            author_id := 'AUT' || timestamp_val || random_val;
        END LOOP;
        
        INSERT INTO author (authorid, name)
        VALUES (author_id, clean_author_name);
    END IF;
    
    RETURN author_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Trigger Functions for author Mapping
-- =============================================

-- Trigger function for INSERT on Books
CREATE OR REPLACE FUNCTION trigger_books_auto_map_author_insert()
RETURNS TRIGGER AS $$
DECLARE
    author_list TEXT[];
    single_author TEXT;
    author_id VARCHAR(10);
BEGIN
    IF NEW.author IS NOT NULL AND TRIM(NEW.author) <> '' THEN
        -- Split authors by comma
        author_list := string_to_array(NEW.author, ',');
        
        -- If no comma, try splitting by &
        IF array_length(author_list, 1) = 1 THEN
            author_list := string_to_array(NEW.author, '&');
        END IF;
        
        -- Process each author
        FOREACH single_author IN ARRAY author_list LOOP
            single_author := TRIM(single_author);
            IF single_author <> '' THEN
                -- Get or create authorid
                author_id := GetOrCreateAuthorID(single_author);
                
                -- INSERT INTO bookauthor if not exists
                INSERT INTO bookauthor (bookid, authorid)
                VALUES (NEW.bookid, author_id)
                ON CONFLICT (bookid, authorid) DO NOTHING;
            END IF;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for UPDATE on Books
CREATE OR REPLACE FUNCTION trigger_books_auto_map_author_update()
RETURNS TRIGGER AS $$
DECLARE
    author_list TEXT[];
    single_author TEXT;
    author_id VARCHAR(15);
BEGIN
    -- Only process if author column is changed
    IF NEW.author IS DISTINCT FROM OLD.author THEN
        -- Delete old mappings
        DELETE FROM bookauthor WHERE bookid = NEW.bookid;
        
        IF NEW.author IS NOT NULL AND TRIM(NEW.author) <> '' THEN
            -- Split authors by comma
            author_list := string_to_array(NEW.author, ',');
            
            -- If no comma, try splitting by &
            IF array_length(author_list, 1) = 1 THEN
                author_list := string_to_array(NEW.author, '&');
            END IF;
            
            -- Process each author
            FOREACH single_author IN ARRAY author_list LOOP
                single_author := TRIM(single_author);
                IF single_author <> '' THEN
                    author_id := GetOrCreateAuthorID(single_author);
                    
                    INSERT INTO bookauthor (bookid, authorid)
                    VALUES (NEW.bookid, author_id)
                    ON CONFLICT (bookid, authorid) DO NOTHING;
                END IF;
            END LOOP;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS tr_books_auto_map_author_insert ON Books;
CREATE TRIGGER tr_books_auto_map_author_insert
    AFTER INSERT ON Books
    FOR EACH ROW
    EXECUTE FUNCTION trigger_books_auto_map_author_insert();

DROP TRIGGER IF EXISTS tr_books_auto_map_author_update ON Books;
CREATE TRIGGER tr_books_auto_map_author_update
    AFTER UPDATE ON Books
    FOR EACH ROW
    EXECUTE FUNCTION trigger_books_auto_map_author_update();

-- =============================================
-- Triggers for updatedat columns
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedat = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updatedat trigger to relevant tables
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON Accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON Books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON Users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON Orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON Cart
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cartdetail_updated_at BEFORE UPDATE ON CartDetail
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_updated_at BEFORE UPDATE ON Payment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shippinginfo_updated_at BEFORE UPDATE ON ShippingInfo
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION update_reviews_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedat = CURRENT_TIMESTAMP;
    NEW.isedited  = TRUE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON Reviews
    FOR EACH ROW EXECUTE FUNCTION update_reviews_updated_at_column();

-- =============================================
-- Create Indexes for Performance
-- =============================================
-- Drop old indexes cleanly
DROP INDEX IF EXISTS idx_books_author;

-- Books
CREATE INDEX idx_books_category   ON Books(categoryid);
CREATE INDEX idx_books_publisher  ON Books(publisherid);
CREATE INDEX idx_books_author     ON Books(author);
CREATE INDEX idx_books_isactive   ON Books(isactive);
CREATE INDEX idx_books_price      ON Books(price);
CREATE INDEX idx_books_sku        ON Books(sku);

-- Orders
CREATE INDEX idx_orders_account   ON Orders(accountid);
CREATE INDEX idx_orders_status    ON Orders(status);
CREATE INDEX idx_orders_date      ON Orders(orderdate DESC);

-- OrderDetails
CREATE INDEX idx_orderdetails_order ON OrderDetails(orderid);
CREATE INDEX idx_orderdetails_book  ON OrderDetails(bookid);

-- Reviews
CREATE INDEX idx_reviews_book     ON Reviews(bookid);
CREATE INDEX idx_reviews_account  ON Reviews(accountid);
CREATE INDEX idx_reviews_rating   ON Reviews(rating);

-- Cart
CREATE INDEX idx_cart_account     ON Cart(accountid);
CREATE INDEX idx_cartdetail_cart  ON CartDetail(cartid);
CREATE INDEX idx_cartdetail_book  ON CartDetail(bookid);

-- Payment
CREATE INDEX idx_payment_order    ON Payment(orderid);
CREATE INDEX idx_payment_status   ON Payment(paymentstatus);

-- Coupons
CREATE INDEX idx_coupons_code     ON Coupons(code);
CREATE INDEX idx_coupons_active   ON Coupons(isactive);

-- ShippingInfo
CREATE INDEX idx_shipping_order   ON ShippingInfo(orderid);
CREATE INDEX idx_shipping_status  ON ShippingInfo(status);

-- BookAuthor
CREATE INDEX idx_bookauthor_book   ON BookAuthor(bookid);
CREATE INDEX idx_bookauthor_author ON BookAuthor(authorid);

-- Accounts
CREATE INDEX idx_accounts_identifier ON Accounts(identifier);
CREATE INDEX idx_accounts_role       ON Accounts(role);

-- =============================================
-- End of Script
-- =============================================
