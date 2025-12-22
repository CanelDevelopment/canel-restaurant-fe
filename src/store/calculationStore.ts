import { create } from "zustand";
// import { useFetchSpecificBranch } from "@/hooks/branch/usefetchspecificbranch";
import type { TOrderType } from "@/components/order/orderPayment";

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

interface DiscountTier {
  minQty: number;
  discountAmount: number;
}

export interface VolumeDiscountRules {
  enabled: boolean;
  type: string;
  tiers: DiscountTier[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  categoryId?: string;
  volumeDiscountRules?: VolumeDiscountRules | null;
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
  setDeliveryCost: (cost: number) => void;
  deliveryCost: number;
}

export const useCalculationStore = create<CalculationState>((set) => ({
  items: [],
  orderType: "pickup",
  deliveryCost: 0,
  setItems: (items) => set({ items }),
  setOrderType: (type) => set({ orderType: type }),
  setDeliveryCost: (cost) => set({ deliveryCost: cost }),
}));

export const usePriceCalculations = () => {
  const { items, orderType, deliveryCost } = useCalculationStore();

  return calculateTotals(items, orderType, deliveryCost);
};

// plain function version
export const calculateTotals = (
  items: CalculationItem[],
  orderType: TOrderType,
  deliveryRate: number
) => {
  // Helpers to track category data across different items
  const categoryCounts: Record<string, number> = {};
  const categoryRules: Record<string, VolumeDiscountRules> = {};

  // -- PASS 1: Calculate Base Subtotals, Addons, Standard Discounts & Aggregate Category Data --
  let subtotal = 0;
  let totalDiscount = 0;

  // console.log("items", items);

  items.forEach((item) => {
    const productPrice = Number(item.product.price) || 0;
    const productQuantity = item.quantity || 0;
    const catId = item.product.categoryId;

    // 1. Track Category Counts & Rules for Pass 2
    if (catId) {
      categoryCounts[catId] = (categoryCounts[catId] || 0) + productQuantity;

      // Store the rules for this category if they exist and are enabled
      // We assume all items in the same category share the same rule object

      // console.log("item.product", item.product);
      if (item.product.volumeDiscountRules?.enabled && !categoryRules[catId]) {
        categoryRules[catId] = item.product.volumeDiscountRules;
      }
    }

    // 2. Item Subtotal
    const productSubtotal = productPrice * productQuantity;
    subtotal += productSubtotal;

    // 3. Standard Product Discount (% based usually)
    const productDiscountPercent = item.product.discount || 0;

    const standardDiscount = (productSubtotal * productDiscountPercent) / 100;

    totalDiscount += standardDiscount;

    // 4. Addons Calculation
    item.selectedAddons.forEach((addon) => {
      const addonPrice = addon.addonItem.price || 0;
      const addonQuantity = addon.quantity || 0;
      const addonSubtotal = addonPrice * addonQuantity;

      const addonDiscountPercent = addon.addonItem.discount || 0;
      const addonDiscount = (addonSubtotal * addonDiscountPercent) / 100;

      subtotal += addonSubtotal;
      totalDiscount += addonDiscount;
    });
  });

  // -- PASS 2: Calculate Volume Discounts Per Category --
  Object.keys(categoryCounts).forEach((catId) => {
    const totalQty = categoryCounts[catId];
    const rules = categoryRules[catId];

    if (rules && rules.enabled && rules.tiers?.length > 0) {
      // Logic for "fixed_amount_off" based on your JSON
      if (rules.type === "fixed_amount_off") {
        // Find the specific tier where Total Quantity >= Tier Minimum
        // We sort by minQty descending so we catch the highest tier first (e.g. check 3 before 2)
        const applicableTier = [...rules.tiers]
          .sort((a, b) => b.minQty - a.minQty)
          .find((tier) => totalQty >= tier.minQty);

        if (applicableTier) {
          // Add the fixed discount amount to the total discount
          // This applies ONCE for the whole set of items in this category
          totalDiscount += applicableTier.discountAmount;

          console.log(
            `Applied Category Discount for Cat ${catId}: -${applicableTier.discountAmount}`
          );
        }
      }
    }
  });

  // -- Final Totals --
  const taxableAmount = subtotal - totalDiscount;
  const shippingCost = orderType === "delivery" ? deliveryRate : 0;

  // Ensure we don't return a negative total
  const finalTotal = Math.max(0, taxableAmount + shippingCost);

  return {
    subtotal,
    discount: totalDiscount,
    shippingCost,
    finalTotal,
  };
};
