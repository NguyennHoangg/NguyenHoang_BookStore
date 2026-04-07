import json
import psycopg2
from psycopg2 import sql
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_db_config():
    """Đọc cấu hình database từ .env file"""
    return {
        'host': os.getenv('DB_HOST', 'localhost'),
        'database': os.getenv('DB_NAME', 'OnlineBookStore'),
        'user': os.getenv('DB_USER', 'postgres'),
        'password': os.getenv('DB_PASSWORD', 'postgres'),
        'port': os.getenv('DB_PORT', '5432')
    }

def create_connection():
    """Tạo kết nối đến PostgreSQL sử dụng cấu hình từ .env"""
    try:
        config = get_db_config()
        
        conn = psycopg2.connect(
            host=config['host'],
            port=config['port'],
            database=config['database'],
            user=config['user'],
            password=config['password']
        )
        
        print("✅ Kết nối database thành công!")
        print(f"   📊 Host: {config['host']}:{config['port']}")
        print(f"   📊 Database: {config['database']}")
        print(f"   📊 User: {config['user']}")
        return conn
    except Exception as e:
        print(f"❌ Lỗi kết nối database: {e}")
        print("💡 Kiểm tra:")
        print("   - PostgreSQL đang chạy")
        print("   - Cấu hình .env file")
        print("   - psycopg2 đã cài đặt: pip install psycopg2-binary")
        return None

def load_json_data(file_path):
    """Đọc dữ liệu từ file JSON"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        print(f"✅ Đọc file JSON thành công! Tìm thấy {len(data)} sách")
        return data
    except Exception as e:
        print(f"❌ Lỗi đọc file JSON: {e}")
        return None

def check_book_exists(cursor, book_id):
    """Kiểm tra sách đã tồn tại trong database chưa"""
    try:
        cursor.execute("SELECT BookID FROM Books WHERE BookID = %s", (str(book_id),))
        return cursor.fetchone() is not None
    except Exception as e:
        print(f"❌ Lỗi kiểm tra sách tồn tại: {e}")
        return False

def insert_book(cursor, book_data):
    """Insert một sách vào database"""
    try:
        # Chuẩn bị dữ liệu với default values cho NOT NULL columns
        book_id = str(book_data.get('id', ''))
        title = book_data.get('name', '') or 'Chưa có tiêu đề'
        author = book_data.get('author', '') or 'Unknown'
        publisher_name = book_data.get('publisher', 'Đang cập nhật')
        price = float(book_data.get('price', 0)) if book_data.get('price') else 0.0
        stock = 100 if book_data.get('available', False) else 0
        image_url = book_data.get('image', '') or 'default.jpg'
        description = book_data.get('summary', '') or 'Đang cập nhật'
        url = book_data.get('url', '') or f'/book/{book_id}'
        pages = int(book_data.get('pages', 0)) if book_data.get('pages') else 100
        barcode = book_data.get('barcode', '') or f'BARCODE{book_id}'
        sku = book_data.get('sku', '') or f'SKU{book_id}'
        release_year = book_data.get('release_year', None)
        compare_at_price = float(book_data.get('compare_at_price', 0)) if book_data.get('compare_at_price') else None
        weight = book_data.get('weight', '') or '0.5 kg'
        is_active = True if book_data.get('available', False) else False
        created_at = datetime.now()
        updated_at = datetime.now()
        
        # Debug: In thông tin sách đang được insert
        print(f"🔍 Đang insert: {title} (ID: {book_id})")
        
        # SQL INSERT statement sử dụng functions để ánh xạ
        insert_query = """
            INSERT INTO Books (
                BookID, Title, Author, 
                PublisherID, CategoryID, 
                Price, Stock, ImageURL, Description, 
                CreatedAt, UpdatedAt, isActive, Url, 
                Pages, Barcode, Sku, ReleaseYear, CompareAtPrice, Weight
            ) VALUES (
                %s, %s, %s, 
                GetPublisherID(%s), GetDefaultCategoryID(%s, %s, %s),
                %s, %s, %s, %s, 
                %s, %s, %s, %s, 
                %s, %s, %s, %s, %s, %s
            )
        """
        
        # Thực hiện insert
        cursor.execute(insert_query, (
            book_id, title, author,
            publisher_name, title, author, description,  # Cho functions ánh xạ
            price, stock, image_url, description,
            created_at, updated_at, is_active, url,
            pages, barcode, sku, release_year, compare_at_price, weight
        ))
        
        return True
    except Exception as e:
        print(f"❌ Lỗi insert sách '{book_data.get('name', 'Unknown')}': {e}")
        print(f"💡 Chi tiết lỗi: {str(e)}")
        return False

def import_books_to_database(json_file_path):
    """Import tất cả sách từ JSON vào database với tắt triggers"""
    # Đọc dữ liệu JSON
    books_data = load_json_data(json_file_path)
    if not books_data:
        return
    
    # Kết nối database
    conn = create_connection()
    if not conn:
        return
    
    cursor = conn.cursor()
    
    # ⭐ TẮT TRIGGERS KHI IMPORT
    try:
        print("🔧 Tắt triggers để tăng tốc import...")
        cursor.execute("ALTER TABLE Books DISABLE TRIGGER tr_books_auto_map_author_insert")
        cursor.execute("ALTER TABLE Books DISABLE TRIGGER tr_books_auto_map_author_update")
        conn.commit()
        print("✅ Đã tắt triggers")
    except Exception as e:
        print(f"⚠️  Không thể tắt triggers: {e}")
    
    # Thống kê
    total_books = len(books_data)
    imported_count = 0
    skipped_count = 0
    error_count = 0
    
    print(f"\n🚀 Bắt đầu import {total_books} sách...")
    
    BATCH_SIZE = 50  # Tăng batch size vì đã tắt triggers
    
    try:
        for i, book in enumerate(books_data, 1):
            try:
                book_id = book.get('id')
                book_name = book.get('name', 'Unknown')
                
                # Hiển thị tiến trình
                if i % 25 == 0 or i == total_books:  # Hiển thị mỗi 25 sách
                    print(f"📊 Tiến trình: {i}/{total_books} ({(i/total_books)*100:.1f}%)")
                
                # Kiểm tra sách đã tồn tại
                if check_book_exists(cursor, book_id):
                    print(f"⚠️  Sách '{book_name}' (ID: {book_id}) đã tồn tại, bỏ qua...")
                    skipped_count += 1
                    continue
                
                # Insert sách mới
                if insert_book(cursor, book):
                    imported_count += 1
                    if i % 50 == 0:  # Chỉ log mỗi 50 sách
                        print(f"✅ Đã import: {book_name}")
                else:
                    error_count += 1
                    print(f"❌ Lỗi import: {book_name}")
                
                # Commit theo batch để tránh timeout
                if i % BATCH_SIZE == 0:
                    conn.commit()
                    print(f"💾 Commit batch {i//BATCH_SIZE} (đã import {imported_count} sách)")
                    
            except Exception as e:
                print(f"❌ Lỗi xử lý sách {i}: {e}")
                error_count += 1
                continue
        
        # Commit batch cuối cùng
        conn.commit()
        print(f"💾 Commit batch cuối cùng")
        
        # Thống kê kết quả
        print(f"\n🎉 Hoàn thành import!")
        print(f"   ✅ Thành công: {imported_count} sách")
        print(f"   ⚠️  Đã tồn tại: {skipped_count} sách")
        print(f"   ❌ Lỗi: {error_count} sách")
        print(f"   📊 Tổng cộng: {total_books} sách")
        
    except Exception as e:
        print(f"❌ Lỗi trong quá trình import: {e}")
        conn.rollback()
    
    finally:
        # ⭐ BẬT LẠI TRIGGERS
        try:
            print("🔧 Bật lại triggers...")
            cursor.execute("ALTER TABLE Books ENABLE TRIGGER tr_books_auto_map_author_insert")
            cursor.execute("ALTER TABLE Books ENABLE TRIGGER tr_books_auto_map_author_update")
            conn.commit()
            print("✅ Đã bật lại triggers")
        except Exception as e:
            print(f"⚠️ Không thể bật lại triggers: {e}")
        
        # ⭐ CHẠY ÁÁÁNH XẠ AUTHOR CHO TẤT CẢ SÁCH MỚI
        if imported_count > 0:
            try:
                print(f"\n🔄 Bắt đầu ánh xạ Author cho {imported_count} sách mới...")
                
                # Lấy danh sách sách chưa có author mapping
                cursor.execute("""
                    SELECT BookID, Author 
                    FROM Books 
                    WHERE BookID NOT IN (SELECT DISTINCT BookID FROM BookAuthor WHERE BookID IS NOT NULL)
                    AND Author IS NOT NULL 
                    AND TRIM(Author) <> ''
                """)
                
                books_need_mapping = cursor.fetchall()
                print(f"📊 Tìm thấy {len(books_need_mapping)} sách cần ánh xạ Author")
                
                author_count = 0
                for i, (book_id, author_name) in enumerate(books_need_mapping, 1):
                    try:
                        # Tách multiple authors (nếu có dấu phấy hoặc &)
                        author_names = []
                        if ',' in author_name:
                            author_names = [name.strip() for name in author_name.split(',')]
                        elif '&' in author_name:
                            author_names = [name.strip() for name in author_name.split('&')]
                        else:
                            author_names = [author_name.strip()]
                        
                        for single_author in author_names:
                            if not single_author:
                                continue
                                
                            # Kiểm tra Author đã tồn tại chưa
                            cursor.execute("SELECT AuthorID FROM Author WHERE Name = %s", (single_author,))
                            existing_author = cursor.fetchone()
                            
                            if existing_author:
                                author_id = existing_author[0]
                            else:
                                # Tạo AuthorID mới
                                cursor.execute("SELECT COUNT(*) FROM Author WHERE AuthorID LIKE 'AUT%'")
                                count = cursor.fetchone()[0]
                                author_id = f"AUT{count + 1:03d}"
                                
                                # Insert Author mới
                                cursor.execute("INSERT INTO Author (AuthorID, Name) VALUES (%s, %s)", 
                                             (author_id, single_author))
                            
                            # Kiểm tra BookAuthor mapping đã tồn tại chưa
                            cursor.execute("SELECT 1 FROM BookAuthor WHERE BookID = %s AND AuthorID = %s", 
                                         (book_id, author_id))
                            if not cursor.fetchone():
                                # Insert BookAuthor mapping
                                cursor.execute("INSERT INTO BookAuthor (BookID, AuthorID, AuthorName) VALUES (%s, %s, %s)", 
                                             (book_id, author_id, single_author))
                                author_count += 1
                        
                        if i % 100 == 0:
                            print(f"📊 Đã xử lý {i}/{len(books_need_mapping)} sách...")
                            conn.commit()
                    
                    except Exception as e:
                        print(f"❌ Lỗi ánh xạ author cho sách {book_id}: {e}")
                        continue
                
                conn.commit()
                print(f"✅ Hoàn thành ánh xạ Author! Đã tạo {author_count} mappings")
                
            except Exception as e:
                print(f"❌ Lỗi trong quá trình ánh xạ Author: {e}")
        
        cursor.close()
        conn.close()
        print("🔒 Đã đóng kết nối database")

def main():
    """Hàm chính"""
    print("📚 IMPORT SÁCH TỪ JSON VÀO POSTGRESQL")
    print("=" * 50)
    
    # Hiển thị cấu hình từ .env
    config = get_db_config()
    print(f"🔧 Cấu hình Database:")
    print(f"   📊 Host: {config['host']}:{config['port']}")
    print(f"   📊 Database: {config['database']}")
    print(f"   📊 User: {config['user']}")
    
    # Đường dẫn file JSON
    json_file = os.path.join(os.path.dirname(__file__), 'nhanam_books_final.json')
    
    # Kiểm tra file tồn tại
    if not os.path.exists(json_file):
        print(f"❌ Không tìm thấy file JSON: {json_file}")
        return
    
    print(f"📁 File JSON: {json_file}")
    
    # Xác nhận trước khi import
    confirm = input("\n⚠️  Bạn có muốn tiếp tục import? (y/N): ").lower().strip()
    if confirm not in ['y', 'yes']:
        print("🚫 Đã hủy import")
        return
    
    # Bắt đầu import
    import_books_to_database(json_file)

if __name__ == "__main__":
    main()
