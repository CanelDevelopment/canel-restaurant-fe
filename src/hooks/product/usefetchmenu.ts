import { useQuery } from "@tanstack/react-query";
import { axios } from "@/configs/axios.config";

// type Category = {
//   id: string;
//   name: string;
//   description: string;
//   visibility: boolean;
// };

export const useFetchMenu = () => {
  return useQuery({
    queryKey: ["menu"],
    queryFn: async () =>
      (await axios.get("/product/categories-with-products")).data.data,
    staleTime: 1000 * 60 * 5,
  });
};
