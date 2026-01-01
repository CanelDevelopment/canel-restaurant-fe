import type { ProductVariant } from "@/components/admin/food Item/newitemcontent";
import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdateProductPayload {
  id: string;
  name?: string;
  description?: string;
  price?: string;
  availability?: boolean;
  categoryId?: string[] | null;
  status?: string;
  branches?: string[];
  discount?: number;
  image?: File | null;
  variants?: ProductVariant[];
  addonItemIds?: string[];
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, UpdateProductPayload>({
    mutationFn: async ({ id, ...payload }) => {
      if (payload.image) {
        const formData = new FormData();

        if (payload.name !== undefined) formData.append("name", payload.name);

        if (payload.description !== undefined)
          formData.append("description", payload.description);

        if (payload.price !== undefined)
          formData.append("price", payload.price);

        if (payload.categoryId && payload.categoryId.length > 0) {
          payload.categoryId.forEach((id) => {
            formData.append("categoryId", id);
          });
        }

        formData.append("productImage", payload.image);

        const response = await axios.patch(
          `/product/products-update/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } else {
        const { image, ...restPayload } = payload;
        const response = await axios.patch(
          `/product/products-update/${id}`,
          restPayload
        );
        console.log("This is payload", payload);
        return response.data;
      }
    },

    onSuccess: (data) => {
      toast.success(data.message || "¡Producto actualizado con éxito!");
      queryClient.invalidateQueries({ queryKey: ["fetch-product"] });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data.message || "Error al actualizar el producto."
      );
      console.error("Failed to update product:", error?.response?.data.message);
    },
  });
};
