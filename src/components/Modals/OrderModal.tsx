import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { PartItem } from "@/types";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  parts: PartItem[];
  onSubmit: () => void;
  onRemove: (id: number) => void;
}

const OrderModal = ({
  open,
  onClose,
  parts,
  onSubmit,
  onRemove,
}: OrderModalProps) => {
  const hasParts = parts && parts.length > 0;

  // console.log(parts);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography>Ваш заказ</Typography>
        <List>
          {parts.map((part) => (
            <ListItem key={part.id}>
              <ListItemText
                primary={
                  <>
                    {`Изделие: ${part.productName}`} <br />
                    {`Наименование: ${part.name} ${part.designation ? part.designation : ""}`}
                  </>
                }
                secondary={`Количество: ${part.quantity}`}
              />
              <IconButton onClick={() => onRemove(part.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          disabled={!hasParts}
        >
          Отправить заказ
        </Button>
      </Box>
    </Modal>
  );
};

export default OrderModal;
