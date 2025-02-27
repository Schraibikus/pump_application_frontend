import { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { PartItem } from "@/types";

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

  useEffect(() => {
    if (open) {
      setQuantity(1);
    }
  }, [open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setQuantity(value >= 0 ? value : 0); // Предотвращаем отрицательные значения
  };

  const [selectedPart, setSelectedPart] = useState<string>("");
  const handlePartChange = (value: string) => {
    setSelectedPart(value);
    // Если нужно обновить обозначение или другие свойства части
    if (part?.alternativeSets && part.alternativeSets[value]) {
      const selectedAlternative = part.alternativeSets[value];
      // Например, обновляем обозначение
      const updatedPart = { ...part };
      updatedPart.designation = selectedAlternative.designation;
      // Можно обновить и другие свойства, если нужно
    }
  };

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
        <Typography>
          Наименование:{" "}
          <Typography component="span" sx={{ fontWeight: 700 }}>
            {part.name}
          </Typography>
        </Typography>

        {part.alternativeSets &&
          Object.keys(part.alternativeSets).length === 0 &&
          part.designation && (
            <Typography>Обозначение: {part.designation}</Typography>
          )}
        {part.alternativeSets &&
          Object.keys(part.alternativeSets).length === 0 &&
          part.description && (
            <Typography>Описание: {part.description}</Typography>
          )}

        {part.designation &&
          part.alternativeSets &&
          Object.keys(part.alternativeSets).length > 0 && (
            <>
              <Select
                displayEmpty
                variant="standard"
                value={selectedPart}
                renderValue={(value) => (value ? value : "Переменные данные")}
                onChange={(e: SelectChangeEvent<string>) => {
                  const selectedValue = e.target.value;
                  handlePartChange(selectedValue);
                }}
              >
                {Object.keys(part.alternativeSets).map((setName) => (
                  <MenuItem key={setName} value={setName}>
                    {setName}
                  </MenuItem>
                ))}
              </Select>
              {selectedPart &&
                part.alternativeSets[selectedPart].designation && (
                  <Typography>
                    Обозначение:{" "}
                    {selectedPart && part.alternativeSets[selectedPart]
                      ? part.alternativeSets[selectedPart].designation
                      : part.designation}
                  </Typography>
                )}
              {selectedPart &&
                part.alternativeSets[selectedPart].description && (
                  <Typography>
                    Описание:{" "}
                    {selectedPart && part.alternativeSets[selectedPart]
                      ? part.alternativeSets[selectedPart].description
                      : part.description}
                  </Typography>
                )}
              {selectedPart && part.alternativeSets[selectedPart].drawing && (
                <Typography>
                  Рисунок:{" "}
                  {selectedPart && part.alternativeSets[selectedPart]
                    ? part.alternativeSets[selectedPart].drawing
                    : part.description}
                </Typography>
              )}
            </>
          )}

        <TextField
          variant="outlined"
          label="Количество"
          type="number"
          value={quantity}
          slotProps={{
            input: {
              inputProps: { min: 1 },
            },
          }}
          onChange={handleChange}
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
