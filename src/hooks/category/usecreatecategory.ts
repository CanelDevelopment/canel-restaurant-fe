import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface DiscountTier {
  minQty: number;
  discountAmount: number;
}

interface VolumeDiscountRules {
  enabled: boolean;
  type: string;
  tiers: DiscountTier[];
}

interface CategoryFormData {
  name: string;
  description: string;
  visibility?: boolean;
  volumeDiscountRules?: VolumeDiscountRules | null;
}

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<WithMessage, ErrorWithMessage, CategoryFormData>({
    mutationFn: async (CategoryFormData) => {
      return await axios.post(`/category/create-category`, CategoryFormData);
    },
    mutationKey: ["create category"],
    retry: false,
    onSuccess() {
      toast.success("¡Categoría agregada con éxito!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data.message || "Algo salió mal");
      console.error("Failed to add category:", error.message);
    },
  });
};
