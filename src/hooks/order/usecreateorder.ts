import { useClearCart } from "./../../store/cartStore";
import {
  axios,
  type ErrorWithMessage,
  type WithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface CreatedOrderData {
  id: string;
}

// interface OrderItem {
//   productId: string;
//   productName: string; // Make sure to send this from the client
//   quantity: number;
//   price: string;
//   instructions?: string;
// }

// interface OrderFormData {
//   name: string;
//   location: string;
//   phoneNumber: number;
//   rif: string;
//   nearestLandmark: string;
//   email: string;
//   changeRequest: string;
//   cartId?: string;
//   items?: OrderItem[];
//   type: string;
//   branchId: string;
// }

export const useCreateOrder = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearCart = useClearCart();

  return useMutation<
    WithMessage & { data: { data: CreatedOrderData } },
    ErrorWithMessage,
    FormData
  >({
    mutationFn: async (FormData) => {
      return await axios.post(`/order/create-order`, FormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    mutationKey: ["create order"],
    retry: false,

    onSuccess: (response) => {
      const newOrder = response.data.data;

      toast.success("¡Pedido agregado con éxito!");

      clearCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["fetch-cart"] });

      navigate(`/place-order/${newOrder.id}`);
    },
    onError: (error) => {
      toast.error(error?.response?.data.message || "¡Algo salió mal!");
    },
  });
};
