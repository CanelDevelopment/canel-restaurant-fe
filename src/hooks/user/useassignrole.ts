import {
  axios,
  type ErrorWithMessage,
  type WithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// interface AssignedPermissionsData {
//   userId: string;
//   assignedPermissions: string[];
// }

interface AssignPermissionsFormData {
  userId: string;
  permissions: string[];
}

export const useAssignPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, AssignPermissionsFormData>({
    mutationFn: async (formData) => {
      const { data } = await axios.put(
        `/users/staff/${formData.userId}/permissions`,
        { permissions: formData.permissions }
      );
      return data;
    },

    mutationKey: ["assign-permissions"],

    retry: false,

    onSuccess: (response) => {
      toast.success(response.message || "Permissions updated successfully!");

      queryClient.invalidateQueries({ queryKey: ["fetch-staff"] });
    },

    onError: (error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });
};
