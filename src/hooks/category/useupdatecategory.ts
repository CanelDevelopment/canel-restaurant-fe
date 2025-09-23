import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdateCategoryPayload {
  id: string;
  name?: string;
  description?: string;
  visibility?: boolean;
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, UpdateCategoryPayload>({
    mutationFn: async ({ id, ...payload }) => {
      const response = await axios.patch(
        `/category/update-category/${id}`,
        payload
      );
      return response.data;
    },

    // This function runs when the mutation is successful
    onSuccess: (data) => {
      toast.success(data.message || "Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["fetch-categories"] });
    },

    // This function runs if the mutation fails
    onError: (error) => {
      toast.error(
        error?.response?.data.message || "Failed to update category."
      );
      console.error(
        "Failed to update category:",
        error?.response?.data.message
      );
    },
  });
};
