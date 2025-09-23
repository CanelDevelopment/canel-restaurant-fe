import { useQuery } from "@tanstack/react-query";
import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";

export interface RolePermission {
  id: string;
  role: string;
  branch: string;
  permissions: number;
}

type FetchRolePermissionsResponse = WithMessage & {
  data: RolePermission[];
};

export const useFetchRolePermissions = () => {
  return useQuery<RolePermission[], ErrorWithMessage>({
    queryKey: ["role-permissions"],
    queryFn: async () => {
      const { data } = await axios.get<FetchRolePermissionsResponse>(
        "/users/roles-permissions"
      );
      return data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
