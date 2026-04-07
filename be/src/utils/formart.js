module.exports = {
  formatPrice: (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    },
    formatDate: (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('vi-VN', options);
    }
};

