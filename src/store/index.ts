import { configureStore, combineReducers } from "@reduxjs/toolkit";

import productsReducer from '@/store/modules/products/productsSlice';
import partsReducer from '@/store/modules/parts/productPartsSlice';


const rootReducer = combineReducers({
  products: productsReducer,
  productParts: partsReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
