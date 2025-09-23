import { useQuery } from "@tanstack/react-query";
import { axios, type ErrorWithMessage } from "@/configs/axios.config";

export interface Rider {
  id: string;
  fullName: string;
  email: string;
}

interface FetchRidersResponse {
  message: string;
  data: Rider[];
}

export const useFetchRiders = () => {
  return useQuery<Rider[], ErrorWithMessage>({
    queryKey: ["riders"],
    queryFn: async () => {
      const response = await axios.get<FetchRidersResponse>(
        "/users/fetch-riders"
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 15,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
