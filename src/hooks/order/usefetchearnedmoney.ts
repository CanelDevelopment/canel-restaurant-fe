import type { ErrorWithMessage } from "../../configs/axios.config";
import { useQuery } from "@tanstack/react-query";
import { axios, type WithMessage } from "@/configs/axios.config";

interface EarningDetails {
deliveredOrdersCount: number
riderId: string 
riderName: string;
totalEarned: number
}

export const useFetchEarnedMoney = (riderId: string | null) => {
  return useQuery<WithMessage, ErrorWithMessage,EarningDetails>({
    queryKey: ["earned-money", riderId],
    queryFn: async () => {

      const token = localStorage.getItem("bearer_token") ?? "";

      const response =  await axios.get(`/order/fetch-earned-money/${riderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log("From hook", response)
      return response.data.data
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
