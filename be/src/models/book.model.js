const { query } = require("../config/database.config");
const { generateBookId } = require("../utils/generateId");
const logger = require("../utils/logger");

/**
 * MAP_CURSOR định nghĩa các kiểu sắp xếp hợp lệ.
 * sortCol  : cột dùng để sort chính
 * dir      : ASC | DESC
 * tiebreak : cột phụ để phân biệt khi sortCol trùng nhau (luôn ASC)
 *
 * Cursor encode JSON { sv: sortValue, id: bookId } → Base64
 * WHERE dùng row comparison của PostgreSQL: (sortCol, tiebreak) > ($1, $2)
 */
const MAP_CURSOR = {
    default:    { sortCol: 'b.bookid',    dir: 'ASC'                          },
    price_asc:  { sortCol: 'b.price',     dir: 'ASC',  tiebreak: 'b.bookid'  },
    price_desc: { sortCol: 'b.price',     dir: 'DESC', tiebreak: 'b.bookid'  },
    newest:     { sortCol: 'b.createdat', dir: 'DESC', tiebreak: 'b.bookid'  },
    title_asc:  { sortCol: 'b.title',     dir: 'ASC',  tiebreak: 'b.bookid'  },
};

/**
 * Encode cursor object → Base64 string
 * @param {object} payload - { sv: sortValue, id: bookId }
 */
const encodeCursor = (payload) =>
    Buffer.from(JSON.stringify(payload)).toString('base64');

/**
 * Decode Base64 cursor → object { sv, id }
 * Trả về null nếu cursor không hợp lệ
 */
const decodeCursor = (cursor) => {
    try {
        return JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
    } catch {
        return null;
    }
};

/**
 * Cursor Pagination cho danh sách sách
 *
 * @param {object} options
 * @param {string|null} options.cursor   - cursor từ response trước (null = trang đầu)
 * @param {number}      options.limit    - số sách mỗi trang (default 12)
 * @param {string}      options.sortBy   - key trong MAP_CURSOR (default 'default')
 * @param {boolean}     options.activeOnly - chỉ lấy sách đang active
 *
 * @returns {{ books: [], nextCursor: string|null, hasNextPage: boolean }}
 */
const getBooksByCursorPagination = async ({
    cursor   = null,
    limit    = 6,
    sortBy   = 'default',
    activeOnly = true,
} = {}) => {
    const map = MAP_CURSOR[sortBy] ?? MAP_CURSOR.default;
    const { sortCol, dir, tiebreak } = map;

    // Lấy limit + 1 để phát hiện còn trang tiếp hay không
    const fetchLimit = limit + 1;

    // Tham số cho query
    const params     = [];

    // --- WHERE clause ---
    // Điều kiện lọc sách active và cursor pagination
    // Nếu activeOnly = true, thêm điều kiện b.isactive = true
    const conditions = [];
    if (activeOnly) {
        params.push(true);
        conditions.push(`b.isactive = $${params.length}`);
    }

    // Xử lý cursor nếu có
    if (cursor) {

        //Decode cursor để lấy giá trị sortCol và bookId của dòng cuối trang trước
        const decoded = decodeCursor(cursor);

        //Nếu decode thành công, thêm điều kiện WHERE để lấy sách tiếp theo
        if (decoded) {
            params.push(decoded.sv, decoded.id);

            // p1, p2 là placeholder cho sortCol và tiebreak trong SQL 
            const p1 = `$${params.length - 1}`;
            const p2 = `$${params.length}`;
        
            if (tiebreak) {
                // Row comparison: (price, bookid) > ($1, $2)  [hoặc < với DESC]
                // Nếu sortCol trùng nhau, dùng tiebreak để phân biệt (luôn ASC)
                // Ví dụ: (b.price, b.bookid) > ($1, $2)
                const op = dir === 'ASC' ? '>' : '<';
                conditions.push(`(${sortCol}, ${tiebreak}) ${op} (${p1}, ${p2})`);
            } else {
                // Không có tiebreak (default sort by bookid)
                const op = dir === 'ASC' ? '>' : '<';
                conditions.push(`${sortCol} ${op} ${p1}`);
            }
        }
    }

    // Kết hợp các điều kiện thành WHERE clause
    const whereSQL = conditions.length
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    // --- ORDER BY ---
    const orderSQL = tiebreak
        ? `ORDER BY ${sortCol} ${dir}, ${tiebreak} ASC`
        : `ORDER BY ${sortCol} ${dir}`;

    // --- LIMIT ---
    params.push(fetchLimit);
    const limitSQL = `LIMIT $${params.length}`;

    const sql = `
        SELECT
            b.bookid,    b.title,    b.author,
            b.price,     b.compareatprice,
            b.imageurl,  b.url,
            b.isactive,  b.createdat,
            c.categoryname, b.isactive, b.discount, b.rating,
            p.publishername
        FROM Books b
        LEFT JOIN Categories c ON b.categoryid = c.categoryid
        LEFT JOIN Publishers p ON b.publisherid = p.publisherid
        ${whereSQL}
        ${orderSQL}
        ${limitSQL}
    `;

    const result = await query(sql, params);
    const rows   = result.rows;

    const hasNextPage = rows.length > limit;

    // Nếu có trang tiếp, loại bỏ phần tử thứ (limit + 1) để trả về đúng số sách yêu cầu
    const books       = hasNextPage ? rows.slice(0, limit) : rows;

    // Tạo cursor từ dòng cuối cùng của trang hiện tại
    let nextCursor = null;
    if (hasNextPage) {
        const last = books[books.length - 1];
        // sv = giá trị của sortCol (price, createdat, title, hoặc bookid)
        const svMap = {
            'b.bookid':    last.bookid,
            'b.price':     last.price,
            'b.createdat': last.createdat,
            'b.title':     last.title,
        };
        nextCursor = encodeCursor({
            sv: svMap[sortCol],
            id: last.bookid,
        });
    }

    return { books, nextCursor, hasNextPage };
};

const getBookByURL = async(url) => {
    try {
        // Đảm bảo url luôn có dấu / ở đầu để khớp với giá trị lưu trong DB
        const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
        const sql = ` SELECT
            b.bookid,    b.title,    b.author,
            b.price,     b.compareatprice,
            b.imageurl,  b.url,
            b.description, b.stock,
            b.pages, b.releaseyear,
            b.isactive,  b.createdat,
            c.categoryname,
            p.publishername
        FROM Books b
        LEFT JOIN Categories c ON b.categoryid = c.categoryid
        LEFT JOIN Publishers p ON b.publisherid = p.publisherid
        WHERE b.url = $1
         `;
        const result = await query(sql, [normalizedUrl]);
        return result.rows[0] || null;
    } catch (error) {
        logger.error("Error fetching book by URL:", error);
        throw error;
    }
}

const getBookFavorites = async () => {
    try{
        const sql = ` SELECT
            b.bookid,    b.title,    b.author,
            b.price,     b.compareatprice,
            b.imageurl,  b.url,
            b.description, b.stock,
            b.pages, b.releaseyear,
            b.isactive,  b.createdat,
            b.discount, b.rating,
            c.categoryname,
            p.publishername
        FROM Books b
        LEFT JOIN Categories c ON b.categoryid = c.categoryid
        LEFT JOIN Publishers p ON b.publisherid = p.publisherid
        WHERE soldcount = (SELECT MAX(soldcount) FROM Books) 
        LIMIT 1
         `;
        const result = await query(sql);
        return result.rows || [];
    }catch(error){
        logger.error("Error fetching book favorites:", error);
        throw error;
    }
}

const getTopSellingBooks = async (limit = 4) => {
    try {
        const sql = `SELECT
            b.bookid,    b.title,    b.author,
            b.price,     b.compareatprice,
            b.imageurl,  b.url,
            b.description, b.stock,
            b.pages, b.releaseyear,
            b.isactive,  b.createdat,
            b.discount, b.rating,
            b.soldcount,
            c.categoryname,
            p.publishername
        FROM Books b
        LEFT JOIN Categories c ON b.categoryid = c.categoryid
        LEFT JOIN Publishers p ON b.publisherid = p.publisherid
        ORDER BY b.soldcount DESC, b.bookid ASC
        LIMIT $1`;

        const result = await query(sql, [limit]);
        return result.rows || [];
    } catch (error) {
        logger.error("Error fetching top selling books:", error);
        throw error;
    }
}

//helpers to check if publisher or category exists before creating a book
const checkPublisherExists = async (publisherId) => {
    const sql = 'SELECT 1 FROM Publishers WHERE publisherid = $1';
    const result = await query(sql, [publisherId]);
    return result.rowCount > 0;
}

//helpers to check if publisher or category exists before creating a book
const checkCategoryExists = async (categoryId) => {
    const sql = 'SELECT 1 FROM Categories WHERE categoryid = $1';
    const result = await query(sql, [categoryId]);
    return result.rowCount > 0;
}

//helpers to check if book exists before creating a book
const checkBookExists = async (bookId) => {
    const sql = 'SELECT 1 FROM Books WHERE bookid = $1';
    const result = await query(sql, [bookId]);
    return result.rowCount > 0;
}



const createBook = async(bookData) =>{
    try {
        await query("BEGIN");
        const bookId = bookData.bookid || generateBookId();
        const sql = `INSERT INTO Books (bookid, title, author, price, compareatprice, imageurl, url, description, stock, pages, releaseyear, isactive, createdat, categoryid, publisherid)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), $13, $14) RETURNING *`;
        const params = [
            bookData.bookid || generateBookId(),
            bookData.title,
            bookData.author,
            bookData.price,
            bookData.compareatprice,
            bookData.imageurl,
            bookData.url,
            bookData.description,
            bookData.stock,
            bookData.pages,
            bookData.releaseyear,
            bookData.isactive,
            bookData.categoryid,
            bookData.publisherid
        ];
        const result = await query(sql, params);
        return result.rows[0];
    } catch (error) {
       
        throw error;
    }
};

const getNewBooks = async() => {
    try{
        const sql = ` SELECT
            b.bookid,    b.title,    b.author,
            b.price,     b.compareatprice,
            b.imageurl,  b.url,
            b.description, b.stock,
            b.pages, b.releaseyear,
            b.isactive,  b.createdat,
            c.categoryname,
            p.publishername
        FROM Books b
        LEFT JOIN Categories c ON b.categoryid = c.categoryid
        LEFT JOIN Publishers p ON b.publisherid = p.publisherid
        WHERE b.isactive = true
        ORDER BY b.createdat DESC
        LIMIT 4
         `;
        const result = await query(sql);
        return result.rows;
    } catch (error) {
        logger.error("Error fetching new books:", error);
        throw error;
    }
};

//helpers to create a publisher
const createPublisher = async(publisherData) =>{
    try {
        // Start a transaction
        await query("BEGIN");
        const sql = `INSERT INTO Publishers (publisherid, publishername, address) VALUES ($1, $2, $3) RETURNING *`;
        const params = [
            publisherData.publisherid || generateBookId(),
            publisherData.publishername,
            publisherData.address
        ];
        const result = await query(sql, params);

        // Commit the transaction
        await query("COMMIT");
        return result.rows[0];
        
    } catch (error) {
        // Rollback the transaction in case of error
        await query("ROLLBACK");
        throw error;
    }
}

//create a category
const createCategory = async(categoryData) =>{
    try{
        await query("BEGIN");
        const sql = `INSERT INTO Categories (categoryid, categoryname) VALUES ($1, $2) RETURNING *`;
        const params = [
            categoryData.categoryid || generateBookId(),
            categoryData.categoryname
        ];
        const result = await query(sql, params);
        await query("COMMIT");
        return result.rows[0];  
    }catch(error){
        await query("ROLLBACK");
        throw error;
    }
}

const getCategories = async() => {
    try {
        const sql = `
            SELECT
                c.categoryid,
                c.categoryname,
                c.description,
                c.slug,
                COUNT(b.bookid) AS quantity
            FROM categories c
            LEFT JOIN books b ON b.categoryid = c.categoryid
            GROUP BY c.categoryid, c.categoryname, c.description, c.slug
            ORDER BY c.categoryname ASC
        `;
        const result = await query(sql);
        return result.rows;
    } catch (error) {
        logger.error("Error fetching categories:", error);
        throw error;
    }
}


module.exports = { getBooksByCursorPagination, 
    MAP_CURSOR, 
    getBookByURL, 
    getBookFavorites, 
    getTopSellingBooks, 
    getNewBooks,
    createBook,
    createPublisher,
    checkPublisherExists,
    checkCategoryExists,
    checkBookExists,
    createCategory,
    getCategories
 };
