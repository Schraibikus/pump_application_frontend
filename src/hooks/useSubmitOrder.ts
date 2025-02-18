import { toast } from "react-toastify";

import { useAppDispatch } from "@/hooks/useReduxHooks";
import { createOrder } from "@/store/modules/orders/thunk";
import { clearOrder } from "@/store/modules/orders/ordersSlice";
import { PartItem } from "@/types";

export const useSubmitOrder = () => {
  const dispatch = useAppDispatch();

  return async (parts: PartItem[], onSuccess: () => void) => {
    try {
      await dispatch(
        createOrder({
          id: 0,
          createdAt: new Date().toISOString(),
          parts,
        })
      ).unwrap();
      toast.success("Заказ успешно отправлен!");
      dispatch(clearOrder());
      onSuccess();
    } catch (error) {
      console.error("Ошибка при отправке заказа:", error);
    }
  };
};
