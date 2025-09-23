import { useQuery } from "@tanstack/react-query";
import { axios, type ErrorWithMessage } from "@/configs/axios.config";

export interface Rider {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
}

interface FetchRidersResponse {
  message: string;
  data: Rider[];
}

export const useFetchRidersByBranch = (branchId?: string) => {
  return useQuery<Rider[], ErrorWithMessage>({
    queryKey: ["riders", branchId],
    enabled: !!branchId,
    queryFn: async () => {
      const response = await axios.get<FetchRidersResponse>(
        `/users/riders/branch/${branchId}`
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
