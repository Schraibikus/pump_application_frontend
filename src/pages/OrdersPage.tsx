import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchOrders } from "@/store/modules/orders/thunk";

export const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.orders);
  const [openOrderId, setOpenOrderId] = useState<number | null>(null); // Храним ID раскрытого заказа

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Box>Error: {error}</Box>;
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
        {orders &&
          orders.map((order) => (
            <Box key={order.id}>
              <Button
                variant="contained"
                onClick={() =>
                  setOpenOrderId(openOrderId === order.id ? null : order.id)
                } // Открывает/закрывает список деталей
              >
                {order.id}
              </Button>
              {openOrderId === order.id && (
                <Box
                key={order.id}
                  sx={{
                    p: 2,
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
                        <Typography>🔹 Позиция: {part.position}</Typography>
                        <Typography>📦 Название: {part.name}</Typography>
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
          ))}
      </Box>
    </Box>
  );
};
