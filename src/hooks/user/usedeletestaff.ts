import {
  axios,
  type ErrorWithMessage,
  type WithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface DeleteStaff {
  id: string;
}

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, DeleteStaff>({
    mutationFn: async ({ id }) => {
      console.log("id from hook", id);
      return await axios.delete(`/users/staff/${id}`);
    },

    mutationKey: ["delete-staff"],

    onSuccess: (data) => {
      toast.success(data.message || "¡Miembro del personal eliminado con éxito!");
      queryClient.invalidateQueries({ queryKey: ["fetch-staff"] });
    },

    onError: (error) => {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Error al eliminar al miembro del personal.";
      toast.error(errorMessage);
    },
  });
};
