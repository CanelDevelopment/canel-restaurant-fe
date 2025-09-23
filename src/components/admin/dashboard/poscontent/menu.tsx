import {
  Box,
  Flex,
  Icon,
  Input,
  InputGroup,
  Text,
  SimpleGrid,
  Spinner,
  Center,
} from "@chakra-ui/react";
import type React from "react";
import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { POSCart } from "./posCart";
import { useFetchProducts } from "@/hooks/product/usefetchproducts";
import { FrequentCard } from "@/components/cart/frequentCard";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { useAddCart } from "@/hooks/cart/useaddcart";

interface MenuProps {
  onPlaceOrder: () => void;
  isPlacingOrder: boolean;
  changeRequest: string;
  onCommentChange: (comment: string) => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  discount: number;
  category?: {
    id: string;
    name: string;
  };
}

interface GroupedProducts {
  categoryName: string;
  products: Product[];
}

export const Menu: React.FC<MenuProps> = ({
  onPlaceOrder,
  isPlacingOrder,
  changeRequest,
  onCommentChange,
}) => {
  const { data: allProducts, isLoading } = useFetchProducts();
  const [searchTerm, setSearchTerm] = useState("");

  const addToCartLocal = useCartStore((state) => state.actions.addToCart);

  const { mutate: addCartToDbMutation } = useAddCart();

  const groupedAndFilteredProducts = useMemo((): GroupedProducts[] => {
    if (!allProducts) return [];
    const filteredProducts = allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groups: Record<string, Product[]> = {};

    filteredProducts.forEach((product) => {
      const categoryName = product.category?.name || "Other Items";
      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }

      const normalizedProduct: Product = {
        ...product,
        category: product.category === null ? undefined : product.category,
      };
      groups[categoryName].push(normalizedProduct);
    });
    return Object.keys(groups).map((categoryName) => ({
      categoryName,
      products: groups[categoryName],
    }));
  }, [allProducts, searchTerm]);

  // The render function remains the same
  const renderProductSections = () => {
    if (isLoading) {
      return (
        <Center h="50vh">
          <Spinner size="xl" />
        </Center>
      );
    }

    return groupedAndFilteredProducts.map((group) => (
      <Box key={group.categoryName} mb={10}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          mb={12}
          px={[3, 6, 6]}
          fontFamily="AmsiProCond-Black, sans-serif"
        >
          {group.categoryName}
        </Text>
        <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} gapY={14}>
          {group.products.map((product) => (
            <FrequentCard
              key={product.id}
              imageSource={product.image}
              title={product.name}
              price={product.price}
              onAdd={() => {
                const dbPayload = {
                  productId: product.id,
                  quantity: 1,
                  notes: "",
                };

                addCartToDbMutation(dbPayload, {
                  onSuccess: () => {
                    addToCartLocal({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      quantity: product.quantity,
                      discount: product.discount,
                      image: product.image,
                    });
                    toast.success(`${product.name} added to cart!`);
                  },
                  onError: (error) => {
                    console.error("Failed to add item to DB cart:", error);
                    toast.error("Could not add item. Please try again.");
                  },
                });
              }}
            />
          ))}
        </SimpleGrid>
      </Box>
    ));
  };

  return (
    <Flex flexDirection={["column", "column", "row"]}>
      {/* Left: Products Section */}
      <Box flex="1" bg="white" py={4}>
        {/* Search Bar */}
        <Box px={[3, 6, 6]} w={["100%", "100%", "100%", "40%"]} my={6}>
          <InputGroup>
            <>
              <Icon
                as={FiSearch}
                position="absolute"
                left="1rem"
                top="50%"
                transform="translateY(-50%)"
                zIndex={1}
                color="gray.400"
              />
              <Input
                placeholder="Buscar"
                pl="2.5rem"
                size={"lg"}
                border={"none"}
                rounded={"md"}
                bgColor={"#EBEBEB"}
                color={"#929292"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </>
          </InputGroup>
        </Box>

        {/* --- Render the dynamic product sections here --- */}
        {renderProductSections()}
      </Box>

      {/* Right: Cart Section */}
      <Box
        width={["100%", "100%", "300px", "400px"]}
        bg="#FBFFEE"
        overflowY="auto"
        position={["relative", "relative", "sticky"]}
        top="0"
        h="100vh"
      >
        <POSCart
          onPlaceOrder={onPlaceOrder}
          isPlacingOrder={isPlacingOrder}
          changeRequest={changeRequest}
          onCommentChange={onCommentChange}
        />
      </Box>
    </Flex>
  );
};
