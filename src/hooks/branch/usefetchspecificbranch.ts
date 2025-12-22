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
  deliveryRates: { min: number; max: number; price: number }[];
  location: { lat: number; lng: number };
}

export const useFetchSpecificBranch = (id: string) => {
  return useQuery<WithMessage, ErrorWithMessage, Branch>({
    queryKey: ["fetch-specific-branch"],
    queryFn: async () =>
      (await axios.get(`/branch/fetch-branch/${id}`)).data.data,
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
