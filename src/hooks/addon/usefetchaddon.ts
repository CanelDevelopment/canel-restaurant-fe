import type { ErrorWithMessage } from "../../configs/axios.config";
import { useQuery } from "@tanstack/react-query";
import { axios, type WithMessage } from "@/configs/axios.config";

type AddonItemCategory = {
  id: string;
  name: string;
  image: string;
  description: string;
  visibility: boolean;
};

// Custom hook
export const useFetchAddon = () => {
  return useQuery<WithMessage, ErrorWithMessage, AddonItemCategory[]>({
    queryKey: ["addon-item"],
    queryFn: async () => (await axios.get("/addon/fetch-addonitem")).data.data,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
1;
