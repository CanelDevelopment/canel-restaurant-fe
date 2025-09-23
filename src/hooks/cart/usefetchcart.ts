import type { ErrorWithMessage } from "../../configs/axios.config";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/configs/axios.config";
import { useCartStore, type ApiCartItem } from "@/store/cartStore";
import { useEffect } from "react";

export const CART_QUERY_KEY = ["fetch-cart"];

export const useFetchCart = () => {
  const { setCart } = useCartStore((state) => state.actions);

  const queryResult = useQuery<ApiCartItem[], ErrorWithMessage>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const response = await axios.get("/cart/fetch");
      console.log("response", response.data.data);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (queryResult.isSuccess && queryResult.data) {
      console.log("queryResult.data", queryResult.data);
      setCart(queryResult.data);
    }
    if (queryResult.isError && queryResult.error) {
      console.error("Failed to fetch cart:", queryResult.error.message);
    }
  }, [
    queryResult.isSuccess,
    queryResult.isError,
    queryResult.data,
    queryResult.error,
    setCart,
  ]);

  return queryResult;
};
