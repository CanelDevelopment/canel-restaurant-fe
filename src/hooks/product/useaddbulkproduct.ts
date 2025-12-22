import { axios } from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const addBulkProducts = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  const res = await axios.post(`/product/add-bulk-product`, formData);
  return res.data;
};

export const useBulkImportProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBulkProducts,
    onSuccess: () => {
      toast.success("¡Productos subidos correctamente!");
      queryClient.invalidateQueries({ queryKey: ["fetch-product"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "No se pudieron cargar los productos"
      );
    },
  });
};
