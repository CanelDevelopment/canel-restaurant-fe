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
import { useFetchBranch } from "@/hooks/branch/usefetchbranch";
import { CartItem } from "./cartItem";
import { FrequentOrder } from "./frequentOrder";
import { CartSummary } from "./cartSummary";
import { SelectLocation } from "./SelectLocation";
import OrderDeliveryInfo from "./orderdeliverytime";
import { useCalculationStore } from "@/store/calculationStore";
import { useFetchCurrentUser } from "@/hooks/user/usefetchuser";
import { LoginPromptModal } from "./logininvitationmodal";
// import type { Branch } from "@/pages/locationform.page";

// Define the Branch interface to ensure type safety
// interface Branch {
//   id: string;
//   name: string;
//   orderType: "pickup" | "delivery" | "both";
//   // Add other properties if they exist
// }

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
  const { cart: cartStore } = useCartStore();
  const { data: currentUser, isLoading: isUserLoading } = useFetchCurrentUser();
  const { data: allAddons, isLoading: addonsLoading } = useFetchGroupedAddons();
  const { isLoading: isCartLoading } = useFetchCart();
  const { data: allBranches, isLoading: isLoadingBranches } = useFetchBranch();

  const navigate = useNavigate();
  const [promptOpen, setPromptOpen] = useState(false);

  const orderType = useCalculationStore((state) => state.orderType);
  const setOrderType = useCalculationStore((state) => state.setOrderType);

  const liveBranch = useMemo(() => {
    const storedBranchData = localStorage.getItem("selectedBranch");

    if (!storedBranchData || !allBranches) {
      return;
    }

    try {
      const storedBranch: { id: string } = JSON.parse(storedBranchData);

      return allBranches.find((b) => b.id === storedBranch.id);
    } catch (error) {
      console.error("Failed to parse or find live branch data:", error);
      return undefined;
    }
  }, [allBranches]);

  const isOrderTypeSelectable = liveBranch?.orderType === "both";

  const selectedArea = localStorage.getItem("selectedArea");
  const city = localStorage.getItem("selectedCity") || "";

  useEffect(() => {
    if (liveBranch) {
      if (
        liveBranch.orderType === "pickup" ||
        liveBranch.orderType === "delivery"
      ) {
        setOrderType(liveBranch.orderType);
        localStorage.setItem("deliveryType", liveBranch.orderType);
      } else {
        const lastSelectedType = localStorage.getItem("deliveryType");
        setOrderType(lastSelectedType === "delivery" ? "delivery" : "pickup");
      }
    }
  }, [liveBranch, setOrderType]);

  const handleSetDeliveryType = (type: "pickup" | "delivery") => {
    setOrderType(type);
    localStorage.setItem("deliveryType", type);
    localStorage.setItem("selectedFromCart", "true");
    if (type === "pickup") {
      localStorage.removeItem("selectedArea");
    }
  };

  const relevantAddons = useMemo<Addon[]>(() => {
    if (!allAddons || !cartStore) return [];
    const cartAddonMap = new Map<string, string>();
    cartStore.forEach((product) => {
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
  }, [cartStore, allAddons]);

  const isPageLoading =
    isUserLoading || (!!currentUser && isCartLoading) || isLoadingBranches;

  if (isPageLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="Cbutton" />
      </Center>
    );
  }

  if (cartStore.length === 0) {
    return (
      <Center py={20}>
        <Text>No hay artículos en el carrito.</Text>
      </Center>
    );
  }

  const showLocationDropdown = orderType === "delivery" && !selectedArea;

  const handleCheckout = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");

    if ((currentUser && currentUser.id) || token) {
      navigate("/checkout");
    } else {
      setPromptOpen(true);
    }
  };

  const handleRedirectToLogin = () => {
    setPromptOpen(false);
    navigate("/signin?redirect=/checkout");
  };

  console.log("cartStore", cartStore);

  return (
    <>
      {cartStore.map((item) => (
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

      <CartSummary />

      {/* This conditional rendering now depends on the LIVE branch data */}
      {isOrderTypeSelectable && (
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
              fontSize={"md"}
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
              fontSize={"md"}
            >
              Delivery
              <Image w={"18%"} loading="lazy" src="/Icon/delivery.png" />
            </Button>
          </HStack>
        </Box>
      )}

      <SelectLocation cityName={city} isVisible={showLocationDropdown} />

      <Button
        onClick={handleCheckout}
        type="button"
        bgColor={"Cbutton"}
        pb={1}
        w={"full"}
        mt={3}
        fontSize={"md"}
      >
        Completar Orden
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
