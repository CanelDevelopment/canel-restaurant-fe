import {
  axios,
  type ErrorWithMessage,
  type WithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Define the shape of the data that you expect your API to return on success
interface CreatedOrderData {
  id: string;
}

interface OrderItem {
  productId: string;
  productName: string; // Make sure to send this from the client
  quantity: number;
  price: number;
}

// Define the shape of the form data being sent
interface OrderFormData {
  name: string;
  location: string;
  phoneNumber: number;
  rif: string;
  nearestLandmark: string;
  email: string;
  changeRequest: string;
  instruction?: string;
  items?: OrderItem[];
}

export const useCreatePOSOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<
    WithMessage & { data: { data: CreatedOrderData } }, // This tells TypeScript the shape of the successful response
    ErrorWithMessage,
    OrderFormData
  >({
    mutationFn: async (orderFormData) => {
      // This part is correct
      return await axios.post(`/order/create-pos-order`, orderFormData);
    },
    mutationKey: ["create pos order"],
    retry: false,

    // --- THIS IS THE CORRECTED PART ---
    onSuccess: () => {
      toast.success("Order added successfully!!");
      queryClient.invalidateQueries({ queryKey: ["all-orders"] });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });
};
