import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios, type ErrorWithMessage } from "@/configs/axios.config";

interface UpdateCartPayload {
  productId: string;
  quantity: number;
}

const updateCartItem = async (payload: UpdateCartPayload) => {
  const response = await axios.patch("/cart/update", payload);
  return response.data;
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-cart"] });
    },

    onError: (error: ErrorWithMessage) => {
      console.log(error);
      // toast.error(error.message || "Error al actualizar el artículo en el carrito.");
    },
  });
};
