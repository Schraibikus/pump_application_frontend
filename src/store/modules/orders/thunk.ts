import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { Order } from "@/store/modules/orders/types";
import {
  createOrdersApi,
  fetchOrdersApi,
  fetchSingleOrderApi,
} from "@/store/modules/orders/apis";

// Асинхронный чанк для получения списка продуктов
export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    return await fetchOrdersApi(); // Теперь возвращает { orders: Orders[] }
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || "Ошибка сервера");
    }
    return rejectWithValue("Неизвестная ошибка.");
  }
});

export const fetchSingleOrder = createAsyncThunk<Order, number>(
  "orders/fetchSingleOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await fetchSingleOrderApi(orderId);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Неизвестная ошибка.");
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (order: Order, { rejectWithValue }) => {
    try {
      const data = await createOrdersApi(order);
      return data; 
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Неизвестная ошибка.");
    }
  }
);