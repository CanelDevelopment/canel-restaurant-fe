import type { ErrorWithMessage } from "../../configs/axios.config";
import { useQuery } from "@tanstack/react-query";
import { axios, type WithMessage } from "@/configs/axios.config";

type City = {
  id: string;
  name: string;
};

// Custom hook
export const useFetchCities = () => {
  return useQuery<WithMessage, ErrorWithMessage, City[]>({
    queryKey: ["fetch-cities"],
    queryFn: async () => (await axios.get("/branch/cities")).data.data,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
