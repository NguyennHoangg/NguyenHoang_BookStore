const generateErrorId = () =>{
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomString}`;
}

const generateUserId = () => {
    const ts = Date.now().toString(36).slice(-4);       // 4 ký tự cuối timestamp base36
    const rand = Math.random().toString(36).substring(2, 8); // 6 ký tự random
    return ts + rand; // đúng 10 ký tự
}

const generateAccountId = () => {
    const ts = Date.now().toString(36).slice(-4);
    const rand = Math.random().toString(36).substring(2, 8);
    return ts + rand; // đúng 10 ký tự
}

const generateBookId = () =>{
    const timestamp = Date.now().toString(36).slice(-4); // 4 ký tự cuối timestamp base36
    const randomString = Math.random().toString(36).substring(2, 8);
    return timestamp + randomString; // 10 ký tự
}


module.exports = {
    generateErrorId,
    generateUserId,
    generateAccountId,
    generateBookId
};
