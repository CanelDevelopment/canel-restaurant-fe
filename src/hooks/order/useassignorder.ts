import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface AssignRiderPayload {
  orderId: string;
  riderId: string;
}

export const useAssignRider = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, AssignRiderPayload>({
    mutationFn: async ({ orderId, riderId }) => {
      const response = await axios.patch(`/order/${orderId}/assign-rider`, {
        riderId,
      });
      return response.data;
    },

    onSuccess: (data, variables) => {
      toast.success(data.message || "¡Repartidor asignado con éxito!");

      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message || "Error al asignar repartidor.");
      console.error("Error assigning rider:", error);
    },
  });
};
