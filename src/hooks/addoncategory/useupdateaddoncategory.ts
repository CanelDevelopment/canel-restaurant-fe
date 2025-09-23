import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Define the payload for updating an addon category
interface UpdateAddonCategoryPayload {
  id: string;
  name?: string;
  description?: string;
  visibility?: boolean;
}

export const useUpdateAddonCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, UpdateAddonCategoryPayload>(
    {
      mutationFn: async ({ id, ...payload }) => {
        const response = await axios.patch(
          `/addon-category/update-addon-category/${id}`,
          payload
        );
        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message || "Addon Category updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["items"] });
      },

      onError: (error: any) => {
        const backendMessage = error?.response?.data?.message;
        toast.error(
          backendMessage || error.message || "Failed to update addon category."
        );
        console.error("Failed to update addon category:", error);
      },
    }
  );
};
