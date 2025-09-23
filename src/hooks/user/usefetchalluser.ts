import { useQuery } from "@tanstack/react-query";
import { axios, type ErrorWithMessage } from "@/configs/axios.config";

export interface User {
  branchId: string | undefined;
  role: string;
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  phoneNumber?: string;
}

interface FetchAllUsersResponse {
  message: string;
  data: User[];
}

export const useFetchAllUsers = () => {
  return useQuery<User[], ErrorWithMessage>({
    queryKey: ["all-users"],
    queryFn: async () => {
      const response = await axios.get<FetchAllUsersResponse>(
        "/users/all-users"
      );

      return response.data.data;
    },
    staleTime: 1000 * 60 * 15,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
