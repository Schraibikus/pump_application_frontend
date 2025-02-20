import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import {
  fetchProductPartsApi,
  fetchProductsApi,
} from "@/store/modules/products/apis";
import { PartItem, Product } from "@/types";

// Асинхронный чанк для получения списка продуктов
export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProductsApi(); // Теперь возвращает { products: Product[] }
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Ошибка сервера");
      }
      return rejectWithValue("Неизвестная ошибка.");
    }
  }
);

export const fetchProductParts = createAsyncThunk<PartItem[], number>(
  "products/fetchProductParts",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await fetchProductPartsApi(productId);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Неизвестная ошибка.");
    }
  }
);