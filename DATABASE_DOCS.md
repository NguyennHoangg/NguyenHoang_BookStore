# Tài liệu Kiến trúc Cơ sở dữ liệu (Database Schema)

Tài liệu này mô tả chi tiết cấu trúc cơ sở dữ liệu PostgreSQL của hệ thống **OnlineBookStore**. Các bảng được thiết kế để quản lý tài khoản, danh mục sách, kho hàng, giỏ hàng, và quy trình xử lý đơn hàng/thanh toán.

---

## Danh sách các bảng (Tables)

### 1. Phân hệ Người dùng & Phân quyền
**`Accounts`**
Lưu trữ thông tin tài khoản đăng nhập và quyền truy cập.
- **accountid** `VARCHAR(10)` *(PK)*: Mã tài khoản duy nhất.
- **identifier** `VARCHAR(100)` *(UNIQUE, NOT NULL)*: Tên đăng nhập hoặc email.
- **passwordhash** `VARCHAR(255)` *(NOT NULL)*: Mật khẩu (đã được hash).
- **role** `VARCHAR(10)`: Vai trò tài khoản (`user`, `admin`, `curator`). *Mặc định: `user`*.
- **isactive** `BOOLEAN`: Trạng thái hoạt động. *Mặc định: `TRUE`*.
- **avatar** `VARCHAR(500)`: URL ảnh đại diện.
- **lastloginat** `TIMESTAMP`: Lần đăng nhập cuối cùng.

**`Users`**
Lưu trữ thông tin cá nhân của người dùng, liên kết 1-1 với `Accounts`.
- **userid** `VARCHAR(10)` *(PK)*: Mã người dùng.
- **accountid** `VARCHAR(10)` *(UNIQUE, FK)*: Liên kết tới `Accounts.accountid` `(ON DELETE CASCADE)`.
- **fullname** `VARCHAR(100)` *(NOT NULL)*: Họ và tên.
- **phone** `VARCHAR(20)`: Số điện thoại.
- **dob** `DATE`: Ngày tháng năm sinh.
- **gender** `VARCHAR(10)`: Giới tính (`Male`, `Female`, `Other`).
- **address** `VARCHAR(255)`: Địa chỉ thường trú.

---

### 2. Phân hệ Thông tin Sách (Catalog)
**`Books`**
Bảng trung tâm lưu trữ thông tin sản phẩm sách.
- **bookid** `VARCHAR(20)` *(PK)*: Mã sách.
- **title** `VARCHAR(255)` *(NOT NULL)*: Tiêu đề sách.
- **author** `VARCHAR(255)` *(NOT NULL)*: Tác giả dạng chuỗi (dùng cho trigger tự động điền vào bảng `BookAuthor`).
- **publisherid** `VARCHAR(10)` *(FK)*: Liên kết tới `Publishers`.
- **categoryid** `VARCHAR(10)` *(FK)*: Liên kết tới `Categories`.
- **price** `DECIMAL(10, 2)` *(NOT NULL)*: Giá bán thực tế `(>= 0)`.
- **compareatprice** `DECIMAL(10, 2)`: Giá gốc chưa giảm `(>= 0)`.
- **discount** `DECIMAL(5, 2)`: Tỉ lệ phần trăm giảm giá `(0 - 100%)`.
- **stock** `INTEGER` *(NOT NULL)*: Tồn kho dự phòng.
- **soldcount** `INTEGER`: Số lượng đã bán.
- **rating** `DECIMAL(3, 2)` *(NOT NULL)*: Đánh giá trung bình `(0 - 5)`.
- **isactive** `BOOLEAN`: Trạng thái sách khả dụng trên cửa hàng.

**`Categories`**
Danh mục sách.
- **categoryid** `VARCHAR(10)` *(PK)*
- **categoryname** `VARCHAR(255)` *(NOT NULL)*
- **slug** `VARCHAR(100)` *(UNIQUE)*: URL thân thiện.
- **description** `VARCHAR(500)`: Mô tả category.

**`Publishers`**
Nhà xuất bản.
- **publisherid** `VARCHAR(10)` *(PK)*
- **publishername** `VARCHAR(255)` *(NOT NULL)*
- **address** `VARCHAR(500)`

**`author`** & **`BookAuthor`**
Tác giả và Cầu nối N-N giữa sách và tác giả.
- **author**: Gồm `authorid` *(PK)*, `name` *(UNIQUE)*, `bio`, `country`.
- **BookAuthor**: Pivot table nối `bookid` và `authorid` `(ON DELETE CASCADE)`.

**`Reviews`**
Đánh giá sách từ người dùng.
- **reviewid** `VARCHAR(10)` *(PK)*
- **accountid** `VARCHAR(10)` *(FK)*: Người đánh giá.
- **bookid** `VARCHAR(20)` *(FK)*: Sách được đánh giá.
- **rating** `INTEGER`: Số sao `(1 - 5)`.
- **comment** `TEXT`: Bình luận text.
- **isedited** `BOOLEAN`: Đã chỉnh sửa hay chưa.
- *(UNIQUE Constraint)*: `accountid, bookid` - Một tài khoản chỉ đánh giá mỗi sách 1 lần.

---

### 3. Phân hệ Kho Hàng (Inventory)
**`Warehouses`**
Các chi nhánh theo dõi tồn kho.
- **warehouseid** `VARCHAR(10)` *(PK)*
- **name** `VARCHAR(100)`: Tên kho.
- **location** `VARCHAR(255)`: Vị trí.

**`BookStock`**
Tồn kho chuyên sâu của mỗi cuốn sách tại từng nhà kho.
- **bookid** `VARCHAR(20)` *(FK)* 
- **warehouseid** `VARCHAR(10)` *(FK)*
- **quantity** `INTEGER`: Số lượng tồn kho tại nhánh tương ứng.
- *(PK)*: Khóa chính ghép `(bookid, warehouseid)`.

---

### 4. Phân hệ Giỏ Hàng (Cart)
**`Cart`**
Giỏ hàng của tài khoản.
- **cartid** `VARCHAR(10)` *(PK)*
- **accountid** `VARCHAR(10)` *(UNIQUE, FK)*: Tài khoản sở hữu.

**`CartDetail`**
Chi tiết sản phẩm lưu trong giỏ hàng.
- **cartdetailid** `VARCHAR(10)` *(PK)*
- **cartid** `VARCHAR(10)` *(FK)*
- **bookid** `VARCHAR(20)` *(FK)*
- **quantity** `INTEGER` *(NOT NULL)* `(>= 1)`
- **unitprice** `DECIMAL(10, 2)`: Giá lúc đưa vào giỏ.

---

### 5. Phân hệ Voucher / Khuyến mãi (Coupons)
**`Coupons`**
Mã giảm giá áp dụng toàn giỏ hàng/đơn hàng.
- **couponid** `VARCHAR(10)` *(PK)*
- **code** `VARCHAR(20)` *(UNIQUE)*: Mã nhập (VD: SALE10).
- **discountpercent** `DECIMAL(5, 2)`: Số % giảm `(0 - 100)`.
- **minorderamount** `DECIMAL(10, 2)`: Đơn giá tối thiểu để sử dụng.
- **maxusage** `INTEGER`: Số lượt dùng tối đa. *(NULL = không giới hạn)*.
- **usedcount** `INTEGER`: Số lượt đã dùng.
- **startdate**, **enddate** `TIMESTAMP`: Thời gian hiệu lực.

---

### 6. Phân hệ Đơn Hàng & Thanh toán (Orders & Payments)
**`Orders`**
Thông tin đơn hàng chính.
- **orderid** `VARCHAR(10)` *(PK)*
- **accountid** `VARCHAR(10)` *(FK)*: Tài khoản đặt hàng.
- **status** `VARCHAR(20)`: Trạng thái đơn (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`, `Refunded`).
- **total** `DECIMAL(10, 2)`: Tổng tiền thanh toán.
- **shippingfee** `DECIMAL(10, 2)`: Phí giao hàng.

**`OrderDetails`**
Chi tiết loại sách được trong đơn hàng.
- **orderdetailid** `VARCHAR(10)` *(PK)*
- **orderid** `VARCHAR(10)` *(FK)*
- **bookid** `VARCHAR(20)` *(FK)*
- **quantity** `INTEGER`: Số lượng đặt.
- **unitprice** `DECIMAL(10, 2)`: Giá 1 đơn vị.
- **discount** `DECIMAL(5, 2)`: Khuyến mãi áp dụng.

**`OrderCoupons`**
Coupon được áp dụng cho Order nào. Bảng pivot giữa `Orders` và `Coupons`.

**`Payment`**
Trạng thái thanh toán của Đơn hàng (1-1).
- **paymentid** `VARCHAR(10)` *(PK)*
- **orderid** `VARCHAR(10)` *(UNIQUE, FK)*
- **paymentmethod** `VARCHAR(50)`: `Credit Card`, `Debit Card`, `Cash`, `Bank Transfer`, `E-Wallet`.
- **paymentstatus** `VARCHAR(20)`: `Pending`, `Completed`, `Failed`, `Refunded`.
- **amount** `DECIMAL(10, 2)`: Tiền thanh toán thực tế.
- **transactionid** `VARCHAR(100)`: Mã giao dịch bên thứ 3.

**`ShippingInfo`**
Thông tin chi tiết giao nhận hàng (1-1 với Orders).
- **shippingid** `VARCHAR(10)` *(PK)*
- **orderid** `VARCHAR(10)` *(UNIQUE, FK)*
- **fullname**, **phone**, **addressline**, **city**, **country**: Thông tin định tuyến.
- **status** `VARCHAR(20)`: `Preparing`, `In Transit`, `Delivered`, `Failed`, `Returned`.
- **carrier** `VARCHAR(100)`: Đơn vị vận chuyển.
- **trackingnumber** `VARCHAR(100)`: Mã thẻ vận đơn.
- **estimateddelivery**, **deliveredat**: Khung thời gian.

---
*Lưu ý: Hầu hết các bảng của hệ thống đều có 2 trường `createdat` và `updatedat` kiểm soát thời gian vòng đời của record.*