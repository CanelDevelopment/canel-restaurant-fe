import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdateAddonItemPayload {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  addonCategoryId?: string;
  image?: File | null;
}

export const useUpdateAddonItem = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, UpdateAddonItemPayload>({
    mutationFn: async ({ id, ...payload }) => {
      if (payload.image) {
        const formData = new FormData();

        if (payload.name !== undefined) formData.append("name", payload.name);
        if (payload.price !== undefined)
          formData.append("price", String(payload.price));
        if (payload.addonCategoryId !== undefined)
          formData.append("addonCategoryId", payload.addonCategoryId);

        formData.append("addonItemImage", payload.image);

        const response = await axios.patch(
          `/addon-item/update-addon-item/${id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
      } else {
        const { image, ...restPayload } = payload;
        const response = await axios.patch(
          `/addon/update-addon-item/${id}`,
          restPayload
        );
        return response.data;
      }
    },

    onSuccess: (data) => {
      toast.success(data.message || "¡Artículo adicional actualizado exitosamente!");

      queryClient.invalidateQueries({ queryKey: ["fetch-addon-items"] });
    },

    onError: (error: any) => {
      const backendMessage = error?.response?.data?.message;
      toast.error(
        backendMessage || error.message || "Error al actualizar el artículo adicional."
      );
      console.error("Error al actualizar el artículo adicional:", error);
    },
  });
};
