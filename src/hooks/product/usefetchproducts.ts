import type { ErrorWithMessage } from "../../configs/axios.config";
import { useQuery } from "@tanstack/react-query";
import { axios, type WithMessage } from "@/configs/axios.config";

type Category = {
  id: string;
  name: string;
  description: string | null;
  visibility: boolean;
  createdAt: string;
  updatedAt: string;
};

type Products = {
  branchId: string[] | undefined;
  availability: any;
  discount: number;
  id: string;
  name: string;
  quantity: number;
  description: string;
  price: number;
  visibility: boolean;
  image: string;
  createdAt: string;
  category: Category | null;
  status: string;
};

// Custom hook
export const useFetchProducts = () => {
  return useQuery<WithMessage, ErrorWithMessage, Products[]>({
    queryKey: ["fetch-product"],
    queryFn: async () => (await axios.get("/product/product-fetch")).data.data,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
1;
