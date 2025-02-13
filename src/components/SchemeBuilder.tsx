import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PartItem } from "@/store/modules/products/types";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchProductParts } from "@/store/modules/products/thunk";
import ScrollToTopButton from "./ScrollToTopButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addPartToOrder,
  clearOrder,
  removePartFromOrder,
} from "@/store/modules/orders/ordersSlice";
import { createOrder } from "@/store/modules/orders/thunk";

export const SchemeBuilder = ({
  schemaSrc,
  productId,
  productWidth,
  productDrawing,
  productName,
}: {
  schemaSrc: string;
  productId: number;
  productWidth: number;
  productDrawing: number;
  productName: string;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PartItem | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { parts, loading, error } = useAppSelector(
    (state) => state.productParts
  );
  const {
    parts: globalOrderParts,
    loading: orderLoading,
    error: orderError,
  } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchProductParts(productId));
  }, [dispatch, productId]);

  const handleOpen = (item: PartItem) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddToOrder = () => {
    if (selectedItem) {
      const newPart = {
        ...selectedItem,
        quantity,
        parentProductId: productId,
        productName,
        productDrawing,
      };
      dispatch(addPartToOrder(newPart));
      setOpen(false);
    }
  };

  const handleSubmitOrder = async () => {
    try {
      await dispatch(
        createOrder({
          id: 0,
          createdAt: new Date().toISOString(),
          parts: globalOrderParts,
        })
      ).unwrap();
      alert("Заказ успешно отправлен!");
      dispatch(clearOrder());
      setOrderOpen(false);
    } catch (error) {
      console.error("Ошибка при отправке заказа:", error);
    }
  };

  const handleRemoveFromOrder = (id: number) => {
    dispatch(removePartFromOrder(id));
  };

  if (loading || orderLoading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || orderError) {
    return <Box>Error: {error || orderError}</Box>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{ m: 2, alignSelf: "flex-start" }}
      >
        На главную страницу
      </Button>
      <Button
        variant="contained"
        onClick={() => setOrderOpen(true)}
        sx={{ m: 2, alignSelf: "flex-start" }}
      >
        Просмотреть заказ
      </Button>
      <ScrollToTopButton />
      <Box sx={{ mt: 2 }}>
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <img src={schemaSrc} alt="Scheme" width={`${productWidth}%`} />

          {parts.map((item) => {
            const positions = [
              { top: item.positioning_top, left: item.positioning_left },
              { top: item.positioning_top2, left: item.positioning_left2 },
              { top: item.positioning_top3, left: item.positioning_left3 },
              { top: item.positioning_top4, left: item.positioning_left4 },
              { top: item.positioning_top5, left: item.positioning_left5 },
            ];

            return positions
              .filter((pos) => pos.top != null && pos.left != null)
              .map((pos, index) => (
                <Button
                  key={`${item.id}-${index}`}
                  onClick={() => handleOpen(item)}
                  sx={{
                    position: "absolute",
                    top: `${pos.top}%`,
                    left: `${pos.left}%`,
                    bgcolor: "rgba(0, 0, 255, 0.7)",
                    color: "white",
                    borderRadius: "5px",
                    py: "2px",
                    px: "2px",
                    minWidth: 30,
                    fontSize: 20,
                    "&:hover": { backgroundColor: "rgba(0, 0, 255, 0.9)" },
                  }}
                >
                  {item.position}
                </Button>
              ));
          })}

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
          >
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
              {selectedItem && (
                <>
                  <Typography variant="h6" id="modal-title">
                    {selectedItem.name}
                  </Typography>
                  {selectedItem.designation && (
                    <Typography>
                      Обозначение: {selectedItem.designation}
                    </Typography>
                  )}
                  {selectedItem.description && (
                    <Typography>
                      Описание: {selectedItem.description}
                    </Typography>
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
                    color="primary"
                    onClick={handleAddToOrder}
                    sx={{ mt: 2, mr: 2 }}
                  >
                    Добавить в заказ
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClose}
                    sx={{ mt: 2 }}
                  >
                    Закрыть
                  </Button>
                </>
              )}
            </Box>
          </Modal>

          <Modal open={orderOpen} onClose={() => setOrderOpen(false)}>
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
              <Typography variant="h6">Ваш заказ</Typography>
              <List>
                {globalOrderParts.map((part) => (
                  <ListItem key={part.id}>
                    <ListItemText
                      primary={`${part.name} (${part.designation})`}
                      secondary={`Количество: ${part.quantity}`}
                    />
                    <IconButton onClick={() => handleRemoveFromOrder(part.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitOrder}
              >
                Отправить заказ
              </Button>
            </Box>
          </Modal>
        </Box>
      </Box>
    </Box>
  );
};
