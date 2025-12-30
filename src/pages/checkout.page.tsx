import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Image,
  Spinner,
  Center,
  Text,
  Skeleton,
} from "@chakra-ui/react";
import {
  CheckoutForm,
  type OrderForm,
} from "@/components/checkout/checkoutForm";
import { OrderSummary } from "@/components/checkout/orderSummary";
import { useForm, FormProvider } from "react-hook-form";
import { useCreateOrder } from "@/hooks/order/usecreateorder";
import { useFetchCart } from "@/hooks/cart/usefetchcart";
import { useFetchLogo } from "@/hooks/branding/usefetchbranding";
import { useAddCart } from "@/hooks/cart/useaddcart";
import { useFetchCurrentUser } from "@/hooks/user/usefetchuser";
import {
  useAddToCart,
  useCartStore,
  useClearCart,
  useRemoveFromCart,
  useUpdateQuantity,
} from "@/store/cartStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Checkout: React.FC = () => {
  const methods = useForm<OrderForm>();
  const { data: logoData, isLoading: isLogoLoading } = useFetchLogo();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const { data: currentUser } = useFetchCurrentUser();
  const { cart: localCart, totalQuantity } = useCartStore();

  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();
  const updateQuantity = useUpdateQuantity();
  const clearCart = useClearCart();

  const { mutateAsync: addToApiCart } = useAddCart();

  const syncStarted = useRef(false);

  const [isPreparingCart, setIsPreparingCart] = useState(true);

  useEffect(() => {
    if (!currentUser?.id || localCart.length === 0 || syncStarted.current) {
      if (!currentUser?.id || localCart.length === 0) {
        setIsPreparingCart(false);
      }
      return;
    }

    const beCartProductIds = cartData?.map((item) => item.product.id) || [];
    const itemsToSync = localCart.filter(
      (item) => !beCartProductIds.includes(item.id)
    );

    if (itemsToSync.length === 0) {
      setIsPreparingCart(false);
      return;
    }

    syncStarted.current = true;

    const syncLocalCartToServer = async () => {
      if (!cartData) return;

      const mergePromises = localCart.map((localItem) => {
        const payload = {
          productId: localItem.id,
          quantity: localItem.quantity,
          notes: localItem.instructions || "",
          addonItems:
            localItem.selectedAddons?.map((addon) => ({
              addonItemId: addon.addonItem.id,
              quantity: addon.quantity,
            })) || [],
        };

        return addToApiCart(payload);
      });

      try {
        await Promise.all(mergePromises);
        console.log("SUCCESS: Local cart merged to server.");
        clearCart();
      } catch (err) {
        console.error(err);
        toast.error("Could not merge local cart. Try again.");
      } finally {
        setIsPreparingCart(false);
      }
    };

    syncLocalCartToServer();
  }, [
    currentUser,
    localCart,
    addToApiCart,
    addToCart,
    clearCart,
    totalQuantity,
    removeFromCart,
    updateQuantity,
  ]);

  const { data: cartData, isLoading: isCartLoading, isError } = useFetchCart();

  useEffect(() => {
    if (localCart.length === 0 && !isCartLoading) {
      setIsPreparingCart(false);
    }
  }, [localCart, isCartLoading]);

  const onSubmit = (formValues: OrderForm) => {
    const cartId = cartData?.[0].cartId;

    if (!cartId) {
      console.error("Cart ID is not available. Cannot create order.");
      return;
    }

    const selectedArea = localStorage.getItem("selectedArea") || "";
    const branches = localStorage.getItem("selectedBranch") || "";
    const deliveryType = localStorage.getItem("deliveryType") || "";
    const fullAddress = `${formValues.location}, ${selectedArea}`.trim();
    const branchId = JSON.parse(branches).id;

    const formData = new FormData();

    formData.append("branchId", branchId);
    formData.append("type", deliveryType);
    formData.append("location", fullAddress);
    formData.append("cartId", cartId.toString());

    // normal form fields
    Object.entries(formValues).forEach(([key, value]) => {
      if (key !== "paymentSS") {
        formData.append(key, value as any);
      }
    });

    if (formValues.paymentSS && formValues.paymentSS.length > 0) {
      const file = formValues.paymentSS[0];
      formData.append("paymentSS", file);
    }

    createOrder(formData);
  };

  if (isCartLoading || isPreparingCart) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isError || !cartData || cartData.length === 0) {
    return (
      <Center h="100vh">
        <Text>Your cart is empty.</Text>
      </Center>
    );
  }

  return (
    <>
      <Link to={"/home"}>
        <Box p={6}>
          {isLogoLoading ? (
            <Skeleton h={"16"} />
          ) : (
            <Image
              loading="lazy"
              src={logoData?.logo || "/Logos/foterlogo.png"}
              maxW="100px"
            />
          )}
        </Box>
      </Link>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Flex direction={{ base: "column", md: "row" }} p={6} gap={6}>
            <CheckoutForm />

            <OrderSummary isSubmitting={isCreatingOrder} />
          </Flex>
        </form>
      </FormProvider>
    </>
  );
};

export default Checkout;
