import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useAppSelector } from "@/hooks/useReduxHooks";

export const MainPage = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );
  // console.log(products);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 4,
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>{"Загрузка изделий..."}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 4,
          gap: 2,
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
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
