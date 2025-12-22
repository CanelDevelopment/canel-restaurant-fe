import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface RemoveAddonParams {
  cartItemId: string;
  addonItemId: string;
}

export const useRemoveAddonCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation<WithMessage, ErrorWithMessage, RemoveAddonParams>({
    mutationFn: async ({ cartItemId, addonItemId }) => {
      return await axios.delete(
        `/cart/${cartItemId}/delete-addon/${addonItemId}`
      );
    },
    onSuccess: () => {
      toast.success("Artículo eliminado del carrito.");
      // Invalidate to refetch the updated cart
      queryClient.invalidateQueries({ queryKey: ["fetch-cart"] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Error al eliminar el artículo.");
    },
  });
};
