import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  operationHours?: string;
  cityName: string;
  state?: string;
  status: string;
  areas?: string[];
  orderType: string;
  deliveryRates: { min: number; max: number; price: number }[];
}

interface BranchResponse extends WithMessage {
  id: string;
}

export const useAddBranch = () => {
  const queryClient = useQueryClient();

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
      toast.success("¡Sucursal agregada con éxito!");
      queryClient.invalidateQueries({ queryKey: ["fetch-branch"] });
    },
    onError() {
      toast.error("¡Algo salió mal!");
    },
  });
};
