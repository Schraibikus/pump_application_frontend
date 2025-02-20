import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductPartsApi} from "@/store/modules/products/apis"; 
import { PartItem } from "@/types";
import { AxiosError } from "axios";

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