import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface CategoryFormData {
  name: string;
  description: string;
  visibility?: boolean;
}

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<WithMessage, ErrorWithMessage, CategoryFormData>({
    mutationFn: async (CategoryFormData) => {
      return await axios.post(`/category/create-category`, CategoryFormData);
    },
    mutationKey: ["create category"],
    retry: false,
    onSuccess() {
      toast.success("Category added successfully!!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data.message || "Something went wrong");
      console.error("Failed to add category:", error.message);
    },
  });
};
