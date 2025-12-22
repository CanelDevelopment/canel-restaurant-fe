import { axios } from "@/configs/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const addBulkAddonItem = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`/addon/add-bulk`, formData);
  return res.data;
};

export const useBulkImportAddonItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBulkAddonItem,
    onSuccess: () => {
      toast.success("¡Items de complemento subidos correctamente!");
      queryClient.invalidateQueries({ queryKey: ["addon-item"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "No se pudieron cargar los items de complemento"
      );
    },
  });
};
