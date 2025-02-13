import { Box, Grid2, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const HeaderBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setTabValue(0);
        break;
      case "/products":
        setTabValue(1);
        break;
      case "/orders":
        setTabValue(2);
        break;
      default:
        setTabValue(0); // По умолчанию выбираем первую вкладку
    }
  }, [location.pathname]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/");
        break;
      case 1:
        navigate("/products");
        break;
      case 2:
        navigate("/orders");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <Box
      sx={{
        pt: 2,
        width: "100%",
        m: "0 auto",
        boxSizing: "border-box",
        position: "fixed",
        top: 0,
        height: 70,
        zIndex: 50,
        backgroundImage: "url(/png/tile_background.png)",
        borderBottom: "2px solid rgba(0, 0, 255, 0.7)",
      }}
    >
      <>
        <Grid2
          container
          size={12}
          spacing={{ xl: 12, lg: 5, md: 2.5, sm: 2, xs: 2 }}
        >
          <Grid2
            size={12}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Tabs
              value={tabValue} // Начальное значение
              onChange={handleTabChange}
              aria-label="Tabs for HeaderBar"
              variant="standard"
            >
              <Tab label="На главную" />
              <Tab label="Изделия" />
              <Tab label="Заказы" />
            </Tabs>
          </Grid2>
        </Grid2>
      </>
    </Box>
  );
};
