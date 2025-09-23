import { axios } from "@/configs/axios.config";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

// interface BroadcastPayload {
//   message: string;
//   phoneNumbers: string[];
// }

// interface SuccessResponse {
//   message: string;
//   totalAttempted: number;
//   successfulSends: number;
// }

// const sendBroadcast = async (
//   payload: BroadcastPayload
// ): Promise<SuccessResponse> => {
//   const { data } = await axios.post<SuccessResponse>("/broadcast/sms", payload);
//   return data;
// };

// export const useSendBroadcast = () => {
//   return useMutation({
//     mutationFn: sendBroadcast,
//     onSuccess: (data) => {
//       toast.success(data.message || "Broadcast sent successfully!");
//     },
//     onError: (error: any) => {
//       const errorMessage =
//         error?.response?.data?.error ||
//         error.message ||
//         "An unexpected error occurred.";
//       toast.error(errorMessage);
//     },
//   });
// };

// import { useMutation } from "@tanstack/react-query";
// import axios, { AxiosError } from "axios";
// import toast from "react-hot-toast";

// Type for the data our mutation function will receive from the component
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
      toast.success("Broadcast scheduled successfully!");
    },
    onError: (error) => {
      const errorMessage = error.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      console.error("Broadcast failed:", error?.message || error);
    },
  });
};
