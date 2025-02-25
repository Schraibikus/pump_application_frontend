import { Box, Tabs, Tab } from "@mui/material";
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
      case "/1":
        setTabValue(1);
        break;
      case "/2":
        setTabValue(2);
        break;
      case "/orders":
        setTabValue(3);
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
        navigate("/1");
        break;
      case 2:
        navigate("/2");
        break;
      case 3:
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
        mx: "auto",
        boxSizing: "border-box",
        position: "fixed",
        top: 0,
        height: 70,
        zIndex: 50,
        backgroundImage: "url(/png/tile_background.png)",
        // borderBottom: "2px solid rgba(0, 0, 255, 0.7)",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Tabs
          value={tabValue} // Начальное значение
          onChange={handleTabChange}
          aria-label="Tabs for HeaderBar"
          variant="standard"
          sx={{
            "& .MuiTabs-flexContainer": {
              gap: "20px", // Расстояние между табами
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "rgba(0, 0, 255, 0.7)",
            },
          }}
        >
          <Tab label="На главную" />
          <Tab label="Изделиe 1" />
          <Tab label="Изделиe 2" />
          <Tab label="Заказы" />
        </Tabs>
      </Box>
    </Box>
  );
};
