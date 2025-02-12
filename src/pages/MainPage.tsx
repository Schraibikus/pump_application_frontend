import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../types";
const API_URL = "http://localhost:5000/api";

export const MainPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  console.log(products);

  useEffect(() => {
    axios
      .get(`${API_URL}/products`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Ошибка загрузки:", error));
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          p: 4,
          mt: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        {products.map(({ name, path, id }) => (
          <Button key={id} variant="contained" onClick={() => navigate(path)}>
            {`${id}. ${name}`}
          </Button>
        ))}
      </Box>
    </Box>
  );
};
