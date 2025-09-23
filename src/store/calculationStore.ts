import { create } from "zustand";
import { type TOrderType } from "@/components/order/orderPayment";

interface AddonItem {
  id: string;
  name: string;
  price: number;
  discount?: number;
}

interface SelectedAddon {
  addonItem: AddonItem;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
}

export interface CalculationItem {
  product: Product;
  quantity: number;
  selectedAddons: SelectedAddon[];
}

interface CalculationState {
  items: CalculationItem[];
  orderType: "delivery" | "pickup";
  setItems: (items: CalculationItem[]) => void;
  setOrderType: (type: "delivery" | "pickup") => void;
}

const TAX_RATE = 0.1; // 10%
const SHIPPING_COST = 3.99;

export const calculateTotals = (
  items: CalculationItem[],
  orderType: TOrderType
) => {
  const totals = items.reduce(
    (acc, item) => {
      const productPrice = item.product.price || 0;
      const productQuantity = item.quantity || 0;
      const productDiscountPercent = item.product.discount || 0;
      const productSubtotal = productPrice * productQuantity;
      const productDiscount = (productSubtotal * productDiscountPercent) / 100;
      acc.subtotal += productSubtotal;
      acc.totalDiscount += productDiscount;

      // Addons calculation
      item.selectedAddons.forEach((addon) => {
        const addonPrice = addon.addonItem.price || 0;
        const addonQuantity = addon.quantity || 0;
        const addonDiscountPercent = addon.addonItem.discount || 0;
        const addonSubtotal = addonPrice * addonQuantity;
        const addonDiscount = (addonSubtotal * addonDiscountPercent) / 100;
        acc.subtotal += addonSubtotal;
        acc.totalDiscount += addonDiscount;
      });

      return acc;
    },
    { subtotal: 0, totalDiscount: 0 }
  );

  const taxableAmount = totals.subtotal - totals.totalDiscount;
  const tax = taxableAmount * TAX_RATE;
  const shippingCost = orderType === "delivery" ? SHIPPING_COST : 0;
  const finalTotal = taxableAmount + tax + shippingCost;

  return {
    subtotal: totals.subtotal,
    discount: totals.totalDiscount,
    tax,
    shippingCost,
    finalTotal,
    TAX_RATE,
    SHIPPING_COST,
  };
};

export const useCalculationStore = create<CalculationState>((set) => ({
  items: [],
  orderType: "pickup",
  setItems: (items) => set({ items }),
  setOrderType: (type) => set({ orderType: type }),
}));

export const usePriceCalculations = () => {
  const { items, orderType } = useCalculationStore();

  const totals = items.reduce(
    (acc, item) => {
      const productPrice = Number(item.product.price) || 0;
      console.log("Calculation", item.product.price);
      const productQuantity = item.quantity || 0;
      const productDiscountPercent = item.product.discount || 0;
      const productSubtotal = productPrice * productQuantity;
      const productDiscount = (productSubtotal * productDiscountPercent) / 100;
      acc.subtotal += productSubtotal;
      acc.totalDiscount += productDiscount;

      item.selectedAddons.forEach((addon) => {
        const addonPrice = addon.addonItem.price || 0;
        const addonQuantity = addon.quantity || 0;
        const addonDiscountPercent = addon.addonItem.discount || 0;
        const addonSubtotal = addonPrice * addonQuantity;
        const addonDiscount = (addonSubtotal * addonDiscountPercent) / 100;
        acc.subtotal += addonSubtotal;
        acc.totalDiscount += addonDiscount;
      });

      return acc;
    },
    { subtotal: 0, totalDiscount: 0 }
  );

  const taxableAmount = totals.subtotal - totals.totalDiscount;
  const tax = taxableAmount * TAX_RATE;
  const shippingCost = orderType === "delivery" ? SHIPPING_COST : 0;
  const finalTotal = taxableAmount + tax + shippingCost;
  console.log("totals", totals.subtotal);
  return {
    subtotal: totals.subtotal,
    discount: totals.totalDiscount,
    tax,
    shippingCost,
    finalTotal,
    TAX_RATE,
    SHIPPING_COST,
  };
};
