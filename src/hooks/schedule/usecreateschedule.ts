import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Define the expected shape of your schedule data
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
      toast.success("Schedule created successfully!");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError() {
      toast.error("Failed to create schedule.");
    },
  });
};
