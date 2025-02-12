import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchProducts } from "@/store/modules/products/thunk";

export const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );
  // console.log(products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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
        {products &&
          products.map(({ name, path, id }) => (
            <Button key={id} variant="contained" onClick={() => navigate(path)}>
              {name}
            </Button>
          ))}
      </Box>
    </Box>
  );
};
