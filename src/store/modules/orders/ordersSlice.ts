import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, PartItem } from "@/types";
import { createOrder, fetchOrders, fetchSingleOrder } from "@/store/modules/orders/thunk";

interface OrdersState {
  orders: Order[] | []; 
  singleOrder: Order | null;
  parts: PartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  parts: [],
  singleOrder: null,
  loading: false,
  error: null,
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
    //создание заказа
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders = [...state.orders, action.payload];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Ошибка создания заказа";
      });

    //получение списка заказов
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
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Ошибка загрузки данных заказов";
      });

    //получение одного заказа
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
        }
      )
      .addCase(fetchSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Ошибка загрузки данных заказа";
      });
  },
});

export const { addPartToOrder, removePartFromOrder, clearOrder } =
  ordersSlice.actions;
export default ordersSlice.reducer;
