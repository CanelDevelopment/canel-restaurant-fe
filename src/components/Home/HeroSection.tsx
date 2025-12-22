import React from "react";
import { CartNav } from "@/components/Home/CartNav";
import { Box, Image } from "@chakra-ui/react";
import { useFetchMainSection } from "@/hooks/branding/usefetchbranding";
// import { TraditionalBox } from "./TraditionalNav";

export const HeroSection: React.FC = () => {
  const { data: mainImage } = useFetchMainSection();

  return (
    <Box
      bgImage={`linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.1)), ${
        mainImage?.mainSection
          ? `url(${mainImage.mainSection})`
          : "url(/Background/hero.jpg)"
      }`}
      bgSize="cover"
      bgPos={["left", "center"]}
      width="100%"
      minHeight="55vh"
      color="white"
      position={"relative"}
    >
      <CartNav />

      {/* <TraditionalBox /> */}

      <Image
        loading="lazy"
        src="/Background/designElement-grape.png"
        position={"absolute"}
        bottom={8}
        right={0}
        width={10}
      />
    </Box>
  );
};
