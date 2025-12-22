import type { ErrorWithMessage } from "../../configs/axios.config";
import { useQuery } from "@tanstack/react-query";
import { axios, type WithMessage } from "@/configs/axios.config";

// Define the Rules Structure
interface VolumeDiscountRules {
  enabled: boolean;
  type: string;
  tiers: { minQty: number; discountAmount: number }[];
}

interface ApiBranch {
  id: string;
  name: string;
  address: string;
  location: string;
  phoneNumber: string;
  deliveryRates?: any;
}

interface ApiProduct {
  id: string;
  name: string;
  image: string;
  price: string;
  description?: string;
  categoryId?: string;
  category?: {
    id: string;
    volumeDiscountRules?: VolumeDiscountRules | null;
  };
}

interface ApiAddonItem {
  id: string;
  name: string;
  price: number;
}

interface ApiOrderAddon {
  quantity: number;
  addonItem: ApiAddonItem;
}

interface ApiOrderItem {
  id: string;
  quantity: number;
  price: number;
  discount: number;
  instructions: string;
  productName: string;
  product: ApiProduct;
  orderAddons: ApiOrderAddon[];
}

export interface FullOrderDetails {
  id: string;
  status: string;
  type: "delivery" | "pickup";
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phoneNumber: string;
  userId: string;
  location: string;
  nearestLandmark: string;
  branchId: string;
  branch: ApiBranch;
  tip: string;
  changeRequest: string;
  rif: string;
  shippingFee?: number;
  orderItems: ApiOrderItem[];
}

// Custom hook
export const useFetchOrder = (id: string | undefined) => {
  return useQuery<WithMessage, ErrorWithMessage, FullOrderDetails>({
    queryKey: ["orders"],
    queryFn: async () => {
      const token = localStorage.getItem("bearer_token") ?? "";

      const response = await axios.get(`/order/user-orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
