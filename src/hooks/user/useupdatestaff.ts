// src/hooks/user/useUpdateStaff.ts

import { axios } from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

// Define the shape of the data the mutation will receive
interface UpdateStaffPayload {
  id: string;
  fullName: string;
  role: string;
  banned: boolean;
}

// The function that makes the API call
const updateStaffRequest = async ({ id, ...payload }: UpdateStaffPayload) => {
  const { data } = await axios.put(`/users/staff/${id}`, payload);
  return data;
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStaffRequest,
    onSuccess: (data) => {
      toast.success(data.message || "Staff updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["fetch-staff"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update staff member.";
      toast.error(errorMessage);
    },
  });
};
