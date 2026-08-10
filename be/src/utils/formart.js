module.exports = {
  formatPrice: (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    },
    formatDate: (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('vi-VN', options);
    },

    formatDateTime: (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleDateString('vi-VN', options);
    }
};

