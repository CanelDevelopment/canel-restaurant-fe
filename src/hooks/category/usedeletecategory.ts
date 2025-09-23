import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation } from "@tanstack/react-query";

export const useDeleteCategory = () => {
  return useMutation<WithMessage, ErrorWithMessage, any>({
    mutationFn: async (id: any) => {
      return await axios.post(`/category/delete-category/${id}`);
    },
    mutationKey: ["create delete"],
    retry: false,
  });
};
