import { useQuery } from "@tanstack/react-query";
import { axios, type ErrorWithMessage } from "@/configs/axios.config";
import type { TOrderType } from "@/components/order/orderPayment";

export interface OrderDetails {
  type: TOrderType;
  branchId: string;
  orderItems: {
    instructions: unknown;
    id: string;
    productName: string;
    quantity: number;
    price: number;
    discount: number;
    orderAddons?: {
      id: string;
      addonItem?: {
        id: string;
        name: string;
        price: number;
        discount?: number;
      };
      quantity: number;
      price: number;
    }[];
  }[];

  discount: string;

  userId: string;
  id: string;
  status: "accepté" | "pending" | "cancelado" | "delivered";
  name: string;
  location: string;
  phoneNumber: string;
  createdAt: string;
  platform?: string;
  instructions?: string;
  riderId?: string;
  acceptedAt: string;
  onlinePaymentProveImage: string;
  deliveredAt: string;
}

// Corrected Custom Hook
export const useFetchAllOrders = () => {
  const branchId =
    typeof window !== "undefined"
      ? localStorage.getItem("selectedBranchId")
      : null;

  return useQuery<OrderDetails[], ErrorWithMessage>({
    queryKey: ["all-orders", branchId],

    queryFn: async () => {
      const token = localStorage.getItem("bearer_token") ?? "";
      const response = await axios.get(`/order/fetch-order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("This is the response:", response.data.data);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: true, // Good for a live dashboard
  });
};
