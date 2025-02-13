import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PartItem } from "@/store/modules/products/types";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchProductParts } from "@/store/modules/products/thunk";
import ScrollToTopButton from "./ScrollToTopButton";

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
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { parts, loading, error } = useAppSelector(
    (state) => state.productParts
  );

  useEffect(() => {
    // console.log(`Запрос деталей для продукта: ${productId}`);
    dispatch(fetchProductParts(productId));
  }, [dispatch, productId]);

  const handleOpen = (item: PartItem) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log("Загруженные детали:", parts);

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
                  <Typography>Количество: {selectedItem.quantity}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClose}
                    sx={{ mt: 2 }}
                  >
                    Закрыть
                  </Button>
                </>
              )}
            </Box>
          </Modal>
        </Box>

        <Typography sx={{ mt: 1 }}>
          Рис.{productDrawing} {productName}
        </Typography>
      </Box>
    </Box>
  );
};
