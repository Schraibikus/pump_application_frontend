import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchOrders, deleteOrder } from "@/store/modules/orders/thunk";
import { ActiveOrdersEmpty } from "./ActiveOrdersEmpty";
import { ExportDropdown } from "@/components/ExportDropdown";

export const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.orders);
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  // console.log(orders);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10; // Количество заказов на странице
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleDeleteOrder = async (orderId: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот заказ?")) {
      try {
        await dispatch(deleteOrder(orderId)).unwrap();
        console.log("Заказ успешно удалён");
        toast.success("Заказ успешно удалён");
        if (openOrderId === orderId) {
          setOpenOrderId(null);
        }
      } catch (error) {
        console.error("Ошибка при удалении заказа:", error);
        toast.error("Ошибка при удалении заказа");
      }
    }
  };

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
        <Typography>Загрузка заказов...</Typography>
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
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Box
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        {currentOrders && currentOrders.length > 0 ? (
          currentOrders.map((order) => (
            <Box key={order.id} sx={{ width: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={() =>
                    setOpenOrderId(openOrderId === order.id ? null : order.id)
                  }
                >
                  Заказ № {order.id} создан{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </Button>
                <ExportDropdown order={order} />
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteOrder(order.id)}
                >
                  Удалить заказ
                </Button>
              </Box>

              {openOrderId === order.id && (
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    mt: 2,
                    width: "100%",
                  }}
                >
                  {order.parts.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 800 }}>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Наименование
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Обозначение
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Кол-во
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(
                            order.parts.reduce(
                              (acc, part) => {
                                if (!acc[part.productName])
                                  acc[part.productName] = [];
                                acc[part.productName].push(part);
                                return acc;
                              },
                              {} as Record<string, typeof order.parts>
                            )
                          ).map(([productName, parts]) => (
                            <Fragment key={productName}>
                              {/* Заголовок группы */}
                              <TableRow
                                key={productName}
                                sx={{
                                  backgroundColor: "#e0e0e0",
                                }}
                              >
                                <TableCell
                                  colSpan={3}
                                  sx={{ fontWeight: "bold" }}
                                >
                                  {productName}:
                                </TableCell>
                              </TableRow>
                              {/* Детали внутри группы */}
                              {parts.map((part) => (
                                <TableRow key={part.id}>
                                  <TableCell>{part.name}</TableCell>
                                  <TableCell>
                                    {part.designation && part.description
                                      ? `${part.designation} (${part.description})`
                                      : part.designation ||
                                        part.description ||
                                        "—"}
                                  </TableCell>
                                  <TableCell>{part.quantity}</TableCell>
                                </TableRow>
                              ))}
                            </Fragment>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography sx={{ p: 2 }}>Нет деталей в заказе</Typography>
                  )}
                </Box>
              )}
            </Box>
          ))
        ) : (
          <ActiveOrdersEmpty />
        )}
      </Box>
      {orders && orders.length > ordersPerPage && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "fixed", // Закрепляем пагинацию внизу
            bottom: 50, // Прижимаем к нижнему краю
            py: 2, // Отступы сверху и снизу
          }}
        >
          <Pagination
            count={Math.ceil(orders.length / ordersPerPage)}
            color="primary"
            page={currentPage}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
            sx={{ my: 2, pl: 4 }}
          />
        </Box>
      )}
    </Box>
  );
};
