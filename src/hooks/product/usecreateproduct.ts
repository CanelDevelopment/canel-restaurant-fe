import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, FormData>({
    mutationFn: async (formData) => {
      return await axios.post(`/product/product-create`, formData);
    },
    mutationKey: ["create product"],
    retry: false,
    onSuccess: (data) => {
      toast.success("¡Producto agregado con éxito!");
      queryClient.invalidateQueries({ queryKey: ["fetch-product"] });
      console.log("Product added successfully:", data.message);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error al agregar el producto"
      );
      console.error("Failed to add product:", error.message);
    },
  });
};
