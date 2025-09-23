import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Separator,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useFetchCart } from "@/hooks/cart/usefetchcart";
import { useFetchGroupedAddons } from "@/hooks/addon/usefetchgroupedaddon";
import { CartItem } from "./cartItem";
import { FrequentOrder } from "./frequentOrder";
import { CartSummary } from "./cartSummary";
import { SelectLocation } from "./SelectLocation";
import OrderDeliveryInfo from "./orderdeliverytime";
import { useCalculationStore } from "@/store/calculationStore";
import { useFetchCurrentUser } from "@/hooks/user/usefetchuser";
import { LoginPromptModal } from "./logininvitationmodal";

interface Addon {
  addonId: string;
  addonName: string;
  items: {
    id: string;
    name: string;
    price: number;
    image: string;
    discount?: number;
    productId: string;
    quantity: number;
  }[];
}

export const Cart: React.FC = () => {
  const { cart } = useCartStore();
  const { data: currentUser, isLoading: isUserLoading } = useFetchCurrentUser();
  const { isLoading: isCartLoading } = useFetchCart();
  const { data: allAddons, isLoading: addonsLoading } = useFetchGroupedAddons();

  const orderType = useCalculationStore((state) => state.orderType);
  const setOrderType = useCalculationStore((state) => state.setOrderType);

  const selectedArea = localStorage.getItem("selectedArea");
  const city = localStorage.getItem("selectedCity") || "";

  useEffect(() => {
    const deliveryType = localStorage.getItem("deliveryType");
    if (deliveryType === "delivery") {
      setOrderType("delivery");
    } else {
      setOrderType("pickup");
    }
  }, [setOrderType]);

  const initialDeliveryType = localStorage.getItem("deliveryType");

  const [inCartDeliveryType, _setInCartDeliveryType] = useState(
    initialDeliveryType || "pickup"
  );

  const handleSetDeliveryType = (type: "pickup" | "delivery") => {
    setOrderType(type);
    localStorage.setItem("deliveryType", type);
    localStorage.setItem("selectedFromCart", "true");

    if (type === "pickup") {
      localStorage.removeItem("selectedArea");
    }
  };

  const relevantAddons = useMemo<Addon[]>(() => {
    if (!allAddons || !cart) return [];

    const cartAddonMap = new Map<string, string>();

    cart.forEach((product) => {
      product.addonItemIds?.forEach((id) => cartAddonMap.set(id, product.id));
    });

    if (cartAddonMap.size === 0) return [];

    return allAddons
      .map((addonGroup) => {
        const relevantItems = addonGroup.items
          .filter((item) => cartAddonMap.has(item.id))
          .map((item) => ({
            ...item,
            productId: cartAddonMap.get(item.id) || "",
            quantity: 1,
          }));

        if (relevantItems.length === 0) return null;

        return {
          addonId: addonGroup.addonId,
          addonName: addonGroup.addonName,
          items: relevantItems,
        } as Addon;
      })
      .filter((group): group is Addon => group !== null);
  }, [cart, allAddons]);

  const isPageLoading = isUserLoading || (!!currentUser && isCartLoading);

  if (isPageLoading) {
    <Center py={20}>
      <Spinner size="xl" color="Cbutton" />
    </Center>;
  }

  if (cart.length === 0) {
    return (
      <Center py={20}>
        <Text>No items in cart.</Text>
      </Center>
    );
  }

  const selectedFromCart = localStorage.getItem("selectedFromCart") === "true";
  const showDeliveryTypeToggle =
    selectedFromCart || initialDeliveryType !== "delivery";

  const showLocationDropdown =
    inCartDeliveryType === "delivery" && !selectedArea;

  const [promptOpen, setPromptOpen] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (currentUser) {
      navigate("/checkout");
    } else {
      setPromptOpen(true);
    }
  };

  const handleRedirectToLogin = () => {
    setPromptOpen(false);
    navigate("/signin");
  };

  return (
    <>
      {cart.map((item) => (
        <CartItem
          key={item.id}
          id={item.id}
          imageUrl={item.image}
          name={item.name}
          price={item.price}
          quantity={item.quantity}
          addons={item.selectedAddons}
        />
      ))}

      <Box width="calc(100% + 38px)" ml="-22px" mr="-24px">
        <Separator
          borderColor="black"
          opacity={0.05}
          width="100%"
          mt={[4, 0]}
        />
      </Box>

      {addonsLoading ? (
        <Text>Loading addons...</Text>
      ) : (
        <FrequentOrder addons={relevantAddons} />
      )}

      <Box width="calc(100% + 38px)" ml="-22px" mr="-24px">
        <Separator borderColor="black" opacity={0.05} width="100%" mt={3} />
      </Box>

      {/* ✅ Pass prop here */}
      <CartSummary />

      {showDeliveryTypeToggle && (
        <Box width="full" mt={4}>
          <HStack p="1" bg="gray.200" borderRadius="md">
            <Button
              onClick={() => handleSetDeliveryType("pickup")}
              bg={orderType === "pickup" ? "Cbutton" : "Cgreen"}
              color={orderType === "pickup" ? "white" : "black"}
              borderRadius="md"
              px={6}
              py={5}
              fontFamily={"AmsiProCond"}
              width="50%"
            >
              <Image w={"11%"} loading="lazy" src="/Icon/carton.png" />
              Pick-up
            </Button>
            <Button
              onClick={() => handleSetDeliveryType("delivery")}
              bg={orderType === "delivery" ? "Cbutton" : "Cgreen"}
              color={orderType === "delivery" ? "white" : "black"}
              borderRadius="md"
              px={6}
              py={5}
              fontFamily={"AmsiProCond"}
              width="47%"
            >
              Delivery
              <Image w={"18%"} loading="lazy" src="/Icon/delivery.png" />
            </Button>
          </HStack>
        </Box>
      )}

      {showLocationDropdown && <SelectLocation cityName={city} />}

      <Button
        onClick={handleCheckout}
        bgColor={"#000"}
        pb={1}
        w={"full"}
        mt={3}
      >
        Passer à la caisse
      </Button>

      <LoginPromptModal
        isOpen={promptOpen}
        onClose={() => setPromptOpen(false)}
        onRedirect={handleRedirectToLogin}
      />

      <OrderDeliveryInfo />
    </>
  );
};
