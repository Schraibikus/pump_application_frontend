import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useAppSelector } from "@/hooks/useReduxHooks";

export const MainPage = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );

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

  // Разделяем изделия по группам
  const productsHead1 = products.filter((product) => product.head === 1);
  const productsHead2 = products.filter((product) => product.head === 2);

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", gap: 4, p: 4, mt: 2 }}
    >
      {/* Колонка с изделиями head: 1 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
          border: "1px solid rgba(0, 0, 255, 0.7)",
          p: 1,
        }}
      >
        {/* <Typography variant="h6">Группа 1</Typography> */}
        {productsHead1.length > 0 ? (
          productsHead1.map(({ name, path, id, head }) => (
            <Button
              key={id}
              variant="contained"
              onClick={() => navigate(`/${head}/${path}`)}
            >
              {name}
            </Button>
          ))
        ) : (
          <Typography color="textSecondary">Нет изделий</Typography>
        )}
      </Box>

      {/* Колонка с изделиями head: 2 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
          border: "1px solid rgba(0, 0, 255, 0.7)",
          p: 1,
        }}
      >
        {/* <Typography variant="h6">Группа 2</Typography> */}
        {productsHead2.length > 0 ? (
          productsHead2.map(({ name, path, id, head }) => (
            <Button
              key={id}
              variant="contained"
              onClick={() => navigate(`/${head}/${path}`)}
            >
              {name}
            </Button>
          ))
        ) : (
          <Typography color="textSecondary">Нет изделий</Typography>
        )}
      </Box>
    </Box>
  );
};
