import { axios } from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const addBulkAddonCategories = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  // The API endpoint now points to the addon category controller
  const res = await axios.post(`/addon-category/add-bulk`, formData);
  return res.data;
};

export const useBulkImportAddonCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBulkAddonCategories,
    onSuccess: () => {
      toast.success("¡Categorías de complementos subidas correctamente!");

      // Invalidate the query that fetches the addon category list
      queryClient.invalidateQueries({ queryKey: ["fetch-addon-categories"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "No se pudieron cargar las categorías de complementos"
      );
    },
  });
};
