import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<WithMessage, ErrorWithMessage, string>({
    mutationFn: async (id: string) => {
      return await axios.post(`/category/delete-category/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    mutationKey: ["create delete"],
    retry: false,
  });
};
