import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchProductParts } from "@/store/modules/products/thunk";

export const useProductParts = (productId: number) => {
  const dispatch = useAppDispatch();
  const { parts, loading, error } = useAppSelector(
    (state) => state.productParts
  );

  useEffect(() => {
    dispatch(fetchProductParts(productId));
  }, [dispatch, productId]);

  return { parts, loading, error };
};
