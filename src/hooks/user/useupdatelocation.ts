import {
  axios,
  type ErrorWithMessage,
  type WithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdateLocationFormData {
  city: string;
  branch: string;
  deliveryType: string;
}

interface UpdatedLocationData {
  updatedId: string;
  city: string | null;
  branch: string | null;
  deliveryType: string | null;
}

export const useUpdateUserLocation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    WithMessage & { data: UpdatedLocationData },
    ErrorWithMessage,
    UpdateLocationFormData
  >({
    mutationFn: async (locationData) => {
      return await axios.put(`/users/update-location`, locationData);
    },
    mutationKey: ["updateUserLocation"],
    retry: false,
    onSuccess: (response) => {
      toast.success(response.message || "¡Ubicación actualizada con éxito!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data.message || "¡Algo salió mal!");
    },
  });
};
