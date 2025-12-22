import React from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Spinner,
  Center,
  Text,
} from "@chakra-ui/react";
import { Headingelevated } from "@/components/Home/Headingelevated";
import { SolidCard } from "@/components/Home/SolidCard";
import type { ProductVariant } from "./Elevatedcard";
import marble from "/Background/marble.jpeg";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  discount: number;
  addonItemIds: string[] | null;
  variants: ProductVariant[] | null;
};

// Define types for the component's props
interface HomeFavoritesProps {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
}

export const HomeFavorites: React.FC<HomeFavoritesProps> = ({
  products,
  isLoading,
  error,
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <Center minH="40vh">
          <Spinner size="xl" color="whiteAlpha.800" />
        </Center>
      );
    }

    if (error) {
      return (
        <Center minH="40vh">
          {/* Translated Text */}
          <Text color="red.300">No se pudieron cargar los favoritos.</Text>
        </Center>
      );
    }

    // Now checks the received products prop
    if (!products || products.length === 0) {
      return (
        <Center minH="40vh">
          <Text fontFamily="AmsiProCond" fontSize="xl" color="Cbutton">
            No se encontraron artículos.
          </Text>
        </Center>
      );
    }

    return (
      <>
        <Headingelevated title="LOS FAVORITOS" />
        <SimpleGrid
          py={12}
          columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
          gap={[2, 6]}
        >
          {products.map((product) => (
            <SolidCard
              key={product.id}
              id={product.id}
              discount={product.discount}
              addonItemIds={product.addonItemIds}
              imageSource={product.image}
              title={product.name.toUpperCase()}
              price={String(product.price)}
              description={product.description}
              variants={product.variants}

              // imageSize="70%"
            />
          ))}
        </SimpleGrid>
      </>
    );
  };

  return (
    <Box
      // bg={"#f3f3f3"}
      bg={`url(${marble})`}
      bgRepeat="no-repeat"
      bgPos="center"
      bgSize="cover"
      width="full"
      // minHeight="90vh"
      position="relative"
      id="los-favoritos"
    >
      {/* Decorative elements remain the same */}
      {/* <Box
        bg={"url(/Background/designElement4.png)"}
        bgRepeat={"no-repeat"}
        width={["25%", "7%"]}
        height={["3%", "10%"]}
        position={"absolute"}
        bottom={0}
        right={0}
      />
      <Box
        bgImage={"url(/Background/designElement-spark.png)"}
        bgRepeat={"no-repeat"}
        position={"absolute"}
        top={0}
        right={0}
      />
      <Box position={"absolute"} top={64} left={28}>
        <Image src="/Background/designElement-cupcake.png" w={"65%"} />
      </Box>
      <Box position={"absolute"} bottom={96} left={44}>
        <Image src="/Background/designElement-tulip.png" w={"74%"} />
      </Box> */}

      {/* The SearchBar has been removed from here */}
      <Container maxW={"container.xl"}>{renderContent()}</Container>
    </Box>
  );
};
