import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axios, type ErrorWithMessage } from '@/configs/axios.config';
import toast from 'react-hot-toast';

interface UpdateCartPayload {
  productId: string;
  quantity: number;
}

const updateCartItem = async (payload: UpdateCartPayload) => {
  const response = await axios.patch('/cart/update', payload);
  return response.data;
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem, 
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch-cart'] });
    },
    
    onError: (error: ErrorWithMessage) => {
      toast.error(error.message || "Failed to update item in cart.");
    },
  });
};