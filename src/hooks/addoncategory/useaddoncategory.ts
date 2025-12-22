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
  status?: string;
  visibility?: boolean;
}

export const useAddonCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<WithMessage, ErrorWithMessage, CategoryFormData>({
    mutationFn: async (CategoryFormData) => {
      return await axios.post(`/addon-category/create-addon`, CategoryFormData);
    },
    mutationKey: ["create addon"],
    retry: false,
    onSuccess() {
      toast.success("¡Complemento agregado con éxito!");
      queryClient.invalidateQueries({ queryKey: ["addon-category"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data.message || "Algo salió mal");
    },
  });
};
