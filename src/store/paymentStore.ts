import { create } from "zustand";

interface PaymentStore {
  selectedPayment: "cash" | "online" | "bolivars";
  conversionRate: number;
  setSelectedPayment: (payment: "cash" | "online" | "bolivars") => void;
  setConversionRate: (rate: number) => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  selectedPayment: "cash",
  conversionRate: 1,
  setSelectedPayment: (payment) =>
    set(() => ({ selectedPayment: payment })),
  setConversionRate: (rate) => set({ conversionRate: rate }),
}));
