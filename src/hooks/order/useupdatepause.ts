import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface PausePayload {
  isPaused: boolean;
  reason?: string | null;
}

interface UpdateBranchStatusVars {
  branchId: string;
  payload: PausePayload;
}

export const useUpdateBranchPauseStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<WithMessage, ErrorWithMessage, UpdateBranchStatusVars>({
    mutationFn: async ({ branchId, payload }) => {
      const { data } = await axios.patch(
        `/order/pause/branch/${branchId}`,
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Branch status updated!");
      queryClient.invalidateQueries({ queryKey: ["fetch-branches"] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Something went wrong!";
      toast.error(message);
    },
  });
};

export const useUpdateGlobalPauseStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<WithMessage, ErrorWithMessage, PausePayload>({
    mutationFn: async (payload) => {
      const { data } = await axios.patch(`/order/pause/global`, payload);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Global status updated!");
      queryClient.invalidateQueries({ queryKey: ["fetch-branches"] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Something went wrong!";
      toast.error(message);
    },
  });
};
