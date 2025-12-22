import { useEffect } from "react";
import { useFetchCart } from "@/hooks/cart/usefetchcart";
import { useAddCart } from "@/hooks/cart/useaddcart";
import { useCartStore } from "@/store/cartStore";
import { useFetchCurrentUser } from "@/hooks/user/usefetchuser";

export const useSyncCart = () => {
  const { data: currentUser } = useFetchCurrentUser();
  const { data: _beCart, refetch } = useFetchCart();
  const { cart: localCart, clearCart, setCart } = useCartStore.getState();
  const { mutateAsync: addToApiCart } = useAddCart();

  useEffect(() => {
    const sync = async () => {
      if (!currentUser?.id) return;

      try {
        const res = await refetch();
        const backendCart = res.data || [];

        if (!backendCart) {
          return;
        }

        if (backendCart.length > 0) {
          setCart(backendCart);
          return;
        }

        if (localCart.length > 0) {
          for (const item of localCart) {
            const payload = {
              productId: item.id,
              quantity: item.quantity,
              notes: item.instructions || "",
              addonItems:
                item.selectedAddons?.map((addon) => ({
                  addonItemId: addon.addonItem.id,
                  quantity: addon.quantity,
                })) || [],
            };
            await addToApiCart(payload);
          }

          const updatedRes = await refetch();
          if (updatedRes.data) {
            setCart(updatedRes.data);
          }

          clearCart();
        }
      } catch (err) {
        console.error("Cart sync failed:", err);
        // toast.error("Could not sync your cart. Try again.");
      }
    };

    sync();
  }, [currentUser?.id]);
};
