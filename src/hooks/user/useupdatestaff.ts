import { axios } from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdateStaffPayload {
  id: string;
  fullName: string;
  role: string;
  banned: boolean;
}

const updateStaffRequest = async ({ id, ...payload }: UpdateStaffPayload) => {
  const { data } = await axios.put(`/users/staff/${id}`, payload);
  return data;
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStaffRequest,
    onSuccess: (data) => {
      toast.success(data.message || "¡Personal actualizado con éxito!");
      queryClient.invalidateQueries({ queryKey: ["fetch-staff"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "No se pudo actualizar al personal.";
      toast.error(errorMessage);
    },
  });
};
