import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface AddAddonToCartPayload {
  productId: string;
  addonItemId: string;
  quantity: number;
}

export const useCreateAddonToCart = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, AddAddonToCartPayload>({
    mutationFn: async (payload) => {
      return await axios.post(`/cart/addon/create`, payload);
    },

    mutationKey: ["create-addon-to-cart"],

    onSuccess: (data) => {
      toast.success("¡Complemento agregado con éxito!");
      console.log("Server response:", data.message);

      queryClient.invalidateQueries({ queryKey: ["fetch-cart"] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message || "Error al agregar el complemento.");
      console.error("Failed to add addon:", error.message);
    },
  });
};
