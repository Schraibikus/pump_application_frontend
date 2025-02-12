import { api } from "@/store/axios";
import axios from "axios";
import { PartItem, Product } from "@/store/modules/products/types";

export const fetchProductsApi = async (): Promise<Product[]> => {
  try {
    const { data } = await api.get<Product[]>("/products");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Ошибка при получении списка изделий:", error.response?.data);
      throw new Error(error.response?.data?.message || "Ошибка запроса"); 
    } else {
      console.error("Неизвестная ошибка при запросе списка изделий:", error);
      throw new Error("Неизвестная ошибка");
    }
  }
};

export const fetchProductPartsApi = async (productId: number): Promise<PartItem[]> => {
  try {
    const { data } = await api.get<PartItem[]>(`/products/${productId}/parts`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Ошибка при получении деталей изделия:", error.response?.data);
    } else {
      console.error("Неизвестная ошибка при запросе деталей:", error);
    }
    throw error;
  }
};