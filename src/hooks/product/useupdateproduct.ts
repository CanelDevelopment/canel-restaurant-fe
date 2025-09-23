import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config"; // Assuming these custom types exist
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdateProductPayload {
  id: string;
  name?: string;
  description?: string;
  price?: string;
  availability?: boolean;
  categoryId?: string;
  status?: string;
  branches?: string[];
  image?: File | null;
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, UpdateProductPayload>({
    mutationFn: async ({ id, ...payload }) => {
      console.log("This is the update product", id, payload);
      if (payload.image) {
        const formData = new FormData();

        if (payload.name !== undefined) formData.append("name", payload.name);
        if (payload.description !== undefined)
          formData.append("description", payload.description);
        if (payload.price !== undefined)
          formData.append("price", payload.price);
        if (payload.categoryId !== undefined)
          formData.append("categoryId", payload.categoryId);
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
      toast.success(data.message || "Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["fetch-product"] });
    },

    onError: (error) => {
      toast.error(error?.response?.data.message || "Failed to update product.");
      console.error("Failed to update product:", error?.response?.data.message);
    },
  });
};
