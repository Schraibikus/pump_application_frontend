import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Order } from "@/types";
import {
  createOrdersApi,
  deleteOrdersApi,
  fetchOrdersApi,
  fetchSingleOrderApi,
} from "@/store/modules/orders/apis";

// Асинхронный чанк для получения списка заказов
export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchOrders", async (_, { getState, rejectWithValue }) => {
  const state = getState() as { orders: { isLoaded: boolean } };

  // Если данные уже загружены, не выполняем запрос
  if (state.orders.isLoaded) {
    return rejectWithValue("Данные уже загружены");
  }

  try {
    return await fetchOrdersApi();
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || "Ошибка сервера");
    }
    return rejectWithValue("Неизвестная ошибка.");
  }
});

// Асинхронный чанк для получения одного заказа
export const fetchSingleOrder = createAsyncThunk<
  Order,
  number,
  { rejectValue: string }
>("orders/fetchSingleOrder", async (orderId, { getState, rejectWithValue }) => {
  const state = getState() as {
    orders: { cachedOrders: Record<number, Order> };
  };

  // Если заказ уже загружен и есть в кэше, возвращаем его
  if (state.orders.cachedOrders[orderId]) {
    return state.orders.cachedOrders[orderId];
  }

  try {
    const data = await fetchSingleOrderApi(orderId);
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message);
    }
    return rejectWithValue("Неизвестная ошибка.");
  }
});

// Асинхронный чанк для создания заказа
export const createOrder = createAsyncThunk<
  Order,
  Order,
  { rejectValue: string }
>("orders/createOrder", async (order, { rejectWithValue }) => {
  try {
    const data = await createOrdersApi(order);
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message);
    }
    return rejectWithValue("Неизвестная ошибка.");
  }
});

// Асинхронный чанк для удаления заказа
export const deleteOrder = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("orders/deleteOrder", async (orderId, { rejectWithValue }) => {
  try {
    const isDeleted = await deleteOrdersApi(orderId);
    if (!isDeleted) {
      return rejectWithValue("Не удалось удалить заказ");
    }
    return orderId; // Возвращаем ID удалённого заказа
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message);
    }
    return rejectWithValue("Неизвестная ошибка");
  }
});
