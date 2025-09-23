import {
  axios,
  type ErrorWithMessage,
  type WithMessage,
} from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Define the shape of the data that you expect your API to return on success
interface CreatedOrderData {
  id: string;
}

interface OrderItem {
  productId: string;
  productName: string; // Make sure to send this from the client
  quantity: number;
  price: string;
  instructions?: string;
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
  cartId?: string;
  items?: OrderItem[];
  type: string;
  branchId: string;
}

export const useCreateOrder = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<
    WithMessage & { data: { data: CreatedOrderData } },
    ErrorWithMessage,
    OrderFormData
  >({
    mutationFn: async (orderFormData) => {
      return await axios.post(`/order/create-order`, orderFormData);
    },
    mutationKey: ["create order"],
    retry: false,

    onSuccess: (response) => {
      const newOrder = response.data.data;

      toast.success("Order added successfully!!");

      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["fetch-cart"] });

      navigate(`/place-order/${newOrder.id}`);
    },
    onError: (error) => {
      toast.error(error?.response?.data.message || "Something went wrong!");
    },
  });
};
