// src/hooks/branch/useDeleteBranch.ts

import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type BranchId = string;

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, BranchId>({
    mutationFn: async (id) => {
      const response = await axios.delete(`/branch/delete-branch/${id}`);
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "¡Sucursal eliminada con éxito!");
      queryClient.invalidateQueries({ queryKey: ["fetch-branch"] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message || "Error al eliminar la sucursal.");
      console.error("Error deleting branch:", error);
    },
  });
};
