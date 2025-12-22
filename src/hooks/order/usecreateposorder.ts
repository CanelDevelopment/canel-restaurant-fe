import {
  axios,
  type ErrorWithMessage,
  type WithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface CreatedOrderData {
  id: string;
}

interface OrderItem {
  productId: string;
  productName: string; // Make sure to send this from the client
  quantity: number;
  price: number;
}

interface OrderFormData {
  name: string;
  location: string;
  phoneNumber: number;
  rif: string;
  nearestLandmark: string;
  email: string;
  changeRequest: string;
  instruction?: string;
  items?: OrderItem[];
}

export const useCreatePOSOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<
    WithMessage & { data: { data: CreatedOrderData } },
    ErrorWithMessage,
    OrderFormData
  >({
    mutationFn: async (orderFormData) => {
      return await axios.post(`/order/create-pos-order`, orderFormData);
    },
    mutationKey: ["create pos order"],
    retry: false,

    onSuccess: () => {
      toast.success("¡Pedido agregado con éxito!");
      queryClient.invalidateQueries({ queryKey: ["all-orders"] });
    },
    onError: (error) => {
      toast.error(error.message || "¡Algo salió mal!");
    },
  });
};
