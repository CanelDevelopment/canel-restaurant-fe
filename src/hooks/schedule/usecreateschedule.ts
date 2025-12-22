import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface ScheduleFormData {
  branchId: string;
  dayOfWeek: number;
  isActive: boolean;
  timeSlots: {
    openTime: string;
    closeTime: string;
  }[];
}

export const useAddSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<WithMessage, ErrorWithMessage, ScheduleFormData>({
    mutationFn: async (scheduleData) => {
      return await axios.post("/schedule/create-schedule", scheduleData);
    },
    mutationKey: ["create schedule"],
    retry: false,
    onSuccess() {
      toast.success("¡Horario creado con éxito!");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError() {
      toast.error("Error al crear el horario.");
    },
  });
};
