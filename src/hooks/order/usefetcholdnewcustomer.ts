import type { ErrorWithMessage } from "../../configs/axios.config";
import { useQuery } from "@tanstack/react-query";
import { axios, type WithMessage } from "@/configs/axios.config";

type NewVsRecurring = {
  total: number;
  newUsers: number;
  recurringUsers: number;
};

// Custom hook
export const useFetchNewVsRecurring = () => {
  return useQuery<WithMessage, ErrorWithMessage, NewVsRecurring>({
    queryKey: ["fetch-new-vs-recurring"],
    queryFn: async () => {
      const token = localStorage.getItem("bearer_token") ?? "";

      const response = await axios.get("/order/new-vs-recurring", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.data
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
