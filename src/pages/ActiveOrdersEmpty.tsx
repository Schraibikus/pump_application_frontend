import { Box, Link, Typography } from "@mui/material";

export const ActiveOrdersEmpty = () => {
  return (
    <Box
      sx={{ width: "90%", maxWidth: 1440, mx: "auto", boxSizing: "border-box" }}
    >
      <Box>
        <Box>
          <Typography sx={{ fontSize: 20, textAlign: "center" }}>
            Здесь будут ваши активные заказы
          </Typography>
          
          <Typography sx={{ fontSize: 20, textAlign: "center", mt: 2 }}>
            Перейти {" "}
            <Link href="/">
              на главную страницу
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
