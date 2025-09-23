import { useQuery } from "@tanstack/react-query";
import { axios } from "@/configs/axios.config";

export type RiderTipDetails = {
  rider: {
    id: string;
    fullName: string;
    email: string;
  };
  tippedOrders: Array<{
    orderId: string;
    tipAmount: string;
    orderDate: Date;
  }>;
  totalTipAmount: string;
};

export const useFetchRiderTips = (riderId: string | undefined) => {
  return useQuery<RiderTipDetails, Error>({
    queryKey: ["riderTips", riderId],
    queryFn: async () => {
      if (!riderId) {
        throw new Error("Rider ID is required to fetch tips.");
      }
      const response = await axios.get(`/users/rider-tips?riderId=${riderId}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch rider tips.");
      }
      const data = response.data;
      return data.data as RiderTipDetails;
    },
    enabled: !!riderId,
    staleTime: 5 * 60 * 1000,
  });
};
