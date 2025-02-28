// import { useState } from "react";
// import { Box, Button, CircularProgress } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// import { PartItem } from "@/types";
// import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
// import ScrollToTopButton from "./ScrollToTopButton";
// import {
//   addPartToOrder,
//   removePartFromOrder,
// } from "@/store/modules/orders/ordersSlice";
// import { useProductParts } from "@/hooks/useProductParts";
// import PartDetailsModal from "@/components/Modals/PartDetailsModal";
// import OrderModal from "@/components/Modals/OrderModal";
// import { useSubmitOrder } from "@/hooks/useSubmitOrder";

// export const SchemeBuilder = ({
//   schemaSrc,
//   productId,
//   productWidth,
//   productDrawing,
//   productName,
//   productHead,
// }: {
//   schemaSrc: string;
//   productId: number;
//   productWidth: number;
//   productDrawing: number;
//   productName: string;
//   productHead: number;
// }) => {
//   const [selectedItem, setSelectedItem] = useState<PartItem | null>(null);
//   const [orderOpen, setOrderOpen] = useState(false);

//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const submitOrder = useSubmitOrder();

//   const { parts, loading, error } = useProductParts(productId);
//   // console.log("parts:", JSON.stringify(parts, null, 2));
//   console.log("parts:", parts);
//   const globalOrderParts = useAppSelector((state) => state.orders.parts);
//   console.log("globalOrderParts", globalOrderParts);
//   const totalPartsInOrder = globalOrderParts.reduce(
//     (sum, part) => sum + part.quantity,
//     0
//   );
//   const totalItemsInOrder = globalOrderParts.length;

//   const hasOrder = globalOrderParts && globalOrderParts.length > 0;

//   const handleOpen = (item: PartItem) => {
//     setSelectedItem(item);
//   };

//   const handleAddToOrder = (quantity: number) => {
//     if (selectedItem) {
//       dispatch(
//         addPartToOrder({
//           ...selectedItem,
//           quantity,
//           parentProductId: productId,
//           productName,
//           productDrawing,
//         })
//       );
//       setSelectedItem(null);
//     }
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Box>Ошибка: {error}</Box>;

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         textAlign: "center",
//         mt: 5,
//       }}
//     >
//       <Box
//         sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
//       >
//         <Button
//           variant="contained"
//           onClick={() => navigate(`/${productHead}`)}
//           sx={{ m: 2, alignSelf: "flex-start", whiteSpace: "nowrap" }}
//         >
//           На страницу изделия
//         </Button>

//         <Button
//           variant="contained"
//           onClick={() => setOrderOpen(true)}
//           sx={{ m: 2, alignSelf: "flex-start" }}
//           disabled={!hasOrder}
//         >
//           {`Просмотреть заказ: наименований-(${totalItemsInOrder}) количество-(${totalPartsInOrder})`}
//         </Button>

//         <ScrollToTopButton />
//       </Box>

//       <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
//         <Box
//           sx={{
//             position: "relative",
//             display: "inline-block",
//           }}
//         >
//           <img src={schemaSrc} alt="Scheme" width={`${productWidth}%`} />
//           {parts.map((item) => {
//             const positions = [
//               { top: item.positioningTop, left: item.positioningLeft },
//               { top: item.positioningTop2, left: item.positioningLeft2 },
//               { top: item.positioningTop3, left: item.positioningLeft3 },
//               { top: item.positioningTop4, left: item.positioningLeft4 },
//               { top: item.positioningTop5, left: item.positioningLeft5 },
//             ];

//             return positions
//               .filter((pos) => pos.top != null && pos.left != null)
//               .map((pos, index) => (
//                 <Button
//                   key={`${item.id}-${index}`}
//                   onClick={() => handleOpen(item)}
//                   sx={{
//                     position: "absolute",
//                     top: `${pos.top}%`,
//                     left: `${pos.left}%`,
//                     color:
//                       item.alternativeSets &&
//                       Object.keys(item.alternativeSets).length > 0
//                         ? "rgba(255, 0, 0, 0.7)"
//                         : "rgba(0, 0, 255, 0.7)",
//                     borderRadius: "5px",
//                     py: "2px",
//                     px: "2px",
//                     minWidth: 30,
//                     fontSize: 20,
//                     "&:hover": {
//                       backgroundColor: "rgba(112, 171, 248, 0.9)",
//                       boxShadow: "0px 20px 35px rgba(0, 0, 0, 0.06)",
//                       transform: "translateY(-5px)",
//                       color: "#000",
//                     },
//                   }}
//                 >
//                   {item.position}
//                 </Button>
//               ));
//           })}
//         </Box>
//       </Box>

//       <PartDetailsModal
//         open={!!selectedItem}
//         part={selectedItem}
//         onClose={() => setSelectedItem(null)}
//         onAddToOrder={handleAddToOrder}
//       />

//       <OrderModal
//         open={orderOpen}
//         onClose={() => setOrderOpen(false)}
//         parts={globalOrderParts}
//         onSubmit={() =>
//           submitOrder(globalOrderParts, () => setOrderOpen(false))
//         }
//         onRemove={(id) => dispatch(removePartFromOrder(id))}
//       />
//     </Box>
//   );
// };

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
import { PartItem } from "@/types";
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
        selectedSet: selectedItem.selectedSet, // Сохраняем выбранный набор
        ...(selectedItem.selectedSet && selectedItem.alternativeSets
          ? selectedItem.alternativeSets[selectedItem.selectedSet] // Обновляем данные
          : {}),
      };
      console.log("newPart", newPart);
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

        <Button
          variant="contained"
          onClick={() => setOrderOpen(true)}
          sx={{ m: 2, alignSelf: "flex-start" }}
          disabled={!hasOrder}
        >
          {`Просмотреть заказ: наименований-(${totalItemsInOrder}) количество-(${totalPartsInOrder})`}
        </Button>

        <ScrollToTopButton />
      </Box>
      <ScrollToTopButton />
      <Box sx={{ mt: 2 }}>
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <img src={schemaSrc} alt="Scheme" width={`${productWidth}%`} />

          {parts.map((item) => {
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
                    color:
                      item.alternativeSets &&
                      Object.keys(item.alternativeSets).length > 0
                        ? "rgba(255, 0, 0, 0.7)"
                        : "rgba(0, 0, 255, 0.7)",
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

                  {/* Добавляем выбор alternativeSets, если они есть */}
                  {selectedItem.alternativeSets && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1">
                        Выберите набор:
                      </Typography>
                      <select
                        onChange={(e) => {
                          const selectedSet = e.target.value;
                          setSelectedItem((prev) => ({
                            ...prev!,
                            selectedSet, // Сохраняем выбранный набор
                            ...(prev?.alternativeSets?.[selectedSet] || {}), // Обновляем данные
                          }));
                        }}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "4px",
                        }}
                      >
                        <option value="">Выберите набор</option>
                        {Object.keys(selectedItem.alternativeSets).map(
                          (setName) => (
                            <option key={setName} value={setName}>
                              {setName}
                            </option>
                          )
                        )}
                      </select>
                    </Box>
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
                width: 600,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6">Ваш заказ</Typography>
              <List>
                {globalOrderParts.map((part) => {
                  const hasSelectedSet =
                    part.selectedSet && part.alternativeSets;
                  const selectedSetData =
                    part.selectedSet !== undefined && part.alternativeSets
                      ? part.alternativeSets[part.selectedSet]
                      : null;

                  return (
                    <ListItem
                      key={`${part.id}-${part.selectedSet || "default"}`}
                    >
                      <ListItemText
                        primary={
                          <>
                            {part.name} <br />
                            {hasSelectedSet && selectedSetData ? (
                              <>
                                {`Набор: ${part.selectedSet}`} <br />
                                {`Обозначение: ${selectedSetData.designation}`}{" "}
                                <br />
                                {selectedSetData.description &&
                                  `Описание: ${selectedSetData.description}`}
                              </>
                            ) : (
                              <>
                                {part.designation &&
                                  `Обозначение: ${part.designation}`}{" "}
                                <br />
                                {part.description &&
                                  `Описание: ${part.description}`}
                              </>
                            )}
                          </>
                        }
                        secondary={`Количество: ${part.quantity}`}
                      />
                      <IconButton
                        onClick={() => handleRemoveFromOrder(part.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  );
                })}
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
