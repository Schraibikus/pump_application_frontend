import { Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LinkItem, Product } from "../types";

export const SchemeBuilder = ({
  schemaSrc,
  product,
}: {
  schemaSrc: string;
  product: Product;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LinkItem | null>(null);
  const navigate = useNavigate();

  const handleOpen = (item: LinkItem) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

      <Box sx={{ position: "relative", display: "inline-block" }}>
        <img src={schemaSrc} alt="Scheme" width={`${product.width}%`} />

        {product.parts.map((item) =>
          Object.entries(item.positioning)
            .filter(
              ([key, value]) => key.includes("top") && value !== undefined
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(([_, topValue], index) => {
              const leftKey = `left${index === 0 ? "" : index + 1}`;
              const leftValue =
                item.positioning[leftKey as keyof typeof item.positioning];

              return (
                leftValue !== undefined && (
                  <Button
                    key={`${item.id}-${index}`}
                    onClick={() => handleOpen(item)}
                    sx={{
                      position: "absolute",
                      top: `${topValue}%`,
                      left: `${leftValue}%`,
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
                )
              );
            })
        )}

        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
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
                  <Typography>Описание: {selectedItem.description}</Typography>
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
        Рис.{product.drawing} {product.name}
      </Typography>
    </Box>
  );
};
