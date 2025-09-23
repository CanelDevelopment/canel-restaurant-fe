import React from "react";
import { Box, Image, Text, Icon } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";

type CompactOrderCardProps = {
  imageSource: string;
  title: string;
  price: number;
  onAdd?: () => void;
};

export const FrequentCard: React.FC<CompactOrderCardProps> = ({
  imageSource,
  title,
  price,
  onAdd,
}) => {
  return (
    <Box position="relative" width="120px" height="100px" mx="auto">
      {/* Product Image (matches Elevatedcard style) */}
      <Box
        position="absolute"
        top="-30px"
        left="50%"
        transform="translateX(-50%)"
        zIndex={99}
        width="90px"
        height="70px"
      >
        <Image
          loading="lazy"
          src={imageSource}
          alt={title}
          width="100%"
          height="100%"
          objectFit="contain"
          objectPosition="center"
        />
      </Box>

      {/* Card with gradient border (like Elevatedcard) */}
      <Box
        p="1px"
        borderRadius="12px"
        background="linear-gradient(to right, rgba(216,210,210, 1), rgba(255,255,255,0))"
        width="100%"
        height="100%"
        position="relative"
        zIndex={9}
      >
        <Box
          bg="#EFEFEF"
          borderRadius="12px"
          border="none"
          width="100%"
          height="100%"
          pt="30px"
          pb="12px"
          textAlign="center"
        >
          {/* Title */}
          <Text
            fontFamily={"AmsiProCond"}
            mt={1}
            color="#24412E"
            fontSize={"12px"}
          >
            {title}
          </Text>

          {/* Price */}
          <Text fontSize="14px" color="Cbutton" fontFamily={"AmsiProCond-Bold"}>
            REF {price}
          </Text>

          {/* Add button (matches Elevatedcard's green) */}
          <Box
            bg="Cgreen"
            _hover={{ bg: "Dgreen" }}
            borderRadius="full"
            p="6px"
            cursor="pointer"
            display="inline-flex"
            position="absolute"
            bottom="-12px"
            left="50%"
            transform="translateX(-50%)"
            onClick={onAdd}
          >
            <Icon as={FaPlus} boxSize={3.5} color="Cbutton" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
