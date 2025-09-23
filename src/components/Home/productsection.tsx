import React from "react";
import { Elevatedcard } from "@/components/Home/Elevatedcard";
import { Box, Image, Container, SimpleGrid } from "@chakra-ui/react";
import { IoCartOutline } from "react-icons/io5";

// Assuming your hook's 'Products' type looks like this.
// It's better to move this to a central types file, e.g., src/types/product.ts
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  discount: number;
};

// Define the component's props
interface ProductSectionProps {
  products: Product[];
}

export const ProductSection: React.FC<ProductSectionProps> = ({ products }) => {
  return (
    <div id="products">
      <Box
        bgImage={`linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255,255,255,0.7)), url('/Background/grunge.png')`}
        bgPos="center"
        bgSize="cover"
        position="relative"
      >
        {/* DESIGN ELEMENTS (Unchanged) */}
        <Box position="absolute" bottom={6} left={16} zIndex={0}>
          <Image
            loading="lazy"
            src="/Background/designElement3.png"
            width={"100px"}
          />
        </Box>
        <Box
          backgroundImage="url('/Background/designElement-dots.png')"
          backgroundRepeat="no-repeat"
          width={"10%"}
          height={"20%"}
          position="absolute"
          top={32}
          left={-6}
          zIndex={0}
        />
        <Box position="absolute" top={96} right={8} zIndex={0}>
          <Image
            loading="lazy"
            src="/Background/designElement-heart3.png"
            w={"60px"}
            rotate={"65"}
          />
        </Box>
        <Box position="absolute" bottom={96} left={8} zIndex={0}>
          <Image
            loading="lazy"
            src="/Background/designElement2.png"
            w={"34px"}
            rotate={"-32"}
          />
        </Box>

        <Container maxW={"container"}>
          <SimpleGrid
            py={12}
            columns={{ base: 2, sm: 2, md: 2, lg: 4 }}
            gapX={[1, 6]}
            gapY={[20, 20]}
            pt={20}
          >
            {/* --- FIX: Map over the 'products' prop instead of static data --- */}
            {products.map((product) => (
              <Elevatedcard
                key={product.id}
                id={product.id}
                title={product.name}
                price={`${product.price}`} // Format the price
                buttontext="Agregar al carrito"
                imageSource={product.image} // Use the image from the product data
                icon={<IoCartOutline size={30} />}
                discount={product.discount}
                description={product.description}
                // itemW={["70px", "auto"]}
              />
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </div>
  );
};
