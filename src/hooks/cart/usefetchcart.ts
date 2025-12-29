import type { ErrorWithMessage } from "../../configs/axios.config";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/configs/axios.config";
import { type ApiCartItem } from "@/store/cartStore";

export const CART_QUERY_KEY = ["fetch-cart"];

export const useFetchCart = () => {
  const queryResult = useQuery<ApiCartItem[], ErrorWithMessage>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const response = await axios.get("/cart/fetch");

      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return queryResult;
};
