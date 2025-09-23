import { useQuery } from "@tanstack/react-query";
import { axios, type ErrorWithMessage } from "@/configs/axios.config";
import type { OrderDetails } from "../order/usefetchallorder";

export const useFetchRiderOrders = (riderId: string | null) => {
  return useQuery<OrderDetails[], ErrorWithMessage>({
    queryKey: ["fetchRiderOrders", riderId],

    queryFn: async () => {
      const { data } = await axios.get(`/order/${riderId}/orders`);
      return data.data;
    },

    enabled: !!riderId,

    staleTime: 1000 * 60,
  });
};
