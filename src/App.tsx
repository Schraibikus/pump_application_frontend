import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { SchemeBuilder } from "./components/SchemeBuilder";
import { Layout } from "./Layout/Layout";
import { MainPage } from "./pages/MainPage";
import { useAppDispatch, useAppSelector } from "./hooks/useReduxHooks";
import { fetchProducts } from "./store/modules/products/thunk";

const App = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />} />
        {products.map(({ path, id, src, width, drawing, name }) => (
          <Route
            key={id}
            path={`/${path}`}
            element={
              <SchemeBuilder
                schemaSrc={src}
                productId={id}
                productWidth={width}
                productDrawing={drawing}
                productName={name}
              />
            }
          />
        ))}
      </Route>
    </Routes>
  );
};

export default App;
