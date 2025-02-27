import { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { PartItem } from "@/types";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import ScrollToTopButton from "./ScrollToTopButton";
import {
  addPartToOrder,
  removePartFromOrder,
} from "@/store/modules/orders/ordersSlice";
import { useProductParts } from "@/hooks/useProductParts";
import PartDetailsModal from "@/components/Modals/PartDetailsModal";
import OrderModal from "@/components/Modals/OrderModal";
import { useSubmitOrder } from "@/hooks/useSubmitOrder";

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
  const [selectedItem, setSelectedItem] = useState<PartItem | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const submitOrder = useSubmitOrder();

  const { parts, loading, error } = useProductParts(productId);
  // console.log("parts:", JSON.stringify(parts, null, 2));
  console.log("parts:", parts);
  const globalOrderParts = useAppSelector((state) => state.orders.parts);
  // console.log("globalOrderParts", globalOrderParts);
  const totalPartsInOrder = globalOrderParts.reduce(
    (sum, part) => sum + part.quantity,
    0
  );
  const totalItemsInOrder = globalOrderParts.length;

  const hasOrder = globalOrderParts && globalOrderParts.length > 0;

  const handleOpen = (item: PartItem) => {
    setSelectedItem(item);
  };

  const handleAddToOrder = (quantity: number) => {
    if (selectedItem) {
      dispatch(
        addPartToOrder({
          ...selectedItem,
          quantity,
          parentProductId: productId,
          productName,
          productDrawing,
        })
      );
      setSelectedItem(null);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Box>Ошибка: {error}</Box>;

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

      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            position: "relative",
            display: "inline-block",
          }}
        >
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
                  key={`${item.id}-${index}`}
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
        </Box>
      </Box>

      <PartDetailsModal
        open={!!selectedItem}
        part={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToOrder={handleAddToOrder}
      />

      <OrderModal
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        parts={globalOrderParts}
        onSubmit={() =>
          submitOrder(globalOrderParts, () => setOrderOpen(false))
        }
        onRemove={(id) => dispatch(removePartFromOrder(id))}
      />
    </Box>
  );
};

// im