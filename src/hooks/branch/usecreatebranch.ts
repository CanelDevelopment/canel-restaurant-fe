import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface BranchFormData {
  name: string;
  address: string;
  location: string;
  phoneNumber: number;
  email: string;
  openingTime: string;
  closingTime: string;
  manager: string;
  cityName: string;
  state?: string;
  status: string;
  areas?: string[];
}

interface BranchResponse extends WithMessage {
  id: string;
}

export const useAddBranch = () => {
  return useMutation<BranchResponse, ErrorWithMessage, BranchFormData>({
    mutationFn: async (BranchFormData) => {
      const response = await axios.post(
        `/branch/create-branch`,
        BranchFormData
      );
      return response.data;
    },
    mutationKey: ["create branch"],
    retry: false,
    onSuccess() {
      toast.success("Branch added successfully!!");
    },
    onError() {
      toast.error("Something went wrong!");
    },
  });
};
