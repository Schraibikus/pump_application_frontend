import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchOrders } from "@/store/modules/orders/thunk";
import { ActiveOrdersEmpty } from "./ActiveOrdersEmpty";

export const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.orders);
  console.log("orders", orders);
  const [openOrderId, setOpenOrderId] = useState<number | null>(null); // Храним ID раскрытого заказа

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 4,
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>{"Загрузка заказов..."}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 4,
          gap: 2,
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          p: 4,
          mt: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        {orders && orders.length > 0 ? (
          orders.map((order, index) => (
            <Box key={index}>
              <Button
                variant="contained"
                onClick={() =>
                  setOpenOrderId(openOrderId === order.id ? null : order.id)
                } // Открывает/закрывает список деталей
              >
                Заказ № {order.id} создан{" "}
                {new Date(order.createdAt).toLocaleString()}
              </Button>
              {openOrderId === order.id && (
                <Box
                  key={order.id}
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    mt: 1,
                  }}
                >
                  {order.parts.length > 0 ? (
                    order.parts.map((part) => (
                      <Box
                        key={part.id}
                        sx={{ p: 1, borderBottom: "1px solid #ddd" }}
                      >
                        <Typography>🔹 Изделие: {part.productName}</Typography>
                        <Typography>🔹 Название: {part.name}</Typography>
                        <Typography>📦 Позиция: {part.position}</Typography>
                        {part.designation && (
                          <Typography>
                            📝 Описание: {part.designation}
                          </Typography>
                        )}
                        {part.description && (
                          <Typography>
                            📝 Описание: {part.description}
                          </Typography>
                        )}
                        <Typography>🔢 Количество: {part.quantity}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography>Нет деталей в заказе</Typography>
                  )}
                </Box>
              )}
            </Box>
          ))
        ) : (
          <ActiveOrdersEmpty />
        )}
      </Box>
    </Box>
  );
};
