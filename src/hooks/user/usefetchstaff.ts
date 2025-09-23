import { useQuery } from "@tanstack/react-query";
import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";

export type StaffMember = {
  name: string;
  email: string;
  role: string;
  status: string;
  id: string;
  banned: boolean;
};

export const useFetchStaff = (searchQuery: string) => {
  return useQuery<WithMessage, ErrorWithMessage, StaffMember[]>({
    queryKey: ["fetch-staff", searchQuery],

    queryFn: async ({ queryKey }) => {
      const [, search] = queryKey as [string, string];

      const { data } = await axios.get("/users/staff", {
        params: {
          search,
        },
      });
      console.log("Coming from hook:", data);
      return data.data;
    },

    // select: (response) => response.data,

    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
