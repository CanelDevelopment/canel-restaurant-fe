import type { ErrorWithMessage } from "../../configs/axios.config";
import { useQuery } from "@tanstack/react-query";
import { axios, type WithMessage } from "@/configs/axios.config";
import { type AddonItemData } from "@/pages/addonitem.page";

// Custom hook
export const useFetchAddon = () => {
  return useQuery<WithMessage, ErrorWithMessage, AddonItemData[]>({
    queryKey: ["addon-item"],
    queryFn: async () => (await axios.get("/addon/fetch-addonitem")).data.data,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
1;
