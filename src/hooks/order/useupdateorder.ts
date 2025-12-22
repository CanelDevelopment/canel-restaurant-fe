import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdateOrderPayload {
  id: string;
  status?: "pending" | "confirmed" | "cancelado";
  paymentStatus?: "paid" | "unpaid" | "refunded";
  shippingAddress?: string;
  notes?: string;
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, UpdateOrderPayload>({
    mutationFn: async ({ id, ...payload }) => {

      const token = localStorage.getItem("bearer_token")

      const response = await axios.patch(`/order/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    },

    onSuccess: (data, variables) => {
      toast.success(data.message || "¡Pedido actualizado con éxito!");

      queryClient.invalidateQueries({ queryKey: ["all-orders"] });

      queryClient.invalidateQueries({ queryKey: ["all-orders", variables.id] });
    },

    onError: (error) => {
      toast.error(error.message || "Error al actualizar el pedido.");
      console.error("Error updating order:", error);
    },
  });
};
