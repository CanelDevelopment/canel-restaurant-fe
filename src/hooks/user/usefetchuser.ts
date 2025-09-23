import { useQuery } from "@tanstack/react-query";
import { axios, type ErrorWithMessage } from "@/configs/axios.config";

export interface User {
  branchId: string | undefined;
  role: string;
  id: string;
  fullName: string;
  email: string;
  selectedCity: string;
  selectedArea: string;
  selectedBranch: string;
}

interface FetchUserResponse {
  message: string;
  data: User;
}

export const useFetchCurrentUser = () => {
  return useQuery<User, ErrorWithMessage>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = localStorage.getItem("bearer_token") ?? "";

      const response = await axios.get<FetchUserResponse>("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    },
    staleTime: 1000 * 60 * 15,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
