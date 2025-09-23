import { CartItem } from "./../components/cart/cartItem";
import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  discount?: number;
  instructions?: string;
  addonItemIds?: string[];
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
}

interface CartStore {
  cart: CartItem[];
  totalQuantity: number;
  actions: {
    setCart: (items: ApiCartItem[]) => void;
    addToCart: (item: Omit<CartItem, "">) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
  };
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  totalQuantity: 0,
  actions: {
    setCart: (items) =>
      set(() => {
        const transformedCart: CartItem[] = items.map((item) => {
          const numericPrice =
            parseFloat(String(item.product.price).replace(/[^0-9.]/g, "")) || 0;
          return {
            id: item.product.id,
            name: item.product.name,
            price: numericPrice,
            image: item.product.image,
            quantity: item.quantity,
            discount: item.product.discount,
            addonItemIds: item.product.addonItemIds || [],
            selectedAddons: item.selectedAddons || [],
          };
        });

        const total = transformedCart.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        return {
          cart: transformedCart,
          totalQuantity: total,
        };
      }),

    addToCart: (item) =>
      set((state) => {
        if (item.isAddon && item.addonItemIds) {
          const parentItem = state.cart.find((i) =>
            i.addonItemIds?.includes(item.id)
          );

          if (parentItem) {
            const updatedCart = state.cart.map((i) => {
              if (i.id === parentItem.id) {
                // check karo addon already exist karta hai ya nahi
                const existingAddon = i.selectedAddons?.find(
                  (a) => a.addonItem.id === item.id
                );

                let updatedAddons;
                if (existingAddon) {
                  // quantity increase
                  updatedAddons = i.selectedAddons?.map((a) =>
                    a.addonItem.id === item.id
                      ? { ...a, quantity: a.quantity + 1 }
                      : a
                  );
                } else {
                  // naya addon push karo
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

            return {
              cart: updatedCart,
              totalQuantity: state.totalQuantity + 1,
            };
          }
        }

        // Agar addon nahi hai (normal product)
        const existingItem = state.cart.find((i) => i.id === item.id);
        const quantityToAdd = item.quantity;
        return {
          cart: existingItem
            ? state.cart.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              )
            : [...state.cart, { ...item, quantity: 1 }],
          totalQuantity: state.totalQuantity + quantityToAdd,
        };
      }),

    removeFromCart: (id) =>
      set((state) => ({
        // This logic is already correct for string IDs
        cart: state.cart.filter((item) => item.id !== id),
        totalQuantity:
          state.totalQuantity -
          (state.cart.find((i) => i.id === id)?.quantity || 0),
      })),

    updateQuantity: (id: string, quantity: number) =>
      set((state) => {
        // This comparison logic now correctly compares string to string
        const item = state.cart.find((i) => i.id === id);
        if (!item || quantity < 0) return state;

        if (quantity === 0) {
          return {
            cart: state.cart.filter((i) => i.id !== id),
            totalQuantity: state.totalQuantity - item.quantity,
          };
        }

        const quantityDiff = quantity - item.quantity;
        return {
          cart: state.cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
          totalQuantity: state.totalQuantity + quantityDiff,
        };
      }),

    clearCart: () => set({ cart: [], totalQuantity: 0 }),
  },
}));

// Export selectors for convenience (no changes needed here)
export const useCartItems = () => useCartStore((state) => state.cart);
export const useCartTotalQuantity = () =>
  useCartStore((state) => state.totalQuantity);
export const useCartActions = () => useCartStore((state) => state.actions);
