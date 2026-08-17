export default function formatPrice(price: number | string): string {
    const num = typeof price === 'string' ? Number(price) : price;
    if (isNaN(num)) return '';
    return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

