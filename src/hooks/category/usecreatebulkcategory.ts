import { axios } from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// The function that performs the API call
const addBulkCategories = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`/category/add-bulk-category`, formData);
  return res.data;
};

export const useBulkImportCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBulkCategories,
    onSuccess: () => {
      toast.success("¡Categorías subidas correctamente!");

      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "No se pudieron cargar las categorías"
      );
    },
  });
};
