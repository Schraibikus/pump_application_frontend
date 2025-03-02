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
  Modal,
} from "@mui/material";
import { Fragment, useState } from "react";
import { ExportDropdown } from "@/components/ExportDropdown";
import { Order } from "@/types";

// Компонент для отображения одного заказа
export const OrderItem = ({
  order,
  handleDeleteOrder,
}: {
  order: Order;
  handleDeleteOrder: (orderId: number) => void;
}) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box key={order.id} sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button variant="contained" onClick={handleOpenModal}>
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

      {/* Модальное окно для отображения деталей заказа */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 0,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography>Заказ № {order.id}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ExportDropdown order={order} />
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteOrder(order.id)}
              >
                Удалить заказ
              </Button>
            </Box>
          </Box>
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
                      <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                        <TableCell colSpan={3} sx={{ fontWeight: "bold" }}>
                          {productName}:
                        </TableCell>
                      </TableRow>
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
      </Modal>
    </Box>
  );
};
