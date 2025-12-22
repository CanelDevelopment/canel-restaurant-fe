import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface DeleteProductVariables {
  id: string;
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, DeleteProductVariables>({
    mutationFn: async ({ id }) => {
      return await axios.post("/product/product-delete", { id });
    },
    mutationKey: ["delete product"],
    retry: false,
    onSuccess: () => {
      toast.success("¡Producto eliminado con éxito!");
      queryClient.invalidateQueries({ queryKey: ["fetch-product"] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "¡Algo salió mal!");
    },
  });
};
