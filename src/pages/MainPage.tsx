import { Box, Link } from "@mui/material";

export const MainPage = () => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", gap: 4, p: 4, mt: 2 }}
    >
      <Link href="/1">
        <img
          src="/png/pump_main_01.png"
          alt="logo"
          style={{ maxWidth: "100%", maxHeight: "100%", cursor: "pointer" }}
        />
      </Link>
    </Box>
  );
};
