import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/store/modules/products/types"; 
import { fetchProducts } from "@/store/modules/products/thunk";

interface ProductsState {
  products: Product[] | []; 
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload; 
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки данных";
      });
  },
});

export default productsSlice.reducer;
