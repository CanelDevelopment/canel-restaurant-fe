// src/hooks/addon/useFetchGroupedAddons.ts

import { useQuery } from "@tanstack/react-query";
import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";

interface Item {
  id: string;
  name: string;
  price: number;
  status?: boolean;
  image: string;
  discount?: number;
}

interface GroupedAddon {
  addonId: string;
  addonName: string;
  items: Item[];
}

export const useFetchGroupedAddons = () => {
  return useQuery<WithMessage, ErrorWithMessage, GroupedAddon[]>({
    // A unique key for this query
    queryKey: ["fetch-grouped-addons"],
    // The function that performs the API call
    queryFn: async () => {
      const response = await axios.get("/addon-category/fetch-grouped-addons");
      return response.data.data;
    },
    // Cache the data for 5 minutes
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
