import { createSlice } from "@reduxjs/toolkit";
import { fetchProductParts } from "@/store/modules/parts/thunk";
import { PartItem } from "@/types";

interface ProductPartsState {
  parts: PartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductPartsState = {
  parts: [],
  loading: false,
  error: null,
};

const productPartsSlice = createSlice({
  name: "productParts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductParts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductParts.fulfilled, (state, action) => {
        state.loading = false;
        state.parts = action.payload;
      })
      .addCase(fetchProductParts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productPartsSlice.reducer;
