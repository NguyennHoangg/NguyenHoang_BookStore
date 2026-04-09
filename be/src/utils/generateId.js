const generateErrorId = () =>{
    // Tạo ID lỗi duy nhất
    const timestamp = Date.now().toString(36); // Chuyển timestamp sang hệ 36 để ngắn hơn
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomString}`;
}

module.exports = {
    generateErrorId
};