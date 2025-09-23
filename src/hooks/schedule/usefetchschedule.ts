import { axios, type ErrorWithMessage } from "@/configs/axios.config";
import { useQuery } from "@tanstack/react-query";

export interface Schedule {
  id: string;
  day: string;
  isActive: boolean;
  dayOfWeek: number;
  timeSlots: {
    id: string;
    openTime: string;
    closeTime: string;
  }[];
}

export const useFetchSchedules = (branchId: string | null) => {
  return useQuery<Schedule[], ErrorWithMessage>({
    queryKey: ["schedules", branchId],
    enabled: !!branchId,
    queryFn: async () => {
      const response = await axios.get(`/schedule/${branchId}`);
      console.log(response);
      return response.data.data || [];
    },
  });
};
