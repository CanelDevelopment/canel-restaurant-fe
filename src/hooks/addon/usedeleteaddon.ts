import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteAddonitem = () => {
  return useMutation<WithMessage, ErrorWithMessage, any>({
    mutationFn: async (id: any) => {
      return await axios.post(`/addon/delete-addonitem/${id}`);
    },
    mutationKey: ["delete addon item"],
    retry: false,
    onSuccess() {
      toast.success("Addon item deleted successfully!!!");
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Something went wrong");
    },
  });
};
