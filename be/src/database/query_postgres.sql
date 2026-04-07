-- PostgreSQL Database Script for OnlineBookStore
-- Converted from SQL Server

-- =============================================
-- IMPORTANT: Run this command separately first:
-- CREATE DATABASE OnlineBookStore;
-- Then connect to the database and run the rest of this script
-- =============================================

-- Drop tables if they exist (for idempotent execution)
DROP TABLE IF EXISTS CartDetail CASCADE;
DROP TABLE IF EXISTS Cart CASCADE;
DROP TABLE IF EXISTS BookAuthor CASCADE;
DROP TABLE IF EXISTS Author CASCADE;
DROP TABLE IF EXISTS ShippingInfo CASCADE;
DROP TABLE IF EXISTS OrderCoupons CASCADE;
DROP TABLE IF EXISTS OrderDetails CASCADE;
DROP TABLE IF EXISTS Payment CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS Reviews CASCADE;
DROP TABLE IF EXISTS BookStock CASCADE;
DROP TABLE IF EXISTS Books CASCADE;
DROP TABLE IF EXISTS Categories CASCADE;
DROP TABLE IF EXISTS Publishers CASCADE;
DROP TABLE IF EXISTS Coupons CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Accounts CASCADE;
DROP TABLE IF EXISTS Warehouses CASCADE;

-- =============================================
-- Table: Accounts
-- =============================================
CREATE TABLE Accounts (
    AccountID VARCHAR(10) PRIMARY KEY,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(10) DEFAULT 'user',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT TRUE
);

-- =============================================
-- Table: Users
-- =============================================
CREATE TABLE Users (
    UserID VARCHAR(10) PRIMARY KEY,
    AccountID VARCHAR(10) UNIQUE,
    FullName VARCHAR(100) NOT NULL,
    Phone VARCHAR(20),
    DOB DATE,
    Gender VARCHAR(10) CHECK (Gender IN ('Male', 'Female', 'Other')),
    Address VARCHAR(255),
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID)
);

-- =============================================
-- Table: Categories
-- =============================================
CREATE TABLE Categories (
    CategoryID VARCHAR(10) PRIMARY KEY,
    CategoryName VARCHAR(255) NOT NULL,
    Description VARCHAR(500)
);

-- =============================================
-- Table: Publishers
-- =============================================
CREATE TABLE Publishers (
    PublisherID VARCHAR(10) PRIMARY KEY,
    PublisherName VARCHAR(255) NOT NULL,
    Address VARCHAR(500)
);

-- =============================================
-- Table: Books
-- =============================================
CREATE TABLE Books (
    BookID VARCHAR(20) PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Author VARCHAR(255) NOT NULL,
    PublisherID VARCHAR(10),
    CategoryID VARCHAR(10),
    Price DECIMAL(10, 2) NOT NULL,
    Stock INTEGER NOT NULL,
    ImageURL VARCHAR(500),
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Url VARCHAR(255) NOT NULL,
    Pages INTEGER NOT NULL,
    Barcode VARCHAR(30) NOT NULL,
    Sku VARCHAR(30) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    ReleaseYear INTEGER,
    CompareAtPrice DECIMAL(10, 2),
    Weight VARCHAR(50),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
    FOREIGN KEY (PublisherID) REFERENCES Publishers(PublisherID)
);

-- =============================================
-- Table: Warehouses
-- =============================================
CREATE TABLE Warehouses (
    WarehouseID VARCHAR(10) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Location VARCHAR(255) NOT NULL
);

-- =============================================
-- Table: BookStock
-- =============================================
CREATE TABLE BookStock (
    BookID VARCHAR(20),
    WarehouseID VARCHAR(10),
    Quantity INTEGER NOT NULL,
    PRIMARY KEY (BookID, WarehouseID),
    FOREIGN KEY (BookID) REFERENCES Books(BookID),
    FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID)
);

-- =============================================
-- Table: Coupons
-- =============================================
CREATE TABLE Coupons (
    CouponID VARCHAR(10) PRIMARY KEY,
    Code VARCHAR(20) NOT NULL UNIQUE,
    Description VARCHAR(255),
    DiscountPercent INTEGER CHECK (DiscountPercent >= 1 AND DiscountPercent <= 100),
    StartDate TIMESTAMP NOT NULL,
    EndDate TIMESTAMP NOT NULL,
    IsActive BOOLEAN DEFAULT TRUE
);

-- =============================================
-- Table: Orders
-- =============================================
CREATE TABLE Orders (
    OrderID VARCHAR(10) PRIMARY KEY,
    AccountID VARCHAR(10),
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(50) DEFAULT 'Pending',
    Total DECIMAL(10, 2) NOT NULL,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID)
);

-- =============================================
-- Table: Payment (NEW)
-- =============================================
CREATE TABLE Payment (
    PaymentID VARCHAR(10) PRIMARY KEY,
    OrderID VARCHAR(10) UNIQUE,
    PaymentMethod VARCHAR(50) NOT NULL, -- 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'E-Wallet'
    PaymentStatus VARCHAR(20) DEFAULT 'Pending', -- 'Pending', 'Completed', 'Failed', 'Refunded'
    Amount DECIMAL(10, 2) NOT NULL,
    TransactionID VARCHAR(100),
    PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Notes TEXT,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);

-- =============================================
-- Table: OrderDetails
-- =============================================
CREATE TABLE OrderDetails (
    OrderDetailID VARCHAR(10) PRIMARY KEY,
    OrderID VARCHAR(10),
    BookID VARCHAR(20),
    Quantity INTEGER NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (BookID) REFERENCES Books(BookID)
);

-- =============================================
-- Table: OrderCoupons
-- =============================================
CREATE TABLE OrderCoupons (
    OrderCouponID VARCHAR(10) PRIMARY KEY,
    OrderID VARCHAR(10),
    CouponID VARCHAR(10),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (CouponID) REFERENCES Coupons(CouponID)
);

-- =============================================
-- Table: Reviews
-- =============================================
CREATE TABLE Reviews (
    ReviewID VARCHAR(10) PRIMARY KEY,
    AccountID VARCHAR(10),
    BookID VARCHAR(20),
    Rating INTEGER CHECK (Rating >= 1 AND Rating <= 5),
    Comment TEXT,
    ReviewDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID),
    FOREIGN KEY (BookID) REFERENCES Books(BookID)
);

-- =============================================
-- Table: ShippingInfo
-- =============================================
CREATE TABLE ShippingInfo (
    ShippingID VARCHAR(10) PRIMARY KEY,
    OrderID VARCHAR(10) UNIQUE,
    FullName VARCHAR(100) NOT NULL,
    Phone VARCHAR(20) NOT NULL,
    AddressLine VARCHAR(255) NOT NULL,
    City VARCHAR(100) NOT NULL,
    PostalCode VARCHAR(20),
    Country VARCHAR(100) DEFAULT 'Vietnam',
    ShippingDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);

-- =============================================
-- Table: Author
-- =============================================
CREATE TABLE Author (
    AuthorID VARCHAR(10) PRIMARY KEY,
    Name VARCHAR(255) NOT NULL UNIQUE,
    Bio VARCHAR(255),
    Country VARCHAR(255)
);

-- =============================================
-- Table: BookAuthor
-- =============================================
CREATE TABLE BookAuthor (
    BookID VARCHAR(20),
    AuthorID VARCHAR(10),
    AuthorName VARCHAR(255) NOT NULL,
    PRIMARY KEY (BookID, AuthorID),
    FOREIGN KEY (BookID) REFERENCES Books(BookID),
    FOREIGN KEY (AuthorID) REFERENCES Author(AuthorID)
);

-- =============================================
-- Table: Cart
-- =============================================
CREATE TABLE Cart (
    CartID VARCHAR(10) PRIMARY KEY,
    AccountID VARCHAR(10) NOT NULL UNIQUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID)
);

-- =============================================
-- Table: CartDetail
-- =============================================
CREATE TABLE CartDetail (
    CartDetailID VARCHAR(10) PRIMARY KEY,
    CartID VARCHAR(10) NOT NULL,
    BookID VARCHAR(20) NOT NULL,
    Quantity INTEGER NOT NULL CHECK (Quantity >= 1),
    UnitPrice DECIMAL(10, 2),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CartID) REFERENCES Cart(CartID),
    FOREIGN KEY (BookID) REFERENCES Books(BookID),
    UNIQUE (CartID, BookID)
);

-- =============================================
-- Insert Data: Categories
-- =============================================
INSERT INTO Categories (CategoryID, CategoryName, Description) VALUES
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
INSERT INTO Publishers (PublisherID, PublisherName, Address) VALUES
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

-- Function to get PublisherID from publisher name
CREATE OR  FUNCTION GetPublisherID(publisher_name VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    publisher_id VARCHAR(10);
BEGIN
    SELECT PublisherID INTO publisher_id
    FROM Publishers
    WHERE LOWER(TRIM(PublisherName)) = LOWER(TRIM(publisher_name));
    
    IF publisher_id IS NULL THEN
        publisher_id := 'PUB011';
    END IF;
    
    RETURN publisher_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get default CategoryID
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
-- Function: Get or Create AuthorID
-- =============================================
CREATE OR REPLACE FUNCTION GetOrCreateAuthorID(author_name VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    author_id VARCHAR(10);
    clean_author_name VARCHAR(255);
    timestamp_val VARCHAR(6);
    random_val VARCHAR(3);
BEGIN
    clean_author_name := TRIM(author_name);
    
    -- Check if author exists
    SELECT AuthorID INTO author_id
    FROM Author
    WHERE Name = clean_author_name;
    
    -- Create new author if not exists
    IF author_id IS NULL THEN
        timestamp_val := LPAD(CAST(EXTRACT(EPOCH FROM NOW())::BIGINT % 1000000 AS VARCHAR), 6, '0');
        random_val := LPAD(CAST(FLOOR(RANDOM() * 1000)::INTEGER AS VARCHAR), 3, '0');
        author_id := 'AUT' || timestamp_val || random_val;
        
        -- Ensure unique AuthorID
        WHILE EXISTS (SELECT 1 FROM Author WHERE AuthorID = author_id) LOOP
            random_val := LPAD(CAST(FLOOR(RANDOM() * 1000)::INTEGER AS VARCHAR), 3, '0');
            author_id := 'AUT' || timestamp_val || random_val;
        END LOOP;
        
        INSERT INTO Author (AuthorID, Name)
        VALUES (author_id, clean_author_name);
    END IF;
    
    RETURN author_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Trigger Functions for Author Mapping
-- =============================================

-- Trigger function for INSERT on Books
CREATE OR REPLACE FUNCTION trigger_books_auto_map_author_insert()
RETURNS TRIGGER AS $$
DECLARE
    author_list TEXT[];
    single_author TEXT;
    author_id VARCHAR(10);
BEGIN
    IF NEW.Author IS NOT NULL AND TRIM(NEW.Author) <> '' THEN
        -- Split authors by comma
        author_list := string_to_array(NEW.Author, ',');
        
        -- If no comma, try splitting by &
        IF array_length(author_list, 1) = 1 THEN
            author_list := string_to_array(NEW.Author, '&');
        END IF;
        
        -- Process each author
        FOREACH single_author IN ARRAY author_list LOOP
            single_author := TRIM(single_author);
            IF single_author <> '' THEN
                -- Get or create AuthorID
                author_id := GetOrCreateAuthorID(single_author);
                
                -- Insert into BookAuthor if not exists
                INSERT INTO BookAuthor (BookID, AuthorID, AuthorName)
                VALUES (NEW.BookID, author_id, single_author)
                ON CONFLICT (BookID, AuthorID) DO NOTHING;
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
    author_id VARCHAR(10);
BEGIN
    -- Only process if Author column is changed
    IF NEW.Author IS DISTINCT FROM OLD.Author THEN
        -- Delete old mappings
        DELETE FROM BookAuthor WHERE BookID = NEW.BookID;
        
        IF NEW.Author IS NOT NULL AND TRIM(NEW.Author) <> '' THEN
            -- Split authors by comma
            author_list := string_to_array(NEW.Author, ',');
            
            -- If no comma, try splitting by &
            IF array_length(author_list, 1) = 1 THEN
                author_list := string_to_array(NEW.Author, '&');
            END IF;
            
            -- Process each author
            FOREACH single_author IN ARRAY author_list LOOP
                single_author := TRIM(single_author);
                IF single_author <> '' THEN
                    author_id := GetOrCreateAuthorID(single_author);
                    
                    INSERT INTO BookAuthor (BookID, AuthorID, AuthorName)
                    VALUES (NEW.BookID, author_id, single_author)
                    ON CONFLICT (BookID, AuthorID) DO NOTHING;
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
-- Triggers for UpdatedAt columns
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.UpdatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply UpdatedAt trigger to relevant tables
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

-- =============================================
-- Create Indexes for Performance
-- =============================================

CREATE INDEX idx_books_category ON Books(CategoryID);
CREATE INDEX idx_books_publisher ON Books(PublisherID);
CREATE INDEX idx_books_author ON Books(Author);
CREATE INDEX idx_books_isactive ON Books(isActive);
CREATE INDEX idx_orders_account ON Orders(AccountID);
CREATE INDEX idx_orders_status ON Orders(Status);
CREATE INDEX idx_orderdetails_order ON OrderDetails(OrderID);
CREATE INDEX idx_orderdetails_book ON OrderDetails(BookID);
CREATE INDEX idx_reviews_book ON Reviews(BookID);
CREATE INDEX idx_reviews_account ON Reviews(AccountID);
CREATE INDEX idx_cart_account ON Cart(AccountID);
CREATE INDEX idx_cartdetail_cart ON CartDetail(CartID);
CREATE INDEX idx_payment_order ON Payment(OrderID);
CREATE INDEX idx_payment_status ON Payment(PaymentStatus);

-- =============================================
-- End of Script
-- =============================================
