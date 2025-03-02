import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, PartItem } from "@/types";
import {
  createOrder,
  deleteOrder,
  fetchOrders,
  fetchSingleOrder,
} from "@/store/modules/orders/thunk";

interface OrdersState {
  orders: Order[] | [];
  singleOrder: Order | null;
  parts: PartItem[];
  loading: boolean;
  error: string | null;
  isLoaded: boolean; // Флаг, указывающий, были ли данные загружены
  cachedOrders: Record<number, Order>; // Кэшированные данные по orderId
}

const initialState: OrdersState = {
  orders: [],
  parts: [],
  singleOrder: null,
  loading: false,
  error: null,
  isLoaded: false, // Изначально данные не загружены
  cachedOrders: {}, // Кэш для заказов по orderId
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addPartToOrder: (state, action: PayloadAction<PartItem>) => {
      state.parts.push(action.payload);
    },
    removePartFromOrder: (state, action: PayloadAction<number>) => {
      state.parts = state.parts.filter((part) => part.id !== action.payload);
    },
    clearOrder: (state) => {
      state.parts = [];
    },
  },
  extraReducers: (builder) => {
    // Создание заказа
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders = [...state.orders, action.payload];
        state.cachedOrders[action.payload.id] = action.payload; // Кэшируем новый заказ
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Ошибка создания заказа";
      });

    // Получение списка заказов
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
          state.isLoaded = true; // Устанавливаем флаг, что данные загружены

          // Кэшируем заказы
          action.payload.forEach((order) => {
            state.cachedOrders[order.id] = order;
          });
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Ошибка загрузки данных заказов";
      });

    // Получение одного заказа
    builder
      .addCase(fetchSingleOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSingleOrder.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.singleOrder = action.payload;
          state.cachedOrders[action.payload.id] = action.payload; // Кэшируем заказ
        }
      )
      .addCase(fetchSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Ошибка загрузки данных заказа";
      });

    // Удаление заказа
    builder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteOrder.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          // Удаляем заказ из списка и кэша
          state.orders = state.orders.filter(
            (order) => order.id !== action.payload
          );
          delete state.cachedOrders[action.payload];
        }
      )
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Ошибка удаления заказа";
      });
  },
});

export const { addPartToOrder, removePartFromOrder, clearOrder } =
  ordersSlice.actions;
export default ordersSlice.reducer;
