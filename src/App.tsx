import { Route, Routes } from "react-router-dom";

import { SchemeBuilder } from "./components/SchemeBuilder";
import { schemes } from "./constants";
import { Layout } from "./Layout/Layout";
import { MainPage } from "./pages/MainPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />} />
        {schemes.map(({ path, data }) => (
          <Route
            key={path}
            path={`/${path}`}
            element={<SchemeBuilder schemaSrc={data.src} product={data} />}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default App;
