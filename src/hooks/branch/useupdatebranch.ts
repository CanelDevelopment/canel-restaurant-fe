import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdateBranchPayload {
  id: string;
  name?: string;
  address?: string;
  cityId?: string;
  manager?: string;
  status?: boolean;
  operatingHours?: string;
  phoneNumber?: string;
  areas?: string[];
  location?: string;
  deliveryRates?: { min: number; max: number; price: number }[];
  orderType: string;
}

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, UpdateBranchPayload>({
    mutationFn: async ({ id, ...payload }) => {
      const response = await axios.patch(
        `/branch/update-branch/${id}`,
        payload
      );
      return response.data;
    },

    // On success, provide user feedback and refetch the data.
    onSuccess: (data) => {
      toast.success(data.message || "¡Sucursal actualizada con éxito!");
      queryClient.invalidateQueries({ queryKey: ["fetch-branch"] });
    },

    // On error, provide user feedback.
    onError: (error) => {
      toast.error(
        error.response?.data.message || "Error al actualizar la sucursal."
      );
      console.error("Error updating branch:", error);
    },
  });
};
