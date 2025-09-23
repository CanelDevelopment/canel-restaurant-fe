// Page: PosContent.tsx
import {
  Box,
  Center,
  Select,
  createListCollection,
  Separator,
  Icon,
} from "@chakra-ui/react";
import type React from "react";
import { OrderType } from "./orderType";
import { DeliveryForm } from "./deliveryForm";
import { Menu } from "./menu";
import { useMemo, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { useFetchBranch } from "@/hooks/branch/usefetchbranch";
import { IoIosArrowDown } from "react-icons/io";
import { useCreatePOSOrder } from "@/hooks/order/usecreateposorder";

export interface Branch {
  id: string;
  name: string;
  areas: string[];
  city: {
    id: string;
    name: string;
  };
  [key: string]: any;
}

export interface PosOrderInfo {
  name: string;
  location: string;
  phoneNumber: string;
  rif: string;
  nearestLandmark: string;
  email: string;
  changeRequest: string;
  city: string;
  area: string;
}

export const PosContent: React.FC = () => {
  const { data: branches, isLoading: isLoadingBranches } = useFetchBranch() as {
    data: Branch[] | undefined;
    isLoading: boolean;
  };

  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");

  const collection = useMemo(() => {
    const defaultOption = { label: "Todas las Sucursales", value: "all" };
    const branchOptions = (branches ?? []).map((branch) => ({
      label: branch.name,
      value: branch.id,
    }));
    return createListCollection({
      items: [defaultOption, ...branchOptions],
    });
  }, [branches]);

  const selectedBranch = useMemo(() => {
    if (selectedBranchId === "all" || !branches) {
      return undefined;
    }
    return branches.find((branch) => branch.id === selectedBranchId);
  }, [selectedBranchId, branches]);

  const [orderType, setOrderType] = useState("delivery");
  const [orderInfo, setOrderInfo] = useState<PosOrderInfo>({
    name: "",
    location: "",
    phoneNumber: "",
    rif: "",
    nearestLandmark: "",
    email: "",
    changeRequest: "",
    city: "",
    area: "",
  });

  const { mutate, isPending: isPlacingOrder } = useCreatePOSOrder();
  const cartItems = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.actions.clearCart);

  const handleInfoChange = (field: keyof PosOrderInfo, value: string) => {
    setOrderInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (selectedBranchId === "all") {
      toast.error("Please select a specific branch to place the order.");
      return;
    }

    if (
      !orderInfo.name.trim() ||
      !orderInfo.phoneNumber.trim() ||
      !orderInfo.location.trim()
    ) {
      toast.error("Please fill in Customer Name, Phone, and Full Address.");
      return;
    }

    if (selectedBranch && (!orderInfo.city || !orderInfo.area)) {
      toast.error("Please select a City and Area for delivery.");
      return;
    }
    const parsedPhoneNumber = parseInt(orderInfo.phoneNumber, 10);
    if (isNaN(parsedPhoneNumber)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    const payload = {
      ...orderInfo,
      branchId: selectedBranchId,
      phoneNumber: parsedPhoneNumber,
      type: orderType,
      items: cartItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    console.log(payload);
    mutate(payload, {
      onSuccess: () => {
        toast.success("Order placed successfully!");
        setOrderInfo({
          name: "",
          location: "",
          phoneNumber: "",
          rif: "",
          nearestLandmark: "",
          email: "",
          changeRequest: "",
          city: "",
          area: "",
        });
        clearCart();
        setSelectedBranchId("all");
      },
      onError: (error) => {
        console.error("Failed to create order:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error.message ||
          "An unknown error occurred.";
        toast.error(`Order Failed: ${errorMessage}`);
      },
    });
  };

  const handleBranchChange = (details: { value: string[] }) => {
    const newBranchId = details.value[0] || "all";
    setSelectedBranchId(newBranchId);
    handleInfoChange("city", "");
    handleInfoChange("area", "");
  };

  return (
    <>
      <Center
        gap={4}
        alignItems={["start", "start", "center", "center"]}
        justifyContent={"space-between"}
        px={[3, 4, 6]}
        py={4}
        flexDirection={["column", "column", "row"]}
        bgColor={"#FFF"}
      >
        <Box width={"100%"} bg={"white"}>
          <Box width={["100%", "100%", "30%"]} fontFamily={"AmsiProCond"}>
            <Select.Root
              collection={collection}
              size="md"
              value={[selectedBranchId]}
              onValueChange={handleBranchChange}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger
                  bgColor={"#f3f3f3"}
                  color={"gray.600"}
                  width={"full"}
                  height={12}
                  borderRadius="md"
                  fontSize={14}
                  fontWeight="bold"
                  cursor={"pointer"}
                  border="none"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "green.400",
                    boxShadow: "0 0 0 1px green.400",
                  }}
                  disabled={isLoadingBranches}
                >
                  <Select.ValueText placeholder="Seleccionar Sucursal" />
                  <Select.IndicatorGroup>
                    <Icon as={IoIosArrowDown} color="gray.600" />
                  </Select.IndicatorGroup>
                </Select.Trigger>
              </Select.Control>
              <Select.Positioner>
                <Select.Content bg="#fff" borderWidth="1px">
                  {collection.items.map((item) => (
                    <Select.Item
                      item={item}
                      key={item.value as string}
                      cursor={"pointer"}
                      bgColor={"#fff"}
                      color="gray.800"
                    >
                      <Select.ItemText>{item.label as string}</Select.ItemText>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Box>
        </Box>
      </Center>

      <OrderType orderType={orderType} onOrderTypeChange={setOrderType} />
      <Separator opacity={0.2} />
      <DeliveryForm
        orderInfo={orderInfo}
        onInfoChange={handleInfoChange}
        selectedBranch={selectedBranch}
      />
      <Separator opacity={0.2} />
      <Menu
        onPlaceOrder={handlePlaceOrder}
        isPlacingOrder={isPlacingOrder}
        changeRequest={orderInfo.changeRequest}
        onCommentChange={(comment) =>
          handleInfoChange("changeRequest", comment)
        }
      />
    </>
  );
};
