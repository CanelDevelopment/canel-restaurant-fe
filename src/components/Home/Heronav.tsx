import { useFetchCategories } from "@/hooks/category/usefetchcategory";
import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export const Heronav: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -150 : 150;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const { data } = useFetchCategories();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      let currentCategory: string | null = null;

      data?.forEach((item) => {
        const section = document.getElementById(
          item.name.replace(/\s+/g, "-").toLowerCase()
        );
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) {
            currentCategory = item.name;
          }
        }
      });

      setActiveCategory(currentCategory);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data]);
  return (
    <Box
      px={[3, 10]}
      py={5}
      bg="Cgreen"
      color="white"
      position="sticky"
      top={0}
      zIndex={999}
    >
      <Box display="flex" alignItems="center" gap={8}>
        <Box
          bg="#fff"
          rounded="full"
          p={1.5}
          cursor="pointer"
          onClick={() => scroll("left")}
        >
          <IoIosArrowBack color="black" size={12} />
        </Box>

        <Box
          ref={scrollRef}
          display="flex"
          justifyContent={"space-around"}
          overflowX="auto"
          gap={{ base: 6, md: 8, lg: 12 }}
          flex={1}
          whiteSpace="nowrap"
          css={{
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {data?.map((item) => (
            <Text
              key={item.id}
              fontSize="lg"
              fontFamily={"AmsiProCond-Bold"}
              flexShrink={0}
              cursor={"pointer"}
              onClick={() => {
                const section = document.getElementById(
                  item.name.replace(/\s+/g, "-").toLowerCase()
                );
                section?.scrollIntoView({ behavior: "smooth" });
              }}
              color={activeCategory === item.name ? "Cbutton" : "#3D3D3D"} // highlight active
            >
              {item.name}
            </Text>
          ))}
        </Box>

        <Box
          bg="#fff"
          rounded="full"
          p={1.5}
          cursor="pointer"
          onClick={() => scroll("right")}
        >
          <IoIosArrowForward color="black" size={12} />
        </Box>
      </Box>
    </Box>
  );
};
