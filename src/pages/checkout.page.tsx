import React from "react";
import { Box, Flex, Image, Spinner, Center, Text } from "@chakra-ui/react";
import {
  CheckoutForm,
  type OrderForm,
} from "@/components/checkout/checkoutForm";
import { OrderSummary } from "@/components/checkout/orderSummary";
import { useForm, FormProvider } from "react-hook-form";
import { useCreateOrder } from "@/hooks/order/usecreateorder";
import { useFetchCart } from "@/hooks/cart/usefetchcart";
import { useFetchLogo } from "@/hooks/branding/usefetchbranding";

const Checkout: React.FC = () => {
  const methods = useForm<OrderForm>();
  const { data: logoData, isLoading: isLogoLoading } = useFetchLogo();

  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  const { data: cartData, isLoading: isCartLoading } = useFetchCart();

  const onSubmit = (formValues: OrderForm) => {
    const cartId = cartData?.[0].cartId;

    if (!cartId) {
      console.error("Cart ID is not available. Cannot create order.");
      return;
    }

    const selectedArea = localStorage.getItem("selectedArea") || "";
    const branchId = localStorage.getItem("selectedBranch") || "";
    const deliveryType = localStorage.getItem("deliveryType") || "";
    const fullAddress = `${formValues.location}, ${selectedArea}`.trim();

    const orderPayload = {
      ...formValues,
      branchId,
      type: deliveryType,
      location: fullAddress,
    };

    console.log("Submitting order with form data:", orderPayload);
    createOrder({ ...orderPayload, cartId });
  };

  // --- UI LOGIC ---
  if (isCartLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Handle case where cart fetch fails or cart is empty
  if (!cartData?.length) {
    return (
      <Center h="100vh">
        <Text>Could not load your cart. Please try again.</Text>
      </Center>
    );
  }
  console.log("This is the cart data:", cartData);
  return (
    <>
      <Box p={6}>
        {isLogoLoading ? (
          <Spinner />
        ) : (
          <Image
            loading="lazy"
            src={logoData?.logo || "/Logos/foterlogo.png"}
            maxW="100px"
          />
        )}
      </Box>

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
