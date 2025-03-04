import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { useMemo } from "react";

export const ProductGroupPage = () => {
  const navigate = useNavigate();
  const { head } = useParams(); // Получаем head из URL
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );

  // Мемоизация фильтрации продуктов
  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.head === Number(head));
  }, [products, head]); // Пересчитываем только при изменении products или head

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
    <Box
      sx={{
        columnCount: 3,
        p: 4,
      }}
    >
      {filteredProducts.length > 0 ? (
        filteredProducts.map(({ name, path, id, head }) => (
          <Button
            sx={{
              breakInside: "avoid-column",
              width: "100%",
              my: 1,
              "&:last-child": { color: "red" },
            }}
            key={id}
            variant="contained"
            onClick={() => navigate(`/${head}${path}`)}
          >
            {name}
          </Button>
        ))
      ) : (
        <Typography>В данной группе нет изделий</Typography>
      )}
    </Box>
  );
};
