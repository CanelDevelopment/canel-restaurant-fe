import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface AssignBranchPayload {
  productId: string;
  branchId: string | null | string[];
}

interface AssignBranchResponse extends WithMessage {
  product: {
    updatedId: string;
    name: string;
    assignedBranchId: string | null;
  };
}

export const useAssignBranchToProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AssignBranchResponse,
    ErrorWithMessage,
    AssignBranchPayload
  >({
    mutationKey: ["assign-branch"],

    mutationFn: async ({ productId, branchId }) => {
      const payload = { branchId };
      return await axios.patch(`/product/assign-branch/${productId}`, payload);
    },

    onSuccess: (data) => {
      toast.success(data.message || "¡Sucursal asignada con éxito!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["branch-products"] });
    },

    onError: (error) => {
      toast.error(error?.response?.data.message || "¡Algo salió mal!");
    },

    retry: false,
  });
};
