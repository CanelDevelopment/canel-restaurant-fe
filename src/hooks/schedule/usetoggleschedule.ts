import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  axios,
  type ErrorWithMessage,
  type WithMessage,
} from "@/configs/axios.config";
import toast from "react-hot-toast";

interface ToggleSchedulePayload {
  branchId: string;
  dayOfWeek: number;
  isActive: boolean;
}

export const useToggleSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, ToggleSchedulePayload>({
    mutationFn: async (payload: ToggleSchedulePayload) => {
      const response = await axios.patch(`/schedule/toggle`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "¡Horario actualizado!");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar el horario.");
    },
  });
};
