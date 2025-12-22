import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation<WithMessage, ErrorWithMessage, string>({
    mutationFn: async (cartItemId) => {
      return await axios.post(`/cart/delete/${cartItemId}`);
    },
    onSuccess: () => {
      toast.success("Artículo eliminado del carrito.");
      // Invalidate to refetch the updated cart
      queryClient.invalidateQueries({ queryKey: ["fetch-cart"] });
    },
    onError: (error) => {
      console.log(error);
      // toast.error(error.message || "Error al eliminar el artículo.");
    },
  });
};
