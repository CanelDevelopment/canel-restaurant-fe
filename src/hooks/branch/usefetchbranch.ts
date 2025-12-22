import { useQuery } from "@tanstack/react-query";
import { axios, type WithMessage } from "@/configs/axios.config";
import type { ErrorWithMessage } from "@/configs/axios.config";

interface Branch {
  manager: any;
  id: string;
  serviceTypes: string[];
  name: string;
  city: {
    id: string;
    name: string;
  };
  areas: string[];
  orderType: "pickup" | "delivery" | "both";
  deliveryRates: { min: number; max: number; price: number }[];
  location: { lat: number; lng: number };
  address: string;
}

export const useFetchBranch = () => {
  return useQuery<WithMessage, ErrorWithMessage, Branch[]>({
    queryKey: ["fetch-branch"],
    queryFn: async () =>
      (await axios.get("/branch/fetch-all-branch")).data.data,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
