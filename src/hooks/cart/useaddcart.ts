import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface AddToCartPayload {
  productId: string;
  quantity: number;
  notes: string;
  variantName?: string;
  variantPrice?: number;
}

export const useAddCart = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, AddToCartPayload>({
    mutationFn: async (payload) => {
      return await axios.post(`/cart/create`, payload);
    },
    mutationKey: ["add-cart"],
    onSuccess: (data) => {
      toast.success("¡Artículo agregado al carrito!");
      console.log("Server response:", data.message);
      // onSuccessCallback(data.cartItemId);

      queryClient.invalidateQueries({ queryKey: ["fetch-cart"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data.message ||
          "Error al agregar el artículo al carrito."
      );
      console.error("Failed to add item:", error.message);
    },
  });
};
