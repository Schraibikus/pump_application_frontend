import { api } from "@/store/axios";
import axios from "axios";
import { Order } from "@/store/modules/orders/types";

export const fetchOrdersApi = async (): Promise<Order[]> => {
  try {
    const { data } = await api.get<Order[]>("/orders");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Ошибка при получении списка заказов:",
        error.response?.data
      );
      throw new Error(error.response?.data?.message || "Ошибка запроса");
    } else {
      console.error("Неизвестная ошибка при запросе списка заказов:", error);
      throw new Error("Неизвестная ошибка");
    }
  }
};

export const fetchSingleOrderApi = async (orderId: number): Promise<Order> => {
  try {
    const { data } = await api.get<Order>(`/orders/${orderId}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Ошибка при получении заказа:", error.response?.data);
    } else {
      console.error("Неизвестная ошибка при запросе заказа:", error);
    }
    throw error;
  }
};

export const createOrdersApi = async (order: Order) => {
  try {
    const { data } = await api.post<Order>("/orders", order);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Ошибка при создании заказа:",
        error.response?.data
      );
      throw new Error(error.response?.data?.message || "Ошибка запроса");
    } else {
      console.error("Неизвестная ошибка при создании заказа:", error);
      throw new Error("Неизвестная ошибка");
    }
  }
};