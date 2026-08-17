import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

//interface CartItem
export interface CartItem{
    bookid: string;
    quantity: number;
    price: number;
    title: string;
}

interface CartState{
    items: CartItem[];
    isLoading: boolean;
    error: string | null;
}

//initialState - 
const initialState: CartState = {
    items: [],
    isLoading: false,
    error: null,
}

//createSlice
/**
 * createSlice - Toolkit - redux
 * @param name - tên của slice
 * @param initialState - trạng thái ban đầu
 * @param reducers - các action
 */
const CartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        //Thêm vào giỏ hàng
        /**
         * addToCart - Thêm vào giỏ hàng
         * @param state - Trạng thái hiện tại
         * @param action - Payload chứa thông tin sản phẩm cần thêm
         */
        addToCart: (state: CartState, action: PayloadAction<CartItem>) => {
            const {bookid, quantity, price, title} = action.payload;
            const existingItem = state.items.find(item => item.bookid === bookid);
            if(existingItem) {
                existingItem.quantity += quantity;
            }
            else{
                state.items.push({bookid, quantity, price, title});
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            const bookid = action.payload;
            state.items = state.items.filter(item => item.bookid !== bookid);
        },
        updateQuantity: (state, action: PayloadAction<{bookid: string, quantity: number}>) => {
            const {bookid, quantity} = action.payload;
            const existingItem = state.items.find(item => item.bookid === bookid);
            if(existingItem) {
                existingItem.quantity = quantity;
            }
        },
        clearCart: (state, action: PayloadAction<void>) => {
            state.items = [];
        }
    }
    
    

})