import { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { PartItem } from "@/store/modules/products/types";

interface PartDetailsModalProps {
  open: boolean;
  onClose: () => void;
  part: PartItem | null;
  onAddToOrder: (quantity: number) => void;
}

const PartDetailsModal = ({
  open,
  onClose,
  part,
  onAddToOrder,
}: PartDetailsModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);

  if (!part) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">{part.name}</Typography>
        {part.designation && (
          <Typography>Обозначение: {part.designation}</Typography>
        )}
        {part.description && (
          <Typography>Описание: {part.description}</Typography>
        )}
        <TextField
          label="Количество"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          onClick={() => onAddToOrder(quantity)}
          sx={{ mt: 2, mr: 2 }}
        >
          Добавить в заказ
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
          sx={{ mt: 2 }}
        >
          Закрыть
        </Button>
      </Box>
    </Modal>
  );
};

export default PartDetailsModal;
