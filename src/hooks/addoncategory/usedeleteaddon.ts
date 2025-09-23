import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteAddon = () => {
  return useMutation<WithMessage, ErrorWithMessage, any>({
    mutationFn: async (id: any) => {
      return await axios.post(`/addon-category/delete-addon/${id}`);
    },
    mutationKey: ["delete addon"],
    retry: false,
    onSuccess() {
      toast.success("Addon deleted successfully!!!");
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Something went wrong");
    },
  });
};
