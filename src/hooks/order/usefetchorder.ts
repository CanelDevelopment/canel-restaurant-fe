import type { ErrorWithMessage } from "../../configs/axios.config";
import { useQuery } from "@tanstack/react-query";
import { axios, type WithMessage } from "@/configs/axios.config";

interface FullOrderDetails {
  orderItems: {
    id: string;
    productName: string;
    quantity: number;
    price: string;
    discount: number;
  }[];
  id: string;
  status: string;
  name: string;
  location: string;
  type: string;
  phoneNumber: string;
  createdAt: string;
}

// Custom hook
export const useFetchOrder = (id: string | undefined) => {
  return useQuery<WithMessage, ErrorWithMessage, FullOrderDetails>({
    queryKey: ["orders"],
    queryFn: async () => {

      const token = localStorage.getItem("bearer_token") ?? "";

      const response =  await axios.get(`/order/user-orders/${id}`, {
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
