import { Box, Typography } from "@mui/material";

export const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        px: 9,
        position: "fixed",
        bottom: 0,
        height: 60,
        zIndex: 50,
        backgroundImage: "url(/png/tile_background.png)",
        borderTop: "2px solid rgba(0, 0, 255, 0.7)",
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
        Copyright 2025
      </Typography>{" "}
      <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
        created by @Schraibikus
      </Typography>
    </Box>
  );
};
