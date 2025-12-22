import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteAddonitem = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, string>({
    mutationFn: async (id: string) => {
      return await axios.post(`/addon/delete-addonitem/${id}`);
    },
    mutationKey: ["delete addon item"],
    retry: false,
    onSuccess() {
      toast.success("¡Artículo adicional eliminado exitosamente!");
      queryClient.invalidateQueries({ queryKey: ["addon-item"] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "Algo salió mal");
    },
  });
};
