import type { ErrorWithMessage } from "../../configs/axios.config";
import { useQuery } from "@tanstack/react-query";
import { axios, type WithMessage } from "@/configs/axios.config";

type Category = {
  id: string;
  name: string;
  description: string;
  visibility: boolean;
  createdAt: string;
};

// Custom hook
export const useFetchCategories = () => {
  return useQuery<WithMessage, ErrorWithMessage, Category[]>({
    queryKey: ["categories"],
    queryFn: async () =>
      (await axios.get("/category/fetch-category")).data.data,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
