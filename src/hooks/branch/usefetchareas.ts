import {
  axios,
  type ErrorWithMessage,
  // type WithMessage,
} from "@/configs/axios.config";
import { useQuery } from "@tanstack/react-query";

// const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// interface FreeAreasResponse {
//   message: string;
//   data: string[];
// }

export const useFreeAreas = (cityName: string | null | undefined) => {
  return useQuery<string[], ErrorWithMessage>({
    queryKey: ["areas-free", cityName],
    enabled: Boolean(cityName),
    queryFn: async () => {
      return (await axios.get(`/branch/areas/${cityName}`)).data.data;
      // const data = await res.json();
      // console.log(data);
      // return data.map((entry: { display_name: any }) => entry.display_name);
    },
    staleTime: 1000 * 60 * 5,
  });
};
