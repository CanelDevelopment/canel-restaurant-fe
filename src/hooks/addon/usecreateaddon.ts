import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAddAddonItem = () => {
  const queryClient = useQueryClient();
  return useMutation<WithMessage, ErrorWithMessage, FormData>({
    mutationFn: async (formData) => {
      console.log(formData);

      return (await axios.post(`/addon/create-addonitem`, formData)).data.data;
    },
    mutationKey: ["create addonitem"],
    retry: false,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["addon-item"] });
      toast.success("Addon Item added successfully!!!");
    },
    onError() {
      toast.error("Something went wrong");
    },
  });
};
