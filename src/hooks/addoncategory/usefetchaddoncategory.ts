import type { ErrorWithMessage } from "../../configs/axios.config";
import { useQuery } from "@tanstack/react-query";
import { axios, type WithMessage } from "@/configs/axios.config";

type AddonCategory = {
  id: string;
  name: string;
  description: string;
  visibility: boolean;
};

// Custom hook
export const useFetchAddonCategories = () => {
  return useQuery<WithMessage, ErrorWithMessage, AddonCategory[]>({
    queryKey: ["addon-category"],
    queryFn: async () =>
      (await axios.get("/addon-category/fetch-addon")).data.data,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
1;
