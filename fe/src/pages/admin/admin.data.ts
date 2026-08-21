export type OrderStatus = "pending" | "processing" | "shipping" | "delivered" | "cancelled";

export interface AdminMetric {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive";
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  amount: number;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: "cod" | "banking" | "card";
}

export interface ManagedBook {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
}

export interface Author {
  id: string;
  name: string;
  country: string;
  birthYear: number;
  bookCount: number;
}

export interface Publisher {
  id: string;
  name: string;
  headquarters: string;
  establishedYear: number;
  publishedTitles: number;
}

export const dashboardMetrics: AdminMetric[] = [
  { label: "Doanh thu tháng", value: "342.500.000 VND", trend: "+12.4%", trendUp: true },
  { label: "Đơn hàng mới", value: "1.284", trend: "+8.1%", trendUp: true },
  { label: "Khách hàng hoạt động", value: "4.962", trend: "+5.2%", trendUp: true },
  { label: "Tỷ lệ huỷ đơn", value: "2.3%", trend: "-0.8%", trendUp: true },
];

export const salesByMonth = [
  { month: "T1", revenue: 120 },
  { month: "T2", revenue: 138 },
  { month: "T3", revenue: 154 },
  { month: "T4", revenue: 170 },
  { month: "T5", revenue: 166 },
  { month: "T6", revenue: 189 },
];

export const topCategories = [
  { name: "Văn học", percent: 32 },
  { name: "Kinh doanh", percent: 24 },
  { name: "Thiếu nhi", percent: 19 },
  { name: "Kỹ năng sống", percent: 15 },
  { name: "Công nghệ", percent: 10 },
];

export const customerSeeds: Customer[] = [
  {
    id: "CUS-001",
    fullName: "Nguyen Thanh Huyen",
    email: "huyen.nguyen@email.com",
    phone: "0909123123",
    city: "Ha Noi",
    totalOrders: 18,
    totalSpent: 9250000,
    status: "active",
  },
  {
    id: "CUS-002",
    fullName: "Tran Minh Quan",
    email: "quan.tran@email.com",
    phone: "0911111999",
    city: "Da Nang",
    totalOrders: 10,
    totalSpent: 5100000,
    status: "active",
  },
  {
    id: "CUS-003",
    fullName: "Le Ha Linh",
    email: "linh.le@email.com",
    phone: "0988123000",
    city: "Ho Chi Minh",
    totalOrders: 4,
    totalSpent: 1250000,
    status: "inactive",
  },
  {
    id: "CUS-004",
    fullName: "Pham Duc Bao",
    email: "bao.pham@email.com",
    phone: "0933123456",
    city: "Can Tho",
    totalOrders: 7,
    totalSpent: 2890000,
    status: "active",
  },
];

export const orderSeeds: Order[] = [
  {
    id: "ORD-24001",
    customerName: "Nguyen Thanh Huyen",
    customerEmail: "huyen.nguyen@email.com",
    itemCount: 4,
    amount: 1260000,
    createdAt: "2026-07-08 09:10",
    status: "pending",
    paymentMethod: "card",
  },
  {
    id: "ORD-24002",
    customerName: "Tran Minh Quan",
    customerEmail: "quan.tran@email.com",
    itemCount: 2,
    amount: 550000,
    createdAt: "2026-07-08 13:22",
    status: "processing",
    paymentMethod: "banking",
  },
  {
    id: "ORD-24003",
    customerName: "Pham Duc Bao",
    customerEmail: "bao.pham@email.com",
    itemCount: 3,
    amount: 780000,
    createdAt: "2026-07-09 10:12",
    status: "shipping",
    paymentMethod: "cod",
  },
  {
    id: "ORD-24004",
    customerName: "Le Ha Linh",
    customerEmail: "linh.le@email.com",
    itemCount: 1,
    amount: 210000,
    createdAt: "2026-07-09 14:41",
    status: "delivered",
    paymentMethod: "card",
  },
  {
    id: "ORD-24005",
    customerName: "Do Van Nam",
    customerEmail: "nam.do@email.com",
    itemCount: 2,
    amount: 430000,
    createdAt: "2026-07-10 17:05",
    status: "cancelled",
    paymentMethod: "cod",
  },
];

export const bookSeeds: ManagedBook[] = [
  {
    id: "BK-001",
    title: "Muoi Van Cau Hoi Vi Sao",
    author: "Nham Hoa",
    publisher: "Nha Nam",
    category: "Thieu nhi",
    price: 98000,
    stock: 140,
    status: "active",
  },
  {
    id: "BK-002",
    title: "Atomic Habits",
    author: "James Clear",
    publisher: "Alpha Books",
    category: "Ky nang song",
    price: 168000,
    stock: 95,
    status: "active",
  },
  {
    id: "BK-003",
    title: "Lap Trinh JavaScript Chuyen Sau",
    author: "Le Quoc Khanh",
    publisher: "Tre",
    category: "Cong nghe",
    price: 189000,
    stock: 22,
    status: "inactive",
  },
];

export const authorSeeds: Author[] = [
  { id: "AUTH-001", name: "Nham Hoa", country: "Viet Nam", birthYear: 1982, bookCount: 12 },
  { id: "AUTH-002", name: "James Clear", country: "USA", birthYear: 1986, bookCount: 5 },
  { id: "AUTH-003", name: "Le Quoc Khanh", country: "Viet Nam", birthYear: 1991, bookCount: 4 },
];

export const publisherSeeds: Publisher[] = [
  { id: "PUB-001", name: "Nha Nam", headquarters: "Ha Noi", establishedYear: 2005, publishedTitles: 2200 },
  { id: "PUB-002", name: "Alpha Books", headquarters: "Ha Noi", establishedYear: 2010, publishedTitles: 1300 },
  { id: "PUB-003", name: "Tre", headquarters: "Ho Chi Minh", establishedYear: 1981, publishedTitles: 4700 },
];

export const currencyVnd = (value: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export const buildId = (prefix: string): string =>
  `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
