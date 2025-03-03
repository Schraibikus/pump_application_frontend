import { useEffect, useState } from "react"; // Добавлен useMemo
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { PartItem } from "@/types";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchProductParts } from "@/store/modules/parts/thunk";
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
  productHead,
}: {
  schemaSrc: string;
  productId: number;
  productWidth: number;
  productDrawing: number;
  productName: string;
  productHead: number;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PartItem | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [lastSelectedSet, setLastSelectedSet] = useState<string>("");

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { parts, loading, error, cachedParts } = useAppSelector(
    (state) => state.productParts
  );
  const {
    parts: globalOrderParts,
    loading: orderLoading,
    error: orderError,
  } = useAppSelector((state) => state.orders);
  // console.log(globalOrderParts);

  // Используем кэшированные данные, если они есть
  const currentParts = cachedParts[productId] || parts;

  useEffect(() => {
    // Загружаем данные только если их нет в кэше
    if (!cachedParts[productId]) {
      dispatch(fetchProductParts(productId));
    }
  }, [dispatch, productId, cachedParts]);

  const handleOpen = (item: PartItem) => {
    const initialSelectedSet = item.alternativeSets?.[lastSelectedSet]
      ? lastSelectedSet
      : "";

    setSelectedItem({
      ...item,
      selectedSet: initialSelectedSet,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddToOrder = () => {
    if (selectedItem) {
      const newPart = {
        ...selectedItem,
        quantity: 1, // Всегда добавляем 1, существующие будут суммироваться
        parentProductId: productId,
        productName,
        productDrawing,
        selectedSet: selectedItem.selectedSet,
        ...(selectedItem.selectedSet && selectedItem.alternativeSets
          ? selectedItem.alternativeSets[selectedItem.selectedSet]
          : {}),
      };

      setQuantity(1);
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

  const totalItemsInOrder = globalOrderParts.length;
  const totalPartsInOrder = globalOrderParts.reduce(
    (sum, part) => sum + part.quantity,
    0
  );
  const hasOrder = globalOrderParts && globalOrderParts.length > 0;
  const hasAlternativeSets =
    selectedItem?.alternativeSets &&
    Object.keys(selectedItem.alternativeSets).length > 0;

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
        justifyContent: "center",
        textAlign: "center",
        mt: 5,
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Button
          variant="contained"
          onClick={() => navigate(`/${productHead}`)}
          sx={{ m: 2, alignSelf: "flex-start", whiteSpace: "nowrap" }}
        >
          На страницу изделия
        </Button>

        {hasOrder && (
          <Button
            variant="contained"
            onClick={() => setOrderOpen(true)}
            sx={{ m: 2, alignSelf: "flex-start" }}
          >
            {`Просмотреть заказ: наименований-(${totalItemsInOrder}) количество-(${totalPartsInOrder})`}
          </Button>
        )}

        <ScrollToTopButton />
      </Box>
      <ScrollToTopButton />
      <Box sx={{ mt: 2 }}>
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <img src={schemaSrc} alt="Scheme" width={`${productWidth}%`} />

          {currentParts.map((item) => {
            const positions = [
              { top: item.positioningTop, left: item.positioningLeft },
              { top: item.positioningTop2, left: item.positioningLeft2 },
              { top: item.positioningTop3, left: item.positioningLeft3 },
              { top: item.positioningTop4, left: item.positioningLeft4 },
              { top: item.positioningTop5, left: item.positioningLeft5 },
            ];

            return positions
              .filter((pos) => pos.top != null && pos.left != null)
              .map((pos, index) => (
                <Button
                  key={`${item.id}-${pos.top}-${pos.left}-${index}`}
                  onClick={() => handleOpen(item)}
                  sx={{
                    position: "absolute",
                    top: `${pos.top}%`,
                    left: `${pos.left}%`,
                    fontWeight: 700,
                    color:
                      item.alternativeSets &&
                      Object.keys(item.alternativeSets).length > 0
                        ? "rgba(255, 0, 0, 0.7)"
                        : "rgba(0, 0, 255, 0.7)",
                    borderRadius: "5px",
                    py: 0.5,
                    px: 0.5,
                    minWidth: 30,
                    fontSize: 20,
                    "&:hover": {
                      backgroundColor: "rgba(112, 171, 248, 0.9)",
                      boxShadow: "0px 20px 35px rgba(0, 0, 0, 0.06)",
                      transform: "translateY(-5px)",
                      color: "#000",
                    },
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
                width: 600,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}
            >
              {selectedItem && (
                <Box>
                  <Typography id="modal-title">
                    Наименование:{" "}
                    <Typography component="span" sx={{ fontWeight: 700 }}>
                      {selectedItem.name}
                    </Typography>
                  </Typography>
                  {!hasAlternativeSets && selectedItem.designation && (
                    <Typography>
                      Обозначение: {selectedItem.designation}
                    </Typography>
                  )}
                  {!hasAlternativeSets && selectedItem.description && (
                    <Typography>
                      Описание: {selectedItem.description}
                    </Typography>
                  )}
                  {!hasAlternativeSets && selectedItem.quantity && (
                    <Typography>Количество: {selectedItem.quantity}</Typography>
                  )}
                  {!hasAlternativeSets && selectedItem.drawing && (
                    <Typography>Рисунок: {selectedItem.drawing}</Typography>
                  )}

                  {hasAlternativeSets && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Выберите переменные данные:
                      </Typography>
                      <FormControl fullWidth>
                        <InputLabel id="alternative-sets-select-label">
                          Переменные данные
                        </InputLabel>
                        <Select
                          labelId="alternative-sets-select-label"
                          id="alternative-sets-select"
                          value={selectedItem.selectedSet || ""}
                          onChange={(e) => {
                            const selectedSet = e.target.value;
                            setSelectedItem((prev) => ({
                              ...prev!,
                              selectedSet,
                              ...(prev?.alternativeSets?.[selectedSet] || {}),
                            }));
                            setLastSelectedSet(selectedSet);
                          }}
                          label="Переменные данные"
                          sx={{ borderRadius: "4px" }}
                        >
                          <MenuItem value="">
                            <em>Выберите переменные данные</em>
                          </MenuItem>
                          {selectedItem.alternativeSets &&
                            Object.keys(selectedItem.alternativeSets).map(
                              (setName) => (
                                <MenuItem key={setName} value={setName}>
                                  {setName}
                                </MenuItem>
                              )
                            )}
                        </Select>
                      </FormControl>
                    </Box>
                  )}
                  <Box>
                    <TextField
                      label="Количество"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      sx={{ mt: 2 }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleDecrement}
                                size="small"
                              >
                                <Remove />
                              </IconButton>
                              <IconButton
                                onClick={handleIncrement}
                                size="small"
                              >
                                <Add />
                              </IconButton>
                            </InputAdornment>
                          ),
                          sx: {
                            "& input[type=number]": {
                              MozAppearance: "textfield",
                            },
                            "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                              {
                                WebkitAppearance: "none",
                                margin: 0,
                              },
                          },
                        },
                      }}
                    />
                    <Box>
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
                    </Box>
                  </Box>
                </Box>
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
                width: 600,
                maxHeight: "80vh", // Ограничиваем высоту модального окна
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6">Ваш заказ</Typography>
              <Box
                sx={{
                  overflowY: "auto", // Добавляем вертикальный скролл
                  flexGrow: 1, // Растягиваем контейнер на доступное пространство
                  mt: 2,
                }}
              >
                {globalOrderParts.map((part) => {
                  const hasSelectedSet =
                    part.selectedSet && part.alternativeSets;
                  const selectedSetData =
                    part.selectedSet !== undefined && part.alternativeSets
                      ? part.alternativeSets[part.selectedSet]
                      : null;

                  return (
                    <Box
                      key={`${part.id}-${part.selectedSet || "default"}`}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #e0e0e0",
                        padding: 2,
                        "&:last-child": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      <Box>
                        <Typography>
                          Наименование:{" "}
                          <Typography
                            component={"span"}
                            sx={{ fontWeight: 700 }}
                          >
                            {part.name}
                          </Typography>
                        </Typography>
                        {hasSelectedSet && selectedSetData ? (
                          <>
                            <Typography variant="body2">
                              Переменные данные:{" "}
                              <Typography
                                component={"span"}
                                sx={{ fontWeight: 700 }}
                              >
                                {part.selectedSet}
                              </Typography>
                            </Typography>
                            <Typography variant="body2">
                              Обозначение:{" "}
                              <Typography
                                component={"span"}
                                sx={{ fontWeight: 700 }}
                              >
                                {selectedSetData.designation}
                              </Typography>
                            </Typography>
                            {selectedSetData.description && (
                              <Typography variant="body2">
                                Описание:{" "}
                                <Typography
                                  component={"span"}
                                  sx={{ fontWeight: 700 }}
                                >
                                  {selectedSetData.description}
                                </Typography>
                              </Typography>
                            )}
                          </>
                        ) : (
                          <>
                            {part.designation && (
                              <Typography variant="body2">
                                Обозначение:{" "}
                                <Typography
                                  component={"span"}
                                  sx={{ fontWeight: 700 }}
                                >
                                  {part.designation}
                                </Typography>
                              </Typography>
                            )}
                            {part.description && (
                              <Typography variant="body2">
                                Описание:{" "}
                                <Typography
                                  component={"span"}
                                  sx={{ fontWeight: 700 }}
                                >
                                  {part.description}
                                </Typography>
                              </Typography>
                            )}
                          </>
                        )}
                        <Typography variant="body2">
                          Количество:{" "}
                          <Typography
                            component={"span"}
                            sx={{ fontWeight: 700 }}
                          >
                            {part.quantity}
                          </Typography>
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => handleRemoveFromOrder(part.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitOrder}
                disabled={!globalOrderParts.length}
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
