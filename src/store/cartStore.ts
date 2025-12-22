import { CartItem } from "./../components/cart/cartItem";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useCalculationStore } from "./calculationStore";

interface DiscountTier {
  minQty: number;
  discountAmount: number;
  maxQty?: number;
}
interface VolumeDiscountRules {
  enabled: boolean;
  type: string;
  tiers: DiscountTier[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  discount?: number;
  instructions?: string;
  addonItemIds?: string[] | null;
  variantName?: string;
  variantPrice?: number;
  isVariant?: boolean;
  isAddon?: boolean;
  selectedAddons?: {
    quantity: number;
    addonItem: {
      id: string;
      name: string;
      price: number;
      image: string;
    };
  }[];

  categoryId?: string;
  volumeDiscountRules?: VolumeDiscountRules | null;
}

export interface ApiCartItem {
  id: string;
  quantity: number;
  cartId: string;
  instructions?: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    discount?: number;
    addonItemIds?: string[];
    categoryId?: string;
    volumeDiscountRules?: VolumeDiscountRules | null;
    category?: {
      id: string;
      volumeDiscountRules: VolumeDiscountRules | null;
    };
  };
  selectedAddons?: {
    quantity: number;
    addonItem: {
      id: string;
      name: string;
      price: number;
      image: string;
    };
  }[];
  variantName: string;
  variantPrice: number;
}

// interface CartStore {
//   cart: CartItem[];
//   totalQuantity: number;
//   actions: {
//     setCart: (items: ApiCartItem[]) => void;
//     addToCart: (item: Omit<CartItem, "">) => void;
//     removeFromCart: (id: string) => void;
//     updateQuantity: (id: string, quantity: number) => void;
//     clearCart: () => void;
//   };
// }

interface CartState {
  cart: CartItem[];
  totalQuantity: number;
}

// This interface holds only the functions.
interface CartActions {
  setCart: (items: any[]) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

type CartStore = CartState & CartActions;

export const syncCartToCalculation = (cart: any[]) => {
  const setItems = useCalculationStore.getState().setItems;

  const mappedItems = cart.map((item) => ({
    product: {
      id: item.id,
      name: item.name,
      price: item.price,
      discount: item.discount,
      isVariant: item.isVariant,
      categoryId: item.categoryId,
      volumeDiscountRules: item.volumeDiscountRules,
    },
    quantity: item.quantity,
    selectedAddons: item.selectedAddons || [],
  }));

  setItems(mappedItems);
};

export const useCartStore = create(
  persist<CartStore, [], [], CartState>(
    (set) => ({
      cart: [],
      totalQuantity: 0,

      setCart: (items) =>
        set(() => {
          const transformedCart: CartItem[] = items.map((item) => {
            const product = item.product || item;

            const numericPrice =
              item.variantPrice && item.variantPrice > 0
                ? item.variantPrice
                : parseFloat(
                    String(item.product.price).replace(/[^0-9.]/g, "")
                  ) || 0;

            const categoryId = product.categoryId || product.category?.id;
            const volumeDiscountRules =
              product.volumeDiscountRules ||
              product.category?.volumeDiscountRules;

            return {
              id: item.product.id,
              name: item.product.name,
              price: numericPrice,
              image: item.product.image,
              quantity: item.quantity,
              discount: item.product.discount,
              addonItemIds: item.product.addonItemIds || [],
              selectedAddons: item.selectedAddons || [],
              variantName: item.variantName,
              variantPrice: item.variantPrice,

              isVariant: !!item.variantName,
              categoryId,
              volumeDiscountRules,
            };
          });

          const total = transformedCart.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          useCalculationStore.getState().setItems(
            transformedCart.map((item) => ({
              product: {
                id: item.id,
                name: item.name,
                price: item.price,
                discount: item.discount,
                categoryId: item.categoryId,
                volumeDiscountRules: item.volumeDiscountRules,
              },
              quantity: item.quantity,
              selectedAddons: item.selectedAddons || [],
            }))
          );

          return {
            cart: transformedCart,
            totalQuantity: total,
          };
        }),

      addToCart: (item) =>
        set((state) => {
          let newCart: CartItem[];

          if (item.isAddon && item.addonItemIds) {
            const parentItem = state.cart.find((i) =>
              i.addonItemIds?.includes(item.id)
            );

            if (parentItem) {
              newCart = state.cart.map((i) => {
                if (i.id === parentItem.id) {
                  const existingAddon = i.selectedAddons?.find(
                    (a) => a.addonItem.id === item.id
                  );

                  let updatedAddons;
                  if (existingAddon) {
                    updatedAddons = i.selectedAddons?.map((a) =>
                      a.addonItem.id === item.id
                        ? { ...a, quantity: a.quantity + 1 }
                        : a
                    );
                  } else {
                    updatedAddons = [
                      ...(i.selectedAddons || []),
                      {
                        quantity: 1,
                        addonItem: {
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                        },
                      },
                    ];
                  }

                  return { ...i, selectedAddons: updatedAddons };
                }
                return i;
              });

              const totalQuantity = state.totalQuantity + 1;
              syncCartToCalculation(newCart);
              return { cart: newCart, totalQuantity };
            }
          }

          const existingItem = state.cart.find((i) => i.id === item.id);
          const quantityToAdd = item.quantity;

          if (existingItem) {
            newCart = state.cart.map((i) =>
              i.id === item.id
                ? { ...i, ...item, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            newCart = [...state.cart, item];
          }

          const totalQuantity = state.totalQuantity + quantityToAdd;
          syncCartToCalculation(newCart);

          return { cart: newCart, totalQuantity };
        }),

      updateQuantity: (id: string, quantity: number) =>
        set((state) => {
          const item = state.cart.find((i) => i.id === id);
          if (!item || quantity < 0) return state;

          let newCart: CartItem[];
          let totalQuantity: number;

          if (quantity === 0) {
            newCart = state.cart.filter((i) => i.id !== id);
            totalQuantity = state.totalQuantity - item.quantity;
          } else {
            const quantityDiff = quantity - item.quantity;
            newCart = state.cart.map((i) =>
              i.id === id ? { ...i, quantity } : i
            );
            totalQuantity = state.totalQuantity + quantityDiff;
          }

          syncCartToCalculation(newCart);
          return { cart: newCart, totalQuantity };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          // This logic is already correct for string IDs
          cart: state.cart.filter((item) => item.id !== id),
          totalQuantity:
            state.totalQuantity -
            (state.cart.find((i) => i.id === id)?.quantity || 0),
        })),

      clearCart: () => set({ cart: [], totalQuantity: 0 }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        totalQuantity: state.totalQuantity,
      }),
    }
  )
);

// ---- Values ----
export const useCartItems = () => useCartStore((state) => state.cart);
export const useCartTotalQuantity = () =>
  useCartStore((state) => state.totalQuantity);

// ---- Actions ----
export const useSetCart = () => useCartStore((state) => state.setCart);
export const useAddToCart = () => useCartStore((state) => state.addToCart);
export const useRemoveFromCart = () =>
  useCartStore((state) => state.removeFromCart);
export const useUpdateQuantity = () =>
  useCartStore((state) => state.updateQuantity);
export const useClearCart = () => useCartStore((state) => state.clearCart);
