import {
  axios,
  type WithMessage,
  type ErrorWithMessage,
} from "@/configs/axios.config";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdateBrandingPayload {
  logo?: File;
  banner?: File;
  name?: string;
  email?: string;
  phoneNumber?: string;
  instagram?: string;
  facebook?: string;
  mainSection?: File;
}

export const useAddBranding = () => {
  return useMutation<WithMessage, ErrorWithMessage, UpdateBrandingPayload>({
    mutationFn: async (payload) => {
      const formData = new FormData();

      if (payload.logo) formData.append("logo", payload.logo);
      if (payload.banner) formData.append("banner", payload.banner);
      if (payload.name) formData.append("name", payload.name);
      if (payload.email) formData.append("email", payload.email);
      if (payload.phoneNumber)
        formData.append("phoneNumber", payload.phoneNumber);
      if (payload.instagram) formData.append("instagram", payload.instagram);
      if (payload.facebook) formData.append("facebook", payload.facebook);
      if (payload.mainSection)
        formData.append("mainSection", payload.mainSection);

      const response = await axios.post(`/branding/create-branding`, formData);
      return response.data;
    },
    mutationKey: ["create-branding"],
    onSuccess: (data) => {
      toast.success("¡Branding actualizado con éxito!");
      console.log("Server response:", data.message);
    },
    onError: (error) => {
      toast.error(
        error.response?.data.message || "Error al actualizar el branding."
      );
      console.error("Failed to update branding:", error.message);
    },
  });
};
