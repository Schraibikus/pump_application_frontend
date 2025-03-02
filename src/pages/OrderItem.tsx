import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Fragment } from "react";
import { ExportDropdown } from "@/components/ExportDropdown";
import { Order } from "@/types";

// Компонент для отображения одного заказа
export const OrderItem = ({
  order,
  openOrderId,
  setOpenOrderId,
  handleDeleteOrder,
}: {
  order: Order;
  openOrderId: number | null;
  setOpenOrderId: (orderId: number | null) => void;
  handleDeleteOrder: (orderId: number) => void;
}) => {
  const isOpen = openOrderId === order.id;

  return (
    <Box key={order.id} sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          variant="contained"
          onClick={() => setOpenOrderId(isOpen ? null : order.id)}
        >
          Заказ № {order.id} создан {new Date(order.createdAt).toLocaleString()}
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

      {isOpen && (
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
                    <TableCell sx={{ fontWeight: "bold" }}>Кол-во</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(
                    order.parts.reduce(
                      (acc, part) => {
                        if (!acc[part.productName]) acc[part.productName] = [];
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
                        <TableCell colSpan={3} sx={{ fontWeight: "bold" }}>
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
                              : part.designation || part.description || "—"}
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
  );
};
