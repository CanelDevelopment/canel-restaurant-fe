import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteAddon = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, string>({
    mutationFn: async (id: string) => {
      return await axios.post(`/addon-category/delete-addon/${id}`);
    },
    mutationKey: ["delete addon"],
    retry: false,
    onSuccess() {
      toast.success("¡Complemento eliminado con éxito!");
      queryClient.invalidateQueries({ queryKey: ["addon-category"] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Algo salió mal");
    },
  });
};
