import { axios } from "@/configs/axios.config";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface BroadcastPayload {
  message: string;
  phoneNumbers: string[];
}

interface ApiClient {
  name: string;
  phone: string;
}

interface ApiPayload {
  message: string;
  clients: ApiClient[];
}

const sendBroadcastFn = async (payload: BroadcastPayload) => {
  const transformedClients: ApiClient[] = payload.phoneNumbers.map(
    (phoneNumber) => ({
      name: "Customer",
      phone: phoneNumber,
    })
  );

  const apiPayload: ApiPayload = {
    message: payload.message,
    clients: transformedClients,
  };

  const { data } = await axios.post("/broadcast/sms", apiPayload);
  return data;
};

export const useSendBroadcast = () => {
  return useMutation({
    mutationFn: sendBroadcastFn,
    onSuccess: () => {
      toast.success("¡Transmisión programada con éxito!");
    },
    onError: (error) => {
      const errorMessage = error.message || "Ocurrió un error inesperado.";
      toast.error(errorMessage);
      console.error("Broadcast failed:", error?.message || error);
    },
  });
};
